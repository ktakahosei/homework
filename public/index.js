// public/index.js // クライアントサイド

//ページが完全に読み込まれた後に実行される関数
window.addEventListener('DOMContentLoaded', (event) => {
  //クラス名が'correct'であるすべての要素を出力
  document.querySelectorAll('.correct').forEach((elem) => {
    elem.addEventListener('click', (event) => {
      alert(event.target.innerHTML);
    });
  });
  //クラス名がsend-buttonの要素を選択
  document.querySelector('.send-button').addEventListener('click', async(event) => {
    //クラス名が'input-text'の入力フィールドの値を取得
    const text = document.querySelector('.input-text').value;
    //POSTリクエストを送信
    fetch('/api/test', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: text }) });
    /*
    const response = fetch('/api/check-answer', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ answer: text }) });
    const result = await response.text();
    alert(result);
    */
  });
});
  