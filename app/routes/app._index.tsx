import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import { authenticate } from "../shopify.server";
import db from "../db.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  return { configuration: await db.shopConfiguration.findUnique({ where: { shop: session.shop }, select: { enabled: true, updatedAt: true } }) };
};

export default function Index() {
  const { configuration } = useLoaderData<typeof loader>();
  return <s-page heading="LEAFer Studio">
    <s-button slot="primary-action" href="/app/configurator" variant="primary">Konfigurator einrichten</s-button>
    <s-section heading="Deine Shopify-Werkzeuge">
      <s-paragraph>Verwalte Substrat-Empfehlungen und optimiere Produktcontent zentral – ohne Theme-Dateien manuell zu verändern.</s-paragraph>
      <s-stack direction="inline" gap="base"><s-button href="/app/configurator">Substrat-Konfigurator</s-button><s-button href="/app/content">Produktcontent &amp; Bilder</s-button></s-stack>
    </s-section>
    <s-section slot="aside" heading="Storefront-Status"><s-paragraph>{configuration?.enabled ? "Aktiviert. Füge den App-Block noch im Theme-Editor ein." : "Noch nicht aktiviert."}</s-paragraph></s-section>
  </s-page>;
}
