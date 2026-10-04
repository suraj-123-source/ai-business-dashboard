// import jsPDF from "jspdf";
// import { toPng } from "html-to-image";
// import { FileDown } from "lucide-react";

// interface Props {
//   dashboardData: any;
// }

// export default function ExportPDF({ dashboardData }: Props) {
//   const generatePDF = async () => {
//     try {
//       if (!dashboardData) {
//         alert("Please upload a dataset first.");
//         return;
//       }

//       const report = document.getElementById("report-template");

//       if (!report) {
//         alert("Report template not found.");
//         return;
//       }

//       // Wait a moment to ensure rendering is complete
//       await new Promise((resolve) => setTimeout(resolve, 300));

//       const imgData = await toPng(report as HTMLElement, {
//         cacheBust: true,
//         pixelRatio: 2,
//       });

//       const pdf = new jsPDF("p", "mm", "a4");

//       const pageWidth = pdf.internal.pageSize.getWidth();
//       const pageHeight = pdf.internal.pageSize.getHeight();

//       const imgWidth = pageWidth;
//       const imgHeight =
//         ((report as HTMLElement).offsetHeight * imgWidth) /
//         (report as HTMLElement).offsetWidth;

//       let heightLeft = imgHeight;
//       let position = 0;

//       pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);

//       heightLeft -= pageHeight;

//       while (heightLeft > 0) {
//         position = heightLeft - imgHeight;
//         pdf.addPage();
//         pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
//         heightLeft -= pageHeight;
//       }

//       pdf.save("AI_Business_Analytics_Report.pdf");
//     } catch (err) {
//       console.error("PDF Error:", err);
//       alert("PDF generation failed. Check console.");
//     }
//   };

//   return (
//     <button
//       onClick={generatePDF}
//       disabled={!dashboardData}
//       className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-slate-700 px-4 py-2 rounded-xl transition"
//     >
//       <FileDown size={18} />
//       Export PDF
//     </button>
//   );
// }


import jsPDF from "jspdf";
import { toPng } from "html-to-image";
import { FileDown } from "lucide-react";

interface Props {
  dashboardData: any;
}

export default function ExportPDF({ dashboardData }: Props) {

  const generatePDF = async () => {
    try {

      if (!dashboardData) {
        alert("Please upload a dataset first.");
        return;
      }

      const report = document.getElementById("report-template");

      if (!report) {
        alert("Report template not found.");
        return;
      }

      // Wait for charts and content to render
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const imgData = await toPng(report, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#ffffff",
      });

      const pdf = new jsPDF("p", "mm", "a4");

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = pageWidth;

      const imgHeight =
        (report.scrollHeight * imgWidth) /
        report.scrollWidth;

      let heightLeft = imgHeight;

      let position = 0;

      // First page
      pdf.addImage(
        imgData,
        "PNG",
        0,
        position,
        imgWidth,
        imgHeight
      );

      heightLeft -= pageHeight;

      // Additional pages
      while (heightLeft > 0) {

        position -= pageHeight;

        pdf.addPage();

        pdf.addImage(
          imgData,
          "PNG",
          0,
          position,
          imgWidth,
          imgHeight
        );

        heightLeft -= pageHeight;
      }

      pdf.save("AI_Business_Analytics_Report.pdf");

    } catch (error) {

      console.error("PDF generation error:", error);

      alert(
        "PDF generation failed. Please check the browser console."
      );

    }
  };


  return (
    <button
      onClick={generatePDF}
      disabled={!dashboardData}
      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed px-5 py-3 rounded-xl font-semibold text-white transition"
    >

      <FileDown size={20} />

      Export PDF

    </button>
  );
}