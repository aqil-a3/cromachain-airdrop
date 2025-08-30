import axios, { isAxiosError } from "axios";
import { useRef, useState, useEffect } from "react";
import { parse } from "papaparse";

export interface PreviewCsv {
  eth_address: string;
}

export function useImportDialog() {
  const [isProcessingDownload, setIsProcessingDownload] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewCsv, setPreviewCSV] = useState<PreviewCsv[]>([]);
  const [csvData, setCsvData] = useState<PreviewCsv[]>([]);
  const [totalData, setTotalData] = useState(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const downloadTemplateHandler = async () => {
    try {
      setIsProcessingDownload(true);
      const { data } = await axios.get("/api/user-tasks/csv/template", {
        responseType: "blob",
      });

      const blob = new Blob([data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "cromachain-airdrop-template.csv");
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setIsProcessingDownload(false);
    }
  };

  const csvReadHandler = () => {
    const target = fileInputRef.current;
    if (!target) return;
    const csv = target.files?.[0];
    if (!csv) return;

    parse<string[]>(csv, {
      complete: (result) => {
        if (!result.data) return;

        const data = result.data;
        if (data.length <= 1) return;

        const rows = data.slice(1).filter((row) => row[0]?.trim());

        const previewData = rows.slice(0, 10).map((row) => ({
          eth_address: row[0],
        }));

        const allData = rows.map((row) => ({
          eth_address: row[0],
        }));

        setTotalData(rows.length);
        setCsvData(allData);
        setPreviewCSV(previewData);
      },
    });
  };

  const submitHandler = async () => {
    if (csvData.length < 1) return;

    try {
      setIsSubmitting(true);
      await axios.post("/api/user-tasks/csv/submit", csvData);

      alert("Under Development");
    } catch (error) {
      console.error(error);
      if (isAxiosError(error)) {
        const data = error.response?.data;

        alert(data.message ?? "Something went wrong!");
      }
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (csvData.length > 0) {
      console.log("csvData updated:", csvData);
    }
  }, [csvData]);

  return {
    downloadTemplateHandler,
    fileInputRef,
    isSubmitting,
    isProcessingDownload,
    csvReadHandler,
    previewCsv,
    totalData,
    submitHandler,
  };
}
