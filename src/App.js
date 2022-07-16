import "./main.css";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "./axios";

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState("");
  const [taskAdded, setTaskAdded] = useState(false);
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const request = await axios.get("/api/v1/tasks");
      setTasks(request.data.tasks);
      setLoading(false);
      return request;
    }
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    setTasks(tasks.filter((task) => task._id !== id));
    const request = await axios.delete(`/api/v1/tasks/${id}`);
    return request;
  };

  const handleSubmit = async () => {
    setTaskAdded(true);
    const request = await axios.post("/api/v1/tasks", {
      name: input,
    });
    setTasks([...tasks, request.data.task]);
    setInput("");
    setTimeout(() => {
      setTaskAdded(false);
    }, 3000);
    return request;
  };

  const handleChange = async (task, index) => {
    let updated = [...tasks];
    updated[index].completed = !updated[index].completed;
    console.log(updated);
    setTasks(updated);
    const request = await axios.patch(`/api/v1/tasks/${task._id}`, {
      completed: updated[index].completed,
    });
    return request;
  };

  return (
    <div className="App">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="task-form"
      >
        <h4>task manager</h4>
        <div className="form-control">
          <input
            type="text"
            name="name"
            value={input || ""}
            className="task-input"
            placeholder="e.g. wash dishes"
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" className="btn submit-btn">
            submit
          </button>
        </div>
        <div className={taskAdded ? "text-success form-alert" : "form-alert"}>
          {taskAdded ? "success, task added" : ""}
        </div>
      </form>
      <section className="tasks-container">
        <div className="tasks">
          {loading ? (
            <p className="loading-text">Loading...</p>
          ) : tasks < 1 ? (
            <h5 className="empty-list">No tasks in your list</h5>
          ) : (
            tasks.map((task, index) => (
              <div
                key={task._id}
                className={
                  task.completed ? "task-completed single-task" : "single-task"
                }
              >
                <h5>
                  <span>
                    <i className="far fa-check-circle"></i>
                  </span>
                  {task.name}
                </h5>
                <div className="task-links">
                  <input
                    id={index}
                    type="checkbox"
                    onChange={() => {
                      handleChange(task, index);
                      // setTaskCompleted(!task.completed);
                    }}
                    checked={task.completed || false}
                    name="completed"
                    className="task-edit-completed"
                  />
                  <Link to={`task/${task._id}`} className="edit-link">
                    <i className="fas fa-edit"></i>
                  </Link>
                  <button
                    onClick={() => handleDelete(task._id)}
                    type="button"
                    className="delete-btn"
                    data-id={`${task._id}`}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

export default App;
