import React, { useState, useEffect } from "react";

function Calculator() {
  const [display, setDisplay] = useState("0");
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem("calculatorHistory");
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error("خطا در خواندن تاریخچه:", error);
      return [];
    }
  });
  const [decimalPlaces, setDecimalPlaces] = useState(2);
  const [darkMode, setDarkMode] = useState(true);

  const toggleTheme = () => setDarkMode(!darkMode);

  useEffect(() => {
    localStorage.setItem("calculatorHistory", JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (/[0-9+\-*/.]/.test(e.key)) {
        handleClick(e.key);
      } else if (e.key === "Enter") {
        handleEqual();
      } else if (e.key === "Escape") {
        handleClear();
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [display, history]);

  const handleClick = (value) => {
    if (display === "0" && value === "0") return;
    if (display === "0" && (value === "*" || value === "/")) return;

    if (value === "." && display.endsWith(".")) return;

    const parts = display.split(/[\+\-\*\/]/);
    const lastPart = parts[parts.length - 1];
    if (value === "." && lastPart.includes(".")) return;

    const operators = ["+", "-", "*", "/"];
    const lastChar = display[display.length - 1];

    if (operators.includes(value) && operators.includes(lastChar)) return;

    if (display === "0" && value !== ".") {
      setDisplay(value);
    } else {
      setDisplay(display + value);
    }
  };

  const handleClear = () => {
    setDisplay("0");
  };

  const handleEqual = () => {
    if (display === "") return;
    if (["+", "-", "*", "/"].includes(display[display.length - 1])) return;
    try {
      const result = eval(display);
      const roundedResult = parseFloat(result).toFixed(decimalPlaces);
      setHistory([...history, `${display} = ${roundedResult}`]);
      setDisplay(roundedResult.toString());
    } catch (error) {
      setDisplay("خطا");
    }
  };

  return (
    <>
      <div className={`calculator-container ${darkMode ? "dark" : "light"}`}>
        <div className="flex justify-between w-full">
          <button onClick={toggleTheme} style={{ marginBottom: "1rem" }}>
            تغییر تم
          </button>
          <button onClick={() => setHistory([])} style={{ marginBottom: "1rem" }}>
          پاک کردن تاریخچه
        </button>
        </div>
        <div className="text-start" dir="rtl" style={{ marginBottom: "1rem" }}>
          <label htmlFor="decimals">تعداد اعشار: </label>
          <select
            id="decimals"
            value={decimalPlaces}
            onChange={(e) => setDecimalPlaces(parseInt(e.target.value))}
          >
            <option value="0">0</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>
        </div>
        <div className="calculator">
          <div className="display">{display}</div>
          <div className="buttons">
            <button onClick={() => handleClick("7")}>7</button>
            <button onClick={() => handleClick("8")}>8</button>
            <button onClick={() => handleClick("9")}>9</button>
            <button onClick={() => handleClick("/")}>/</button>

            <button onClick={() => handleClick("4")}>4</button>
            <button onClick={() => handleClick("5")}>5</button>
            <button onClick={() => handleClick("6")}>6</button>
            <button onClick={() => handleClick("*")}>*</button>

            <button onClick={() => handleClick("1")}>1</button>
            <button onClick={() => handleClick("2")}>2</button>
            <button onClick={() => handleClick("3")}>3</button>
            <button onClick={() => handleClick("-")}>-</button>

            <button onClick={() => handleClick("0")}>0</button>
            <button onClick={() => handleClick(".")}>.</button>
            <button onClick={handleEqual}>=</button>
            <button onClick={() => handleClick("+")}>+</button>

            <button onClick={handleClear}>AC</button>
          </div>
        </div>

        <div className="history">
          <h3>تاریخچه</h3>
          {history.length > 0 ? (
            <ul>
            {history.map((history, index) => (
              <li key={index}>{history}</li>
            ))}
          </ul>
          ) : 
          (
            <></>
          )
        }
          
        </div>
      </div>
    </>
  );
}

export default Calculator;
