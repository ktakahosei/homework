//必要なモジュールのインポート
const express = require('express');//express:Node.js用のWebフレームワークで、WebアプリケーションやAPIを簡単に構築できる
const app = express();
const path = require('node:path');//path:ファイルパスを操作するためのNode.jsの標準モジュール
const { MongoClient } = require('mongodb');//MongoDB:MongoDBのクライアントライブラリで、MongoDBに接続するために使用
const client = new MongoClient('mongodb://localhost:27017');//client:MongoDBへの接続を管理するインスタンス



//動的なHTMLページのテンプレートエンジンを設定
//app.set('.ejsファイルが存在するディレクトリ engine', 'ejs')
app.set('view engine', 'ejs');
//'public'ディレクトリ内のファイルを、'/static'パスで静的ファイルとして配信
app.use('/static', express.static(path.join(__dirname, 'public')));
//ログミドルウェアの定義
//logMiddlewareはリクエストのメソッドとパスをコンソールにログ出力します。次のミドルウェアまたはルートハンドラーに処理を渡すために、next()を呼び出します。
const logMiddleware = (req, res, next) => {
  console.log(req.method, req.path);
  next();
}
//ユーザーIDの取得
//'/user/:id'というエンドポイントに対して、リクエストが来ると、logMiddlewareを通過し、リクエストパラメータのidをレスポンスとして送信します。
app.get('/user/:id', logMiddleware, (req, res) => {
  // :idをreq.params.idとして受け取る
  res.status(200).send(req.params.id);
});
//エラーハンドリングミドルウェア
//サーバーでエラーが発生した場合、このミドルウェアが呼ばれ、エラーをコンソールに出力し、500ステータスコードとともに「Internal Server Error」というメッセージをクライアントに返します。
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Internal Server Error');
});



//メイン処理
async function main() {
  //MongoDBに接続し'my-app'データベースを選択
  await client.connect();
  const db = client.db('test');

  //ルートハンドラーの設定
  //GETリクエストが来た場合、userコレクションからすべてのユーザーを取得し、その名前をテンプレートエンジンを使ってindex.ejsファイルでレンダリングする
  app.get('/', logMiddleware, async (req, res) => {
    //answer:解答
    //correct:正誤
    const answer_table = await db.collection('answer_table').find().toArray();
    const answers = answer_table.map((table_element) => {
      return table_element.answer;
    });

    res.render(path.resolve(__dirname, 'views/index.ejs'), { corrects: answers });
  });
  //POSTTリクエストが来た場合、リクエストボディからnameを取得し、userコレクションに新しいドキュメントを追加します。名前が提供されていない場合は、400ステータスコードで「Bad Request」を返す
  app.post('/api/test', express.json(), async (req, res) => {
    const answer = req.body.answer;
    if (!answer) {
      res.status(400).send('Bad Request');
      return;
    }
    await db.collection('answer_table').insertOne({ answer: answer });
    res.status(200).send('Created');
    
    /*
    const correctAnswer = '2';

    if(userAnswer === correctAnswer){
      res.status(200).send('○');
    }else{
      res.status(200).send('×');
    }
    */
  });

  //サーバー起動
  // ポート: 3000でサーバーを起動
  app.listen(3000, () => {
    // サーバー起動後に呼び出されるCallback
    console.log('start listening');
  });
}
main();
