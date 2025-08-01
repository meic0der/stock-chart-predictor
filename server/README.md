# Stock Chart Predictor - Server

株価予測アプリケーションのサーバーサイド（MVCアーキテクチャ）

## アーキテクチャ

このプロジェクトはMVC（Model-View-Controller）パターンに従って構築されています：

### 📁 ディレクトリ構造

```
server/
├── config/           # 設定ファイル
│   ├── app.js       # アプリケーション設定
│   └── database.js  # データベース設定
├── controllers/      # コントローラー層
│   ├── AuthController.js
│   ├── HistoryController.js
│   └── PredictController.js
├── middleware/       # ミドルウェア
│   └── auth.js      # 認証ミドルウェア
├── models/          # モデル層
│   ├── History.js   # 履歴モデル
│   └── User.js      # ユーザーモデル
├── routes/          # ルーティング
│   ├── auth.js      # 認証ルート
│   ├── history.js   # 履歴ルート
│   └── predict.js   # 予測ルート
├── services/        # サービス層
│   ├── AuthService.js    # 認証サービス
│   └── StockService.js   # 株価サービス
├── utils/           # ユーティリティ
│   └── validation.js     # バリデーション
├── db.js           # データベース接続
├── index.js        # メインアプリケーション
└── knexfile.js     # Knex設定
```

### 🔧 各層の役割

#### Models（モデル層）
- データベース操作の抽象化
- ビジネスロジックの基本部分
- データの永続化

#### Controllers（コントローラー層）
- HTTPリクエストの処理
- レスポンスの制御
- バリデーション
- エラーハンドリング

#### Services（サービス層）
- 複雑なビジネスロジック
- 外部APIとの連携
- データの変換・加工

#### Routes（ルーティング層）
- エンドポイントの定義
- コントローラーへの振り分け

## 🚀 セットアップ

### 必要な環境変数

```bash
# .env ファイルを作成
NODE_ENV=development
PORT=4010
CLIENT_URL=http://localhost:5173
ML_API_URL=http://localhost:5000
SESSION_SECRET=your-secret-key
```

### インストールと実行

```bash
# 依存関係のインストール
npm install

# データベースマイグレーション
npx knex migrate:latest

# 開発サーバーの起動
npm start
```

## 📡 API エンドポイント

### 認証関連
- `POST /api/auth/register` - ユーザー登録
- `POST /api/auth/login` - ログイン
- `POST /api/auth/logout` - ログアウト
- `GET /api/auth/me` - 現在のユーザー情報

### 予測関連
- `POST /api/predict` - 株価予測

### 履歴関連
- `GET /api/history` - 履歴一覧取得
- `GET /api/history/:id` - 特定の履歴取得
- `PATCH /api/history/:id` - メモ更新
- `DELETE /api/history/:id` - 履歴削除

## 🔒 認証

セッションベースの認証を実装しています：

- Cookieを使用したセッション管理
- 24時間のセッション有効期限
- 認証が必要なエンドポイントには`requireAuth`ミドルウェアを使用

## 🛡️ セキュリティ

- パスワードのハッシュ化（SHA-256 + Salt）
- CORS設定
- 入力バリデーション
- エラーハンドリング

## 🧪 テスト

```bash
# テストの実行
npm test
```

## 📝 開発ガイドライン

### 新しい機能の追加

1. **Model**: データベース操作を定義
2. **Service**: ビジネスロジックを実装
3. **Controller**: リクエスト処理を実装
4. **Route**: エンドポイントを定義

### エラーハンドリング

- 適切なHTTPステータスコードを返す
- エラーメッセージは日本語で統一
- 開発環境では詳細なエラー情報を表示

### バリデーション

- 入力値の検証は`utils/validation.js`で一元管理
- コントローラーでバリデーションを実行 