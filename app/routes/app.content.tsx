import { parse } from "csv-parse/sync";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { Form, useActionData, useLoaderData } from "react-router";
import { authenticate } from "../shopify.server";

type CsvRow = { Title: string; "URL handle": string; Description: string; "SEO title": string; "SEO description": string };
type ProductSummary = { id: string; title: string; handle: string; media: { nodes: Array<{ image?: { altText?: string | null } | null }> } };

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { admin } = await authenticate.admin(request);
  const response = await admin.graphql(`#graphql query ContentProducts { products(first: 25, sortKey: UPDATED_AT, reverse: true) { nodes { id title handle descriptionHtml seo { title description } media(first: 10) { nodes { ... on MediaImage { id image { url altText } } } } } } }`);
  const body = await response.json();
  return { products: (body.data?.products?.nodes ?? []) as ProductSummary[] };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { admin } = await authenticate.admin(request); const form = await request.formData(); const file = form.get("file");
  if (!(file instanceof File)) return { ok: false, message: "CSV-Datei fehlt.", updated: 0, errors: [] as string[] };
  const rows = parse(await file.text(), { columns: true, skip_empty_lines: true, bom: true }) as CsvRow[];
  const products = rows.filter(row => row.Title && row["URL handle"]); let updated = 0; const errors: string[] = [];
  for (const row of products) {
    const lookup = await admin.graphql(`#graphql query ProductForImport($identifier: ProductIdentifierInput!) { productByIdentifier(identifier: $identifier) { id } }`, { variables: { identifier: { handle: row["URL handle"] } } });
    const found = await lookup.json(); const id = found.data?.productByIdentifier?.id;
    if (!id) { errors.push(`${row["URL handle"]}: Produkt nicht gefunden`); continue; }
    const update = await admin.graphql(`#graphql mutation UpdateImportedContent($product: ProductUpdateInput!) { productUpdate(product: $product) { product { id } userErrors { field message } } }`, { variables: { product: { id, title: row.Title, descriptionHtml: row.Description, seo: { title: row["SEO title"], description: row["SEO description"] } } } });
    const result = await update.json(); const userErrors = result.data?.productUpdate?.userErrors ?? [];
    if (userErrors.length) errors.push(`${row["URL handle"]}: ${userErrors.map((e: {message:string}) => e.message).join(", ")}`); else updated++;
  }
  return { ok: errors.length === 0, message: `${updated} von ${products.length} Produkten aktualisiert.`, updated, errors: errors.slice(0, 20) };
};

export default function Content() {
  const { products } = useLoaderData<typeof loader>(); const result = useActionData<typeof action>();
  return <s-page heading="Produktcontent & Bilder"><s-section heading="Shopify-CSV importieren"><s-paragraph>Unterstützt das bereitgestellte Format mit Title, URL handle, Description, SEO title und SEO description. Variantenzeilen ohne Titel bleiben unberührt.</s-paragraph>
    {result ? <s-banner tone={result.ok ? "success" : "warning"}>{result.message}{result.errors.map(error => <div key={error}>{error}</div>)}</s-banner> : null}
    <Form method="post" encType="multipart/form-data"><input type="file" name="file" accept=".csv,text/csv" required /> <s-button type="submit" variant="primary">Content aktualisieren</s-button></Form>
  </s-section><s-section heading="Zuletzt aktualisierte Produkte"><s-stack direction="block" gap="base">{products.map((product) => <s-box key={product.id} padding="base" borderWidth="base" borderRadius="base"><s-heading>{product.title}</s-heading><s-paragraph>{product.handle} · {product.media.nodes.length} Bilder · {product.media.nodes.filter((media) => media.image?.altText).length} mit Alt-Text</s-paragraph></s-box>)}</s-stack></s-section></s-page>;
}
