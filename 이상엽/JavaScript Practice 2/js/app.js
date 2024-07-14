const classId = document.querySelectorAll("input")[0];
const className = document.querySelectorAll("input")[1];
const submitBtn = document.querySelector("button");
const display = document.querySelectorAll("div")[1];
let data = [];
let count = -1;

submitBtn.addEventListener("click", () => {
  console.log(classId.value);
  data.push({ num: ++count + 1, id: classId.value, name: className.value });

  let newElement = document.createElement("p");
  newElement.innerText = data[count].num + "번째 수업";
  display.insertAdjacentElement("beforeend", newElement);

  newElement = document.createElement("p");
  newElement.innerText = "수업 아이디: " + data[count].id;
  display.insertAdjacentElement("beforeend", newElement);

  newElement = document.createElement("p");
  newElement.innerText = "수업 이름: " + data[count].name;
  display.insertAdjacentElement("beforeend", newElement);

  display.insertAdjacentElement("beforeend", document.createElement("br"));
});
