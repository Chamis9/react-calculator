import { useState } from "react";
import Display from "./Display";
import Buttons from "./Buttons";
import "./styles/Calculator.css";
import { evaluate, round } from "mathjs";

// Calculator component
function Calculator() {
  // State to store the current input and the calculated answer
  const [input, setInput] = useState("");
  const [answer, setAnswer] = useState("");

  // Handler for button inputs
  const inputHandler = (event) => {
    if (answer === "Invalid Input!!") return;
    let val = event.target.innerText;

    // Replace specific button values with corresponding operators
    if (val === "x2") val = "^2";
    else if (val === "x3") val = "^3";

    let str = input + val;
    if (str.length > 14) return;

    // If there's an answer, start a new input sequence
    if (answer !== "") {
      setInput(answer + val);
      setAnswer("");
    } else setInput(str);
  };

  // Clear the input and answer
  const clearInput = () => {
    setInput("");
    setAnswer("");
  };

  // Check if the brackets in the expression are balanced
  const checkBracketBalanced = (expr) => {
    let stack = [];
    for (let i = 0; i < expr.length; i++) {
      let x = expr[i];
      if (x === "(") {
        stack.push(x);
        continue;
      }

      if (x === ")") {
        if (stack.length === 0) return false;
        else stack.pop();
      }
    }
    return stack.length === 0;
  };

  // Calculate the answer based on the input
  const calculateAns = () => {
    if (input === "") return;
    let result = 0;
    let finalexpression = input;
    finalexpression = finalexpression.replaceAll("x", "*");
    finalexpression = finalexpression.replaceAll("÷", "/");

    // Handle square root expressions
    let noSqrt = input.match(/√\d+|√\([^)]*\)/gi);

    if (noSqrt !== null) {
      let evalSqrt = input;
      for (let i = 0; i < noSqrt.length; i++) {
        evalSqrt = evalSqrt.replace(
          noSqrt[i],
          `sqrt(${noSqrt[i].substring(1)})`
        );
      }
      finalexpression = evalSqrt;
    }

    try {
      // Check for balanced brackets before evaluating
      if (!checkBracketBalanced(finalexpression)) {
        const errorMessage = { message: "Brackets are not balanced!" };
        throw errorMessage;
      }

      // Check for division by zero
      if (finalexpression.includes("/0")) {
        const errorMessage = { message: "Cannot divide by zero!" };
        throw errorMessage;
      }

      result = evaluate(finalexpression);
    } catch (error) {
      result =
        error.message === "Brackets are not balanced!"
          ? "Brackets are not balanced!"
          : error.message === "Cannot divide by zero!"
          ? "Infinity"
          : "Invalid Input!!";
    }
    isNaN(result) ? setAnswer(result) : setAnswer(round(result, 3));
  };

  // Remove the last character from the input
  const backspace = () => {
    if (answer !== "") {
      setInput(answer.toString().slice(0, -1));
      setAnswer("");
    } else setInput((prev) => prev.slice(0, -1));
  };

  // Render the calculator display and buttons
  return (
    <>
      <div className="container">
        <div className="main">
          <Display input={input} setInput={setInput} answer={answer} />
          <Buttons
            inputHandler={inputHandler}
            clearInput={clearInput}
            backspace={backspace}
            calculateAns={calculateAns}
          />
        </div>
      </div>
    </>
  );
}

export default Calculator;
