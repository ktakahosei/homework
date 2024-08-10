// public/index.js // クライアントサイド

//イベントリスナー
//ページが完全に読み込まれた後に実行される関数を指定
window.addEventListener('DOMContentLoaded', (event) => {
  //クラス名が'user-name'であるすべての要素を選択
  //forEachメソッドで、各要素に対してクリックイベントリスナーを追加
  document.querySelectorAll('.correct').forEach((elem) => {
    //クリックイベントが発生すると、event.target.innerHTML（クリックされた要素の内部HTML）を取得し、alertでその内容を表示します
    elem.addEventListener('click', (event) => {
      alert(event.target.innerHTML);
    });
  });
  //クラス名がsend-buttonの要素を選択
  //クリックイベントリスナーが追加されているため、クリックされたときの処理を行う
  document.querySelector('.send-button').addEventListener('click', async(event) => {
    //クラス名が'input-text'の入力フィールドの値を取得
    const text = document.querySelector('.input-text').value;
    //fetch関数を使って、/api/userエンドポイントに対してPOSTリクエストを送信します。リクエストの設定として、Content-Typeをapplication/jsonに設定し、リクエストボディとして{ name: text }というJSONデータを送ります。このデータは、入力フィールドから取得したユーザー名です
    fetch('/api/test', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: text }) });
    /*
    const response = fetch('/api/check-answer', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ answer: text }) });
    const result = await response.text();
    alert(result);
    */
  });
});
  