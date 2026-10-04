

# from fastapi import APIRouter
# import pandas as pd
# import app.data_store as data_store


# router = APIRouter(
#     prefix="/analytics",
#     tags=["Analytics"]
# )


# # =========================================================
# # HELPER FUNCTIONS
# # =========================================================

# def get_dataframe():
#     """
#     Get the currently uploaded dataframe.
#     """
#     return data_store.uploaded_data


# def find_column(df, possible_names):
#     """
#     Find a column using multiple possible names.
#     Matching is case-insensitive and ignores spaces,
#     underscores and hyphens.
#     """

#     normalized_columns = {}

#     for column in df.columns:
#         key = (
#             str(column)
#             .strip()
#             .lower()
#             .replace(" ", "")
#             .replace("_", "")
#             .replace("-", "")
#         )

#         normalized_columns[key] = column

#     for name in possible_names:

#         key = (
#             name
#             .strip()
#             .lower()
#             .replace(" ", "")
#             .replace("_", "")
#             .replace("-", "")
#         )

#         if key in normalized_columns:
#             return normalized_columns[key]

#     return None


# def find_numeric_columns(df):
#     """
#     Return all numeric columns.
#     """

#     numeric_columns = []

#     for column in df.columns:

#         converted = pd.to_numeric(
#             df[column],
#             errors="coerce"
#         )

#         if converted.notna().sum() > 0:
#             numeric_columns.append(column)

#     return numeric_columns


# def find_date_column(df):
#     """
#     Try to find a date/time column automatically.
#     """

#     possible_names = [
#         "date",
#         "orderdate",
#         "salesdate",
#         "transactiondate",
#         "datetime",
#         "timestamp",
#         "year"
#     ]

#     return find_column(df, possible_names)


# def find_revenue_column(df):
#     """
#     Automatically find the most likely revenue/sales column.
#     """

#     possible_names = [
#         "revenue",
#         "sales",
#         "total_sales",
#         "totalsales",
#         "salesamount",
#         "sales_amount",
#         "amount",
#         "totalamount",
#         "total_amount",
#         "turnover",
#         "income",
#         "value",
#         "price_in_thousands",
#         "sales_in_thousands"
#     ]

#     column = find_column(
#         df,
#         possible_names
#     )

#     if column:
#         return column

#     # If no standard revenue name exists,
#     # use the first numeric column.
#     numeric_columns = find_numeric_columns(df)

#     if numeric_columns:
#         return numeric_columns[0]

#     return None


# def find_profit_column(df):
#     """
#     Automatically find a profit column.
#     """

#     possible_names = [
#         "profit",
#         "profits",
#         "netprofit",
#         "net_profit",
#         "grossprofit",
#         "gross_profit",
#         "margin",
#         "income"
#     ]

#     return find_column(
#         df,
#         possible_names
#     )


# def find_category_column(df):
#     """
#     Find a useful categorical column.
#     """

#     possible_names = [
#         "category",
#         "type",
#         "productcategory",
#         "product_category",
#         "segment",
#         "vehicle_type",
#         "vehicletype",
#         "department",
#         "class"
#     ]

#     return find_column(
#         df,
#         possible_names
#     )


# def find_product_column(df):
#     """
#     Find a product/item column.
#     """

#     possible_names = [
#         "product",
#         "productname",
#         "product_name",
#         "item",
#         "itemname",
#         "item_name",
#         "model",
#         "vehicle",
#         "vehicle_name"
#     ]

#     return find_column(
#         df,
#         possible_names
#     )


# def find_customer_column(df):
#     """
#     Find customer column.
#     """

#     possible_names = [
#         "customer",
#         "customername",
#         "customer_name",
#         "customerid",
#         "customer_id",
#         "client",
#         "clientname",
#         "client_name"
#     ]

#     return find_column(
#         df,
#         possible_names
#     )


# def find_region_column(df):
#     """
#     Find regional/location column.
#     """

#     possible_names = [
#         "region",
#         "state",
#         "city",
#         "country",
#         "location",
#         "area",
#         "territory",
#         "zone"
#     ]

#     return find_column(
#         df,
#         possible_names
#     )


# # =========================================================
# # HOME
# # =========================================================

# @router.get("/")
# def analytics_home():

#     df = get_dataframe()

#     if df is None:
#         return {
#             "success": False,
#             "message": "Please upload data first."
#         }

#     return {
#         "success": True,
#         "message": "Analytics API Working Successfully",
#         "rows": len(df),
#         "columns": list(df.columns)
#     }


# # =========================================================
# # DATASET SUMMARY
# # =========================================================

# @router.get("/summary")
# def analytics_summary():

#     df = get_dataframe()

#     if df is None:
#         return {
#             "success": False,
#             "message": "Please upload data first."
#         }

#     revenue_column = find_revenue_column(df)
#     profit_column = find_profit_column(df)
#     category_column = find_category_column(df)
#     product_column = find_product_column(df)
#     customer_column = find_customer_column(df)
#     region_column = find_region_column(df)

#     total_revenue = 0
#     total_profit = 0

#     if revenue_column:

#         revenue_values = pd.to_numeric(
#             df[revenue_column],
#             errors="coerce"
#         )

#         total_revenue = float(
#             revenue_values.fillna(0).sum()
#         )

#     if profit_column:

#         profit_values = pd.to_numeric(
#             df[profit_column],
#             errors="coerce"
#         )

#         total_profit = float(
#             profit_values.fillna(0).sum()
#         )

#     # -----------------------------------------
#     # Category
#     # -----------------------------------------

#     category_data = []

#     if category_column and revenue_column:

#         temp = df.copy()

#         temp["_value"] = pd.to_numeric(
#             temp[revenue_column],
#             errors="coerce"
#         ).fillna(0)

#         category_data = (
#             temp.groupby(category_column)["_value"]
#             .sum()
#             .reset_index()
#             .sort_values("_value", ascending=False)
#             .rename(
#                 columns={
#                     category_column: "name",
#                     "_value": "value"
#                 }
#             )
#             .head(10)
#             .to_dict(orient="records")
#         )

#     # -----------------------------------------
#     # Products
#     # -----------------------------------------

#     product_data = []

#     if product_column and revenue_column:

#         temp = df.copy()

#         temp["_value"] = pd.to_numeric(
#             temp[revenue_column],
#             errors="coerce"
#         ).fillna(0)

#         product_data = (
#             temp.groupby(product_column)["_value"]
#             .sum()
#             .reset_index()
#             .sort_values("_value", ascending=False)
#             .rename(
#                 columns={
#                     product_column: "name",
#                     "_value": "revenue"
#                 }
#             )
#             .head(10)
#             .to_dict(orient="records")
#         )

#     # -----------------------------------------
#     # Customers
#     # -----------------------------------------

#     customer_data = []

#     if customer_column and revenue_column:

#         temp = df.copy()

#         temp["_value"] = pd.to_numeric(
#             temp[revenue_column],
#             errors="coerce"
#         ).fillna(0)

#         customer_data = (
#             temp.groupby(customer_column)["_value"]
#             .sum()
#             .reset_index()
#             .sort_values("_value", ascending=False)
#             .rename(
#                 columns={
#                     customer_column: "name",
#                     "_value": "revenue"
#                 }
#             )
#             .head(10)
#             .to_dict(orient="records")
#         )

#     # -----------------------------------------
#     # Region
#     # -----------------------------------------

#     region_data = []

#     if region_column and revenue_column:

#         temp = df.copy()

#         temp["_value"] = pd.to_numeric(
#             temp[revenue_column],
#             errors="coerce"
#         ).fillna(0)

#         region_data = (
#             temp.groupby(region_column)["_value"]
#             .sum()
#             .reset_index()
#             .sort_values("_value", ascending=False)
#             .rename(
#                 columns={
#                     region_column: "region",
#                     "_value": "revenue"
#                 }
#             )
#             .head(10)
#             .to_dict(orient="records")
#         )

#     return {
#         "success": True,

#         "dataset": {
#             "rows": len(df),
#             "columns": list(df.columns)
#         },

#         "detectedColumns": {
#             "revenue": revenue_column,
#             "profit": profit_column,
#             "category": category_column,
#             "product": product_column,
#             "customer": customer_column,
#             "region": region_column
#         },

#         "kpis": {
#             "revenue": total_revenue,
#             "profit": total_profit,
#             "orders": len(df),
#             "customers": (
#                 int(df[customer_column].nunique())
#                 if customer_column
#                 else 0
#             )
#         },

#         "categoryRevenue": category_data,
#         "topProducts": product_data,
#         "topCustomers": customer_data,
#         "regionalSales": region_data
#     }


# # =========================================================
# # MONTHLY REVENUE
# # =========================================================

# @router.get("/monthly-revenue")
# def monthly_revenue():

#     df = get_dataframe()

#     if df is None:
#         return {
#             "success": False,
#             "message": "Please upload data first.",
#             "data": []
#         }

#     revenue_column = find_revenue_column(df)

#     if revenue_column is None:
#         return {
#             "success": True,
#             "message": "No sales/revenue column detected.",
#             "data": []
#         }

#     date_column = find_date_column(df)

#     # -----------------------------------------------------
#     # CASE 1: Date column exists
#     # -----------------------------------------------------

#     if date_column:

#         dates = pd.to_datetime(
#             df[date_column],
#             errors="coerce"
#         )

#         values = pd.to_numeric(
#             df[revenue_column],
#             errors="coerce"
#         )

#         temp = pd.DataFrame({
#             "date": dates,
#             "revenue": values
#         })

#         temp = temp.dropna(
#             subset=["date"]
#         )

#         if len(temp) > 0:

#             result = (
#                 temp.groupby(
#                     temp["date"].dt.to_period("M")
#                 )["revenue"]
#                 .sum()
#                 .reset_index()
#             )

#             result["month"] = (
#                 result["date"]
#                 .astype(str)
#             )

#             result = result[
#                 ["month", "revenue"]
#             ]

#             return {
#                 "success": True,
#                 "data": result.to_dict(
#                     orient="records"
#                 )
#             }

#     # -----------------------------------------------------
#     # CASE 2: Month column exists
#     # -----------------------------------------------------

#     month_column = find_column(
#         df,
#         [
#             "month",
#             "monthname"
#         ]
#     )

#     if month_column:

#         temp = df.copy()

#         temp["_revenue"] = pd.to_numeric(
#             temp[revenue_column],
#             errors="coerce"
#         ).fillna(0)

#         result = (
#             temp.groupby(month_column)["_revenue"]
#             .sum()
#             .reset_index()
#             .rename(
#                 columns={
#                     month_column: "month",
#                     "_revenue": "revenue"
#                 }
#             )
#         )

#         return {
#             "success": True,
#             "data": result.to_dict(
#                 orient="records"
#             )
#         }

#     # -----------------------------------------------------
#     # CASE 3: No time data
#     # -----------------------------------------------------

#     return {
#         "success": True,
#         "message": (
#             "No date or month column detected. "
#             "Monthly revenue cannot be calculated "
#             "for this dataset."
#         ),
#         "data": []
#     }


# # =========================================================
# # PROFIT ANALYSIS
# # =========================================================

# @router.get("/profit")
# def profit_analysis():

#     df = get_dataframe()

#     if df is None:
#         return {
#             "success": False,
#             "message": "Please upload data first."
#         }

#     revenue_column = find_revenue_column(df)
#     profit_column = find_profit_column(df)

#     if not revenue_column or not profit_column:

#         return {
#             "success": True,
#             "available": False,
#             "message": (
#                 "Revenue or profit information "
#                 "is not available in this dataset."
#             )
#         }

#     revenue = pd.to_numeric(
#         df[revenue_column],
#         errors="coerce"
#     ).fillna(0).sum()

#     profit = pd.to_numeric(
#         df[profit_column],
#         errors="coerce"
#     ).fillna(0).sum()

#     margin = (
#         (profit / revenue) * 100
#         if revenue != 0
#         else 0
#     )

#     return {
#         "success": True,
#         "available": True,
#         "revenue": float(revenue),
#         "profit": float(profit),
#         "profitMargin": round(
#             float(margin),
#             2
#         )
#     }


# # =========================================================
# # DETECTED COLUMNS
# # =========================================================

# @router.get("/columns")
# def detected_columns():

#     df = get_dataframe()

#     if df is None:
#         return {
#             "success": False,
#             "message": "Please upload data first."
#         }

#     return {
#         "success": True,
#         "columns": list(df.columns),
#         "numericColumns": find_numeric_columns(df),

#         "detected": {
#             "revenue": find_revenue_column(df),
#             "profit": find_profit_column(df),
#             "category": find_category_column(df),
#             "product": find_product_column(df),
#             "customer": find_customer_column(df),
#             "region": find_region_column(df),
#             "date": find_date_column(df)
#         }
#     }



from fastapi import APIRouter, Depends
import pandas as pd
import app.data_store as data_store

from app.routes.auth import get_current_user


router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"],
    dependencies=[Depends(get_current_user)]
)


# =========================================================
# HELPER FUNCTIONS
# =========================================================

def get_dataframe():
    """
    Get the currently uploaded dataframe.
    """
    return data_store.uploaded_data


def find_column(df, possible_names):
    """
    Find a column using multiple possible names.
    Matching is case-insensitive and ignores spaces,
    underscores and hyphens.
    """

    normalized_columns = {}

    for column in df.columns:
        key = (
            str(column)
            .strip()
            .lower()
            .replace(" ", "")
            .replace("_", "")
            .replace("-", "")
        )

        normalized_columns[key] = column

    for name in possible_names:

        key = (
            name
            .strip()
            .lower()
            .replace(" ", "")
            .replace("_", "")
            .replace("-", "")
        )

        if key in normalized_columns:
            return normalized_columns[key]

    return None


def find_numeric_columns(df):
    """
    Return all numeric columns.
    """

    numeric_columns = []

    for column in df.columns:

        converted = pd.to_numeric(
            df[column],
            errors="coerce"
        )

        if converted.notna().sum() > 0:
            numeric_columns.append(column)

    return numeric_columns


def find_date_column(df):
    """
    Try to find a date/time column automatically.
    """

    possible_names = [
        "date",
        "orderdate",
        "salesdate",
        "transactiondate",
        "datetime",
        "timestamp",
        "year"
    ]

    return find_column(df, possible_names)


def find_revenue_column(df):
    """
    Automatically find the most likely revenue/sales column.
    """

    possible_names = [
        "revenue",
        "sales",
        "total_sales",
        "totalsales",
        "salesamount",
        "sales_amount",
        "amount",
        "totalamount",
        "total_amount",
        "turnover",
        "income",
        "value",
        "price_in_thousands",
        "sales_in_thousands"
    ]

    column = find_column(
        df,
        possible_names
    )

    if column:
        return column

    numeric_columns = find_numeric_columns(df)

    if numeric_columns:
        return numeric_columns[0]

    return None


def find_profit_column(df):
    """
    Automatically find a profit column.
    """

    possible_names = [
        "profit",
        "profits",
        "netprofit",
        "net_profit",
        "grossprofit",
        "gross_profit",
        "margin",
        "income"
    ]

    return find_column(
        df,
        possible_names
    )


def find_category_column(df):
    """
    Find a useful categorical column.
    """

    possible_names = [
        "category",
        "type",
        "productcategory",
        "product_category",
        "segment",
        "vehicle_type",
        "vehicletype",
        "department",
        "class"
    ]

    return find_column(
        df,
        possible_names
    )


def find_product_column(df):
    """
    Find a product/item column.
    """

    possible_names = [
        "product",
        "productname",
        "product_name",
        "item",
        "itemname",
        "item_name",
        "model",
        "vehicle",
        "vehicle_name"
    ]

    return find_column(
        df,
        possible_names
    )


def find_customer_column(df):
    """
    Find customer column.
    """

    possible_names = [
        "customer",
        "customername",
        "customer_name",
        "customerid",
        "customer_id",
        "client",
        "clientname",
        "client_name"
    ]

    return find_column(
        df,
        possible_names
    )


def find_region_column(df):
    """
    Find regional/location column.
    """

    possible_names = [
        "region",
        "state",
        "city",
        "country",
        "location",
        "area",
        "territory",
        "zone"
    ]

    return find_column(
        df,
        possible_names
    )


# =========================================================
# HOME
# =========================================================

@router.get("/")
def analytics_home():

    df = get_dataframe()

    if df is None:
        return {
            "success": False,
            "message": "Please upload data first."
        }

    return {
        "success": True,
        "message": "Analytics API Working Successfully",
        "rows": len(df),
        "columns": list(df.columns)
    }


# =========================================================
# DATASET SUMMARY
# =========================================================

@router.get("/summary")
def analytics_summary():

    df = get_dataframe()

    if df is None:
        return {
            "success": False,
            "message": "Please upload data first."
        }

    revenue_column = find_revenue_column(df)
    profit_column = find_profit_column(df)
    category_column = find_category_column(df)
    product_column = find_product_column(df)
    customer_column = find_customer_column(df)
    region_column = find_region_column(df)

    total_revenue = 0
    total_profit = 0

    if revenue_column:

        revenue_values = pd.to_numeric(
            df[revenue_column],
            errors="coerce"
        )

        total_revenue = float(
            revenue_values.fillna(0).sum()
        )

    if profit_column:

        profit_values = pd.to_numeric(
            df[profit_column],
            errors="coerce"
        )

        total_profit = float(
            profit_values.fillna(0).sum()
        )

    # -----------------------------------------
    # Category
    # -----------------------------------------

    category_data = []

    if category_column and revenue_column:

        temp = df.copy()

        temp["_value"] = pd.to_numeric(
            temp[revenue_column],
            errors="coerce"
        ).fillna(0)

        category_data = (
            temp.groupby(category_column)["_value"]
            .sum()
            .reset_index()
            .sort_values("_value", ascending=False)
            .rename(
                columns={
                    category_column: "name",
                    "_value": "value"
                }
            )
            .head(10)
            .to_dict(orient="records")
        )

    # -----------------------------------------
    # Products
    # -----------------------------------------

    product_data = []

    if product_column and revenue_column:

        temp = df.copy()

        temp["_value"] = pd.to_numeric(
            temp[revenue_column],
            errors="coerce"
        ).fillna(0)

        product_data = (
            temp.groupby(product_column)["_value"]
            .sum()
            .reset_index()
            .sort_values("_value", ascending=False)
            .rename(
                columns={
                    product_column: "name",
                    "_value": "revenue"
                }
            )
            .head(10)
            .to_dict(orient="records")
        )

    # -----------------------------------------
    # Customers
    # -----------------------------------------

    customer_data = []

    if customer_column and revenue_column:

        temp = df.copy()

        temp["_value"] = pd.to_numeric(
            temp[revenue_column],
            errors="coerce"
        ).fillna(0)

        customer_data = (
            temp.groupby(customer_column)["_value"]
            .sum()
            .reset_index()
            .sort_values("_value", ascending=False)
            .rename(
                columns={
                    customer_column: "name",
                    "_value": "revenue"
                }
            )
            .head(10)
            .to_dict(orient="records")
        )

    # -----------------------------------------
    # Region
    # -----------------------------------------

    region_data = []

    if region_column and revenue_column:

        temp = df.copy()

        temp["_value"] = pd.to_numeric(
            temp[revenue_column],
            errors="coerce"
        ).fillna(0)

        region_data = (
            temp.groupby(region_column)["_value"]
            .sum()
            .reset_index()
            .sort_values("_value", ascending=False)
            .rename(
                columns={
                    region_column: "region",
                    "_value": "revenue"
                }
            )
            .head(10)
            .to_dict(orient="records")
        )

    return {
        "success": True,

        "dataset": {
            "rows": len(df),
            "columns": list(df.columns)
        },

        "detectedColumns": {
            "revenue": revenue_column,
            "profit": profit_column,
            "category": category_column,
            "product": product_column,
            "customer": customer_column,
            "region": region_column
        },

        "kpis": {
            "revenue": total_revenue,
            "profit": total_profit,
            "orders": len(df),
            "customers": (
                int(df[customer_column].nunique())
                if customer_column
                else 0
            )
        },

        "categoryRevenue": category_data,
        "topProducts": product_data,
        "topCustomers": customer_data,
        "regionalSales": region_data
    }


# =========================================================
# MONTHLY REVENUE
# =========================================================

@router.get("/monthly-revenue")
def monthly_revenue():

    df = get_dataframe()

    if df is None:
        return {
            "success": False,
            "message": "Please upload data first.",
            "data": []
        }

    revenue_column = find_revenue_column(df)

    if revenue_column is None:
        return {
            "success": True,
            "message": "No sales/revenue column detected.",
            "data": []
        }

    date_column = find_date_column(df)

    # -----------------------------------------------------
    # CASE 1: Date column exists
    # -----------------------------------------------------

    if date_column:

        dates = pd.to_datetime(
            df[date_column],
            errors="coerce"
        )

        values = pd.to_numeric(
            df[revenue_column],
            errors="coerce"
        )

        temp = pd.DataFrame({
            "date": dates,
            "revenue": values
        })

        temp = temp.dropna(
            subset=["date"]
        )

        if len(temp) > 0:

            result = (
                temp.groupby(
                    temp["date"].dt.to_period("M")
                )["revenue"]
                .sum()
                .reset_index()
            )

            result["month"] = (
                result["date"]
                .astype(str)
            )

            result = result[
                ["month", "revenue"]
            ]

            return {
                "success": True,
                "data": result.to_dict(
                    orient="records"
                )
            }

    # -----------------------------------------------------
    # CASE 2: Month column exists
    # -----------------------------------------------------

    month_column = find_column(
        df,
        [
            "month",
            "monthname"
        ]
    )

    if month_column:

        temp = df.copy()

        temp["_revenue"] = pd.to_numeric(
            temp[revenue_column],
            errors="coerce"
        ).fillna(0)

        result = (
            temp.groupby(month_column)["_revenue"]
            .sum()
            .reset_index()
            .rename(
                columns={
                    month_column: "month",
                    "_revenue": "revenue"
                }
            )
        )

        return {
            "success": True,
            "data": result.to_dict(
                orient="records"
            )
        }

    # -----------------------------------------------------
    # CASE 3: No time data
    # -----------------------------------------------------

    return {
        "success": True,
        "message": (
            "No date or month column detected. "
            "Monthly revenue cannot be calculated "
            "for this dataset."
        ),
        "data": []
    }


# =========================================================
# PROFIT ANALYSIS
# =========================================================

@router.get("/profit")
def profit_analysis():

    df = get_dataframe()

    if df is None:
        return {
            "success": False,
            "message": "Please upload data first."
        }

    revenue_column = find_revenue_column(df)
    profit_column = find_profit_column(df)

    if not revenue_column or not profit_column:

        return {
            "success": True,
            "available": False,
            "message": (
                "Revenue or profit information "
                "is not available in this dataset."
            )
        }

    revenue = pd.to_numeric(
        df[revenue_column],
        errors="coerce"
    ).fillna(0).sum()

    profit = pd.to_numeric(
        df[profit_column],
        errors="coerce"
    ).fillna(0).sum()

    margin = (
        (profit / revenue) * 100
        if revenue != 0
        else 0
    )

    return {
        "success": True,
        "available": True,
        "revenue": float(revenue),
        "profit": float(profit),
        "profitMargin": round(
            float(margin),
            2
        )
    }


# =========================================================
# DETECTED COLUMNS
# =========================================================

@router.get("/columns")
def detected_columns():

    df = get_dataframe()

    if df is None:
        return {
            "success": False,
            "message": "Please upload data first."
        }

    return {
        "success": True,
        "columns": list(df.columns),
        "numericColumns": find_numeric_columns(df),

        "detected": {
            "revenue": find_revenue_column(df),
            "profit": find_profit_column(df),
            "category": find_category_column(df),
            "product": find_product_column(df),
            "customer": find_customer_column(df),
            "region": find_region_column(df),
            "date": find_date_column(df)
        }
    }