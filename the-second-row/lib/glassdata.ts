import { foundingWall as wall } from "./records";
import { listLen, loadBoard } from "./store";

export { listLen };

/** The Glass Desk's live counters — pulled, never typed in. */
export async function foundingWall(): Promise<{
  founding: number;
  seats: number;
  users: number;
  sweeps: number;
}> {
  const [w, seats, users, board] = await Promise.all([
    wall(),
    listLen("tsr:seats"),
    listLen("tsr:users"),
    loadBoard(),
  ]);
  return {
    founding: w.length,
    seats,
    users,
    sweeps: board?.version ?? 0,
  };
}
