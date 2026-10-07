

# from datetime import datetime, timedelta, timezone
# import os
# import sqlite3
# import hashlib
# import secrets

# from fastapi import APIRouter, HTTPException, Depends
# from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
# from jose import jwt, JWTError
# from pydantic import BaseModel, EmailStr
# from dotenv import load_dotenv

# load_dotenv()


# # ============================================================
# # ROUTER
# # ============================================================

# router = APIRouter(
#     prefix="/auth",
#     tags=["Authentication"]
# )


# # ============================================================
# # CONFIGURATION
# # ============================================================

# DATABASE = os.getenv(
#     "AUTH_DATABASE",
#     "users.db"
# )

# SECRET_KEY = os.getenv(
#     "AUTH_SECRET_KEY"
# )

# ALGORITHM = "HS256"

# ACCESS_TOKEN_EXPIRE_MINUTES = int(
#     os.getenv(
#         "AUTH_TOKEN_EXPIRE_MINUTES",
#         "1440"
#     )
# )

# security = HTTPBearer()


# # ============================================================
# # SECRET KEY VALIDATION
# # ============================================================

# if not SECRET_KEY:
#     raise RuntimeError(
#         "AUTH_SECRET_KEY is not configured. "
#         "Set AUTH_SECRET_KEY in your environment before starting the backend."
#     )

# if len(SECRET_KEY) < 32:
#     raise RuntimeError(
#         "AUTH_SECRET_KEY must contain at least 32 characters."
#     )


# # ============================================================
# # DATABASE
# # ============================================================

# def get_connection():
#     connection = sqlite3.connect(DATABASE)

#     connection.row_factory = sqlite3.Row

#     return connection


# def create_users_table():
#     connection = get_connection()

#     connection.execute(
#         """
#         CREATE TABLE IF NOT EXISTS users (
#             id INTEGER PRIMARY KEY AUTOINCREMENT,
#             name TEXT NOT NULL,
#             email TEXT UNIQUE NOT NULL,
#             password_hash TEXT NOT NULL,
#             created_at TEXT NOT NULL
#         )
#         """
#     )

#     connection.commit()
#     connection.close()


# create_users_table()


# # ============================================================
# # PASSWORD HASHING
# # ============================================================

# def hash_password(
#     password: str,
#     salt: str | None = None
# ) -> str:

#     if salt is None:
#         salt = secrets.token_hex(16)

#     password_hash = hashlib.pbkdf2_hmac(
#         "sha256",
#         password.encode("utf-8"),
#         salt.encode("utf-8"),
#         100_000
#     ).hex()

#     return f"{salt}${password_hash}"


# def verify_password(
#     password: str,
#     stored_password: str
# ) -> bool:

#     try:

#         salt, stored_hash = stored_password.split(
#             "$",
#             1
#         )

#         password_hash = hashlib.pbkdf2_hmac(
#             "sha256",
#             password.encode("utf-8"),
#             salt.encode("utf-8"),
#             100_000
#         ).hex()

#         return secrets.compare_digest(
#             password_hash,
#             stored_hash
#         )

#     except Exception:
#         return False


# # ============================================================
# # JWT TOKEN
# # ============================================================

# def create_access_token(
#     user_id: int,
#     email: str
# ) -> str:

#     expire = (
#         datetime.now(timezone.utc)
#         + timedelta(
#             minutes=ACCESS_TOKEN_EXPIRE_MINUTES
#         )
#     )

#     payload = {
#         "sub": str(user_id),
#         "email": email,
#         "exp": expire
#     }

#     return jwt.encode(
#         payload,
#         SECRET_KEY,
#         algorithm=ALGORITHM
#     )


# # ============================================================
# # CURRENT USER
# # ============================================================

# def get_current_user(
#     credentials: HTTPAuthorizationCredentials = Depends(
#         security
#     )
# ):

#     token = credentials.credentials

#     try:

#         payload = jwt.decode(
#             token,
#             SECRET_KEY,
#             algorithms=[ALGORITHM]
#         )

#         user_id = payload.get("sub")
#         email = payload.get("email")

#         if not user_id or not email:
#             raise HTTPException(
#                 status_code=401,
#                 detail="Invalid authentication token"
#             )

#         try:
#             user_id = int(user_id)

#         except (TypeError, ValueError):

#             raise HTTPException(
#                 status_code=401,
#                 detail="Invalid authentication token"
#             )

#         connection = get_connection()

#         try:

#             user = connection.execute(
#                 """
#                 SELECT
#                     id,
#                     name,
#                     email,
#                     created_at
#                 FROM users
#                 WHERE id = ?
#                 """,
#                 (user_id,)
#             ).fetchone()

#         finally:

#             connection.close()

#         if not user:

#             raise HTTPException(
#                 status_code=401,
#                 detail="User no longer exists"
#             )

#         return {
#             "id": user["id"],
#             "name": user["name"],
#             "email": user["email"],
#             "created_at": user["created_at"]
#         }

#     except JWTError:

#         raise HTTPException(
#             status_code=401,
#             detail="Invalid or expired authentication token"
#         )


# # ============================================================
# # REQUEST MODELS
# # ============================================================

# class RegisterRequest(BaseModel):
#     name: str
#     email: EmailStr
#     password: str


# class LoginRequest(BaseModel):
#     email: EmailStr
#     password: str


# # ============================================================
# # REGISTER
# # ============================================================

# @router.post("/register")
# def register_user(
#     data: RegisterRequest
# ):

#     name = data.name.strip()
#     email = str(data.email).lower().strip()
#     password = data.password

#     if not name:

#         raise HTTPException(
#             status_code=400,
#             detail="Name is required"
#         )

#     if len(password) < 6:

#         raise HTTPException(
#             status_code=400,
#             detail="Password must be at least 6 characters"
#         )

#     connection = get_connection()

#     try:

#         existing_user = connection.execute(
#             """
#             SELECT id
#             FROM users
#             WHERE email = ?
#             """,
#             (email,)
#         ).fetchone()

#         if existing_user:

#             raise HTTPException(
#                 status_code=400,
#                 detail="An account with this email already exists"
#             )

#         password_hash = hash_password(password)

#         created_at = datetime.now(
#             timezone.utc
#         ).isoformat()

#         cursor = connection.execute(
#             """
#             INSERT INTO users (
#                 name,
#                 email,
#                 password_hash,
#                 created_at
#             )
#             VALUES (?, ?, ?, ?)
#             """,
#             (
#                 name,
#                 email,
#                 password_hash,
#                 created_at
#             )
#         )

#         connection.commit()

#         user_id = cursor.lastrowid

#         return {
#             "success": True,
#             "message": "Registration successful",
#             "user": {
#                 "id": user_id,
#                 "name": name,
#                 "email": email
#             }
#         }

#     finally:

#         connection.close()


# # ============================================================
# # LOGIN
# # ============================================================

# @router.post("/login")
# def login_user(
#     data: LoginRequest
# ):

#     email = str(data.email).lower().strip()
#     password = data.password

#     connection = get_connection()

#     try:

#         user = connection.execute(
#             """
#             SELECT *
#             FROM users
#             WHERE email = ?
#             """,
#             (email,)
#         ).fetchone()

#     finally:

#         connection.close()

#     if not user:

#         raise HTTPException(
#             status_code=401,
#             detail="Invalid email or password"
#         )

#     if not verify_password(
#         password,
#         user["password_hash"]
#     ):

#         raise HTTPException(
#             status_code=401,
#             detail="Invalid email or password"
#         )

#     access_token = create_access_token(
#         user_id=user["id"],
#         email=user["email"]
#     )

#     return {
#         "success": True,
#         "message": "Login successful",
#         "access_token": access_token,
#         "token_type": "bearer",
#         "user": {
#             "id": user["id"],
#             "name": user["name"],
#             "email": user["email"]
#         }
#     }


# # ============================================================
# # CURRENT USER
# # ============================================================

# @router.get("/me")
# def get_me(
#     current_user: dict = Depends(get_current_user)
# ):

#     return {
#         "success": True,
#         "user": current_user
#     }


# # ============================================================
# # AUTH STATUS
# # ============================================================

# @router.get("/status")
# def auth_status():

#     connection = get_connection()

#     try:

#         result = connection.execute(
#             """
#             SELECT COUNT(*) AS total_users
#             FROM users
#             """
#         ).fetchone()

#         total_users = result["total_users"]

#     finally:

#         connection.close()

#     return {
#         "authentication": "active",
#         "total_users": total_users,
#         "jwt": "enabled"
#     }



from datetime import datetime, timedelta, timezone
import os
import sqlite3
import hashlib
import secrets

from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from pydantic import BaseModel, EmailStr
from dotenv import load_dotenv


load_dotenv()


# ============================================================
# ROUTER
# ============================================================

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


# ============================================================
# CONFIGURATION
# ============================================================

DATABASE_URL = os.getenv("DATABASE_URL")

# Local development fallback
SQLITE_DATABASE = os.getenv(
    "AUTH_DATABASE",
    "users.db"
)

SECRET_KEY = os.getenv("AUTH_SECRET_KEY")

ALGORITHM = "HS256"

ACCESS_TOKEN_EXPIRE_MINUTES = int(
    os.getenv(
        "AUTH_TOKEN_EXPIRE_MINUTES",
        "1440"
    )
)

security = HTTPBearer()


# ============================================================
# SECRET KEY VALIDATION
# ============================================================

if not SECRET_KEY:
    raise RuntimeError(
        "AUTH_SECRET_KEY is not configured. "
        "Set AUTH_SECRET_KEY in your environment before starting the backend."
    )


if len(SECRET_KEY) < 32:
    raise RuntimeError(
        "AUTH_SECRET_KEY must contain at least 32 characters."
    )


# ============================================================
# DATABASE CONNECTION
# ============================================================

def using_postgres():
    return bool(DATABASE_URL)


def get_connection():
    """
    Production:
        PostgreSQL using DATABASE_URL

    Local:
        SQLite using users.db
    """

    if DATABASE_URL:

        import psycopg2
        from psycopg2.extras import RealDictCursor

        connection = psycopg2.connect(
            DATABASE_URL,
            cursor_factory=RealDictCursor
        )

        return connection

    connection = sqlite3.connect(
        SQLITE_DATABASE
    )

    connection.row_factory = sqlite3.Row

    return connection


# ============================================================
# CREATE USERS TABLE
# ============================================================

def create_users_table():

    connection = get_connection()

    try:

        cursor = connection.cursor()

        if using_postgres():

            cursor.execute(
                """
                CREATE TABLE IF NOT EXISTS users (
                    id SERIAL PRIMARY KEY,
                    name TEXT NOT NULL,
                    email TEXT UNIQUE NOT NULL,
                    password_hash TEXT NOT NULL,
                    created_at TEXT NOT NULL
                )
                """
            )

        else:

            cursor.execute(
                """
                CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    email TEXT UNIQUE NOT NULL,
                    password_hash TEXT NOT NULL,
                    created_at TEXT NOT NULL
                )
                """
            )

        connection.commit()

    finally:

        connection.close()


create_users_table()


# ============================================================
# PASSWORD HASHING
# ============================================================

def hash_password(
    password: str,
    salt: str | None = None
) -> str:

    if salt is None:
        salt = secrets.token_hex(16)

    password_hash = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        salt.encode("utf-8"),
        100_000
    ).hex()

    return f"{salt}${password_hash}"


def verify_password(
    password: str,
    stored_password: str
) -> bool:

    try:

        salt, stored_hash = stored_password.split(
            "$",
            1
        )

        password_hash = hashlib.pbkdf2_hmac(
            "sha256",
            password.encode("utf-8"),
            salt.encode("utf-8"),
            100_000
        ).hex()

        return secrets.compare_digest(
            password_hash,
            stored_hash
        )

    except Exception:

        return False


# ============================================================
# JWT TOKEN
# ============================================================

def create_access_token(
    user_id: int,
    email: str
) -> str:

    expire = (
        datetime.now(timezone.utc)
        + timedelta(
            minutes=ACCESS_TOKEN_EXPIRE_MINUTES
        )
    )

    payload = {
        "sub": str(user_id),
        "email": email,
        "exp": expire
    }

    return jwt.encode(
        payload,
        SECRET_KEY,
        algorithm=ALGORITHM
    )


# ============================================================
# CURRENT USER
# ============================================================

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(
        security
    )
):

    token = credentials.credentials

    try:

        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        user_id = payload.get("sub")
        email = payload.get("email")

        if not user_id or not email:

            raise HTTPException(
                status_code=401,
                detail="Invalid authentication token"
            )

        try:

            user_id = int(user_id)

        except (TypeError, ValueError):

            raise HTTPException(
                status_code=401,
                detail="Invalid authentication token"
            )

        connection = get_connection()

        try:

            cursor = connection.cursor()

            if using_postgres():

                cursor.execute(
                    """
                    SELECT
                        id,
                        name,
                        email,
                        created_at
                    FROM users
                    WHERE id = %s
                    """,
                    (user_id,)
                )

            else:

                cursor.execute(
                    """
                    SELECT
                        id,
                        name,
                        email,
                        created_at
                    FROM users
                    WHERE id = ?
                    """,
                    (user_id,)
                )

            user = cursor.fetchone()

        finally:

            connection.close()

        if not user:

            raise HTTPException(
                status_code=401,
                detail="User no longer exists"
            )

        return {
            "id": user["id"],
            "name": user["name"],
            "email": user["email"],
            "created_at": user["created_at"]
        }

    except JWTError:

        raise HTTPException(
            status_code=401,
            detail="Invalid or expired authentication token"
        )


# ============================================================
# REQUEST MODELS
# ============================================================

class RegisterRequest(BaseModel):

    name: str
    email: EmailStr
    password: str


class LoginRequest(BaseModel):

    email: EmailStr
    password: str


# ============================================================
# REGISTER
# ============================================================

@router.post("/register")
def register_user(
    data: RegisterRequest
):

    name = data.name.strip()

    email = str(
        data.email
    ).lower().strip()

    password = data.password

    if not name:

        raise HTTPException(
            status_code=400,
            detail="Name is required"
        )

    if len(password) < 6:

        raise HTTPException(
            status_code=400,
            detail="Password must be at least 6 characters"
        )

    connection = get_connection()

    try:

        cursor = connection.cursor()

        # ----------------------------------------------------
        # CHECK EXISTING USER
        # ----------------------------------------------------

        if using_postgres():

            cursor.execute(
                """
                SELECT id
                FROM users
                WHERE email = %s
                """,
                (email,)
            )

        else:

            cursor.execute(
                """
                SELECT id
                FROM users
                WHERE email = ?
                """,
                (email,)
            )

        existing_user = cursor.fetchone()

        if existing_user:

            raise HTTPException(
                status_code=400,
                detail="An account with this email already exists"
            )

        # ----------------------------------------------------
        # HASH PASSWORD
        # ----------------------------------------------------

        password_hash = hash_password(
            password
        )

        created_at = datetime.now(
            timezone.utc
        ).isoformat()

        # ----------------------------------------------------
        # INSERT USER
        # ----------------------------------------------------

        if using_postgres():

            cursor.execute(
                """
                INSERT INTO users (
                    name,
                    email,
                    password_hash,
                    created_at
                )
                VALUES (%s, %s, %s, %s)
                RETURNING id
                """,
                (
                    name,
                    email,
                    password_hash,
                    created_at
                )
            )

            result = cursor.fetchone()

            user_id = result["id"]

        else:

            cursor.execute(
                """
                INSERT INTO users (
                    name,
                    email,
                    password_hash,
                    created_at
                )
                VALUES (?, ?, ?, ?)
                """,
                (
                    name,
                    email,
                    password_hash,
                    created_at
                )
            )

            user_id = cursor.lastrowid

        connection.commit()

        return {
            "success": True,
            "message": "Registration successful",
            "user": {
                "id": user_id,
                "name": name,
                "email": email
            }
        }

    except HTTPException:

        connection.rollback()

        raise

    except Exception as error:

        connection.rollback()

        print(
            "Registration database error:",
            error
        )

        raise HTTPException(
            status_code=500,
            detail="Unable to create account"
        )

    finally:

        connection.close()


# ============================================================
# LOGIN
# ============================================================

@router.post("/login")
def login_user(
    data: LoginRequest
):

    email = str(
        data.email
    ).lower().strip()

    password = data.password

    connection = get_connection()

    try:

        cursor = connection.cursor()

        if using_postgres():

            cursor.execute(
                """
                SELECT *
                FROM users
                WHERE email = %s
                """,
                (email,)
            )

        else:

            cursor.execute(
                """
                SELECT *
                FROM users
                WHERE email = ?
                """,
                (email,)
            )

        user = cursor.fetchone()

    finally:

        connection.close()

    if not user:

        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    if not verify_password(
        password,
        user["password_hash"]
    ):

        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    access_token = create_access_token(
        user_id=user["id"],
        email=user["email"]
    )

    return {
        "success": True,
        "message": "Login successful",
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user["id"],
            "name": user["name"],
            "email": user["email"]
        }
    }


# ============================================================
# CURRENT USER
# ============================================================

@router.get("/me")
def get_me(
    current_user: dict = Depends(
        get_current_user
    )
):

    return {
        "success": True,
        "user": current_user
    }


# ============================================================
# AUTH STATUS
# ============================================================

@router.get("/status")
def auth_status():

    connection = get_connection()

    try:

        cursor = connection.cursor()

        cursor.execute(
            """
            SELECT COUNT(*) AS total_users
            FROM users
            """
        )

        result = cursor.fetchone()

        total_users = result["total_users"]

    finally:

        connection.close()

    return {
        "authentication": "active",
        "database": (
            "postgresql"
            if using_postgres()
            else "sqlite"
        ),
        "total_users": total_users,
        "jwt": "enabled"
    }