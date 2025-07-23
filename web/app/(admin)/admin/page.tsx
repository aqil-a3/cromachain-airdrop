import AdminTemplate from "@/components/templates/admin/AdminTemplate";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard",
};

export default function AdminPage() {
  return <AdminTemplate />;
}
