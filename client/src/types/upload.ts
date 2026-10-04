export interface UploadResponse {
  success: boolean;
  filename: string;
  rows: number;
  columns: string[];
  preview: Record<string, any>[];
}