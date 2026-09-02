import tasks from "../../data/tasks.json" with { type: "json" };

import { sanitizeTaskContext } from "../assistant-core.mjs";

const taskSnapshots = new Map(tasks.map((task) => [task.id, sanitizeTaskContext(task)]));

export function getCanonicalTaskSnapshot(taskId) {
  const snapshot = taskSnapshots.get(String(taskId ?? ""));
  return snapshot ? structuredClone(snapshot) : null;
}
