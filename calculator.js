const screen = document.querySelector(".display");
const inputs = document.querySelectorAll(".input");
const resultDis = document.querySelector(".result");
const equal = document.querySelector(".equal");
const clear = document.querySelector(".clear");
const del = document.querySelector(".delete");
const point = document.querySelector(".point");

let expression=""; 
let result = "";
let flag = true;

inputs.forEach(input=>{
    input.addEventListener("click", display);
})
point.addEventListener("click", addPoint);
equal.addEventListener("click", calculate);
clear.addEventListener("click", clearScreen);
del.addEventListener("click", delNum);

document.addEventListener("keydown", keyboardInput);

//keyboard input into calculator
function keyboardInput(e){
    console.log(e.key)
    if (["+", "-"].includes(e.key)) {
        expression += (" "+e.key+" ");
        flag = true;
    //keyboard input *
    } else if (e.key == "*"){
        expression += (" × ");
    //keyboard input /
    } else if (e.key == "/"){
        expression += (" ÷ ")
    } else if (e.key == "." && flag == true) {
        expression += e.key;
        flag = false;
    //delete one character 
    } else if (e.key == "Backspace"){
        delNum();
    } else if (e.key == "c") {
        clearScreen();
    //input an digit
    }   else if (["1", "2", "3", "4", "5", "6", "7", "8", "9", "9", "0"].includes(e.key)) {
        expression += e.key;
    //if expression end with digit and input an operator add space in front and behind of it.
    } else if (["+", "-", "×", "÷"].includes(expression.slice(-1))) {
        expression += (" "+e.key);
    }
    
    //display new input and reset the result. 
    screen.textContent = expression;
    result = "";
    resultDis.textContent = result;

    if (e.key == "=" || e.key == "Enter") {
        calculate();
    }  
}

//check if point has been added
function addPoint(e) {
    if (flag) {
        expression+=e.target.textContent;
        screen.textContent = expression;
        flag = false;
    }
}

//display input expression on screen
function display(e) {
    //if expression end with operator, add a space behind operator
    if (["+", "-", "×", "÷"].includes(e.target.textContent)) {
        expression += (" "+e.target.textContent+" ");
        flag = true;
    //if expression end with digit and input an operator add space in front and behind of it.     
    } else if (["+", "-", "×", "÷"].includes(expression.slice(-1))) {
        expression += (" "+e.target.textContent);
    //input an digit
    }   else {
        expression += e.target.textContent;
    }
    
    //display new input and reset the result. 
    screen.textContent = expression;
    result = "";
    resultDis.textContent = result;
}


//calculate result
function calculate() {
    result = evaluate(expression);
    resultDis.textContent = result;
}


//clear all input and result. 
function clearScreen() {
    expression = "";
    screen.textContent = "";
    result = "";
    resultDis.textContent = result;
}


//delete a single input
function delNum() {
    //if expression end with a space, delete it straight away. 
    if (expression.slice(-1)===" ") {
        expression = expression.substring(0, expression.length-1);
    }
    //delete the digit or operator. 
    expression = expression.substring(0, expression.length-1);
    
    //if there is a space after delete the char, delete it straight away. 
    if (expression.slice(-1)===" ") {
        expression = expression.substring(0, expression.length-1);
    } 
    
    //update input and result display
    screen.textContent = expression;
    result = "";
    resultDis.textContent = result;
}


//calculate based on operator
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

//evaluate expression in correct math order.
function evaluate(string) {
    //turn the infix expression to prefix expression
    const preString = prefix(string);
    
    //read digit in stack and calculate based on operator 
    let digit = [];
    for (element of preString) {
        
        if (!isNaN(Number(element))) {
            //add digit in stack
            digit.unshift(Number(element));
        
        } else {
            //calculate result of current operator and put result into stack after delete previous two digit
            let result = operate(element, digit[1], digit[0]);
            digit.shift();
            digit.shift();
            digit.unshift(result);
        }   
    }
    return digit[0].toFixed(3);
}


//turn the expression to prefix order
function prefix(string) {
    let operator = [];
    let out = [];
    const expression = string.split(" ");

    for (char of expression) {
        if (!isNaN(Number(char))) {
            //put number into output 
            out.push(char);
        } else {
            //put operator into output
            let temp=[""];
            temp = tempList(temp, operator)
            for (ope of temp) {
                //high priority, add to the left of operator list 
                if (checkPriority(ope, char)) {
                    operator.unshift(char);
                    break;
                //low priority, move the high priority operator into output list
                } else {
                    out.push(operator.shift());
                }
            }
            //no operator in the list, put the current one in list
            if (operator.length == 0) {
                operator.push(char);
            }           
        }
    }
    //append the rest of operator into output
    out = out.concat(operator);
    return out;
}


//check the priority of two operators
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


//copy the list
function tempList(temp, list) {
    for (let i=0; i<list.length; i++) {
        temp[i]=list[i];
    }
    return temp;
}