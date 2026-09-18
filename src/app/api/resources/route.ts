import { NextResponse } from "next/server";
import { fetchResources } from "@/lib/resources/server";
import type { IResource } from "@/types";

// Browser fallback for resources (Sanity rejects browser origins); also feeds the header dropdown.
// Statically generated and regenerated on the content ISR window; must be a literal — keep in sync
// with SANITY_REVALIDATE_SECONDS.
export const revalidate = 3600;

export const GET = async (): Promise<NextResponse<IResource[]>> =>
  NextResponse.json(await fetchResources());
