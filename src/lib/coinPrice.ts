type PriceOutputInternal = {
  [type: string]: PriceOutput;
};

type PriceOutput = {
  price: number;
};

const API_URL = "https://aftermath.finance/api/price-info/[%22coin_type%22]";

export async function getPrice(type: string): Promise<number> {
  try {
    if (type === "0x2::sui::SUI")
      type =
        "0x0000000000000000000000000000000000000000000000000000000000000002::sui::SUI";

    const response = await fetch(API_URL.replace("coin_type", type), {
      next: { revalidate: 1800 },
      headers: {
        Accept: "application/json",
      },
    });

    const result: PriceOutputInternal = await response.json();

    return result[type].price;
  } catch (error) {
    console.error("Failed to fetch price", error);
    return 0;
  }
}
