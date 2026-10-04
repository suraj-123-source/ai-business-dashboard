# from fastapi import APIRouter
# from reportlab.platypus import SimpleDocTemplate, Paragraph
# from reportlab.lib.styles import getSampleStyleSheet
# from fastapi.responses import FileResponse

# router = APIRouter()

# @router.get("/report")
# def generate_report():

#     doc = SimpleDocTemplate("Business_Report.pdf")
#     styles = getSampleStyleSheet()

#     story = []

#     story.append(Paragraph("<b>AI Business Analytics Report</b>", styles["Title"]))
#     story.append(Paragraph("Generated Automatically", styles["Normal"]))

#     story.append(Paragraph("<br/>", styles["Normal"]))

#     story.append(Paragraph("<b>KPI Summary</b>", styles["Heading2"]))
#     story.append(Paragraph("Revenue : ₹850000", styles["Normal"]))
#     story.append(Paragraph("Profit : ₹220000", styles["Normal"]))
#     story.append(Paragraph("Orders : 1200", styles["Normal"]))
#     story.append(Paragraph("Customers : 800", styles["Normal"]))

#     doc.build(story)

#     return FileResponse(
#         "Business_Report.pdf",
#         filename="Business_Report.pdf",
#         media_type="application/pdf"
#     )


# from fastapi import APIRouter, Depends
# from reportlab.platypus import SimpleDocTemplate, Paragraph
# from reportlab.lib.styles import getSampleStyleSheet
# from fastapi.responses import FileResponse

# from app.routes.auth import get_current_user


# # ============================================================
# # REPORT ROUTER
# # ============================================================

# router = APIRouter(
#     prefix="/report",
#     tags=["Reports"],
#     dependencies=[Depends(get_current_user)]
# )


# # ============================================================
# # GENERATE REPORT
# # ============================================================

# @router.get("/report")
# def generate_report():

#     doc = SimpleDocTemplate(
#         "Business_Report.pdf"
#     )

#     styles = getSampleStyleSheet()

#     story = []

#     story.append(
#         Paragraph(
#             "<b>AI Business Analytics Report</b>",
#             styles["Title"]
#         )
#     )

#     story.append(
#         Paragraph(
#             "Generated Automatically",
#             styles["Normal"]
#         )
#     )

#     story.append(
#         Paragraph(
#             "<br/>",
#             styles["Normal"]
#         )
#     )

#     story.append(
#         Paragraph(
#             "<b>KPI Summary</b>",
#             styles["Heading2"]
#         )
#     )

#     story.append(
#         Paragraph(
#             "Revenue : ₹850000",
#             styles["Normal"]
#         )
#     )

#     story.append(
#         Paragraph(
#             "Profit : ₹220000",
#             styles["Normal"]
#         )
#     )

#     story.append(
#         Paragraph(
#             "Orders : 1200",
#             styles["Normal"]
#         )
#     )

#     story.append(
#         Paragraph(
#             "Customers : 800",
#             styles["Normal"]
#         )
#     )

#     doc.build(story)

#     return FileResponse(
#         "Business_Report.pdf",
#         filename="Business_Report.pdf",
#         media_type="application/pdf"
#     )



from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse

from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet

import pandas as pd
import numpy as np
import os
import tempfile

from app.routes.auth import get_current_user
from app import data_store


# ============================================================
# REPORT ROUTER
# ============================================================

router = APIRouter(
    prefix="/report",
    tags=["Reports"],
    dependencies=[Depends(get_current_user)]
)


# ============================================================
# HELPER FUNCTIONS
# ============================================================

def clean_number(value):
    """
    Convert pandas/numpy values into safe Python numbers.
    """
    if value is None:
        return None

    try:
        if pd.isna(value):
            return None
    except Exception:
        pass

    try:
        return float(value)
    except Exception:
        return None


def normalize_column(column):
    """
    Normalize column names for easier detection.
    """
    return (
        str(column)
        .strip()
        .lower()
        .replace("_", " ")
        .replace("-", " ")
    )


def find_column(df, keywords):
    """
    Find the first column whose name contains one of the keywords.
    """
    for column in df.columns:
        name = normalize_column(column)

        for keyword in keywords:
            if keyword in name:
                return column

    return None


def find_revenue_column(df):
    """
    Detect revenue/sales/amount column.
    """

    priority_keywords = [
        "revenue",
        "sales",
        "sale amount",
        "sales amount",
        "total sales",
        "total revenue",
        "amount",
        "turnover",
        "income"
    ]

    # First search by exact/priority business names
    for keyword in priority_keywords:

        for column in df.columns:

            name = normalize_column(column)

            if name == keyword:
                return column

    # Then partial match
    return find_column(df, priority_keywords)


def find_profit_column(df):
    """
    Detect profit column.
    """

    keywords = [
        "profit",
        "net profit",
        "gross profit",
        "profit amount",
        "profit margin"
    ]

    return find_column(df, keywords)


def find_customer_column(df):
    """
    Detect customer-related column.
    """

    keywords = [
        "customer",
        "customer id",
        "customer name",
        "client",
        "client id",
        "buyer",
        "buyer id",
        "user id",
        "user"
    ]

    return find_column(df, keywords)


# ============================================================
# GENERATE REPORT
# ============================================================

@router.get("/report")
def generate_report():

    # --------------------------------------------------------
    # CHECK DATASET
    # --------------------------------------------------------

    df = getattr(data_store, "uploaded_data", None)

    if df is None:
        raise HTTPException(
            status_code=404,
            detail="No dataset uploaded. Please upload a dataset first."
        )

    if not isinstance(df, pd.DataFrame):
        raise HTTPException(
            status_code=500,
            detail="Uploaded dataset is not available as a DataFrame."
        )

    if df.empty:
        raise HTTPException(
            status_code=400,
            detail="Uploaded dataset is empty."
        )

    # --------------------------------------------------------
    # DETECT BUSINESS COLUMNS
    # --------------------------------------------------------

    revenue_column = find_revenue_column(df)

    profit_column = find_profit_column(df)

    customer_column = find_customer_column(df)

    # --------------------------------------------------------
    # CALCULATE KPIs
    # --------------------------------------------------------

    revenue = None
    profit = None

    # Revenue
    if revenue_column is not None:

        revenue_series = pd.to_numeric(
            df[revenue_column],
            errors="coerce"
        )

        revenue = clean_number(
            revenue_series.sum()
        )

    # Profit
    if profit_column is not None:

        profit_series = pd.to_numeric(
            df[profit_column],
            errors="coerce"
        )

        profit = clean_number(
            profit_series.sum()
        )

    # Orders / Records
    orders = int(len(df))

    # Customers
    customers = None

    if customer_column is not None:

        customers = int(
            df[customer_column]
            .dropna()
            .nunique()
        )

    # --------------------------------------------------------
    # CREATE TEMPORARY PDF
    # --------------------------------------------------------

    temp_file = tempfile.NamedTemporaryFile(
        delete=False,
        suffix=".pdf"
    )

    pdf_path = temp_file.name

    temp_file.close()

    # --------------------------------------------------------
    # CREATE PDF
    # --------------------------------------------------------

    doc = SimpleDocTemplate(
        pdf_path
    )

    styles = getSampleStyleSheet()

    story = []

    # --------------------------------------------------------
    # TITLE
    # --------------------------------------------------------

    story.append(
        Paragraph(
            "<b>AI Business Analytics Report</b>",
            styles["Title"]
        )
    )

    story.append(
        Spacer(1, 12)
    )

    story.append(
        Paragraph(
            "Generated Automatically",
            styles["Normal"]
        )
    )

    story.append(
        Spacer(1, 20)
    )

    # --------------------------------------------------------
    # DATASET INFORMATION
    # --------------------------------------------------------

    story.append(
        Paragraph(
            "<b>Dataset Summary</b>",
            styles["Heading2"]
        )
    )

    story.append(
        Paragraph(
            f"Total Records : {len(df):,}",
            styles["Normal"]
        )
    )

    story.append(
        Paragraph(
            f"Total Columns : {len(df.columns):,}",
            styles["Normal"]
        )
    )

    story.append(
        Spacer(1, 15)
    )

    # --------------------------------------------------------
    # KPI SUMMARY
    # --------------------------------------------------------

    story.append(
        Paragraph(
            "<b>KPI Summary</b>",
            styles["Heading2"]
        )
    )

    # Revenue
    if revenue is not None:

        story.append(
            Paragraph(
                f"Revenue : ₹{revenue:,.2f}",
                styles["Normal"]
            )
        )

    else:

        story.append(
            Paragraph(
                "Revenue : Not detected",
                styles["Normal"]
            )
        )

    # Profit
    if profit is not None:

        story.append(
            Paragraph(
                f"Profit : ₹{profit:,.2f}",
                styles["Normal"]
            )
        )

    else:

        story.append(
            Paragraph(
                "Profit : Not detected",
                styles["Normal"]
            )
        )

    # Orders
    story.append(
        Paragraph(
            f"Orders / Records : {orders:,}",
            styles["Normal"]
        )
    )

    # Customers
    if customers is not None:

        story.append(
            Paragraph(
                f"Customers : {customers:,}",
                styles["Normal"]
            )
        )

    else:

        story.append(
            Paragraph(
                "Customers : Not detected",
                styles["Normal"]
            )
        )

    story.append(
        Spacer(1, 20)
    )

    # --------------------------------------------------------
    # DETECTED BUSINESS COLUMNS
    # --------------------------------------------------------

    story.append(
        Paragraph(
            "<b>Detected Business Fields</b>",
            styles["Heading2"]
        )
    )

    if revenue_column:

        story.append(
            Paragraph(
                f"Revenue / Sales Column : {revenue_column}",
                styles["Normal"]
            )
        )

    if profit_column:

        story.append(
            Paragraph(
                f"Profit Column : {profit_column}",
                styles["Normal"]
            )
        )

    if customer_column:

        story.append(
            Paragraph(
                f"Customer Column : {customer_column}",
                styles["Normal"]
            )
        )

    story.append(
        Spacer(1, 20)
    )

    # --------------------------------------------------------
    # COLUMN INFORMATION
    # --------------------------------------------------------

    story.append(
        Paragraph(
            "<b>Dataset Columns</b>",
            styles["Heading2"]
        )
    )

    for column in df.columns:

        dtype = str(df[column].dtype)

        story.append(
            Paragraph(
                f"{column} : {dtype}",
                styles["Normal"]
            )
        )

    # --------------------------------------------------------
    # BUILD PDF
    # --------------------------------------------------------

    doc.build(story)

    # --------------------------------------------------------
    # RETURN PDF
    # --------------------------------------------------------

    return FileResponse(
        pdf_path,
        filename="Business_Report.pdf",
        media_type="application/pdf",
        background=None
    )