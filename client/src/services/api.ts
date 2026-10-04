// import axios from "axios";

// const api = axios.create({
//   baseURL: "http://127.0.0.1:8000",
// });

// export default api;

// export const downloadReport = async () => {
//     const response = await fetch("http://127.0.0.1:8000/report");

//     const blob = await response.blob();

//     const url = window.URL.createObjectURL(blob);

//     const a = document.createElement("a");

//     a.href = url;

//     a.download = "Business_Report.pdf";

//     a.click();
// };


import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const api = axios.create({
  baseURL: API_URL,
});

export default api;

export const downloadReport = async () => {
  const token = localStorage.getItem("dashboard_access_token");

  const response = await fetch(`${API_URL}/report/report`, {
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {},
  });

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      localStorage.removeItem("dashboard_access_token");
      localStorage.removeItem("dashboard_authenticated");
    }

    throw new Error("Unable to download report.");
  }

  const blob = await response.blob();

  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");

  a.href = url;
  a.download = "Business_Report.pdf";

  document.body.appendChild(a);
  a.click();

  a.remove();

  window.URL.revokeObjectURL(url);
};