import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DownloadIcon, Sheet, Upload } from "lucide-react";
import { useImportDialog } from "../logics";
import { DataTable } from "@/components/ui/data-table";
import { previewCsvColumnsDef } from "../variables/columnDef";

export default function ImportDialog() {
  const {
    downloadTemplateHandler,
    fileInputRef,
    isProcessingDownload,
    csvReadHandler,
    previewCsv,
    totalData,
    submitHandler
  } = useImportDialog();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-green-500 hover:bg-green-600">
          <Sheet /> <span>Import CSV</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-4/5 max-w-screen-lg">
        <DialogHeader>
          <DialogTitle>Import CSV</DialogTitle>
          <DialogDescription>
            This feature can't be used in every tasks.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2">
          <div className="space-y-4 flex flex-col">
            {/* Download Button */}
            <Button
              className="bg-green-500 hover:bg-green-600"
              onClick={downloadTemplateHandler}
              disabled={isProcessingDownload}
            >
              <DownloadIcon />{" "}
              <span>
                {isProcessingDownload ? "Processing..." : "Download Template"}
              </span>
            </Button>

            {/* Upload Button */}
            <Label
              htmlFor="upload-csv"
              className="bg-green-500 hover:bg-green-600 flex items-center gap-2 p-2 cursor-pointer rounded-md text-white justify-center"
            >
              <Upload /> <span>Import CSV</span>
            </Label>
            <Input
              ref={fileInputRef}
              id="upload-csv"
              className="hidden"
              type="file"
              accept=".csv,text/csv"
              onChange={csvReadHandler}
            />
          </div>
          <div className="p-4">
            <p>Total Data : {totalData} data</p>
            <p>This preview only displays 10 rows data</p>
            <DataTable columns={previewCsvColumnsDef} data={previewCsv} />
          </div>
        </div>
        <DialogFooter>
          <Button
            className="bg-green-500 hover:bg-green-600"
            disabled={!totalData}
            onClick={submitHandler}
          >
            <Upload /> <span>Submit</span>
          </Button>
          <DialogClose asChild>
            <Button>Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
