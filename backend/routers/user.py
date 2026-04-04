from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from sqlalchemy.orm import Session
from typing import Optional
from database import get_db
from auth import hash_password, verify_password, create_access_token, get_current_user
from utils import save_upload, user_to_dict
import models

router = APIRouter(prefix="/api/v1/user", tags=["user"])


# ── REGISTER ──────────────────────────────────────────────────────────────────
@router.post("/register")
async def register(
    fullname:    str  = Form(...),
    email:       str  = Form(...),
    phoneNumber: str  = Form(...),
    password:    str  = Form(...),
    role:        str  = Form(...),
    file: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
):
    try:
        print(f"DEBUG: register called")
        
        # Validate required fields
        if not all([fullname, email, phoneNumber, password, role]):
            raise HTTPException(status_code=400, detail="All fields are required")
        
        # Validate role
        if role not in ("student", "recruiter"):
            raise HTTPException(status_code=400, detail="Role must be 'student' or 'recruiter'")
        
        # Check if email already exists
        existing = db.query(models.User).filter(models.User.email == email).first()
        if existing:
            raise HTTPException(status_code=400, detail="User already exists with this email")
        
        # Handle file upload (optional)
        photo_url = None
        if file and file.filename:
            photo_url = await save_upload(file)
        
        # Create user
        user = models.User(
            fullname=fullname,
            email=email,
            phone_number=phoneNumber,
            password=hash_password(password),
            role=models.RoleEnum(role),
            profile_photo=photo_url,
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        
        return {"success": True, "message": "Account created successfully."}
    except HTTPException:
        raise
    except Exception as exc:
        print(f"DEBUG: error during registration: {exc}")
        import traceback
        traceback.print_exc()
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Registration failed: {exc}")


# ── LOGIN ─────────────────────────────────────────────────────────────────────
@router.post("/login")
def login(body: dict, db: Session = Depends(get_db)):
    # Accept JSON body with email, password, role
    from schemas import LoginRequest
    try:
        req = LoginRequest(**body)
    except Exception as e:
        raise HTTPException(status_code=422, detail=str(e))

    user = db.query(models.User).filter(models.User.email == req.email).first()
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect email or password.")

    if not verify_password(req.password, user.password):
        raise HTTPException(status_code=400, detail="Incorrect email or password.")

    if user.role.value != req.role.value:
        raise HTTPException(status_code=400, detail="Account doesn't exist with current role.")

    token = create_access_token({"sub": user.email})
    return {
        "success": True,
        "message": f"Welcome back {user.fullname}",
        "token": token,
        "user": user_to_dict(user),
    }


# ── LOGOUT ────────────────────────────────────────────────────────────────────
@router.get("/logout")
def logout():
    # JWT is stateless — client drops the token
    return {"success": True, "message": "Logged out successfully."}


# ── GET CURRENT USER ──────────────────────────────────────────────────────────
@router.get("/me")
def me(current_user: models.User = Depends(get_current_user)):
    return {"success": True, "message": "User fetched.", "data": user_to_dict(current_user)}


# ── UPDATE PROFILE ────────────────────────────────────────────────────────────
@router.post("/profile/update")
async def update_profile(
    fullname:    Optional[str]  = Form(None),
    email:       Optional[str]  = Form(None),
    phoneNumber: Optional[str]  = Form(None),
    bio:         Optional[str]  = Form(None),
    skills:      Optional[str]  = Form(None),
    file: Optional[UploadFile]  = File(None),
    current_user: models.User   = Depends(get_current_user),
    db: Session                 = Depends(get_db),
):
    user = db.query(models.User).filter(models.User.id == current_user.id).first()

    if fullname:    user.fullname     = fullname
    if email:       user.email        = email
    if phoneNumber: user.phone_number = phoneNumber
    if bio:         user.bio          = bio

    if skills:
        # Replace skills list
        db.query(models.UserSkill).filter(models.UserSkill.user_id == user.id).delete()
        for s in skills.split(","):
            s = s.strip()
            if s:
                db.add(models.UserSkill(user_id=user.id, skill=s))

    if file and file.filename:
        url = await save_upload(file)
        user.resume = url
        user.resume_original_name = file.filename

    db.commit()
    db.refresh(user)
    return {"success": True, "message": "Profile updated successfully.", "data": user_to_dict(user)}
