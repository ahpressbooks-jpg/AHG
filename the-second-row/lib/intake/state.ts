import { FloorItem } from "../floor";

// STATE PIPE — abstracted behind this interface so the provider (LegiScan or
// Open States) and additional states can be swapped/added without touching the
// rest of the system. Texas launches in Phase 3. Until a provider key is set,
// this returns null and the Floor states its coverage plainly rather than faking it.

export function stateConfigured(): boolean {
  return Boolean(process.env.LEGISCAN_API_KEY || process.env.OPENSTATES_API_KEY);
}

export async function fetchState(): Promise<FloorItem[] | null> {
  // Implemented in Phase 3 (Texas). Fetch + normalize into the same FloorItem
  // shape returned by the federal/regulatory pipes, keyed on the state's
  // source-of-record identifier for idempotent upserts.
  return null;
}
