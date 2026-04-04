import os
import uuid
import aiofiles
from fastapi import UploadFile
from config import settings


async def save_upload(file: UploadFile) -> str:
    """Save an uploaded file and return its URL path."""
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    ext = os.path.splitext(file.filename or "file")[1]
    filename = f"{uuid.uuid4().hex}{ext}"
    dest = os.path.join(settings.UPLOAD_DIR, filename)
    async with aiofiles.open(dest, "wb") as out:
        content = await file.read()
        await out.write(content)
    return f"/uploads/{filename}"


def user_to_dict(user) -> dict:
    return {
        "id": user.id,
        "fullname": user.fullname,
        "email": user.email,
        "phoneNumber": user.phone_number,
        "role": user.role.value if hasattr(user.role, "value") else user.role,
        "bio": user.bio,
        "profilePhoto": user.profile_photo,
        "resume": user.resume,
        "resumeOriginalName": user.resume_original_name,
        "skills": [s.skill for s in user.skills],
        "createdAt": user.created_at.isoformat() if user.created_at else None,
    }


def company_to_dict(company) -> dict:
    return {
        "_id": company.id,
        "name": company.name,
        "description": company.description,
        "website": company.website,
        "location": company.location,
        "logo": company.logo,
        "createdAt": company.created_at.isoformat() if company.created_at else None,
    }


def job_to_dict(job, with_applications=False) -> dict:
    d = {
        "_id": job.id,
        "title": job.title,
        "description": job.description,
        "requirements": [r.requirement for r in job.requirements],
        "salary": job.salary,
        "experienceLevel": job.experience_level,
        "location": job.location,
        "jobType": job.job_type,
        "position": job.position,
        "createdAt": job.created_at.isoformat() if job.created_at else None,
        "company": company_to_dict(job.company) if job.company else None,
        "applications": [],
    }
    if with_applications:
        d["applications"] = [
            {
                "_id": a.id,
                "applicant": a.applicant_id,
                "status": a.status.value if hasattr(a.status, "value") else a.status,
            }
            for a in job.applications
        ]
    return d


def application_to_dict(app) -> dict:
    job = app.job
    applicant = app.applicant
    return {
        "_id": app.id,
        "status": app.status.value if hasattr(app.status, "value") else app.status,
        "createdAt": app.created_at.isoformat() if app.created_at else None,
        "job": {
            "_id": job.id,
            "title": job.title,
            "location": job.location,
            "jobType": job.job_type,
            "salary": job.salary,
            "company": company_to_dict(job.company) if job.company else None,
        } if job else None,
        "applicant": {
            "_id": applicant.id,
            "fullname": applicant.fullname,
            "email": applicant.email,
            "phoneNumber": applicant.phone_number,
            "profilePhoto": applicant.profile_photo,
            "resume": applicant.resume,
            "resumeOriginalName": applicant.resume_original_name,
            "skills": [s.skill for s in applicant.skills],
        } if applicant else None,
    }
