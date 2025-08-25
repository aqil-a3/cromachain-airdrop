export interface DiscordTokenResponse {
  token_type: string;
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
}

export interface DiscordUser {
  id: string;
  username: string;
  avatar: string | null;
  discriminator: string;
  public_flags: number;
  flags: number;
  banner: string | null;
  accent_color: number | null;
  global_name: string | null;
  avatar_decoration_data: unknown | null;
  collectibles: unknown | null;
  display_name_styles: unknown | null;
  banner_color: string | null;
  clan: unknown | null;
  primary_guild: unknown | null;
  mfa_enabled: boolean;
  locale: string;
  premium_type: number;
}
