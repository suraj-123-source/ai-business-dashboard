
# from fastapi import APIRouter, UploadFile, File
# import pandas as pd
# import numpy as np
# import re
# import app.data_store as data_store

# router = APIRouter(prefix="/upload", tags=["Upload"])


# # ============================================================
# # SAFE / NORMALIZATION HELPERS
# # ============================================================

# def clean_value(value):
#     if pd.isna(value):
#         return None
#     if isinstance(value, (np.integer,)):
#         return int(value)
#     if isinstance(value, (np.floating,)):
#         return float(value)
#     if isinstance(value, (np.bool_,)):
#         return bool(value)
#     if isinstance(value, (pd.Timestamp, np.datetime64)):
#         return str(pd.Timestamp(value))
#     return value


# def norm(value):
#     return re.sub(r"[^a-z0-9]+", "_", str(value).lower()).strip("_")


# ID_EXACT = {
#     "id",
#     "index",
#     "sno",
#     "srno",
#     "serial",
#     "serial_no",
#     "serial_number",
#     "row",
#     "row_number",
#     "row_num",
#     "record_id",
#     "record_number",
# }

# SENSITIVE_WORDS = (
#     "password",
#     "token",
#     "secret",
#     "email",
#     "phone",
#     "mobile",
#     "address",
#     "url",
# )


# def is_id(column, series):
#     n = norm(column)

#     if n in ID_EXACT:
#         return True

#     if n.endswith("_id") or n.endswith("_number"):
#         return True

#     if n.startswith(("index_", "serial_", "row_")):
#         return True

#     if n in {"zip", "zipcode", "postal_code", "pincode"}:
#         return True

#     # Numeric sequential columns are almost always row/index identifiers.
#     if pd.api.types.is_numeric_dtype(series):
#         x = pd.to_numeric(series, errors="coerce").dropna()

#         if len(x) >= 5 and x.nunique() == len(x):
#             a = x.to_numpy()

#             if np.allclose(a, np.arange(a[0], a[0] + len(a))):
#                 return True

#     return False


# # ============================================================
# # DATE DETECTION
# # ============================================================

# def detect_date_columns(df):
#     date_columns = []

#     date_words = (
#         "date",
#         "time",
#         "year",
#         "month",
#         "day",
#         "created",
#         "updated",
#         "timestamp",
#         "joined",
#         "registered",
#     )

#     for column in df.columns:
#         series = df[column]

#         if is_id(column, series):
#             continue

#         if pd.api.types.is_numeric_dtype(series):
#             continue

#         try:
#             parsed = pd.to_datetime(series, errors="coerce")
#             ratio = parsed.notna().mean()

#             threshold = (
#                 0.50
#                 if any(word in norm(column) for word in date_words)
#                 else 0.80
#             )

#             if ratio >= threshold:
#                 date_columns.append(column)

#         except Exception:
#             pass

#     return date_columns


# # ============================================================
# # COLUMN TYPE DETECTION
# # ============================================================

# def detect_column_types(df, date_columns):
#     numeric = []
#     categorical = []
#     text = []
#     ids = []

#     for column in df.columns:
#         series = df[column]

#         if column in date_columns:
#             continue

#         if is_id(column, series):
#             ids.append(column)
#             continue

#         if pd.api.types.is_numeric_dtype(series):
#             numeric.append(column)
#             continue

#         unique_count = int(series.nunique(dropna=True))
#         total_count = len(series)
#         unique_ratio = (
#             unique_count / total_count
#             if total_count > 0
#             else 0
#         )

#         name = norm(column)

#         # Clearly sensitive/free-text fields stay text.
#         if any(word in name for word in SENSITIVE_WORDS):
#             text.append(column)

#         # Normal business dimensions with manageable cardinality.
#         elif unique_count <= 100 or unique_ratio <= 0.50:
#             categorical.append(column)

#         else:
#             text.append(column)

#     return {
#         "numeric": numeric,
#         "categorical": categorical,
#         "text": text,
#         "id": ids,
#         "date": date_columns,
#     }


# # ============================================================
# # NUMERIC ANALYSIS
# # ============================================================

# def generate_numeric_analysis(df, numeric_columns):
#     analysis = []

#     for column in numeric_columns:
#         series = pd.to_numeric(
#             df[column],
#             errors="coerce"
#         ).dropna()

#         if len(series) == 0:
#             continue

#         analysis.append({
#             "column": column,
#             "count": int(series.count()),
#             "sum": round(float(series.sum()), 2),
#             "average": round(float(series.mean()), 2),
#             "minimum": round(float(series.min()), 2),
#             "maximum": round(float(series.max()), 2),
#             "median": round(float(series.median()), 2),
#             "std": round(float(series.std()), 2) if len(series) > 1 else 0.0,
#         })

#     return analysis


# # ============================================================
# # CATEGORY / DIMENSION ANALYSIS
# # ============================================================

# def generate_category_analysis(df, categorical_columns):
#     analysis = []

#     for column in categorical_columns:
#         counts = (
#             df[column]
#             .fillna("Unknown")
#             .astype(str)
#             .value_counts()
#             .head(12)
#         )

#         top_values = [
#             {
#                 "name": str(name),
#                 "value": int(count),
#             }
#             for name, count in counts.items()
#         ]

#         analysis.append({
#             "column": column,
#             "uniqueValues": int(df[column].nunique(dropna=True)),
#             "topValues": top_values,
#         })

#     return analysis


# # ============================================================
# # TEXT DIMENSION ANALYSIS
# # ------------------------------------------------------------
# # High-cardinality text is not allowed to become an ID chart,
# # but it can still provide useful "top values" information.
# # ============================================================

# def generate_text_analysis(df, text_columns):
#     analysis = []

#     for column in text_columns:
#         name = norm(column)

#         if any(word in name for word in SENSITIVE_WORDS):
#             continue

#         counts = (
#             df[column]
#             .fillna("Unknown")
#             .astype(str)
#             .value_counts()
#             .head(10)
#         )

#         if len(counts) == 0:
#             continue

#         analysis.append({
#             "column": column,
#             "uniqueValues": int(df[column].nunique(dropna=True)),
#             "topValues": [
#                 {
#                     "name": str(name_value),
#                     "value": int(count),
#                 }
#                 for name_value, count in counts.items()
#             ],
#         })

#     return analysis


# # ============================================================
# # GROUPED ANALYSIS
# # ============================================================

# def generate_grouped_analysis(
#     df,
#     categorical_columns,
#     numeric_columns,
# ):
#     analysis = []

#     # Numeric group analysis.
#     for category in categorical_columns[:8]:
#         for metric in numeric_columns[:6]:
#             try:
#                 grouped = (
#                     df.groupby(category, dropna=False)[metric]
#                     .sum()
#                     .reset_index()
#                     .sort_values(metric, ascending=False)
#                     .head(10)
#                 )

#                 records = [
#                     {
#                         "name": str(row[category]),
#                         "value": round(float(row[metric]), 2),
#                     }
#                     for _, row in grouped.iterrows()
#                 ]

#                 analysis.append({
#                     "category": category,
#                     "metric": metric,
#                     "data": records,
#                     "type": "sum",
#                 })

#             except Exception:
#                 continue

#     # Count-based group analysis is important for non-numeric datasets.
#     if not numeric_columns:
#         for category in categorical_columns[:8]:
#             try:
#                 grouped = (
#                     df[category]
#                     .fillna("Unknown")
#                     .astype(str)
#                     .value_counts()
#                     .head(10)
#                 )

#                 records = [
#                     {
#                         "name": str(name),
#                         "value": int(count),
#                     }
#                     for name, count in grouped.items()
#                 ]

#                 analysis.append({
#                     "category": category,
#                     "metric": "Records",
#                     "data": records,
#                     "type": "count",
#                 })

#             except Exception:
#                 continue

#     return analysis


# # ============================================================
# # DATE ANALYSIS
# # ============================================================

# def generate_date_analysis(
#     df,
#     date_columns,
#     numeric_columns,
# ):
#     analysis = []

#     if not date_columns:
#         return analysis

#     for date_column in date_columns[:3]:
#         try:
#             temp = df.copy()

#             temp["_date"] = pd.to_datetime(
#                 temp[date_column],
#                 errors="coerce"
#             )

#             temp = temp.dropna(subset=["_date"])

#             if temp.empty:
#                 continue

#             # Numeric time series.
#             for metric in numeric_columns[:5]:
#                 try:
#                     grouped = (
#                         temp.groupby(
#                             temp["_date"].dt.to_period("M")
#                         )[metric]
#                         .sum()
#                         .reset_index()
#                     )

#                     records = [
#                         {
#                             "month": str(row["_date"]),
#                             "value": round(float(row[metric]), 2),
#                         }
#                         for _, row in grouped.iterrows()
#                     ]

#                     analysis.append({
#                         "dateColumn": date_column,
#                         "metric": metric,
#                         "data": records,
#                         "type": "sum",
#                     })

#                 except Exception:
#                     continue

#             # Record-count time series for non-numeric datasets.
#             if not numeric_columns:
#                 grouped = (
#                     temp.groupby(
#                         temp["_date"].dt.to_period("M")
#                     )
#                     .size()
#                     .reset_index(name="records")
#                 )

#                 records = [
#                     {
#                         "month": str(row["_date"]),
#                         "value": int(row["records"]),
#                     }
#                     for _, row in grouped.iterrows()
#                 ]

#                 analysis.append({
#                     "dateColumn": date_column,
#                     "metric": "Records",
#                     "data": records,
#                     "type": "count",
#                 })

#         except Exception:
#             continue

#     return analysis


# # ============================================================
# # KPIs
# # ============================================================

# def generate_kpis(
#     df,
#     numeric_columns,
#     categorical_columns,
#     date_columns,
# ):
#     kpis = [
#         {
#             "name": "Total Records",
#             "value": len(df),
#             "type": "count",
#         },
#         {
#             "name": "Numeric Fields",
#             "value": len(numeric_columns),
#             "type": "count",
#         },
#         {
#             "name": "Category Fields",
#             "value": len(categorical_columns),
#             "type": "count",
#         },
#         {
#             "name": "Date Fields",
#             "value": len(date_columns),
#             "type": "count",
#         },
#     ]

#     for column in numeric_columns[:10]:
#         series = pd.to_numeric(
#             df[column],
#             errors="coerce"
#         ).dropna()

#         if len(series) == 0:
#             continue

#         kpis.append({
#             "name": f"Total {column}",
#             "value": round(float(series.sum()), 2),
#             "type": "sum",
#             "column": column,
#         })

#         kpis.append({
#             "name": f"Average {column}",
#             "value": round(float(series.mean()), 2),
#             "type": "average",
#             "column": column,
#         })

#     for column in categorical_columns[:8]:
#         kpis.append({
#             "name": f"Unique {column}",
#             "value": int(df[column].nunique(dropna=True)),
#             "type": "unique",
#             "column": column,
#         })

#     return kpis


# # ============================================================
# # BUSINESS METRIC DETECTION
# # ============================================================

# def is_financial_name(column):
#     return bool(
#         re.search(
#             r"revenue|sales|amount|income|turnover|profit|earning|salary|"
#             r"spend|cost|price|fee|expense|value",
#             norm(column),
#         )
#     )


# def is_profit_name(column):
#     return bool(
#         re.search(
#             r"profit|net_income|netincome|earning",
#             norm(column),
#         )
#     )


# def find_business_metrics(df, numeric_columns):
#     usable = [
#         c for c in numeric_columns
#         if not is_id(c, df[c])
#     ]

#     financial = next(
#         (c for c in usable if is_financial_name(c)),
#         None,
#     )

#     profit = next(
#         (c for c in usable if is_profit_name(c)),
#         None,
#     )

#     return financial, profit


# # ============================================================
# # AI-STYLE INSIGHTS
# # ============================================================

# def generate_insights(
#     df,
#     numeric_columns,
#     categorical_columns,
#     date_columns,
#     numeric_analysis,
#     category_analysis,
# ):
#     insights = []

#     insights.append(
#         f"Dataset contains {len(df):,} records and {len(df.columns)} columns."
#     )

#     if numeric_columns:
#         insights.append(
#             f"{len(numeric_columns)} numeric field(s) are available for statistical analysis."
#         )
#     else:
#         insights.append(
#             "No numeric business measures were detected; analysis focuses on records, dimensions and time patterns."
#         )

#     for item in numeric_analysis[:4]:
#         column = item["column"]
#         average = item["average"]
#         maximum = item["maximum"]

#         insights.append(
#             f"{column}: average {average:,.2f}, maximum {maximum:,.2f}."
#         )

#     for item in category_analysis[:4]:
#         values = item.get("topValues", [])

#         if values:
#             top = values[0]

#             insights.append(
#                 f"{item['column']}: '{top['name']}' is the most common value with {top['value']:,} records."
#             )

#     if date_columns:
#         insights.append(
#             f"{len(date_columns)} date field(s) were detected and included in time-based analysis."
#         )

#     return insights[:12]


# # ============================================================
# # COLUMN INFORMATION
# # ============================================================

# def build_column_information(
#     df,
#     column_types,
# ):
#     date_columns = column_types["date"]
#     numeric_columns = column_types["numeric"]
#     categorical_columns = column_types["categorical"]
#     text_columns = column_types["text"]
#     id_columns = column_types["id"]

#     information = []

#     for column in df.columns:
#         series = df[column]

#         if column in date_columns:
#             kind = "date"
#         elif column in numeric_columns:
#             kind = "numeric"
#         elif column in categorical_columns:
#             kind = "categorical"
#         elif column in text_columns:
#             kind = "text"
#         elif column in id_columns:
#             kind = "id"
#         else:
#             kind = "text"

#         information.append({
#             "name": column,
#             "type": kind,
#             "unique": int(series.nunique(dropna=True)),
#             "missing": int(series.isna().sum()),
#             "missingPercentage": round(
#                 float(series.isna().mean() * 100),
#                 2,
#             ),
#         })

#     return information


# # ============================================================
# # UPLOAD ENDPOINT
# # ============================================================

# @router.post("/")
# async def upload_file(
#     file: UploadFile = File(...),
# ):
#     filename = file.filename or ""

#     try:
#         if filename.lower().endswith(".csv"):
#             df = pd.read_csv(file.file)

#         elif filename.lower().endswith(".xlsx"):
#             df = pd.read_excel(file.file)

#         elif filename.lower().endswith(".xls"):
#             df = pd.read_excel(file.file)

#         else:
#             return {
#                 "success": False,
#                 "message": "Unsupported file format. Please upload CSV, XLS or XLSX.",
#             }

#     except Exception as error:
#         return {
#             "success": False,
#             "message": f"Could not read file: {str(error)}",
#         }

#     # --------------------------------------------------------
#     # Cleaning
#     # --------------------------------------------------------

#     df.columns = [
#         str(column).strip()
#         for column in df.columns
#     ]

#     df = df.dropna(
#         how="all"
#     ).reset_index(drop=True)

#     if df.empty:
#         return {
#             "success": False,
#             "message": "The uploaded dataset contains no usable rows.",
#         }

#     # Store current dataset.
#     data_store.uploaded_data = df

#     # --------------------------------------------------------
#     # Detect types
#     # --------------------------------------------------------

#     date_columns = detect_date_columns(df)

#     column_types = detect_column_types(
#         df,
#         date_columns,
#     )

#     numeric_columns = column_types["numeric"]
#     categorical_columns = column_types["categorical"]
#     text_columns = column_types["text"]

#     # --------------------------------------------------------
#     # Analytics
#     # --------------------------------------------------------

#     numeric_analysis = generate_numeric_analysis(
#         df,
#         numeric_columns,
#     )

#     category_analysis = generate_category_analysis(
#         df,
#         categorical_columns,
#     )

#     text_analysis = generate_text_analysis(
#         df,
#         text_columns,
#     )

#     grouped_analysis = generate_grouped_analysis(
#         df,
#         categorical_columns,
#         numeric_columns,
#     )

#     date_analysis = generate_date_analysis(
#         df,
#         date_columns,
#         numeric_columns,
#     )

#     kpis = generate_kpis(
#         df,
#         numeric_columns,
#         categorical_columns,
#         date_columns,
#     )

#     financial_column, profit_column = find_business_metrics(
#         df,
#         numeric_columns,
#     )

#     financial_total = None
#     profit_total = None

#     if financial_column:
#         financial_total = round(
#             float(
#                 pd.to_numeric(
#                     df[financial_column],
#                     errors="coerce",
#                 ).sum()
#             ),
#             2,
#         )

#     if profit_column:
#         profit_total = round(
#             float(
#                 pd.to_numeric(
#                     df[profit_column],
#                     errors="coerce",
#                 ).sum()
#             ),
#             2,
#         )

#     # --------------------------------------------------------
#     # Customer / group detection
#     # --------------------------------------------------------

#     customer_column = next(
#         (
#             c
#             for c in (
#                 categorical_columns +
#                 text_columns
#             )
#             if re.search(
#                 r"customer|client|buyer|user",
#                 c,
#                 re.I,
#             )
#         ),
#         None,
#     )

#     customer_count = None

#     if customer_column:
#         customer_count = int(
#             df[customer_column].nunique(
#                 dropna=True
#             )
#         )

#     # --------------------------------------------------------
#     # AI insights
#     # --------------------------------------------------------

#     insights = generate_insights(
#         df,
#         numeric_columns,
#         categorical_columns,
#         date_columns,
#         numeric_analysis,
#         category_analysis,
#     )

#     # --------------------------------------------------------
#     # Preview
#     # --------------------------------------------------------

#     preview = []

#     for record in df.head(20).to_dict(
#         orient="records"
#     ):
#         preview.append({
#             str(key): clean_value(value)
#             for key, value in record.items()
#         })

#     # --------------------------------------------------------
#     # Column information
#     # --------------------------------------------------------

#     column_information = build_column_information(
#         df,
#         column_types,
#     )

#     # --------------------------------------------------------
#     # Data quality
#     # --------------------------------------------------------

#     total_cells = len(df) * len(df.columns)

#     missing_cells = sum(
#         int(df[column].isna().sum())
#         for column in df.columns
#     )

#     completeness = (
#         100.0
#         if total_cells == 0
#         else max(
#             0.0,
#             100.0 -
#             (missing_cells / total_cells) * 100.0,
#         )
#     )

#     # --------------------------------------------------------
#     # Summary
#     # --------------------------------------------------------

#     summary = {
#         "primaryMetric": financial_column,
#         "primaryMetricTotal": financial_total,
#         "profitMetric": profit_column,
#         "revenue": financial_total,
#         "profit": profit_total,
#         "orders": len(df),
#         "totalRecords": len(df),
#         "customers": customer_count,
#         "customerColumn": customer_column,
#         "averageOrder": (
#             round(financial_total / len(df), 2)
#             if financial_total is not None and len(df) > 0
#             else None
#         ),
#         "numericFields": len(numeric_columns),
#         "categoryFields": len(categorical_columns),
#         "dateFields": len(date_columns),
#         "textFields": len(text_columns),
#         "missingCells": missing_cells,
#         "dataCompleteness": round(completeness, 2),
#     }

#     # --------------------------------------------------------
#     # Response
#     # --------------------------------------------------------

#     return {
#         "success": True,
#         "filename": filename,
#         "rows": len(df),
#         "columns": list(df.columns),

#         "summary": summary,

#         "columnInformation": column_information,

#         "detectedColumns": column_types,

#         "preview": preview,

#         "kpis": kpis,

#         "numericAnalysis": numeric_analysis,

#         "categoryAnalysis": category_analysis,

#         "textAnalysis": text_analysis,

#         "groupedAnalysis": grouped_analysis,

#         "dateAnalysis": date_analysis,

#         "aiInsights": insights,

#         # Compatibility keys used by existing frontend components.
#         "monthlyRevenue": (
#             date_analysis[0]["data"]
#             if date_analysis
#             else []
#         ),

#         "categoryRevenue": category_analysis,

#         "topProducts": (
#             grouped_analysis[0]["data"]
#             if grouped_analysis
#             else []
#         ),

#         "topCustomers": [],

#         "regionalSales": [],

#         "forecast": [],
#     }



from fastapi import APIRouter, UploadFile, File, Depends
import pandas as pd
import numpy as np
import re

import app.data_store as data_store
from app.routes.auth import get_current_user


router = APIRouter(prefix="/upload", tags=["Upload"])


# ============================================================
# SAFE / NORMALIZATION HELPERS
# ============================================================

def clean_value(value):
    if pd.isna(value):
        return None

    if isinstance(value, (np.integer,)):
        return int(value)

    if isinstance(value, (np.floating,)):
        return float(value)

    if isinstance(value, (np.bool_,)):
        return bool(value)

    if isinstance(value, (pd.Timestamp, np.datetime64)):
        return str(pd.Timestamp(value))

    return value


def norm(value):
    return re.sub(
        r"[^a-z0-9]+",
        "_",
        str(value).lower()
    ).strip("_")


ID_EXACT = {
    "id",
    "index",
    "sno",
    "srno",
    "serial",
    "serial_no",
    "serial_number",
    "row",
    "row_number",
    "row_num",
    "record_id",
    "record_number",
}


SENSITIVE_WORDS = (
    "password",
    "token",
    "secret",
    "email",
    "phone",
    "mobile",
    "address",
    "url",
)


def is_id(column, series):
    n = norm(column)

    if n in ID_EXACT:
        return True

    if n.endswith("_id") or n.endswith("_number"):
        return True

    if n.startswith(("index_", "serial_", "row_")):
        return True

    if n in {
        "zip",
        "zipcode",
        "postal_code",
        "pincode",
    }:
        return True

    # Numeric sequential columns are almost always row/index identifiers.
    if pd.api.types.is_numeric_dtype(series):
        x = pd.to_numeric(
            series,
            errors="coerce"
        ).dropna()

        if len(x) >= 5 and x.nunique() == len(x):
            a = x.to_numpy()

            if np.allclose(
                a,
                np.arange(
                    a[0],
                    a[0] + len(a)
                )
            ):
                return True

    return False


# ============================================================
# DATE DETECTION
# ============================================================

def detect_date_columns(df):
    date_columns = []

    date_words = (
        "date",
        "time",
        "year",
        "month",
        "day",
        "created",
        "updated",
        "timestamp",
        "joined",
        "registered",
    )

    for column in df.columns:
        series = df[column]

        if is_id(column, series):
            continue

        if pd.api.types.is_numeric_dtype(series):
            continue

        try:
            parsed = pd.to_datetime(
                series,
                errors="coerce"
            )

            ratio = parsed.notna().mean()

            threshold = (
                0.50
                if any(
                    word in norm(column)
                    for word in date_words
                )
                else 0.80
            )

            if ratio >= threshold:
                date_columns.append(column)

        except Exception:
            pass

    return date_columns


# ============================================================
# COLUMN TYPE DETECTION
# ============================================================

def detect_column_types(df, date_columns):
    numeric = []
    categorical = []
    text = []
    ids = []

    for column in df.columns:
        series = df[column]

        if column in date_columns:
            continue

        if is_id(column, series):
            ids.append(column)
            continue

        if pd.api.types.is_numeric_dtype(series):
            numeric.append(column)
            continue

        unique_count = int(
            series.nunique(dropna=True)
        )

        total_count = len(series)

        unique_ratio = (
            unique_count / total_count
            if total_count > 0
            else 0
        )

        name = norm(column)

        # Clearly sensitive/free-text fields stay text.
        if any(
            word in name
            for word in SENSITIVE_WORDS
        ):
            text.append(column)

        # Normal business dimensions with manageable cardinality.
        elif (
            unique_count <= 100
            or unique_ratio <= 0.50
        ):
            categorical.append(column)

        else:
            text.append(column)

    return {
        "numeric": numeric,
        "categorical": categorical,
        "text": text,
        "id": ids,
        "date": date_columns,
    }


# ============================================================
# NUMERIC ANALYSIS
# ============================================================

def generate_numeric_analysis(
    df,
    numeric_columns
):
    analysis = []

    for column in numeric_columns:
        series = pd.to_numeric(
            df[column],
            errors="coerce"
        ).dropna()

        if len(series) == 0:
            continue

        analysis.append({
            "column": column,
            "count": int(series.count()),
            "sum": round(
                float(series.sum()),
                2
            ),
            "average": round(
                float(series.mean()),
                2
            ),
            "minimum": round(
                float(series.min()),
                2
            ),
            "maximum": round(
                float(series.max()),
                2
            ),
            "median": round(
                float(series.median()),
                2
            ),
            "std": round(
                float(series.std()),
                2
            ) if len(series) > 1 else 0.0,
        })

    return analysis


# ============================================================
# CATEGORY / DIMENSION ANALYSIS
# ============================================================

def generate_category_analysis(
    df,
    categorical_columns
):
    analysis = []

    for column in categorical_columns:
        counts = (
            df[column]
            .fillna("Unknown")
            .astype(str)
            .value_counts()
            .head(12)
        )

        top_values = [
            {
                "name": str(name),
                "value": int(count),
            }
            for name, count in counts.items()
        ]

        analysis.append({
            "column": column,
            "uniqueValues": int(
                df[column].nunique(
                    dropna=True
                )
            ),
            "topValues": top_values,
        })

    return analysis


# ============================================================
# TEXT DIMENSION ANALYSIS
# ============================================================

def generate_text_analysis(
    df,
    text_columns
):
    analysis = []

    for column in text_columns:
        name = norm(column)

        if any(
            word in name
            for word in SENSITIVE_WORDS
        ):
            continue

        counts = (
            df[column]
            .fillna("Unknown")
            .astype(str)
            .value_counts()
            .head(10)
        )

        if len(counts) == 0:
            continue

        analysis.append({
            "column": column,
            "uniqueValues": int(
                df[column].nunique(
                    dropna=True
                )
            ),
            "topValues": [
                {
                    "name": str(name_value),
                    "value": int(count),
                }
                for name_value, count
                in counts.items()
            ],
        })

    return analysis


# ============================================================
# GROUPED ANALYSIS
# ============================================================

def generate_grouped_analysis(
    df,
    categorical_columns,
    numeric_columns,
):
    analysis = []

    # Numeric group analysis.
    for category in categorical_columns[:8]:

        for metric in numeric_columns[:6]:

            try:
                grouped = (
                    df.groupby(
                        category,
                        dropna=False
                    )[metric]
                    .sum()
                    .reset_index()
                    .sort_values(
                        metric,
                        ascending=False
                    )
                    .head(10)
                )

                records = [
                    {
                        "name": str(row[category]),
                        "value": round(
                            float(row[metric]),
                            2
                        ),
                    }
                    for _, row
                    in grouped.iterrows()
                ]

                analysis.append({
                    "category": category,
                    "metric": metric,
                    "data": records,
                    "type": "sum",
                })

            except Exception:
                continue

    # Count-based group analysis.
    if not numeric_columns:

        for category in categorical_columns[:8]:

            try:
                grouped = (
                    df[category]
                    .fillna("Unknown")
                    .astype(str)
                    .value_counts()
                    .head(10)
                )

                records = [
                    {
                        "name": str(name),
                        "value": int(count),
                    }
                    for name, count
                    in grouped.items()
                ]

                analysis.append({
                    "category": category,
                    "metric": "Records",
                    "data": records,
                    "type": "count",
                })

            except Exception:
                continue

    return analysis


# ============================================================
# DATE ANALYSIS
# ============================================================

def generate_date_analysis(
    df,
    date_columns,
    numeric_columns,
):
    analysis = []

    if not date_columns:
        return analysis

    for date_column in date_columns[:3]:

        try:
            temp = df.copy()

            temp["_date"] = pd.to_datetime(
                temp[date_column],
                errors="coerce"
            )

            temp = temp.dropna(
                subset=["_date"]
            )

            if temp.empty:
                continue

            # Numeric time series.
            for metric in numeric_columns[:5]:

                try:
                    grouped = (
                        temp.groupby(
                            temp["_date"].dt.to_period("M")
                        )[metric]
                        .sum()
                        .reset_index()
                    )

                    records = [
                        {
                            "month": str(row["_date"]),
                            "value": round(
                                float(row[metric]),
                                2
                            ),
                        }
                        for _, row
                        in grouped.iterrows()
                    ]

                    analysis.append({
                        "dateColumn": date_column,
                        "metric": metric,
                        "data": records,
                        "type": "sum",
                    })

                except Exception:
                    continue

            # Record-count time series.
            if not numeric_columns:

                grouped = (
                    temp.groupby(
                        temp["_date"].dt.to_period("M")
                    )
                    .size()
                    .reset_index(
                        name="records"
                    )
                )

                records = [
                    {
                        "month": str(row["_date"]),
                        "value": int(
                            row["records"]
                        ),
                    }
                    for _, row
                    in grouped.iterrows()
                ]

                analysis.append({
                    "dateColumn": date_column,
                    "metric": "Records",
                    "data": records,
                    "type": "count",
                })

        except Exception:
            continue

    return analysis


# ============================================================
# KPIs
# ============================================================

def generate_kpis(
    df,
    numeric_columns,
    categorical_columns,
    date_columns,
):
    kpis = [
        {
            "name": "Total Records",
            "value": len(df),
            "type": "count",
        },
        {
            "name": "Numeric Fields",
            "value": len(numeric_columns),
            "type": "count",
        },
        {
            "name": "Category Fields",
            "value": len(categorical_columns),
            "type": "count",
        },
        {
            "name": "Date Fields",
            "value": len(date_columns),
            "type": "count",
        },
    ]

    for column in numeric_columns[:10]:

        series = pd.to_numeric(
            df[column],
            errors="coerce"
        ).dropna()

        if len(series) == 0:
            continue

        kpis.append({
            "name": f"Total {column}",
            "value": round(
                float(series.sum()),
                2
            ),
            "type": "sum",
            "column": column,
        })

        kpis.append({
            "name": f"Average {column}",
            "value": round(
                float(series.mean()),
                2
            ),
            "type": "average",
            "column": column,
        })

    for column in categorical_columns[:8]:

        kpis.append({
            "name": f"Unique {column}",
            "value": int(
                df[column].nunique(
                    dropna=True
                )
            ),
            "type": "unique",
            "column": column,
        })

    return kpis


# ============================================================
# BUSINESS METRIC DETECTION
# ============================================================

def is_financial_name(column):
    return bool(
        re.search(
            r"revenue|sales|amount|income|turnover|profit|"
            r"earning|salary|spend|cost|price|fee|expense|value",
            norm(column),
        )
    )


def is_profit_name(column):
    return bool(
        re.search(
            r"profit|net_income|netincome|earning",
            norm(column),
        )
    )


def find_business_metrics(
    df,
    numeric_columns
):
    usable = [
        c
        for c in numeric_columns
        if not is_id(c, df[c])
    ]

    financial = next(
        (
            c
            for c in usable
            if is_financial_name(c)
        ),
        None,
    )

    profit = next(
        (
            c
            for c in usable
            if is_profit_name(c)
        ),
        None,
    )

    return financial, profit


# ============================================================
# AI-STYLE INSIGHTS
# ============================================================

def generate_insights(
    df,
    numeric_columns,
    categorical_columns,
    date_columns,
    numeric_analysis,
    category_analysis,
):
    insights = []

    insights.append(
        f"Dataset contains {len(df):,} records "
        f"and {len(df.columns)} columns."
    )

    if numeric_columns:

        insights.append(
            f"{len(numeric_columns)} numeric field(s) "
            "are available for statistical analysis."
        )

    else:

        insights.append(
            "No numeric business measures were detected; "
            "analysis focuses on records, dimensions and time patterns."
        )

    for item in numeric_analysis[:4]:

        column = item["column"]
        average = item["average"]
        maximum = item["maximum"]

        insights.append(
            f"{column}: average {average:,.2f}, "
            f"maximum {maximum:,.2f}."
        )

    for item in category_analysis[:4]:

        values = item.get(
            "topValues",
            []
        )

        if values:

            top = values[0]

            insights.append(
                f"{item['column']}: "
                f"'{top['name']}' is the most common value "
                f"with {top['value']:,} records."
            )

    if date_columns:

        insights.append(
            f"{len(date_columns)} date field(s) "
            "were detected and included in time-based analysis."
        )

    return insights[:12]


# ============================================================
# COLUMN INFORMATION
# ============================================================

def build_column_information(
    df,
    column_types,
):
    date_columns = column_types["date"]
    numeric_columns = column_types["numeric"]
    categorical_columns = column_types["categorical"]
    text_columns = column_types["text"]
    id_columns = column_types["id"]

    information = []

    for column in df.columns:

        series = df[column]

        if column in date_columns:
            kind = "date"

        elif column in numeric_columns:
            kind = "numeric"

        elif column in categorical_columns:
            kind = "categorical"

        elif column in text_columns:
            kind = "text"

        elif column in id_columns:
            kind = "id"

        else:
            kind = "text"

        information.append({
            "name": column,
            "type": kind,
            "unique": int(
                series.nunique(
                    dropna=True
                )
            ),
            "missing": int(
                series.isna().sum()
            ),
            "missingPercentage": round(
                float(
                    series.isna().mean() * 100
                ),
                2,
            ),
        })

    return information


# ============================================================
# UPLOAD ENDPOINT
# ============================================================
# JWT PROTECTED
#
# Only authenticated users can upload datasets.
# The token is verified by get_current_user().
# ============================================================

@router.post("/")
async def upload_file(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user),
):
    filename = file.filename or ""

    try:

        if filename.lower().endswith(".csv"):

            df = pd.read_csv(
                file.file
            )

        elif filename.lower().endswith(".xlsx"):

            df = pd.read_excel(
                file.file
            )

        elif filename.lower().endswith(".xls"):

            df = pd.read_excel(
                file.file
            )

        else:

            return {
                "success": False,
                "message": (
                    "Unsupported file format. "
                    "Please upload CSV, XLS or XLSX."
                ),
            }

    except Exception as error:

        return {
            "success": False,
            "message": (
                f"Could not read file: {str(error)}"
            ),
        }

    # --------------------------------------------------------
    # Cleaning
    # --------------------------------------------------------

    df.columns = [
        str(column).strip()
        for column in df.columns
    ]

    df = df.dropna(
        how="all"
    ).reset_index(drop=True)

    if df.empty:

        return {
            "success": False,
            "message": (
                "The uploaded dataset contains "
                "no usable rows."
            ),
        }

    # Store current dataset.
    data_store.uploaded_data = df

    # --------------------------------------------------------
    # Detect types
    # --------------------------------------------------------

    date_columns = detect_date_columns(df)

    column_types = detect_column_types(
        df,
        date_columns,
    )

    numeric_columns = column_types["numeric"]
    categorical_columns = column_types["categorical"]
    text_columns = column_types["text"]

    # --------------------------------------------------------
    # Analytics
    # --------------------------------------------------------

    numeric_analysis = generate_numeric_analysis(
        df,
        numeric_columns,
    )

    category_analysis = generate_category_analysis(
        df,
        categorical_columns,
    )

    text_analysis = generate_text_analysis(
        df,
        text_columns,
    )

    grouped_analysis = generate_grouped_analysis(
        df,
        categorical_columns,
        numeric_columns,
    )

    date_analysis = generate_date_analysis(
        df,
        date_columns,
        numeric_columns,
    )

    kpis = generate_kpis(
        df,
        numeric_columns,
        categorical_columns,
        date_columns,
    )

    financial_column, profit_column = find_business_metrics(
        df,
        numeric_columns,
    )

    financial_total = None
    profit_total = None

    if financial_column:

        financial_total = round(
            float(
                pd.to_numeric(
                    df[financial_column],
                    errors="coerce",
                ).sum()
            ),
            2,
        )

    if profit_column:

        profit_total = round(
            float(
                pd.to_numeric(
                    df[profit_column],
                    errors="coerce",
                ).sum()
            ),
            2,
        )

    # --------------------------------------------------------
    # Customer / group detection
    # --------------------------------------------------------

    customer_column = next(
        (
            c
            for c in (
                categorical_columns +
                text_columns
            )
            if re.search(
                r"customer|client|buyer|user",
                c,
                re.I,
            )
        ),
        None,
    )

    customer_count = None

    if customer_column:

        customer_count = int(
            df[customer_column].nunique(
                dropna=True
            )
        )

    # --------------------------------------------------------
    # AI insights
    # --------------------------------------------------------

    insights = generate_insights(
        df,
        numeric_columns,
        categorical_columns,
        date_columns,
        numeric_analysis,
        category_analysis,
    )

    # --------------------------------------------------------
    # Preview
    # --------------------------------------------------------

    preview = []

    for record in df.head(20).to_dict(
        orient="records"
    ):

        preview.append({
            str(key): clean_value(value)
            for key, value in record.items()
        })

    # --------------------------------------------------------
    # Column information
    # --------------------------------------------------------

    column_information = build_column_information(
        df,
        column_types,
    )

    # --------------------------------------------------------
    # Data quality
    # --------------------------------------------------------

    total_cells = (
        len(df) *
        len(df.columns)
    )

    missing_cells = sum(
        int(df[column].isna().sum())
        for column in df.columns
    )

    completeness = (
        100.0
        if total_cells == 0
        else max(
            0.0,
            100.0 -
            (
                missing_cells /
                total_cells
            ) * 100.0,
        )
    )

    # --------------------------------------------------------
    # Summary
    # --------------------------------------------------------

    summary = {
        "primaryMetric": financial_column,
        "primaryMetricTotal": financial_total,
        "profitMetric": profit_column,
        "revenue": financial_total,
        "profit": profit_total,
        "orders": len(df),
        "totalRecords": len(df),
        "customers": customer_count,
        "customerColumn": customer_column,
        "averageOrder": (
            round(
                financial_total /
                len(df),
                2,
            )
            if (
                financial_total is not None
                and len(df) > 0
            )
            else None
        ),
        "numericFields": len(
            numeric_columns
        ),
        "categoryFields": len(
            categorical_columns
        ),
        "dateFields": len(
            date_columns
        ),
        "textFields": len(
            text_columns
        ),
        "missingCells": missing_cells,
        "dataCompleteness": round(
            completeness,
            2,
        ),
    }

    # --------------------------------------------------------
    # Response
    # --------------------------------------------------------

    return {
        "success": True,
        "filename": filename,
        "rows": len(df),
        "columns": list(df.columns),

        "summary": summary,

        "columnInformation": column_information,

        "detectedColumns": column_types,

        "preview": preview,

        "kpis": kpis,

        "numericAnalysis": numeric_analysis,

        "categoryAnalysis": category_analysis,

        "textAnalysis": text_analysis,

        "groupedAnalysis": grouped_analysis,

        "dateAnalysis": date_analysis,

        "aiInsights": insights,

        # Compatibility keys used by existing
        # frontend components.
        "monthlyRevenue": (
            date_analysis[0]["data"]
            if date_analysis
            else []
        ),

        "categoryRevenue": category_analysis,

        "topProducts": (
            grouped_analysis[0]["data"]
            if grouped_analysis
            else []
        ),

        "topCustomers": [],

        "regionalSales": [],

        "forecast": [],
    }