export type OverviewHeaderBadgeProps = {
  text: string;
  percentage: string | number;
};

export type OverviewBadgeProps = {
  text: string;
  onClick?: () => void;
  active?: boolean;
};
