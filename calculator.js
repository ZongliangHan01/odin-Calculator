function add(a,b) {
    return a+b;
}

function subtract(a,b) {
    return a-b;
}

function multiply(a,b) {
    return a*b;
}

function divide(a, b) {
    return a/b;
}

function operate(operator, a, b) {
    if (operator=="+") {
        return add(a,b);
    } else if (operator=="-") {
        return subtract(a,b);
    } else if (operator=="×") {
        return multiply(a,b);
    } else if (operator=="÷") {
        return divide(a,b);
    }
}

const screen = document.querySelector(".display");

const inputs = document.querySelectorAll(".input");

let expression=""; 
let result = "";

const resultDis = document.querySelector(".result");


inputs.forEach(input=>{
    input.addEventListener("click", display);
})

function display(e) {
    if (["+", "-", "×", "÷"].includes(e.target.textContent)) {
        expression += (" "+e.target.textContent+" ");
    } else if (["+", "-", "×", "÷"].includes(expression.slice(-1))) {
        expression += (" "+e.target.textContent);
        console.log("add space")
    }   else {
        expression += e.target.textContent;
    }
    
    screen.textContent = expression;
    result = "";
    resultDis.textContent = result;
}

let flag = true;

const equal = document.querySelector(".equal");

equal.addEventListener("click", calculate);


function calculate() {
    result = evaluate(expression);
    resultDis.textContent = result;
}

const clear = document.querySelector(".clear");
clear.addEventListener("click", clearScreen);

function clearScreen() {
    expression = "";
    screen.textContent = "";
    result = "";
    resultDis.textContent = result;
}

const del = document.querySelector(".delete");
del.addEventListener("click", delNum);

function delNum() {
    if (expression.slice(-1)===" ") {
        expression = expression.substring(0, expression.length-1);
    }
    expression = expression.substring(0, expression.length-1);
    //console.log(expression.slice(-1));
    if (expression.slice(-1)===" ") {
        expression = expression.substring(0, expression.length-1);
    } 
    screen.textContent = expression;
    console.log(expression);
    console.log("the last char is "+expression.slice(-1))
}

function evaluate(string) {
    //turn the infix expression to prefix expression
    const preString = prefix(string);
    console.log(preString);
    let digit = [];
    //read digit and operator in stack 
    for (element of preString) {
        if (!isNaN(Number(element))) {
            digit.unshift(Number(element));
            console.log(digit);
        } else {
            let result = operate(element, digit[1], digit[0]);
            digit.shift();
            digit.shift();
            digit.unshift(result);
            console.log(digit);
        }
        
    }
    
    return digit[0];
    //calculate result
}

function prefix(string) {
    let operator = [];
    let out = [];
    const expression = string.split(" ");
    console.log(expression);
    for (char of expression) {
        if (!isNaN(Number(char))) {
            out.push(char);
            console.log("current operator"+operator);
            console.log("current out"+out);
        } else {
            let temp=[""];
            temp = tempList(temp, operator)
            for (ope of temp) {
                //high priority 
                if (checkPriority(ope, char)) {
                    operator.unshift(char);
                    console.log("comparing"+ope+char)
                    console.log("current operator"+operator);
                    console.log("current out"+out);
                    break;
                //low priority
                } else {
                    console.log("comparing"+ope+char)
                    out.push(operator.shift());
                    console.log("current operator"+operator);
                    console.log("current out"+out);
                }
            }
            if (operator.length == 0) {
                operator.push(char);
                console.log("current operator"+operator);
                console.log("current out"+out);
            }
            
        }
    }
    out = out.concat(operator);
    
    //console.log(expression);
    console.log(out);
    return out;
}

function checkPriority(first, second) {
    if (first == "") {
        return true;
    }
    if (["×", "÷"].includes(first) && ["+", "-"].includes(second) ) {
        return false;
    } else if (["+", "-"].includes(first) && ["×", "÷"].includes(second)) {
        return true;
    } 
    return false;
}

function tempList(temp, list) {
    for (let i=0; i<list.length; i++) {
        temp[i]=list[i];
    }
    return temp;
}