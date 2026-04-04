from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional
from database import get_db
from auth import get_current_user, require_recruiter
from utils import job_to_dict
import models

router = APIRouter(prefix="/api/v1/job", tags=["job"])


@router.post("/post")
def post_job(
    body: dict,
    current_user: models.User = Depends(require_recruiter),
    db: Session = Depends(get_db),
):
    required = ["title", "description", "requirements", "salary",
                "location", "jobType", "experience", "position", "companyId"]
    for field in required:
        if not body.get(field):
            raise HTTPException(status_code=400, detail=f"Field '{field}' is required.")

    company = db.query(models.Company).filter(
        models.Company.id == int(body["companyId"])
    ).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found.")

    # Convert numeric fields safely (e.g. "12-15 LPA" should still work by taking first number)
    def parse_float(value, field_name):
        try:
            return float(value)
        except Exception:
            import re
            match = re.search(r"[0-9]+(?:\.[0-9]+)?", str(value))
            if match:
                return float(match.group(0))
            raise HTTPException(status_code=400, detail=f"Field '{field_name}' must be a number")

    def parse_int(value, field_name):
        try:
            return int(float(value))
        except Exception:
            raise HTTPException(status_code=400, detail=f"Field '{field_name}' must be an integer")

    salary_value = parse_float(body["salary"], "salary")
    experience_value = parse_int(body["experience"], "experience")
    position_value = parse_int(body["position"], "position")

    job = models.Job(
        title=body["title"],
        description=body["description"],
        salary=salary_value,
        experience_level=experience_value,
        location=body["location"],
        job_type=body["jobType"],
        position=position_value,
        company_id=company.id,
        created_by_id=current_user.id,
    )
    db.add(job)
    db.flush()   # get job.id before adding requirements

    for req in body["requirements"].split(","):
        req = req.strip()
        if req:
            db.add(models.JobRequirement(job_id=job.id, requirement=req))

    db.commit()
    db.refresh(job)
    return {"success": True, "message": "New job created successfully.",
            "data": job_to_dict(job, with_applications=True)}


@router.get("/get")
def get_all_jobs(
    keyword: str = Query(default=""),
    db: Session = Depends(get_db),
):
    query = db.query(models.Job)
    if keyword:
        kw = f"%{keyword}%"
        query = query.filter(
            models.Job.title.ilike(kw) | models.Job.description.ilike(kw)
        )
    jobs = query.order_by(models.Job.created_at.desc()).all()
    return {"success": True, "message": "Jobs fetched.",
            "data": {"jobs": [job_to_dict(j, with_applications=False) for j in jobs]}}


@router.get("/get/{job_id}")
def get_job_by_id(
    job_id: int,
    db: Session = Depends(get_db),
):
    job = db.query(models.Job).filter(models.Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found.")
    return {"success": True, "message": "Job fetched.",
            "data": {"job": job_to_dict(job, with_applications=True)}}


@router.get("/getadminjobs")
def get_admin_jobs(
    current_user: models.User = Depends(require_recruiter),
    db: Session = Depends(get_db),
):
    jobs = db.query(models.Job).filter(
        models.Job.created_by_id == current_user.id
    ).order_by(models.Job.created_at.desc()).all()
    return {"success": True, "message": "Admin jobs fetched.",
            "data": {"jobs": [job_to_dict(j, with_applications=False) for j in jobs]}}
