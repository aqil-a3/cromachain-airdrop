import { SiteSettings } from "@/@types/site-settings";
import UserLeaderboardForm from "./UserLeaderForm";

export type ValueEditProps = {
  siteSettings: SiteSettings;
  setSiteSettings: React.Dispatch<React.SetStateAction<SiteSettings>>;
  isLoading: boolean;
};

const editors: Record<string, React.FC<ValueEditProps>> = {
  first_rank_leaderboard: UserLeaderboardForm,
  second_rank_leaderboard: UserLeaderboardForm,
};

export default function ValueEdit({ ...props }: ValueEditProps) {
  const Editor = editors[props.siteSettings.key];
  return Editor ? <Editor {...props} /> : null;
}
