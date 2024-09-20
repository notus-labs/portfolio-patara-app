import {
  DCAOObjectsSchema,
  DCAObject,
  DCAOrder,
  DCAOrderSchema,
} from "./types";

export async function fetchDCAObjects(owner: string): Promise<DCAObject[]> {
  const response = await fetch(
    `https://api.patara.app/dca/api/dcas?owner=${owner}`,
  );
  const data = await response.json();
  console.log(data);
  return DCAOObjectsSchema.parse(data);
}

export async function fetchDCAOrders(dca: string): Promise<DCAOrder[]> {
  const response = await fetch(
    `https://api.patara.app/dca/api/dcas/${dca}/orders`,
  );
  const data = await response.json();

  return DCAOrderSchema.parse(data);
}
