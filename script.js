// ========================
// TAB SWITCHING
// ========================
const menuBtns = document.querySelectorAll(".menu-btn");
const tabs = document.querySelectorAll(".tab");

menuBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelector(".menu-btn.active")?.classList.remove("active");
    btn.classList.add("active");

    document.querySelector(".tab.active")?.classList.remove("active");
    document.getElementById(btn.dataset.tab).classList.add("active");
  });
});


// ========================
// CALCULATOR
// ========================
const display = document.getElementById("display");
const btnContainer = document.getElementById("buttons");

let memory = 0;
let degMode = true;

const calcButtons = [
  "7","8","9","/","sin","cos",
  "4","5","6","*","tan","log",
  "1","2","3","-","√","x²",
  "0",".","=","+","(",")",
  "AC","DEL","π","e"
];

// GENERATE BUTTONS
calcButtons.forEach(txt => {
  const b = document.createElement("button");
  b.textContent = txt;
  b.className = "btn";
  b.addEventListener("click", () => handleButton(txt));
  btnContainer.appendChild(b);
});


// ========================
// BUTTON LOGIC
// ========================
function handleButton(val) {

  if (val === "AC") {
    display.value = "";
    return;
  }

  if (val === "DEL") {
    display.value = display.value.slice(0, -1);
    return;
  }

  if (val === "=") {
    try {
      let expr = display.value
        .replace(/sin/g, "Math.sin")
        .replace(/cos/g, "Math.cos")
        .replace(/tan/g, "Math.tan")
        .replace(/log/g, "Math.log10")
        .replace(/√/g, "Math.sqrt")
        .replace(/x²/g, "**2")
        .replace(/π/g, "Math.PI")
        .replace(/e/g, "Math.E");

      if (degMode) {
        expr = expr.replace(/Math.sin\(/g, "Math.sin((Math.PI/180)*");
        expr = expr.replace(/Math.cos\(/g, "Math.cos((Math.PI/180)*");
        expr = expr.replace(/Math.tan\(/g, "Math.tan((Math.PI/180)*");
      }

      display.value = eval(expr);
    } catch {
      display.value = "Error";
    }
    return;
  }

  display.value += val;
}


// ========================
// MEMORY BUTTONS
// ========================
document.getElementById("mc").onclick = () => (memory = 0);
document.getElementById("mr").onclick = () => (display.value += memory);
document.getElementById("mplus").onclick = () => (memory += Number(display.value || 0));
document.getElementById("mminus").onclick = () => (memory -= Number(display.value || 0));


// ========================
// DEG/RAD TOGGLE
// ========================
document.getElementById("degRad").onclick = () => {
  degMode = !degMode;
  document.getElementById("degRad").textContent = degMode ? "DEG" : "RAD";
};
