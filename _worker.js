
var worker_default = {
  async fetch(request, env) {
    const url = new URL(request.url);

    // NHL: kokoonpanot ja ottelut
    if (url.pathname.startsWith("/nhl-api/")) {
      const target = new URL(
        "https://api-web.nhle.com" +
        url.pathname.slice("/nhl-api".length)
      );
      target.search = url.search;
      return fetch(target, {
        headers: { "Accept": "application/json" }
      });
    }

    // NHL: pelaajatilastot
    if (url.pathname.startsWith("/nhl-stats/")) {
      const target = new URL(
        "https://api.nhle.com/stats/rest/en/" +
        url.pathname.slice("/nhl-stats/".length)
      );
      target.search = url.search;
      return fetch(target, {
        headers: { "Accept": "application/json" }
      });
    }

    // NHL: ketjutietojen lähde
    if (url.pathname.startsWith("/nhl-lines/")) {
      const path = url.pathname.slice("/nhl-lines/".length);
      const target = new URL(path, "https://hockeyinsights.ca/");
      target.search = url.search;

      const response = await fetch(target, {
        headers: { "Accept": "application/json" }
      });

      const headers = new Headers(response.headers);
      headers.set("Cache-Control", "public, max-age=300");

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers
      });
    }

    // Jalkapallo: PitchAPI
    if (url.pathname.startsWith("/pitchapi/")) {
      const target = new URL(
        "https://api.pitchapi.dev/v1/" +
        url.pathname.slice("/pitchapi/".length)
      );
      target.search = url.search;

      return fetch(target, {
        headers: {
          "X-API-KEY": env.PITCHAPI_KEY,
          "Accept": "application/json"
        }
      });
    }

    // Sivuston HTML GitHubista
    const file = await fetch(
      "https://raw.githubusercontent.com/tzekki5-beep/otb-match-center/main/index_fixed.html",
      { headers: { "Cache-Control": "no-cache" } }
    );

    return new Response(file.body, {
      status: file.status,
      headers: {
        "Content-Type": "text/html; charset=UTF-8",
        "Cache-Control": "no-cache"
      }
    });
  }
};

export { worker_default as default };
