import { useState, useEffect } from "react";
import "./List.css";

function List({ getRemaining }) {
  const [list, setList] = useState([]);

  const [doneList, setDoneList] = useState([]);
  const [newTask, setNewTask] = useState("");

  var counter = 0;
  list.filter((item) => {
    return item.completed === false && counter++;
  });

  console.log(counter);

  useEffect(() => {
    getRemaining(counter);
  });

  useEffect(() => {
    async function getRecords() {
      const response = await fetch(`http://localhost:3002/`);

      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        window.alert(message);
        return;
      }

      const records = await response.json();
      setList(records);
    }

    getRecords();

    return;
  }, [list.length]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (newTask.length > 0) {
      const toPost = {
        task: newTask,
        completed: false,
      };
      const response = await fetch("http://localhost:3002/", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(toPost),
      });
    }
    setNewTask("");
  }

  async function handleDelete(val) {
    console.log("Request delete for: " + val);
    const response = await fetch(`http://localhost:3002/${val}`, {
      method: "DELETE",
    });
  }

  async function handleComplete(val) {
    setDoneList([...doneList], val);

    console.log("Requesting status change for: " + JSON.stringify(val));

    const toPatch = {
      task: val.task,
      completed: !val.completed,
    };

    console.log("To patch completed" + toPatch.completed);

    const response = await fetch(`http://localhost:3002/${val._id}`, {
      method: "PATCH",
      body: JSON.stringify(toPatch),
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  const mappedItems = list.map((item) => {
    return (
      <li
        key={list.indexOf(item)}
        className={
          item.completed ? "task-container-completed" : "task-container"
        }
      >
        <div className="checkbox-container">
          <input
            className="checkbox"
            type="checkbox"
            defaultChecked={item.completed}
            onChange={(e) => {
              handleComplete(item);
            }}
          />
        </div>
        <div className="text-container">
          <span className="task-text">{item.task}</span>
        </div>
        <div className="del-btn-container">
          <button
            className="del-btn"
            onClick={() => {
              handleDelete(item._id);
            }}
          >
            X
          </button>
        </div>
      </li>
    );
  });

  return (
    <>
      <form onSubmit={handleSubmit} className="new-task-field">
        <input
          className={"new-task-text"}
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button className={"new-task-button"} type="submit">
          +
        </button>
      </form>
      <div className="all-tasks-container">
        {list.length > 0
          ? mappedItems
          : "Im sure you can find something to do 😉"}
      </div>
    </>
  );
}

export default List;
