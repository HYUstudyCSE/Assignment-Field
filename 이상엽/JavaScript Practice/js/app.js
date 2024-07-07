function printText(src, display) {
  const text = document.getElementById(src).value;

  if (text !== "") document.getElementById(display).innerText = text;
  else document.getElementById(display).innerText = " ";
}
