export type Recommendation = { id: string; label: string; plantTypes: string[]; wateringStyles: string[]; minPotCm: number; maxPotCm: number; mix: string; productUrl: string };
export const defaultRecommendations: Recommendation[] = [
  { id: "aroid-balanced", label: "Aroid Balance", plantTypes: ["aroid"], wateringStyles: ["balanced", "frequent"], minPotCm: 6, maxPotCm: 40, mix: "40 % Pinienrinde · 30 % Bims · 20 % Kokos · 10 % Pflanzenkohle", productUrl: "" },
  { id: "dry-structure", label: "Dry Structure", plantTypes: ["succulent", "cactus"], wateringStyles: ["rare", "balanced"], minPotCm: 6, maxPotCm: 40, mix: "45 % Bims · 30 % Lava · 15 % Zeolith · 10 % Kokos", productUrl: "" },
];
export function parseRecommendations(value: FormDataEntryValue | null): Recommendation[] {
  if (typeof value !== "string") throw new Error("Empfehlungen fehlen.");
  const rows = JSON.parse(value) as Recommendation[];
  if (!Array.isArray(rows) || !rows.length) throw new Error("Mindestens eine Empfehlung ist erforderlich.");
  rows.forEach((row, i) => { if (!row.id || !row.label || !row.mix) throw new Error(`Empfehlung ${i + 1} ist unvollständig.`); });
  return rows;
}
