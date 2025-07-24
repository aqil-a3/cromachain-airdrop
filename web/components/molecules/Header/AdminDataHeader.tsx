import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export interface AdminDataHeaderContext {
  title: string;
  addLink?: string;
  addLabel?: string;
}

interface AdminDataHeaderProps {
  context: AdminDataHeaderContext;
}

export default function AdminDataHeader({ context }: AdminDataHeaderProps) {
  const { title, addLabel, addLink } = context;

  if (!addLabel) context.addLabel = "Tambah Data";

  return (
    <div className="flex justify-between items-center bg-white/50 p-4 rounded-md">
      <span className="font-bold text-xl">{title}</span>
      {addLink && (
        <Link href={addLink}>
          <Button className="bg-slate-300 text-slate-800 hover:bg-slate-200">
            <Plus /> {addLabel}
          </Button>
        </Link>
      )}
    </div>
  );
}
