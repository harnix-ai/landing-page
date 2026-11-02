/** Stable cover palette based only on the post id. */
export function coverVariant(seed: string): "night" | "accent" | "soft" {
  let hash = 0;
  for (let index = 0; index < seed.length; index++) {
    hash = (hash + seed.charCodeAt(index)) % 3;
  }
  return (["night", "accent", "soft"] as const)[hash];
}

export function coverLabel(tag: string): string {
  return tag.trim() || "Blog";
}
