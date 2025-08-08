import { unparse } from "papaparse";

export function convertToCSV(data: any[]) {
  return unparse(data);
}
