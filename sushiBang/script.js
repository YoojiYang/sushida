const RANDOM_SENTENCE_URL_API = "https://api.quotable.io/random";
const typeDisplayElement = document.getElementById("typeDisplay");
const typeInput = document.getElementById("typeInput");
const timer = document.getElementById("timer");

const typeSound = new Audio("./audio/typing-sound.mp3");
const wrongSound = new Audio("./audio/wrong.mp3");
const correctSound = new Audio("./audio/correct.mp3");

// inputテキスト入力、合っているかどうかの判定。
typeInput.addEventListener("input", () => {

  // タイプ音をつける
  typeSound.play();
  typeSound.currentTime = 0;
  
  const sentenceArrey = typeDisplayElement.querySelectorAll("span");
  // console.log(sentenceArrey);
  const arreyValue = typeInput.value.split("");
  // console.log(arreyValue);
  let correct = true;
  sentenceArrey.forEach((characterSpan, index) => {
    if ((arreyValue[index] == null)) {
      characterSpan.classList.remove("correct");
      characterSpan.classList.remove("incorrect");
      correct = false;
    } else if (characterSpan.innerText == arreyValue[index]) {
      characterSpan.classList.add("correct");
      characterSpan.classList.remove("incorrect")
    } else {
      characterSpan.classList.add("incorrect")
      characterSpan.classList.remove("correct")
      
      wrongSound.volume = 0.3;
      wrongSound.play();
      wrongSound.currentTime = 0;
    
      correct = false;
    }
  });

  if(correct == true) {
    RenderNextSentence();
    correctSound.play();
    correctSound.currentTime = 0;
  }

});


// 非同期でランダムな文章を取得する。
function GetRandomSentence() {
  return fetch(RANDOM_SENTENCE_URL_API)
  .then((response) => response.json())
  .then(
    (data) => (data.content));
}

// ランダムな文章を取得して、表示する
async function RenderNextSentence() {
  const sentence = await GetRandomSentence();
  
  // ディスプレイに表示
  typeDisplayElement.innerText = "";
  // 文章を1文字ずつ分解してspanタグを生成する
  let oneText = sentence.split("");

  // console.log(oneText);
  oneText.forEach((character) => {
    const characterSpan = document.createElement("span");
    characterSpan.innerText = character;
    // console.log(characterSpan);
    typeDisplayElement.appendChild(characterSpan);
    // characterSpan.classList.add("correct");
  });
  // テキストボックスの中身を消す
  typeInput.value = "";

  StartTimer();
}


let StartTime;
let originTime = 40;
function StartTimer() {
  timer.innerText = originTime;
  StartTime = new Date();
  // console.log(StartTime);
  setInterval(() => {
    timer.innerText = originTime - getTimerTime();
    if (timer.innerText <= 0) TimeUP();
  }, 1000);
}

function getTimerTime () {
  return Math.floor((new Date() - StartTime) / 1000);
}

function TimeUP() {
  RenderNextSentence();
}

RenderNextSentence();
