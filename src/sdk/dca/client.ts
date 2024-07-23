import { DeepBookClient } from "@mysten/deepbook";

import { SUI_CLIENT } from "../utils/client";

export const DEEP_BOOK_CLIENT = new DeepBookClient(SUI_CLIENT);
