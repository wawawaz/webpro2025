import express from "express";
// 生成した Prisma Client をインポート
import { PrismaClient } from "./generated/prisma/client";

const prisma = new PrismaClient({
  // クエリが実行されたときに実際に実行したクエリをログに表示する設定
  log: ["query"],
});
const app = express();

// 環境変数が設定されていれば、そこからポート番号を取得する。環境変数に設定がなければ 8888 を使用する。
const PORT = process.env.PORT || 8888;

// EJS をテンプレートエンジンとして設定
app.set("view engine", "ejs");
// EJS のテンプレートファイルが置かれているディレクトリを指定
app.set("views", "./views");

// form から送信されたデータを受け取れるように設定
app.use(express.urlencoded({ extended: true }));

// ルートパス('/')にアクセスがあったときの処理
app.get("/", async (req, res) => {
  // データベースから全ユーザーを取得
  const users = await prisma.user.findMany();
  // 取得したユーザー情報を 'index.ejs' に渡して、HTMLを生成して返す
  res.render("index", { users });
});

// '/users' にPOSTリクエストがあったときの処理
app.post("/users", async (req, res) => {
  const name = req.body.name; // フォームから送信された名前を取得
  const age = req.body.age ? Number(req.body.age) : null; // フォームから送信された年齢を取得

  if (name) {
    const newUser = await prisma.user.create({
      data: { name, age }, // 年齢も保存
    });
    console.log("新しいユーザーを追加しました:", newUser);
  }
  res.redirect("/"); // ユーザー追加後、一覧ページにリダイレクト
});

// サーバーを起動
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
