export type OverviewHeaderBadgeProps = {
  text: string;
  percentage: string | number;
};

export type OverviewBadgeProps = {
  text: string;
  onClick?: () => void;
  active?: boolean;
};

export type Badges = "Portfolio" | "NFTs";
export const BADGES: Badges[] = ["Portfolio", "NFTs"];
