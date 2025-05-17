from flask import Flask, request, jsonify
# Flask: Web API サーバーを作るための軽量フレームワーク
# request: フロントエンドなどから送られてくるリクエスト（データ）を扱う
# jsonify: Pythonの辞書（dict）を JSON形式で返す
from flask_cors import CORS #CORS（Cross-Origin Resource Sharing） を有効にする
import joblib  # ← pkl を読み込む
import numpy as np



app = Flask(__name__) #Flask サーバーを生成
CORS(app)  # CORSを有効にする 他のポート（Reactなど）からのアクセスを許可する

# モデルの読み込み
model2 = joblib.load('models/model2.pkl')
model3 = joblib.load('models/model3.pkl')

@app.route("/")
def index():
    return "👋 Flask サーバーは正常に動作しています！"

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json #JSON データを Pythonのdictとして受け取る
    prev_close = data.get('prev_close')
    return_rate = data.get('return') #成長率（たとえば +1% なら 0.01）
    model_name = data.get('model', 'model1')
    
    # 特徴量を作る（1日ごとの特徴を7日分）
    X = np.array([
        [prev_close * ((1 + return_rate) ** i), return_rate]
        for i in range(1, 8)
    ])

    # モデルを選択して予測
    # modelは.predict()メッソドをもつモデル
    if model_name == "model2":
        #model2.predict(X) を呼ぶことで、新しいデータ X に対して予測値を出す
        #.tolist() でNumpy配列を配列(list)に変換
        predicted = model2.predict(X).tolist() # SVR（Support Vector Regression） モデル
    elif model_name == "model3":
        predicted = model3.predict(X).tolist() #XGBoost
    else:
        return jsonify({"error": "未知のモデルです"}), 400

    return jsonify({"predicted": predicted})