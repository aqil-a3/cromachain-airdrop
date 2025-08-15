export interface SiteSettings<TValue = unknown> {
  id: number;
  created_at: string;
  key: string;
  label: string;
  value: TValue;
}
