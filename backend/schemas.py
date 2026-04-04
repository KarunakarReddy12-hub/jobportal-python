from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional, List
from datetime import datetime
from enum import Enum


class RoleEnum(str, Enum):
    student = "student"
    recruiter = "recruiter"


class StatusEnum(str, Enum):
    pending = "pending"
    accepted = "accepted"
    rejected = "rejected"


# ── Auth ──────────────────────────────────────────────────────────────────────

class LoginRequest(BaseModel):
    email: EmailStr
    password: str
    role: RoleEnum


class Token(BaseModel):
    token: str
    type: str = "Bearer"


# ── User ──────────────────────────────────────────────────────────────────────

class UserResponse(BaseModel):
    id: int
    fullname: str
    email: str
    phoneNumber: str
    role: str
    bio: Optional[str] = None
    profilePhoto: Optional[str] = None
    resume: Optional[str] = None
    resumeOriginalName: Optional[str] = None
    skills: List[str] = []
    createdAt: Optional[datetime] = None

    class Config:
        from_attributes = True


class LoginResponse(BaseModel):
    success: bool = True
    message: str
    token: str
    user: UserResponse


# ── Company ───────────────────────────────────────────────────────────────────

class CompanyResponse(BaseModel):
    _id: int
    name: str
    description: Optional[str] = None
    website: Optional[str] = None
    location: Optional[str] = None
    logo: Optional[str] = None
    createdAt: Optional[datetime] = None

    class Config:
        from_attributes = True


# ── Job ───────────────────────────────────────────────────────────────────────

class CompanyBrief(BaseModel):
    _id: int
    name: str
    logo: Optional[str] = None
    location: Optional[str] = None


class ApplicationBrief(BaseModel):
    _id: int
    applicant: int
    status: str


class JobResponse(BaseModel):
    _id: int
    title: str
    description: Optional[str] = None
    requirements: List[str] = []
    salary: Optional[float] = None
    experienceLevel: Optional[int] = None
    location: Optional[str] = None
    jobType: Optional[str] = None
    position: Optional[int] = None
    company: Optional[dict] = None
    applications: List[dict] = []
    createdAt: Optional[datetime] = None


# ── Application ───────────────────────────────────────────────────────────────

class ApplicantBrief(BaseModel):
    _id: int
    fullname: str
    email: str
    phoneNumber: str
    profilePhoto: Optional[str] = None
    resume: Optional[str] = None
    resumeOriginalName: Optional[str] = None
    skills: List[str] = []


class ApplicationResponse(BaseModel):
    _id: int
    status: str
    createdAt: Optional[datetime] = None
    job: Optional[dict] = None
    applicant: Optional[dict] = None


# ── Generic ───────────────────────────────────────────────────────────────────

class ApiResponse(BaseModel):
    success: bool
    message: str
    data: Optional[dict] = None
