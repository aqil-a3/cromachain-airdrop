"use client";

import { SiteSettings } from "@/@types/site-settings";
import { siteSettingsColumns } from "@/components/features/admin/site-settings/variables/siteSettingColumns";
import AdminContainer from "@/components/layouts/container/AdminContainer";
import AdminDataHeader, {
  AdminDataHeaderContext,
} from "@/components/molecules/Header/AdminDataHeader";
import { DataTable } from "@/components/ui/data-table";

interface Props {
  data: SiteSettings[];
}

const headerContext: AdminDataHeaderContext = {
  title: "Site Settings",
};

export default function AdminSiteSettingsTemplate({ data }: Props) {
  return (
    <AdminContainer>
      <AdminDataHeader context={headerContext} />

      <DataTable columns={siteSettingsColumns} data={data} />
    </AdminContainer>
  );
}
