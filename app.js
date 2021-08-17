'use strict';

const ERROR_MESSAGE = 'YOU FOOL!!';
const OPERATOR = /[+-/*]/;
const DOT = /[.]/;
const OVERLIMIT = 'OVERLIMIT';

function add(number1, number2) {
    return parseFloat(number1) + parseFloat(number2);
}

function sub(number1, number2) {
    return parseFloat(number1) - parseFloat(number2);
}

function multiply(number1, number2) {
    return parseFloat(number1) * parseFloat(number2);
}

function divide(number1, number2) {
    return parseFloat(number1) / parseFloat(number2);
}

function validateNumber(number) {
    let result;
    let lgString;
    let strNumber;
    if (number == Infinity) {
        result = ERROR_MESSAGE;
    }
    else if (number > 9999999999) {
        result = OVERLIMIT;
    }
    else {
        if (number == Math.floor(number)) {
            result = number.toString();
        }
        else {
            strNumber = number.toString();
            lgString = strNumber.length;
            if (lgString <= 10) {
                result = strNumber;
            }
            else {
                result = strNumber.slice(0, 10);
            }
        }
    }
    return result;
}

function operate(operation) {
    let result;
    switch (operation.operator) {
        case '+':
            result = add(operation.firstOperande, operation.secondOperande);
            break;
        case '-':
            result = sub(operation.firstOperande, operation.secondOperande);
            break;
        case '*':
            result = multiply(operation.firstOperande, operation.secondOperande);
            break;
        case '/':
            result = divide(operation.firstOperande, operation.secondOperande);
            break;
        default:
            result = 0;
            break;
    }
    return validateNumber(result);
}

function testLastCharacter(str, target) {
    let lastCharacter = str.charAt(str.length - 1);
    return target.test(lastCharacter);
}

function resetOperation(operation) {
    operation.firstOperande = '';
    operation.secondOperande = '';
    operation.operator = '';
    operation.fullOperation = '';

}

const loadPage = function (outputElement) {
    window.addEventListener('load', function (e) {
        outputElement.innerHTML = '0';
    }, false);
};

const handleDigit = function (inputElement, outputElement, operation) {
    if (operation.fullOperation != ERROR_MESSAGE && operation.fullOperation != OVERLIMIT) {
        if (outputElement.innerHTML.length < 10) {
            if ((outputElement.innerHTML == '0' || testLastCharacter(operation.fullOperation, OPERATOR))
                && !testLastCharacter(operation.fullOperation, DOT)) {
                outputElement.innerHTML = inputElement.innerHTML;
            }
            else {
                outputElement.innerHTML += inputElement.innerHTML;
            }
            operation.fullOperation += inputElement.innerHTML;
        }

    }
    else {
        resetOperation(operation);
        outputElement.innerHTML = inputElement.innerHTML;
        operation.fullOperation += inputElement.innerHTML;
    }
};

const handleZero = function (inputElement, outputElement, operation) {
    if (operation.fullOperation != ERROR_MESSAGE && operation.fullOperation != OVERLIMIT) {
        if (outputElement.innerHTML.length < 10) {
            if (testLastCharacter(operation.fullOperation, OPERATOR) && !testLastCharacter(operation.fullOperation, DOT)) {
                outputElement.innerHTML = inputElement.innerHTML;
            }
            else if (outputElement.innerHTML != inputElement.innerHTML || !testLastCharacter(operation.fullOperation, OPERATOR)) {
                outputElement.innerHTML += inputElement.innerHTML;
            }
            operation.fullOperation += inputElement.innerHTML;
        }
    }
    else {
        resetOperation(operation);
        outputElement.innerHTML = inputElement.innerHTML;
        operation.fullOperation += inputElement.innerHTML;
    }
};

const handleDot = function (inputElement, outputElement, operation) {
    if (operation.fullOperation != ERROR_MESSAGE && operation.fullOperation != OVERLIMIT) {
        if (!outputElement.innerHTML.includes(inputElement.innerHTML)
            && !testLastCharacter(operation.fullOperation, DOT) && outputElement.innerHTML.length < 9) {
            outputElement.innerHTML += inputElement.innerHTML;
            operation.fullOperation += inputElement.innerHTML;
        }
    }
};

const handleOperator = function (inputElement, outputElement, operation) {
    if (operation.fullOperation != ERROR_MESSAGE && operation.fullOperation != OVERLIMIT) {
        if (!operation.firstOperande) {
            operation.firstOperande = outputElement.innerHTML;
        }
        else {
            if (testLastCharacter(operation.fullOperation, OPERATOR)) {
                operation.fullOperation = operation.fullOperation.slice(0, -1);
            }
            else {
                operation.secondOperande = outputElement.innerHTML;
                operation.firstOperande = operate(operation);
                operation.secondOperande = '';
                outputElement.innerHTML = operation.firstOperande;
            }
        }
        operation.operator = inputElement.innerHTML;
        operation.fullOperation += inputElement.innerHTML;
    }
};

const handleUndo = function (outputElement, operation) {
    if (outputElement.innerHTML != ERROR_MESSAGE && outputElement.innerHTML != OVERLIMIT) {
        if (testLastCharacter(operation.fullOperation, OPERATOR)) {
            operation.fullOperation = operation.fullOperation.slice(0, -1);
        }
        else {
            if (outputElement.innerHTML.length == 1) {
                outputElement.innerHTML = '0';
            }
            else {
                outputElement.innerHTML = outputElement.innerHTML.slice(0, -1);
            }
            operation.fullOperation = operation.fullOperation.slice(0, -1);
        }
    }
    else {
        outputElement.innerHTML = '0';
        resetOperation(operation);
    }

};

const handleClear = function (outputElement, operation) {
    outputElement.innerHTML = '0';
    resetOperation(operation);
};

const handleTotal = function (outputElement, operation) {
    if (operation.firstOperande && operation.operator) {
        operation.secondOperande = outputElement.innerHTML;
        outputElement.innerHTML = operate(operation);
        operation.fullOperation = outputElement.innerHTML;
    }
};

const printDigit = function (inputElement, outputElement, operation) {
    inputElement.forEach(element => element.addEventListener('click', function (e) {
        handleDigit(element, outputElement, operation);
    }, false));

};

const keyboardPrintDigit = function (inputElement, outputElement, operation) {
    window.addEventListener('keydown', function (e) {
        inputElement.forEach(element => {
            if (e.code == element.dataset.code) {
                handleDigit(element, outputElement, operation);
            }
        });
    }, false);
};

const printZero = function (inputElement, outputElement, operation) {
    inputElement.addEventListener('click', function (e) {
        handleZero(inputElement, outputElement, operation);
    }, false);
};

const keyboardPrintZero = function (inputElement, outputElement, operation) {
    window.addEventListener('keydown', function (e) {
        if (e.code == inputElement.dataset.code) {
            handleZero(inputElement, outputElement, operation);
        }
    }, false);
};

const printDot = function (inputElement, outputElement, operation) {
    inputElement.addEventListener('click', function (e) {
        handleDot(inputElement, outputElement, operation);
    }, false);
};

const keyboardPrintDot = function (inputElement, outputElement, operation) {
    window.addEventListener('keydown', function (e) {
        if (e.code == inputElement.dataset.code) {
            handleDot(inputElement, outputElement, operation);
        }
    }, false);
};

const printOperator = function (inputElement, outputElement, operation) {
    inputElement.forEach(element => element.addEventListener('click', function (e) {
        handleOperator(element, outputElement, operation);
    }, false));
};

const keyboardPrintOperator = function (inputElement, outputElement, operation) {
    window.addEventListener('keydown', function (e) {
        inputElement.forEach(element => {
            if (e.code == element.dataset.code) {
                handleOperator(element, outputElement, operation);
            }
        });
    }, false);
};

const undoScreen = function (inputElement, outputElement, operation) {
    inputElement.addEventListener('click', function (e) {
        handleUndo(outputElement, operation);
    }, false);
};

const keyboardUndoScreen = function (inputElement, outputElement, operation) {
    window.addEventListener('keydown', function (e) {
        if (e.code == inputElement.dataset.code) {
            handleUndo(outputElement, operation);
        }
    }, false);
};

const clearScreen = function (inputElement, outputElement, operation) {
    inputElement.addEventListener('click', function (e) {
        handleClear(outputElement, operation);
    }, false);
};

const keyboardClearScreen = function (inputElement, outputElement, operation) {
    window.addEventListener('keydown', function (e) {
        if (e.code == inputElement.dataset.code) {
            handleClear(outputElement, operation);
        }
    }, false);
};

const printTotal = function (inputElement, outputElement, operation) {
    inputElement.addEventListener('click', function (e) {
        handleTotal(outputElement, operation);
    }, false);
};

const keyboardPrintTotal = function (inputElement, outputElement, operation) {
    window.addEventListener('keydown', function (e) {
        if (e.code == inputElement.dataset.code) {
            handleTotal(outputElement, operation);
        }
    }, false);
};

const displayDigit = function (inputElement, outputElement, operation) {
    printDigit(inputElement, outputElement, operation);
    keyboardPrintDigit(inputElement, outputElement, operation);
};

const displayZero = function (inputElement, outputElement, operation) {
    printZero(inputElement, outputElement, operation);
    keyboardPrintZero(inputElement, outputElement, operation);
};

const displayDot = function (inputElement, outputElement, operation) {
    printDot(inputElement, outputElement, operation);
    keyboardPrintDot(inputElement, outputElement, operation);
};

const displayOperator = function (inputElement, outputElement, operation) {
    printOperator(inputElement, outputElement, operation);
    keyboardPrintOperator(inputElement, outputElement, operation);
};

const undoDisplay = function (inputElement, outputElement, operation) {
    undoScreen(inputElement, outputElement, operation);
    keyboardUndoScreen(inputElement, outputElement, operation);
};

const clearDisplay = function (inputElement, outputElement, operation) {
    clearScreen(inputElement, outputElement, operation);
    keyboardClearScreen(inputElement, outputElement, operation);
};

const displayTotal = function (inputElement, outputElement, operation) {
    printTotal(inputElement, outputElement, operation);
    keyboardPrintTotal(inputElement, outputElement, operation);
};

let operation = {
    'firstOperande': '',
    'secondOperande': '',
    'operator': '',
    'fullOperation': ''
};

let btnDigits = document.querySelectorAll('.digit');
let btnZero = document.querySelector('#btnZero');
let btnDot = document.querySelector('#btnDot');
let btnOperators = document.querySelectorAll('.operator');
let btnUndo = document.querySelector('#btnUndo');
let btnClr = document.querySelector('#btnClr');
let btnEql = document.querySelector('#btnEql');
let res = document.querySelector('#res');

loadPage(res);
displayDigit(btnDigits, res, operation);
displayZero(btnZero, res, operation);
displayDot(btnDot, res, operation);
displayOperator(btnOperators, res, operation);
undoDisplay(btnUndo, res, operation);
clearDisplay(btnClr, res, operation);
displayTotal(btnEql, res, operation);