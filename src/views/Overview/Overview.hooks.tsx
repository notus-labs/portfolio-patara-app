import { useState } from "react";

import { Badges } from "./Overview.types";

export const useBadges = () => {
  const [active, setActive] = useState<Badges>("Portfolio");

  const handleBadgeClick = (text: Badges) => {
    setActive(text);
  };

  return {
    active,
    handleBadgeClick,
  };
};
