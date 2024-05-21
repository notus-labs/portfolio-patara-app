import { At, CirclesFour, Pulse, StarFour, Swap } from "@phosphor-icons/react";

export const SIDEBAR_ITEMS = [
  {
    text: "Overview",
    icon: <CirclesFour />,
    href: "/",
  },
  {
    text: "Platforms",
    icon: <StarFour />,
    href: "/platforms",
  },
  {
    text: "Swap",
    icon: <Swap />,
    href: "/swap",
  },
  {
    text: "Address Book",
    icon: <At />,
    href: "/address-book",
  },
  {
    text: "History",
    icon: <Pulse />,
    href: "/history",
  },
];
