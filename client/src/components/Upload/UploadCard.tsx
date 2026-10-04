// import { UploadCloud } from "lucide-react";
// import { useRef } from "react";
// import api from "../../services/api";

// interface Props {
//   onUploadSuccess: (data: any) => void;

//   showNotification: (
//     message: string,
//     type: "success" | "error" | "info"
//   ) => void;
// }

// export default function UploadCard({
//     onUploadSuccess,
//     showNotification,
// }: Props) {
//   const inputRef = useRef<HTMLInputElement>(null);

//   const upload = async (file: File) => {
//     const formData = new FormData();

//     formData.append("file", file);

//     try {
//       const res = await api.post("/upload/", formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       onUploadSuccess(res.data);

//       showNotification(
//          "Dataset uploaded successfully.",
//          "success"
//       );
//     } catch (error) {
//       console.error(error);
//       showNotification(
//           "Upload failed. Please try again.",
//           "error"
//       );
//     }
//   };

//   return (
//     <div
//       className="bg-slate-900 border-2 border-dashed border-blue-500 rounded-2xl p-10 text-center cursor-pointer hover:border-blue-400 transition"
//       onClick={() => inputRef.current?.click()}
//     >
//       <UploadCloud
//         size={60}
//         className="mx-auto text-blue-400"
//       />

//       <h2 className="text-2xl font-semibold mt-4">
//         Upload Excel or CSV
//       </h2>

//       <p className="text-slate-400 mt-2">
//         Click here to upload your dataset
//       </p>

//       <input
//         ref={inputRef}
//         type="file"
//         hidden
//         accept=".csv,.xlsx"
//         onChange={(e) => {
//           if (!e.target.files?.length) return;

//           upload(e.target.files[0]);
//         }}
//       />
//     </div>
//   );
// }



import { UploadCloud } from "lucide-react";
import { useRef, useState } from "react";
import api from "../../services/api";

interface Props {
  onUploadSuccess: (data: any) => void;

  showNotification: (
    message: string,
    type: "success" | "error" | "info"
  ) => void;
}

export default function UploadCard({
  onUploadSuccess,
  showNotification,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [uploading, setUploading] = useState(false);

  const upload = async (file: File) => {
    // ========================================================
    // CHECK JWT TOKEN
    // ========================================================

    const token = localStorage.getItem(
      "dashboard_access_token"
    );

    if (!token) {
      showNotification(
        "Your session has expired. Please login again.",
        "error"
      );
      return;
    }

    // ========================================================
    // CHECK FILE TYPE
    // ========================================================

    const fileName = file.name.toLowerCase();

    if (
      !fileName.endsWith(".csv") &&
      !fileName.endsWith(".xlsx") &&
      !fileName.endsWith(".xls")
    ) {
      showNotification(
        "Please upload a CSV, XLS or XLSX file.",
        "error"
      );
      return;
    }

    const formData = new FormData();

    formData.append("file", file);

    try {
      setUploading(true);

      // ======================================================
      // UPLOAD WITH JWT
      // ======================================================

      const res = await api.post(
        "/upload/",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // ======================================================
      // CHECK BACKEND RESPONSE
      // ======================================================

      if (!res.data?.success) {
        showNotification(
          res.data?.message ||
            "Upload failed. Please try again.",
          "error"
        );
        return;
      }

      // ======================================================
      // SUCCESS
      // ======================================================

      onUploadSuccess(res.data);

      showNotification(
        "Dataset uploaded successfully.",
        "success"
      );

      // Allow selecting the same file again later.
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    } catch (error: any) {
      console.error(
        "Dataset upload error:",
        error
      );

      // ======================================================
      // AUTHORIZATION ERROR
      // ======================================================

      if (
        error?.response?.status === 401 ||
        error?.response?.status === 403
      ) {
        localStorage.removeItem(
          "dashboard_access_token"
        );

        localStorage.removeItem(
          "dashboard_authenticated"
        );

        localStorage.removeItem(
          "dashboard_user_name"
        );

        localStorage.removeItem(
          "dashboard_user_email"
        );

        localStorage.removeItem(
          "dashboard_user_id"
        );

        showNotification(
          "Your session has expired. Please login again.",
          "error"
        );

        return;
      }

      // ======================================================
      // SERVER ERROR
      // ======================================================

      if (error?.response?.data?.message) {
        showNotification(
          error.response.data.message,
          "error"
        );

        return;
      }

      if (error?.response?.data?.detail) {
        showNotification(
          error.response.data.detail,
          "error"
        );

        return;
      }

      // ======================================================
      // GENERAL ERROR
      // ======================================================

      showNotification(
        "Upload failed. Please try again.",
        "error"
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      className={`bg-slate-900 border-2 border-dashed border-blue-500 rounded-2xl p-10 text-center transition ${
        uploading
          ? "cursor-not-allowed opacity-70"
          : "cursor-pointer hover:border-blue-400"
      }`}
      onClick={() => {
        if (!uploading) {
          inputRef.current?.click();
        }
      }}
    >
      <UploadCloud
        size={60}
        className="mx-auto text-blue-400"
      />

      <h2 className="text-2xl font-semibold mt-4">
        {uploading
          ? "Uploading..."
          : "Upload Excel or CSV"}
      </h2>

      <p className="text-slate-400 mt-2">
        {uploading
          ? "Please wait while your dataset is being analyzed."
          : "Click here to upload your dataset"}
      </p>

      <input
        ref={inputRef}
        type="file"
        hidden
        disabled={uploading}
        accept=".csv,.xlsx,.xls"
        onChange={(e) => {
          if (!e.target.files?.length) {
            return;
          }

          upload(e.target.files[0]);
        }}
      />
    </div>
  );
}