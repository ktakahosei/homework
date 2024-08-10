//サーバーサイド

//必要なモジュールのインポート
const express = require('express');
const app = express();
const path = require('node:path');
const { MongoClient } = require('mongodb');
const client = new MongoClient('mongodb://localhost:27017');



//使用するファイルの設定
app.set('view engine', 'ejs');
app.use('/static', express.static(path.join(__dirname, 'public')));

//ログミドルウェアの定義
const logMiddleware = (req, res, next) => {
  console.log(req.method, req.path);
  next();
}

//ユーザーIDの取得
app.get('/user/:id', logMiddleware, (req, res) => {
  // :idをreq.params.idとして受け取る
  res.status(200).send(req.params.id);
});

//エラーハンドリングミドルウェア
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Internal Server Error');
});



//メイン処理
async function main() {
  //db:データベース
  //collection:テーブル
  //field:列
  //-test(db)
  // -math(collection)
  //   -answer(field):答え
  //   -text(field):userの解答
  await client.connect();
  const db = client.db('test');
  const collection = db.collection('math');

  //GETリクエスト処理
  app.get('/', logMiddleware, async (req, res) => {
    //answer,textのそれぞれのfieldに格納されている値を配列にする
    const math = await collection.find().toArray();
    const answers = math.map((answer_element) => {
      return answer_element.answer;
    });
    const texts = math.map((text_element) => {
      return text_element.text;
    });

    //正解なら○、不正解なら×をcorrectsに格納する
    const corrects = [];
    for(let i = 0; i < answers.length; i++){
      if(texts[i + (texts.length - answers.length)] == answers[i]){
        corrects.push('○');
      }else{
        corrects.push('×'); 
      }
    }

    //correctsをindex.ejsへ渡す
    res.render(path.resolve(__dirname, 'views/index.ejs'), { corrects: corrects });
  });

  //POSTTリクエスト処理
  app.post('/api/test', express.json(), async (req, res) => {
    //userの解答と答えをそれぞれanswer,textに格納する
    const text = req.body.text;
    if (!text) {
      res.status(400).send('Bad Request');
      return;
    }
    await collection.insertOne({  answer: '66' , text: text});
    res.status(200).send('Created');
  });

  //サーバー起動
  // ポート: 3000でサーバーを起動
  app.listen(3000, () => {
    // サーバー起動後に呼び出されるCallback
    console.log('start listening');
  });
}
main();
