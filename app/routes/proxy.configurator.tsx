import type { LoaderFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";
import db from "../db.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.public.appProxy(request);
  if (!session) return Response.json({ enabled: false }, { status: 404 });
  const config = await db.shopConfiguration.findUnique({ where: { shop: session.shop }, select: { enabled: true, heading: true, intro: true, primaryColor: true, recommendations: true, updatedAt: true } });
  return Response.json(config ?? { enabled: false }, { headers: { "Cache-Control": "public, max-age=60, stale-while-revalidate=300" } });
};
