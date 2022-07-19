import React from "react";
import './Calculator.css';

const calculator = {
    displayValue: '0',
    firstOperand: null,
    waitingForSecondOperand: false,
    operator: null,
};

class Calculator extends React.Component {

    componentDidMount() {

        this.updateDisplay();
        const keys = document.querySelector('.calculator-keys');
        keys.addEventListener('click', event => {
            const { target } = event;
            const { value } = target;
            if (!target.matches('button')) {
                return;
            }

            switch (value) {
                case '+':
                case '-':
                case '*':
                case '/':
                case '=':
                    this.handleOperator(value);
                    break;
                case '.':
                    this.inputDecimal(value);
                    break;
                case 'all-clear':
                    this.resetCalculator();
                    break;
                default:
                    if (Number.isInteger(parseFloat(value))) {
                        this.inputDigit(value);
                    }
            }

            this.updateDisplay();
        });
    }

    inputDigit(digit) {
        const { displayValue, waitingForSecondOperand } = calculator;

        if (waitingForSecondOperand === true) {
            calculator.displayValue = digit;
            calculator.waitingForSecondOperand = false;
        } else {
            calculator.displayValue = displayValue === '0' ? digit : displayValue + digit;
        }
    }

    inputDecimal(dot) {
        if (calculator.waitingForSecondOperand === true) {
            calculator.displayValue = "0."
            calculator.waitingForSecondOperand = false;
            return
        }

        if (!calculator.displayValue.includes(dot)) {
            calculator.displayValue += dot;
        }
    }

    handleOperator(nextOperator) {
        const { firstOperand, displayValue, operator } = calculator
        const inputValue = parseFloat(displayValue);

        if (operator && calculator.waitingForSecondOperand)  {
            calculator.operator = nextOperator;
            return;
        }


        if (firstOperand == null && !isNaN(inputValue)) {
            calculator.firstOperand = inputValue;
        } else if (operator) {
            const result = this.calculate(firstOperand, inputValue, operator);

            calculator.displayValue = `${parseFloat(result.toFixed(7))}`;
            calculator.firstOperand = result;
        }

        calculator.waitingForSecondOperand = true;
        calculator.operator = nextOperator;
    }

    calculate(firstOperand, secondOperand, operator) {
        if (operator === '+') {
            return firstOperand + secondOperand;
        } else if (operator === '-') {
            return firstOperand - secondOperand;
        } else if (operator === '*') {
            return firstOperand * secondOperand;
        } else if (operator === '/') {
            return firstOperand / secondOperand;
        }

        return secondOperand;
    }

    resetCalculator() {
        calculator.displayValue = '0';
        calculator.firstOperand = null;
        calculator.waitingForSecondOperand = false;
        calculator.operator = null;
    }

    updateDisplay() {
        const display = document.querySelector('.calculator-screen');
        display.value = calculator.displayValue;
    }

    render() {
        return (
            <div className="calculator">

                <input type="text" className="calculator-screen" value="" disabled/>

                <div className="calculator-keys">

                    <button type="button" className="operator" value="+">+</button>
                    <button type="button" className="operator" value="-">-</button>
                    <button type="button" className="operator" value="*">&times;</button>
                    <button type="button" className="operator" value="/">&divide;</button>

                    <button type="button" value="7">7</button>
                    <button type="button" value="8">8</button>
                    <button type="button" value="9">9</button>


                    <button type="button" value="4">4</button>
                    <button type="button" value="5">5</button>
                    <button type="button" value="6">6</button>


                    <button type="button" value="1">1</button>
                    <button type="button" value="2">2</button>
                    <button type="button" value="3">3</button>


                    <button type="button" value="0">0</button>
                    <button type="button" className="decimal" value=".">.</button>
                    <button type="button" className="all-clear" value="all-clear">AC</button>

                    <button type="button" className="equal-sign operator" value="=">=</button>

                </div>
            </div>
        );
    }
}

export default Calculator;