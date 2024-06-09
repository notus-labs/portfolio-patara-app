import {
  At,
  CirclesFour,
  Hourglass,
  PaperPlane,
  Pulse,
  StarFour,
  Swap,
} from "@phosphor-icons/react";

export const SIDEBAR_ITEMS = [
  {
    text: "Overview",
    icon: <CirclesFour />,
    href: "/",
    activated: true,
  },
  {
    text: "Swap",
    icon: <Swap />,
    href: "/swap",
    activated: false,
  },
  {
    text: "DCA",
    icon: <Hourglass />,
    href: "/dca",
    activated: false,
  },
  {
    text: "Send",
    icon: <PaperPlane />,
    href: "/send",
    activated: false,
  },
  {
    text: "Platforms",
    icon: <StarFour />,
    href: "/platforms",
    activated: false,
  },
  {
    text: "Address Book",
    icon: <At />,
    href: "/address-book",
    activated: false,
  },
  {
    text: "History",
    icon: <Pulse />,
    href: "/history",
    activated: false,
  },
];
