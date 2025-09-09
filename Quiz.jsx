import React, { useRef, useState, useEffect } from "react";
import "./Quiz.css";
import { data } from "../../assets/data";

const Quiz = () => {
  const [index, setIndex] = useState(0);
  const [question, setQuestion] = useState(data[0]);
  const [lock, setLock] = useState(false);
  const [score, setScore] = useState(0);
  const [result, setResult] = useState(false);

  // Timer
  const [timeLeft, setTimeLeft] = useState(30);
  const [totalTime, setTotalTime] = useState(0);

  // UI
  const [message, setMessage] = useState("");
  const [selected, setSelected] = useState(null);

  const Option1 = useRef(null);
  const Option2 = useRef(null);
  const Option3 = useRef(null);
  const Option4 = useRef(null);
  const optionRefs = [Option1, Option2, Option3, Option4];

  useEffect(() => {
    if (result) return;
    if (timeLeft === 0) {
      if (!lock) {
        optionRefs[question.ans - 1].current.classList.add("correct");
        setMessage("⏰ Time up!");
        setLock(true);
      }
      return;
    }
    const t = setTimeout(() => {
      setTimeLeft((s) => s - 1);
      setTotalTime((t) => t + 1);
    }, 1000);
    return () => clearTimeout(t);
  }, [timeLeft, result, lock, question.ans]);

  const handleSubmit = () => {
    if (lock || selected === null) return;
    if (question.ans === selected) {
      optionRefs[selected - 1].current.classList.add("correct");
      setScore((p) => p + 1);
      setMessage("✅ Correct!");
    } else {
      optionRefs[selected - 1].current.classList.add("wrong");
      optionRefs[question.ans - 1].current.classList.add("correct");
      setMessage("❌ Incorrect!");
    }
    setLock(true);
  };

  const clearOptionClasses = () => {
    optionRefs.forEach((r) => {
      r.current.classList.remove("wrong");
      r.current.classList.remove("correct");
      r.current.classList.remove("selected");
    });
  };

  const loadQuestion = (newIndex) => {
    setIndex(newIndex);
    setQuestion(data[newIndex]);
    setLock(false);
    setSelected(null);
    setMessage("");
    setTimeLeft(30);
    clearOptionClasses();
  };

  const next = () => {
    if (!lock) return; // must submit or time up first
    if (index === data.length - 1) {
      setResult(true);
      return;
    }
    loadQuestion(index + 1);
  };

  const prev = () => {
    if (index === 0) return;
    loadQuestion(index - 1);
  };

  const reset = () => {
    setScore(0);
    setResult(false);
    setTotalTime(0);
    loadQuestion(0);
  };

  return (
    <div className="container">
      <h1>Quiz App</h1>
      <hr />
      {!result ? (
        <>
          <div className="info">
            <p>
              Time Left:{" "}
              <b className={timeLeft <= 30 ? "red-timer" : ""}>
                {timeLeft}s
              </b>{" "}
              | Total Time Used: <b>{totalTime}s</b>
            </p>
            <p>Progress: {index + 1}/{data.length} | Score: {score}</p>
          </div>

          <h2>{index + 1}. {question.question}</h2>
          <ul>
            <li
              ref={Option1}
              onClick={() => {
                if (!lock) {
                  setSelected(1);
                  Option1.current.classList.add("selected");
                  Option2.current.classList.remove("selected");
                  Option3.current.classList.remove("selected");
                  Option4.current.classList.remove("selected");
                }
              }}
            >
              {question.option1}
            </li>
            <li
              ref={Option2}
              onClick={() => {
                if (!lock) {
                  setSelected(2);
                  Option2.current.classList.add("selected");
                  Option1.current.classList.remove("selected");
                  Option3.current.classList.remove("selected");
                  Option4.current.classList.remove("selected");
                }
              }}
            >
              {question.option2}
            </li>
            <li
              ref={Option3}
              onClick={() => {
                if (!lock) {
                  setSelected(3);
                  Option3.current.classList.add("selected");
                  Option1.current.classList.remove("selected");
                  Option2.current.classList.remove("selected");
                  Option4.current.classList.remove("selected");
                }
              }}
            >
              {question.option3}
            </li>
            <li
              ref={Option4}
              onClick={() => {
                if (!lock) {
                  setSelected(4);
                  Option4.current.classList.add("selected");
                  Option1.current.classList.remove("selected");
                  Option2.current.classList.remove("selected");
                  Option3.current.classList.remove("selected");
                }
              }}
            >
              {question.option4}
            </li>
          </ul>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 8,
              marginTop: 12,
            }}
          >
            <button onClick={prev} disabled={index === 0}>
              ⟵ Prev
            </button>
            <button onClick={handleSubmit} disabled={lock || selected === null}>
              Submit
            </button>
            <button onClick={next} disabled={!lock}>
              {index === data.length - 1 ? "Finish ➜" : "Next ➜"}
            </button>
          </div>

          <p
            className={`message ${
              message.startsWith("✅") ? "green" : message ? "red" : ""
            }`}
            style={{ minHeight: 24 }}
          >
            {message}
          </p>
        </>
      ) : (
        <>
          <h2>
            🎉 You Scored {score} out of {data.length}
          </h2>
          <p>Total Time Taken: {totalTime} seconds</p>
          <button onClick={reset}>Reset</button>
        </>
      )}
    </div>
  );
};

export default Quiz;
