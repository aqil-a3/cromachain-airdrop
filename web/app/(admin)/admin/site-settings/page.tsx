import AdminSiteSettingsTemplate from "@/components/templates/admin/AdminSiteSettingsTemplate";
import { getAllSiteSettings } from "@/utils/supabase/sitesettingsTable";

export default async function AdminSiteSettingsPage(){
    const siteSettings = await getAllSiteSettings();

    return <AdminSiteSettingsTemplate data={siteSettings} />
}