let memory = 0;
let angleMode = "DEG";
let ans = "";

const display = document.getElementById("display");
const buttons = document.querySelectorAll("#buttons button");

function trig(x, fn) {
    if (angleMode === "DEG") x = x * Math.PI / 180;
    return fn(x);
}

buttons.forEach(btn => {
    btn.addEventListener("click", () => {
        let key = btn.textContent;

        switch (key) {
            case "AC":
                display.value = "";
                break;

            case "DEL":
                display.value = display.value.slice(0, -1);
                break;

            case "=":
                calculate();
                break;

            case "MC":
                memory = 0;
                break;

            case "MR":
                display.value += memory;
                break;

            case "M+":
                try { memory += Number(eval(display.value)); } catch {}
                break;

            case "M-":
                try { memory -= Number(eval(display.value)); } catch {}
                break;

            case "sin":
                display.value += "sin(";
                break;

            case "cos":
                display.value += "cos(";
                break;

            case "tan":
                display.value += "tan(";
                break;

            case "log":
                display.value += "log(";
                break;

            case "ln":
                display.value += "ln(";
                break;

            case "√":
                display.value += "sqrt(";
                break;

            case "x²":
                display.value += "**2";
                break;

            case "x³":
                display.value += "**3";
                break;

            case "xʸ":
                display.value += "**";
                break;

            case "EXP":
                display.value += "e";
                break;

            case "π":
                display.value += "Math.PI";
                break;

            case "e":
                display.value += "Math.E";
                break;

            case "Ans":
                display.value += ans;
                break;

            default:
                display.value += key;
        }
    });
});

function calculate() {
    let expr = display.value;

    try {
        expr = expr
            .replace(/sin\(/g, "trig(")
            .replace(/cos\(/g, "trigC(")
            .replace(/tan\(/g, "trigT(")
            .replace(/log\(/g, "Math.log10(")
            .replace(/ln\(/g, "Math.log(")
            .replace(/sqrt\(/g, "Math.sqrt(");

        window.trig = (x) => trig(x, Math.sin);
        window.trigC = (x) => trig(x, Math.cos);
        window.trigT = (x) => trig(x, Math.tan);

        const result = eval(expr);
        ans = result;
        display.value = result;

    } catch {
        display.value = "Error";
    }
}

document.getElementById("degRadBtn").addEventListener("click", () => {
    angleMode = angleMode === "DEG" ? "RAD" : "DEG";
    document.getElementById("degRadBtn").textContent = angleMode;
});
