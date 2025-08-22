import { SiteSettings } from "@/@types/site-settings";
import UserLeaderboardForm from "./UserLeaderForm";
import NumberForm from "./NumberForm";

export type ValueEditProps = {
  siteSettings: SiteSettings;
  setSiteSettings: React.Dispatch<React.SetStateAction<SiteSettings>>;
  isLoading: boolean;
};

const editors: Record<string, React.FC<ValueEditProps>> = {
  first_rank_leaderboard: UserLeaderboardForm,
  second_rank_leaderboard: UserLeaderboardForm,
  third_rank_leaderboard: UserLeaderboardForm,
  user_referrals_limit_per_day: NumberForm
};

export default function ValueEdit({ ...props }: ValueEditProps) {
  const Editor = editors[props.siteSettings.key];
  return Editor ? <Editor {...props} /> : null;
}
