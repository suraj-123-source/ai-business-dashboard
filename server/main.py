
# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware

# from app.routes.report import router as report_router
# from app.routes.upload import router as upload_router
# from app.routes.analytics import router as analytics_router
# from app.routes.auth import router as auth_router


# app = FastAPI(
#     title="AI Business Analytics Dashboard"
# )


# # ---------------------------------------------------------
# # CORS
# # ---------------------------------------------------------

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=[
#         "http://localhost:5173"
#     ],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )


# # ---------------------------------------------------------
# # ROUTES
# # ---------------------------------------------------------

# app.include_router(auth_router)
# app.include_router(upload_router)
# app.include_router(analytics_router)
# app.include_router(report_router)


# # ---------------------------------------------------------
# # HOME
# # ---------------------------------------------------------

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



load_dotenv()
# ============================================================
# APPLICATION
# ============================================================

app = FastAPI(
    title="AI Business Analytics Dashboard"
)


# ============================================================
# CORS CONFIGURATION
# ============================================================

cors_origins_raw = os.getenv(
    "CORS_ORIGINS",
    "http://localhost:5173"
)

cors_origins = [
    origin.strip()
    for origin in cors_origins_raw.split(",")
    if origin.strip()
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# ROUTES
# ============================================================

app.include_router(auth_router)
app.include_router(upload_router)
app.include_router(analytics_router)
app.include_router(report_router)


# ============================================================
# HOME
# ============================================================

@app.get("/")
def home():

    return {
        "message": "Backend Running 🚀",
        "authentication": "enabled",
        "services": [
            "authentication",
            "upload",
            "analytics",
            "reports"
        ]
    }