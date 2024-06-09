import { OverviewContent } from "./content";
import { useBadges } from "./Overview.hooks";
import { OverviewBadges, OverviewHeader } from "./Overview.sections";

export const Overview = () => {
  const { active, handleBadgeClick } = useBadges();

  return (
    <div className="relative z-10 flex flex-col">
      <OverviewHeader />
      <OverviewBadges active={active} handleBadgeClick={handleBadgeClick} />
      <OverviewContent active={active} />
    </div>
  );
};
