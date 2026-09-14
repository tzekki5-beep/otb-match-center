export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname.startsWith("/pitchapi/")) {
      const target = new URL(
        "https://api.pitchapi.dev/v1/" +
        url.pathname.slice("/pitchapi/".length)
      );
      target.search = url.search;

      return fetch(target, {
        headers: {
          "X-API-KEY": env.PITCHAPI_KEY
        }
      });
    }

    const file = await fetch(
      "https://raw.githubusercontent.com/tzekki5-beep/otb-match-center/main/index.html"
    );

    return new Response(file.body, {
      status: file.status,
      headers: {
        "Content-Type": "text/html; charset=UTF-8"
      }
    });
  }
};
