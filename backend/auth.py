from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from database import get_db
from config import settings
import models
import hashlib
import hmac

bearer_scheme = HTTPBearer()


def hash_password(password: str) -> str:
    """Hash password using PBKDF2 (no external dependency needed)"""
    # For now, use a simple approach: salt + hmac
    salt = settings.SECRET_KEY[:16].encode()
    h = hashlib.pbkdf2_hmac('sha256', password.encode(), salt, 100000)
    return f"pbkdf2${h.hex()}"


def verify_password(plain: str, hashed: str) -> bool:
    """Verify password against PBKDF2 hash"""
    if not hashed.startswith("pbkdf2$"):
        return False
    try:
        salt = settings.SECRET_KEY[:16].encode()
        h = hashlib.pbkdf2_hmac('sha256', plain.encode(), salt, 100000)
        expected = f"pbkdf2${h.hex()}"
        return hmac.compare_digest(expected, hashed)
    except:
        return False


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def decode_token(token: str) -> Optional[str]:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload.get("sub")
    except JWTError:
        return None


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> models.User:
    token = credentials.credentials
    email = decode_token(token)
    if not email:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user


def require_recruiter(current_user: models.User = Depends(get_current_user)) -> models.User:
    if current_user.role != models.RoleEnum.recruiter:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Recruiter access only")
    return current_user
