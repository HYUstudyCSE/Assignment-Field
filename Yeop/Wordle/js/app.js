const display = document.querySelectorAll("div ul li");
const ans = "apple";
let colCnt = 0;
let rowCnt = 0;
let isFin = 0;

window.addEventListener("keydown", (e) => {
  if (isFin) return;
  if (colCnt < 5 && /^[a-zA-Z]$/.test(e.key))
    display[rowCnt * 5 + colCnt++].textContent = e.key;
  else if (e.key === "Enter") {
    check();
    colCnt = 0;
    rowCnt++;
  } else if (e.key === "Backspace" && colCnt != 0) {
    display[rowCnt * 5 + --colCnt].textContent = "";
  }
});

function check() {
  let corCnt = 0;
  for (let i = 0; i < 5; i++) {
    let target = display[rowCnt * 5 + i];
    if (target.textContent == ans[i]) {
      target.setAttribute("style", "background-color:green");
      corCnt++;
      if (corCnt == 5) {
        isFin = true;
        alert("Congratulation!");
      }
    } else {
      for (let j = 0; j < 5; j++) {
        if (target.textContent == ans[j]) {
          target.setAttribute("style", "background-color:yellow");
          break;
        }
      }
    }
  }
}
