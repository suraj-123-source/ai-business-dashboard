import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

export default api;

export const downloadReport = async () => {
    const response = await fetch("http://127.0.0.1:8000/report");

    const blob = await response.blob();

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;

    a.download = "Business_Report.pdf";

    a.click();
};
