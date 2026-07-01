import { getCollection } from "./mongodb";
import { Counter } from "./types";

export async function getNextSequence(name: string): Promise<number> {
  const counters = await getCollection<Counter>("Counter");
  const result = await counters.findOneAndUpdate(
    { name },
    { $inc: { seq: 1 } },
    { returnDocument: "after", upsert: true },
  );
  return result!.seq;
}
