
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Server-side PitchAPI proxy. The browser never receives the secret.
    if (url.pathname.startsWith("/pitchapi/")) {
      const suffix = url.pathname.slice("/pitchapi/".length);
      const target = new URL("https://api.pitchapi.dev/v1/" + suffix);
      target.search = url.search;

      const headers = new Headers(request.headers);
      headers.set("X-API-KEY", env.PITCHAPI_KEY || "");
      headers.delete("host");

      const init = {
        method: request.method,
        headers,
        redirect: "follow"
      };
      if (request.method !== "GET" && request.method !== "HEAD") {
        init.body = request.body;
      }

      const upstream = await fetch(target.toString(), init);
      const out = new Response(upstream.body, upstream);
      out.headers.set("Cache-Control", "no-store");
      return out;
    }

    // Serve the existing static app.
    return env.ASSETS.fetch(request);
  }
};
