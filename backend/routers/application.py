from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from auth import get_current_user, require_recruiter
from utils import application_to_dict, job_to_dict
import models

router = APIRouter(prefix="/api/v1/application", tags=["application"])


@router.get("/apply/{job_id}")
def apply_job(
    job_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    job = db.query(models.Job).filter(models.Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found.")

    already = db.query(models.Application).filter(
        models.Application.job_id == job_id,
        models.Application.applicant_id == current_user.id,
    ).first()
    if already:
        raise HTTPException(status_code=400, detail="You have already applied for this job.")

    application = models.Application(job_id=job_id, applicant_id=current_user.id)
    db.add(application)
    db.commit()
    return {"success": True, "message": "Job applied successfully."}


@router.get("/get")
def get_applied_jobs(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    applications = (
        db.query(models.Application)
        .filter(models.Application.applicant_id == current_user.id)
        .order_by(models.Application.created_at.desc())
        .all()
    )
    return {
        "success": True,
        "message": "Applications fetched.",
        "data": {"application": [application_to_dict(a) for a in applications]},
    }


@router.get("/{job_id}/applicants")
def get_applicants(
    job_id: int,
    current_user: models.User = Depends(require_recruiter),
    db: Session = Depends(get_db),
):
    job = db.query(models.Job).filter(models.Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found.")

    applications = (
        db.query(models.Application)
        .filter(models.Application.job_id == job_id)
        .all()
    )
    return {
        "success": True,
        "message": "Applicants fetched.",
        "data": {
            "job": {
                "_id": job.id,
                "title": job.title,
                "applications": [application_to_dict(a) for a in applications],
            }
        },
    }


@router.post("/status/{application_id}/update")
def update_status(
    application_id: int,
    body: dict,
    current_user: models.User = Depends(require_recruiter),
    db: Session = Depends(get_db),
):
    status_val = (body.get("status") or "").lower().strip()
    if status_val not in ("pending", "accepted", "rejected"):
        raise HTTPException(status_code=400, detail="Status must be: pending, accepted, or rejected")

    application = db.query(models.Application).filter(
        models.Application.id == application_id
    ).first()
    if not application:
        raise HTTPException(status_code=404, detail="Application not found.")

    application.status = models.StatusEnum(status_val)
    db.commit()
    return {"success": True, "message": "Status updated successfully."}
