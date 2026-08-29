export class CloudHistoryClient {
  constructor(options = {}) {
    this.sessionUrl = options.sessionUrl ?? "/api/session";
    this.historyUrl = options.historyUrl ?? "/api/history";
    this.fetch = options.fetch ?? globalThis.fetch?.bind(globalThis);
    this.status = { configured: false, storage: "local", reason: "not_checked" };
    this.installationId = "";
  }

  async bootstrap(installationId) {
    this.installationId = installationId;
    if (!this.fetch) return this.status;
    try {
      const response = await this.fetch(this.sessionUrl, {
        credentials: "same-origin",
        cache: "no-store",
        headers: { "X-Installation-Id": installationId },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error?.code || `session_${response.status}`);
      this.status = data;
    } catch (error) {
      this.status = { configured: false, storage: "local", reason: error.message || "session_unavailable" };
    }
    return this.status;
  }

  async loadHistory() {
    if (!this.status.configured || !this.fetch) return { threads: [], messages: [] };
    const response = await this.fetch(this.historyUrl, {
      credentials: "same-origin",
      cache: "no-store",
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data?.error?.code || `history_${response.status}`);
    return {
      threads: Array.isArray(data?.threads)
        ? data.threads.map((row) => ({
            version: 1,
            id: row.id,
            deviceId: this.installationId,
            opportunityType: row.opportunity_type || "task",
            opportunityId: row.opportunity_id || row.context_snapshot?.id || "",
            title: row.title || row.context_snapshot?.title || "Untitled conversation",
            provider: row.provider || "rules",
            model: row.model || null,
            providerThreadId: row.provider_thread_id || null,
            contextSnapshot: row.context_snapshot || {},
            messageCount: Number(row.message_count) || 0,
            lastMessagePreview: row.last_message_preview || "",
            createdAt: row.client_created_at || row.created_at,
            updatedAt: row.client_updated_at || row.updated_at,
          }))
        : [],
      messages: Array.isArray(data?.messages)
        ? data.messages.map((row) => ({
            version: 1,
            id: row.id,
            threadId: row.thread_id,
            role: row.role,
            content: row.content || "",
            provider: row.provider || null,
            model: row.model || null,
            providerThreadId: row.provider_thread_id || null,
            status: row.status || "completed",
            errorCode: row.error_code || null,
            usage: row.usage || null,
            createdAt: row.client_created_at || row.created_at,
            updatedAt: row.client_updated_at || row.updated_at,
          }))
        : [],
    };
  }

  async syncThread(thread, messages) {
    if (!this.status.configured || !this.fetch) return { synced: false, reason: "local_only" };
    const response = await this.fetch(this.historyUrl, {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ thread, messages }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data?.error?.code || `history_${response.status}`);
    return data;
  }

  async deleteThread(threadId) {
    if (!this.status.configured || !this.fetch) return { deleted: false, reason: "local_only" };
    const response = await this.fetch(this.historyUrl, {
      method: "DELETE",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ threadId }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data?.error?.code || `history_${response.status}`);
    return data;
  }
}
