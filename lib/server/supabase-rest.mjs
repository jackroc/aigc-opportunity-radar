function trimSlash(value) {
  return String(value ?? "").replace(/\/+$/, "");
}

export function getDatabaseConfig(environment = process.env) {
  const url = trimSlash(environment.SUPABASE_URL);
  const serviceKey = String(environment.SUPABASE_SERVICE_ROLE_KEY ?? "");
  return {
    configured: /^https:\/\/[^/]+\.supabase\.co$/i.test(url) && serviceKey.length > 20,
    url,
    serviceKey,
  };
}

export async function supabaseRequest(config, path, options = {}) {
  if (!config?.configured) {
    const error = new Error("Cloud conversation storage is not configured");
    error.code = "cloud_not_configured";
    error.status = 503;
    throw error;
  }
  const response = await fetch(`${config.url}/rest/v1/${path.replace(/^\/+/, "")}`, {
    method: options.method ?? "GET",
    headers: {
      apikey: config.serviceKey,
      Authorization: `Bearer ${config.serviceKey}`,
      Accept: "application/json",
      ...(options.body === undefined ? {} : { "Content-Type": "application/json" }),
      ...(options.prefer ? { Prefer: options.prefer } : {}),
      ...options.headers,
    },
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
    signal: options.signal,
  });
  if (!response.ok) {
    const details = await response.text();
    const error = new Error(`Conversation database request failed with ${response.status}`);
    error.code = "database_request_failed";
    error.status = response.status >= 500 ? 503 : response.status;
    error.details = details.slice(0, 500);
    throw error;
  }
  if (response.status === 204) return null;
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

export async function registerDevice(config, device) {
  return supabaseRequest(config, "devices?on_conflict=id", {
    method: "POST",
    prefer: "resolution=merge-duplicates,return=representation",
    body: {
      id: device.id,
      installation_id: device.installationId,
      last_seen_at: new Date().toISOString(),
    },
  });
}

export async function touchDevice(config, deviceId) {
  return supabaseRequest(config, `devices?id=eq.${encodeURIComponent(deviceId)}`, {
    method: "PATCH",
    prefer: "return=minimal",
    body: { last_seen_at: new Date().toISOString() },
  });
}
