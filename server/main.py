
# import os

# from dotenv import load_dotenv
# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware

# from app.routes.report import router as report_router
# from app.routes.upload import router as upload_router
# from app.routes.analytics import router as analytics_router
# from app.routes.auth import router as auth_router



# load_dotenv()
# # ============================================================
# # APPLICATION
# # ============================================================

# app = FastAPI(
#     title="AI Business Analytics Dashboard"
# )


# # ============================================================
# # CORS CONFIGURATION
# # ============================================================

# cors_origins_raw = os.getenv(
#     "CORS_ORIGINS",
#     "http://localhost:5173"
# )

# cors_origins = [
#     origin.strip()
#     for origin in cors_origins_raw.split(",")
#     if origin.strip()
# ]


# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=cors_origins,
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )


# # ============================================================
# # ROUTES
# # ============================================================

# app.include_router(auth_router)
# app.include_router(upload_router)
# app.include_router(analytics_router)
# app.include_router(report_router)


# # ============================================================
# # HOME
# # ============================================================

# @app.get("/")
# def home():

#     return {
#         "message": "Backend Running 🚀",
#         "authentication": "enabled",
#         "services": [
#             "authentication",
#             "upload",
#             "analytics",
#             "reports"
#         ]
#     }

import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.report import router as report_router
from app.routes.upload import router as upload_router
from app.routes.analytics import router as analytics_router
from app.routes.auth import router as auth_router


# Load environment variables
load_dotenv()


app = FastAPI(
    title="AI Business Analytics Dashboard"
)


# ---------------------------------------------------------
# CORS CONFIGURATION
# ---------------------------------------------------------

ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://ai-business-dashboard-1-0qa2.onrender.com",
]


# Also allow additional origins from Render environment variable
cors_origins_raw = os.getenv("CORS_ORIGINS", "")

if cors_origins_raw:
    for origin in cors_origins_raw.split(","):
        origin = origin.strip()

        if origin and origin not in ALLOWED_ORIGINS:
            ALLOWED_ORIGINS.append(origin)


app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------
# ROUTES
# ---------------------------------------------------------

app.include_router(auth_router)

app.include_router(upload_router)

app.include_router(analytics_router)

app.include_router(report_router)


# ---------------------------------------------------------
# HOME
# ---------------------------------------------------------

@app.get("/")
def home():
    return {
        "message": "Backend Running 🚀",
        "authentication": "enabled",
        "services": [
            "authentication",
            "upload",
            "analytics",
            "reports",
        ],
    }