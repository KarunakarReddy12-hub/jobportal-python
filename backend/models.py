from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Enum, Table, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base
import enum


# ── Enums ─────────────────────────────────────────────────────────────────────

class RoleEnum(str, enum.Enum):
    student = "student"
    recruiter = "recruiter"


class StatusEnum(str, enum.Enum):
    pending = "pending"
    accepted = "accepted"
    rejected = "rejected"


# ── Association: User skills (stored as rows) ─────────────────────────────────

class UserSkill(Base):
    __tablename__ = "user_skills"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    skill = Column(String(100), nullable=False)


# ── Association: Job requirements ─────────────────────────────────────────────

class JobRequirement(Base):
    __tablename__ = "job_requirements"
    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("jobs.id", ondelete="CASCADE"), nullable=False)
    requirement = Column(String(200), nullable=False)


# ── User ──────────────────────────────────────────────────────────────────────

class User(Base):
    __tablename__ = "users"

    id           = Column(Integer, primary_key=True, index=True)
    fullname     = Column(String(100), nullable=False)
    email        = Column(String(150), unique=True, nullable=False, index=True)
    phone_number = Column(String(20), nullable=False)
    password     = Column(String(200), nullable=False)
    role         = Column(Enum(RoleEnum), nullable=False, default=RoleEnum.student)

    # Profile
    bio                  = Column(Text, nullable=True)
    profile_photo        = Column(String(300), nullable=True)
    resume               = Column(String(300), nullable=True)
    resume_original_name = Column(String(200), nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    skills       = relationship("UserSkill", cascade="all, delete-orphan", lazy="joined")
    companies    = relationship("Company", back_populates="user", lazy="dynamic")
    posted_jobs  = relationship("Job", back_populates="created_by", lazy="dynamic")
    applications = relationship("Application", back_populates="applicant", lazy="dynamic")


# ── Company ───────────────────────────────────────────────────────────────────

class Company(Base):
    __tablename__ = "companies"

    id          = Column(Integer, primary_key=True, index=True)
    name        = Column(String(150), unique=True, nullable=False, index=True)
    description = Column(Text, nullable=True)
    website     = Column(String(300), nullable=True)
    location    = Column(String(150), nullable=True)
    logo        = Column(String(300), nullable=True)
    user_id     = Column(Integer, ForeignKey("users.id"), nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="companies")
    jobs = relationship("Job", back_populates="company", lazy="dynamic")


# ── Job ───────────────────────────────────────────────────────────────────────

class Job(Base):
    __tablename__ = "jobs"

    id               = Column(Integer, primary_key=True, index=True)
    title            = Column(String(200), nullable=False)
    description      = Column(Text, nullable=True)
    salary           = Column(Float, nullable=True)
    experience_level = Column(Integer, nullable=True)
    location         = Column(String(150), nullable=True)
    job_type         = Column(String(50), nullable=True)
    position         = Column(Integer, nullable=True)
    company_id       = Column(Integer, ForeignKey("companies.id"), nullable=False)
    created_by_id    = Column(Integer, ForeignKey("users.id"), nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    company      = relationship("Company", back_populates="jobs")
    created_by   = relationship("User", back_populates="posted_jobs")
    requirements = relationship("JobRequirement", cascade="all, delete-orphan", lazy="joined")
    applications = relationship("Application", back_populates="job", lazy="joined")


# ── Application ───────────────────────────────────────────────────────────────

class Application(Base):
    __tablename__ = "applications"

    id           = Column(Integer, primary_key=True, index=True)
    job_id       = Column(Integer, ForeignKey("jobs.id"), nullable=False)
    applicant_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    status       = Column(Enum(StatusEnum), nullable=False, default=StatusEnum.pending)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    job       = relationship("Job", back_populates="applications")
    applicant = relationship("User", back_populates="applications")
