// node.jsの標準ライブラリであるhttpとurlをインポートする
import http from "node:http";
import { URL } from "node:url";

// 環境変数PORTが設定されていればそれを使い、なければ8888番ポートを使う
const PORT = process.env.PORT || 8888;

// httpサーバーを作成する
const server = http.createServer((req, res) => {
  // リクエストURLをパースして、パス名やクエリパラメータを取得しやすくする
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = parsedUrl.pathname;

  // レスポンスのヘッダーに、文字コードがUTF-8であることを設定する
  res.setHeader("Content-Type", "text/plain; charset=utf-8");

  // パス名によって処理を分岐する
  if (pathname === "/") {
    console.log("/ へのアクセスがありました");
    // ステータスコード200（成功）を返し、「こんにちは！」という文字列を送る
    res.writeHead(200);
    res.end("こんにちは！");
  } else if (pathname === "/ask") {
    console.log("/ask へのアクセスがありました");
    // クエリパラメータから'q'の値を取得する
    const question = parsedUrl.searchParams.get("q");
    // ステータスコード200（成功）を返し、質問内容を含む文字列を送る
    res.writeHead(200);
    res.end(`Your question is '${question}'`);
  } else {
    console.log("不明なパスへのアクセスがありました:", pathname);
    // どのパスにも当てはまらない場合は、404 Not Foundエラーを返す
    res.writeHead(404);
    res.end("ページが見つかりません");
  }
});

// 指定したポートでサーバーを起動し、リクエストを待ち受ける
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
