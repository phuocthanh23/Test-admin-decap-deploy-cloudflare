// Bước 2: GitHub trả về code -> đổi lấy access token -> gửi token về cho Decap qua postMessage
export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const cookieState = (request.headers.get("Cookie") || "").match(/oauth_state=([^;]+)/)?.[1];

  if (!code || !state || state !== cookieState) {
    return reply(url.origin, "error", { message: "State không hợp lệ, anh thử đăng nhập lại." });
  }

  const res = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      code,
    }),
  });
  const data = await res.json();

  if (data.error || !data.access_token) {
    return reply(url.origin, "error", { message: data.error_description || "Không lấy được token." });
  }
  return reply(url.origin, "success", { token: data.access_token, provider: "github" });
}

// Giao thức bắt tay mà Decap chờ: "authorizing:github" rồi "authorization:github:<status>:<json>"
// Chỉ gửi token cho trang /admin cùng domain, để web lạ mở popup này không lấy được token
function reply(origin, status, content) {
  const message = `authorization:github:${status}:${JSON.stringify(content)}`;
  const html = `<!doctype html><html><body><script>
    (function () {
      function receive(e) {
        if (e.origin !== ${JSON.stringify(origin)}) return;
        window.opener.postMessage(${JSON.stringify(message)}, e.origin);
        window.removeEventListener("message", receive, false);
      }
      window.addEventListener("message", receive, false);
      window.opener.postMessage("authorizing:github", "*");
    })();
  </script><p>Đang đăng nhập...</p></body></html>`;
  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Set-Cookie": "oauth_state=; Path=/api; Max-Age=0",
    },
  });
}
