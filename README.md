# stock-chart-predictor
##　📈 株価予測アプリ
このアプリは、指定した銘柄の過去データをもとに 機械学習による株価予測 を行い、チャート表示・履歴保存・モデル切替ができる Web アプリです。

```
stock-chart-predictor/
├── client/           # React フロントエンド
├── server/           # Node.js + Express バックエンドAPI
├── ml-api/           # Flask (Python) 機械学習 API
└── README.md
```

## 🖥 使用技術
- 機能	技術スタック
- フロントエンド	React, TypeScript, Recharts
- バックエンド	Node.js, Express, Knex.js, PostgreSQL
- ML サーバー	Python, Flask, Scikit-learn, XGBoost, joblib
- その他	Yahoo Finance API, CORS 対応, RESTful API構成

## 🚀 起動方法
```
1. PostgreSQL を起動（Render またはローカル）
.env に必要な接続情報を記述してください。

2. サーバとフロントエンド
bash- 
コードをコピーする
cd server
npm install
npm run dev  # サーバ起動（localhost:4000）

cd ../client
npm install
npm run dev  # フロント起動（localhost:5173）
3. 機械学習API（Flask）
bash
コードをコピーする
cd ml-api
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# モデル生成（初回のみ）
python train_model.py

# 起動
make run  # または python app.py
Flask サーバーは http://localhost:5000 で起動します。
```

## 🔄 機能一覧
- 機能	説明
- 🔍 銘柄検索	株式シンボル（例: AAPL）でデータ取得
- 📊 チャート表示	実株価・予測値・移動平均を表示
- 📁 履歴保存・呼出	過去の検索履歴を保持・クリックで復元
- 🧠 モデル切り替え	モデル1（単純予測）、モデル2（SVR）、モデル3（XGBoost）
- 📝 メモ保存	履歴ごとにコメントを追記可能

## ⚠️ 注意
- Flask サーバーはバックエンドから http://localhost:5000 にアクセスされるため、同時起動しておく必要があります。

- CORS は Flask 側で flask-cors を使って有効化済みです。

- .venv, .env, node_modules は .gitignore に登録してください。
