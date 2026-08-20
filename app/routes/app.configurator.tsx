import { useState } from "react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { Form, useActionData, useLoaderData } from "react-router";
import { authenticate } from "../shopify.server";
import db from "../db.server";
import { defaultRecommendations, parseRecommendations } from "../configurator.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request); const saved = await db.shopConfiguration.findUnique({ where: { shop: session.shop } });
  return { enabled: saved?.enabled ?? false, heading: saved?.heading ?? "Finde dein passendes Substrat", intro: saved?.intro ?? "Beantworte drei kurze Fragen.", primaryColor: saved?.primaryColor ?? "#315c3b", recommendations: saved?.recommendations ?? defaultRecommendations };
};
export const action = async ({ request }: ActionFunctionArgs) => {
  const { session } = await authenticate.admin(request); const form = await request.formData();
  try { const values = { enabled: form.get("enabled") === "on", heading: String(form.get("heading") || ""), intro: String(form.get("intro") || ""), primaryColor: String(form.get("primaryColor") || "#315c3b"), recommendations: parseRecommendations(form.get("recommendations")) };
    await db.shopConfiguration.upsert({ where: { shop: session.shop }, create: { shop: session.shop, ...values }, update: values }); return { ok: true, message: "Gespeichert." };
  } catch (e) { return { ok: false, message: e instanceof Error ? e.message : "Fehler" }; }
};
export default function Configurator() {
  const data = useLoaderData<typeof loader>(); const result = useActionData<typeof action>(); const [rules, setRules] = useState(JSON.stringify(data.recommendations, null, 2));
  return <s-page heading="Substrat-Konfigurator"><Form method="post"><s-section heading="Storefront-Einstellungen">
    {result ? <s-banner tone={result.ok ? "success" : "critical"}>{result.message}</s-banner> : null}
    <p><label><input type="checkbox" name="enabled" defaultChecked={data.enabled} /> Konfigurator aktivieren</label></p>
    <p><label>Überschrift <input name="heading" defaultValue={data.heading} required /></label></p>
    <p><label>Einleitung <textarea name="intro" defaultValue={data.intro} /></label></p>
    <p><label>Markenfarbe <input name="primaryColor" type="color" defaultValue={data.primaryColor} /></label></p>
  </s-section><s-section heading="Empfehlungsregeln"><textarea name="recommendations" value={rules} onChange={e => setRules(e.currentTarget.value)} rows={22} style={{width:"100%",fontFamily:"monospace"}}/><s-button type="submit" variant="primary">Speichern</s-button></s-section></Form></s-page>;
}
