from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import Optional
from database import get_db
from auth import get_current_user, require_recruiter
from utils import save_upload, company_to_dict
import models

router = APIRouter(prefix="/api/v1/company", tags=["company"])


@router.post("/register")
def register_company(
    body: dict,
    current_user: models.User = Depends(require_recruiter),
    db: Session = Depends(get_db),
):
    company_name = body.get("companyName", "").strip()
    if not company_name:
        raise HTTPException(status_code=400, detail="Company name is required.")

    if db.query(models.Company).filter(models.Company.name == company_name).first():
        raise HTTPException(status_code=400, detail="You can't register the same company.")

    company = models.Company(name=company_name, user_id=current_user.id)
    db.add(company)
    db.commit()
    db.refresh(company)
    return {"success": True, "message": "Company registered successfully.",
            "data": {"company": company_to_dict(company)}}


@router.get("/get")
def get_companies(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    companies = db.query(models.Company).filter(models.Company.user_id == current_user.id).all()
    return {"success": True, "message": "Companies fetched.",
            "data": {"companies": [company_to_dict(c) for c in companies]}}


@router.get("/get/{company_id}")
def get_company_by_id(
    company_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    company = db.query(models.Company).filter(models.Company.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found.")
    return {"success": True, "message": "Company fetched.",
            "data": {"company": company_to_dict(company)}}


@router.put("/update/{company_id}")
async def update_company(
    company_id:  int,
    name:        Optional[str]        = Form(None),
    description: Optional[str]        = Form(None),
    website:     Optional[str]        = Form(None),
    location:    Optional[str]        = Form(None),
    file: Optional[UploadFile]        = File(None),
    current_user: models.User         = Depends(require_recruiter),
    db: Session                       = Depends(get_db),
):
    company = db.query(models.Company).filter(models.Company.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found.")

    if name:        company.name        = name
    if description: company.description = description
    if website:     company.website     = website
    if location:    company.location    = location

    if file and file.filename:
        company.logo = await save_upload(file)

    db.commit()
    return {"success": True, "message": "Company information updated."}
