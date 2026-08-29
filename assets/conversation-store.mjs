export const CONVERSATION_DATABASE_NAME = "aigc-opportunity-conversations";
export const CONVERSATION_FALLBACK_KEY = "opportunity-conversations-v1";

const PROVIDERS = new Set(["rules", "local-codex", "platform", "byok"]);
const ROLES = new Set(["user", "assistant", "system"]);
const MESSAGE_STATUSES = new Set(["pending", "completed", "failed"]);

function nowIso(value = new Date()) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) throw new TypeError("Invalid date");
  return date.toISOString();
}

function uuid(randomUUID) {
  const generator = randomUUID ?? globalThis.crypto?.randomUUID?.bind(globalThis.crypto);
  if (typeof generator !== "function") throw new Error("A secure random UUID generator is required");
  return generator();
}

function cleanText(value, maxLength) {
  return String(value ?? "").replaceAll("\u0000", "").trim().slice(0, maxLength);
}

function compareMessages(left, right) {
  const timestamp = String(left.createdAt ?? "").localeCompare(String(right.createdAt ?? ""));
  if (timestamp) return timestamp;
  if (left.role !== right.role) {
    if (left.role === "user") return -1;
    if (right.role === "user") return 1;
  }
  return String(left.id ?? "").localeCompare(String(right.id ?? ""));
}

export function snapshotTask(task) {
  if (!task?.id || !task?.title) throw new TypeError("A task with an id and title is required");
  return {
    id: cleanText(task.id, 180),
    title: cleanText(task.title, 300),
    summary: cleanText(task.summary ?? task.description, 4000),
    applicationUrl: cleanText(task.application_url, 2048),
    sourceRepo: cleanText(task.source_repo, 300),
    sourceNumber: Number.isFinite(Number(task.source_number)) ? Number(task.source_number) : null,
    sourceUpdatedAt: cleanText(task.source_updated_at, 64),
    expiresAt: cleanText(task.expires_at, 64),
    categories: Array.isArray(task.categories) ? task.categories.map((item) => cleanText(item, 80)).slice(0, 20) : [],
    skills: Array.isArray(task.skills) ? task.skills.map((item) => cleanText(item, 120)).slice(0, 30) : [],
    reward: task.reward && typeof task.reward === "object" ? structuredClone(task.reward) : null,
    aiPolicy: cleanText(task.ai_policy, 80) || null,
    competition: task.competition && typeof task.competition === "object" ? structuredClone(task.competition) : null,
  };
}

export function createConversationThread(input, options = {}) {
  const createdAt = nowIso(options.now ?? new Date());
  const provider = PROVIDERS.has(input.provider) ? input.provider : "rules";
  const contextSnapshot = input.contextSnapshot ?? snapshotTask(input.task);
  return {
    version: 1,
    id: input.id ?? uuid(options.randomUUID),
    deviceId: cleanText(input.deviceId, 80),
    opportunityType: "task",
    opportunityId: cleanText(contextSnapshot.id, 180),
    title: cleanText(input.title ?? contextSnapshot.title, 300),
    provider,
    model: cleanText(input.model, 160) || null,
    providerThreadId: cleanText(input.providerThreadId, 300) || null,
    contextSnapshot,
    messageCount: 0,
    lastMessagePreview: "",
    createdAt,
    updatedAt: createdAt,
  };
}

export function createConversationMessage(input, options = {}) {
  const createdAt = nowIso(options.now ?? new Date());
  const role = ROLES.has(input.role) ? input.role : "user";
  const status = MESSAGE_STATUSES.has(input.status) ? input.status : "completed";
  const provider = PROVIDERS.has(input.provider) ? input.provider : null;
  const content = cleanText(input.content, 32000);
  if (!content && status !== "pending") throw new TypeError("Message content is required");
  return {
    version: 1,
    id: input.id ?? uuid(options.randomUUID),
    threadId: cleanText(input.threadId, 80),
    role,
    content,
    provider,
    model: cleanText(input.model, 160) || null,
    providerThreadId: cleanText(input.providerThreadId, 300) || null,
    status,
    errorCode: cleanText(input.errorCode, 120) || null,
    usage: input.usage && typeof input.usage === "object" ? structuredClone(input.usage) : null,
    createdAt,
    updatedAt: createdAt,
  };
}

export function changeConversationProvider(thread, provider, options = {}) {
  if (!thread?.id) throw new TypeError("A conversation thread is required");
  const nextProvider = PROVIDERS.has(provider) ? provider : "rules";
  const changed = thread.provider !== nextProvider;
  return {
    ...thread,
    provider: nextProvider,
    model: changed ? null : thread.model,
    providerThreadId: changed ? null : thread.providerThreadId,
    updatedAt: nowIso(options.now ?? new Date()),
  };
}

function updateThreadFromMessages(thread, messages) {
  const ordered = [...messages].sort(compareMessages);
  const latest = ordered.at(-1);
  return {
    ...thread,
    messageCount: ordered.length,
    lastMessagePreview: latest ? cleanText(latest.content, 120) : "",
    updatedAt: latest?.updatedAt ?? thread.updatedAt,
  };
}

function createEmptyDocument() {
  return { version: 1, threads: [], messages: [] };
}

export class LocalConversationStore {
  constructor(storage, options = {}) {
    this.storage = storage;
    this.storageKey = options.storageKey ?? CONVERSATION_FALLBACK_KEY;
    this.maxMessages = options.maxMessages ?? 500;
    this.memory = createEmptyDocument();
  }

  read() {
    try {
      const value = JSON.parse(this.storage?.getItem?.(this.storageKey) || "null");
      if (value?.version === 1 && Array.isArray(value.threads) && Array.isArray(value.messages)) return value;
    } catch {
      // Fall back to the in-memory document when browser storage is unavailable or corrupt.
    }
    return structuredClone(this.memory);
  }

  write(document) {
    const compact = {
      version: 1,
      threads: document.threads,
      messages: [...document.messages]
        .sort(compareMessages)
        .slice(-this.maxMessages),
    };
    this.memory = structuredClone(compact);
    try {
      this.storage?.setItem?.(this.storageKey, JSON.stringify(compact));
    } catch {
      // Current-session history remains available from memory.
    }
  }

  async listThreads(filters = {}) {
    const document = this.read();
    return document.threads
      .filter((thread) => !filters.deviceId || thread.deviceId === filters.deviceId)
      .filter((thread) => !filters.opportunityId || thread.opportunityId === filters.opportunityId)
      .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));
  }

  async getThread(threadId) {
    return this.read().threads.find((thread) => thread.id === threadId) ?? null;
  }

  async putThread(thread) {
    const document = this.read();
    const index = document.threads.findIndex((candidate) => candidate.id === thread.id);
    if (index === -1) document.threads.push(structuredClone(thread));
    else document.threads[index] = structuredClone(thread);
    this.write(document);
    return thread;
  }

  async listMessages(threadId) {
    return this.read().messages
      .filter((message) => message.threadId === threadId)
      .sort(compareMessages);
  }

  async putMessage(message) {
    const document = this.read();
    const index = document.messages.findIndex((candidate) => candidate.id === message.id);
    if (index === -1) document.messages.push(structuredClone(message));
    else document.messages[index] = structuredClone(message);
    const threadIndex = document.threads.findIndex((candidate) => candidate.id === message.threadId);
    if (threadIndex !== -1) {
      const threadMessages = document.messages.filter((candidate) => candidate.threadId === message.threadId);
      document.threads[threadIndex] = updateThreadFromMessages(document.threads[threadIndex], threadMessages);
    }
    this.write(document);
    return message;
  }

  async deleteThread(threadId) {
    const document = this.read();
    document.threads = document.threads.filter((thread) => thread.id !== threadId);
    document.messages = document.messages.filter((message) => message.threadId !== threadId);
    this.write(document);
  }

  async exportThread(threadId) {
    const thread = await this.getThread(threadId);
    if (!thread) return null;
    return { version: 1, exportedAt: new Date().toISOString(), thread, messages: await this.listMessages(threadId) };
  }
}

function requestResult(request) {
  return new Promise((resolve, reject) => {
    request.addEventListener("success", () => resolve(request.result), { once: true });
    request.addEventListener("error", () => reject(request.error), { once: true });
  });
}

function transactionDone(transaction) {
  return new Promise((resolve, reject) => {
    transaction.addEventListener("complete", resolve, { once: true });
    transaction.addEventListener("abort", () => reject(transaction.error), { once: true });
    transaction.addEventListener("error", () => reject(transaction.error), { once: true });
  });
}

export class IndexedDbConversationStore {
  constructor(database) {
    this.database = database;
  }

  async listThreads(filters = {}) {
    const transaction = this.database.transaction("threads", "readonly");
    const threads = await requestResult(transaction.objectStore("threads").getAll());
    await transactionDone(transaction);
    return threads
      .filter((thread) => !filters.deviceId || thread.deviceId === filters.deviceId)
      .filter((thread) => !filters.opportunityId || thread.opportunityId === filters.opportunityId)
      .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));
  }

  async getThread(threadId) {
    const transaction = this.database.transaction("threads", "readonly");
    const thread = await requestResult(transaction.objectStore("threads").get(threadId));
    await transactionDone(transaction);
    return thread ?? null;
  }

  async putThread(thread) {
    const transaction = this.database.transaction("threads", "readwrite");
    transaction.objectStore("threads").put(structuredClone(thread));
    await transactionDone(transaction);
    return thread;
  }

  async listMessages(threadId) {
    const transaction = this.database.transaction("messages", "readonly");
    const messages = await requestResult(transaction.objectStore("messages").index("threadId").getAll(threadId));
    await transactionDone(transaction);
    return messages.sort(compareMessages);
  }

  async putMessage(message) {
    const transaction = this.database.transaction(["messages", "threads"], "readwrite");
    const messageStore = transaction.objectStore("messages");
    const threadStore = transaction.objectStore("threads");
    messageStore.put(structuredClone(message));
    const thread = await requestResult(threadStore.get(message.threadId));
    if (thread) {
      const messages = await requestResult(messageStore.index("threadId").getAll(message.threadId));
      const existingIndex = messages.findIndex((candidate) => candidate.id === message.id);
      if (existingIndex === -1) messages.push(message);
      else messages[existingIndex] = message;
      threadStore.put(updateThreadFromMessages(thread, messages));
    }
    await transactionDone(transaction);
    return message;
  }

  async deleteThread(threadId) {
    const transaction = this.database.transaction(["messages", "threads"], "readwrite");
    const messageStore = transaction.objectStore("messages");
    const messages = await requestResult(messageStore.index("threadId").getAll(threadId));
    messages.forEach((message) => messageStore.delete(message.id));
    transaction.objectStore("threads").delete(threadId);
    await transactionDone(transaction);
  }

  async exportThread(threadId) {
    const thread = await this.getThread(threadId);
    if (!thread) return null;
    return { version: 1, exportedAt: new Date().toISOString(), thread, messages: await this.listMessages(threadId) };
  }
}

export async function openConversationStore(environment = globalThis) {
  if (!environment.indexedDB?.open) return new LocalConversationStore(environment.localStorage);
  try {
    const request = environment.indexedDB.open(CONVERSATION_DATABASE_NAME, 1);
    request.addEventListener("upgradeneeded", () => {
      const database = request.result;
      const threadStore = database.createObjectStore("threads", { keyPath: "id" });
      threadStore.createIndex("deviceId", "deviceId", { unique: false });
      threadStore.createIndex("opportunityId", "opportunityId", { unique: false });
      const messageStore = database.createObjectStore("messages", { keyPath: "id" });
      messageStore.createIndex("threadId", "threadId", { unique: false });
    }, { once: true });
    const database = await requestResult(request);
    return new IndexedDbConversationStore(database);
  } catch {
    return new LocalConversationStore(environment.localStorage);
  }
}
