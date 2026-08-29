export function json(data, options = {}) {
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json; charset=utf-8");
  headers.set("Cache-Control", "no-store");
  headers.set("X-Content-Type-Options", "nosniff");
  return new Response(JSON.stringify(data), { status: options.status ?? 200, headers });
}

export function errorResponse(error) {
  const status = Number(error?.status) || 500;
  const code = error?.code || (status >= 500 ? "internal_error" : "invalid_request");
  return json({ error: { code, message: status >= 500 ? "The service is temporarily unavailable" : error.message } }, { status });
}

export async function readJson(request, options = {}) {
  const contentType = request.headers.get("content-type") || "";
  if (!contentType.toLowerCase().startsWith("application/json")) {
    const error = new Error("Content-Type must be application/json");
    error.status = 415;
    throw error;
  }
  const declaredLength = Number(request.headers.get("content-length") || 0);
  if (declaredLength > (options.maxBytes ?? 256_000)) {
    const error = new Error("Request body is too large");
    error.status = 413;
    throw error;
  }
  try {
    return await request.json();
  } catch {
    const error = new Error("Request body must be valid JSON");
    error.status = 400;
    throw error;
  }
}
