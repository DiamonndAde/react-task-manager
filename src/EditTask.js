import React, { useEffect, useState } from "react";
import axios from "./axios";
import { useParams, Link } from "react-router-dom";

const EditTask = () => {
  const [task, setTask] = useState({});
  const [loading, setLoading] = useState(true);
  const [taskName, setTaskName] = useState(task.name);
  const [taskCompleted, setTaskCompleted] = useState(task.completed);
  const [taskEdited, setTaskEdited] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const request = await axios.get(`/api/v1/tasks/${id}`);
      setTask(request.data.task);
      setTaskCompleted(request.data.task.completed);
      setTaskName(request.data.task.name);
      setLoading(false);
      return request;
    }
    fetchData();
  }, [id]);

  const handleSubmit = async () => {
    setTaskEdited(true);
    setLoading(true);
    const request = await axios.patch(`/api/v1/tasks/${id}`, {
      name: taskName,
      completed: taskCompleted,
    });
    setTask(request.data.task);
    setLoading(false);
    setTimeout(() => {
      setTaskEdited(false);
    }, 3000);

    return request;
  };

  return (
    <div className="container">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="single-task-form"
      >
        <h4>Edit Task</h4>
        <div className="form-control">
          <label>Task ID</label>
          <p className="task-edit-id">{task._id}</p>
        </div>
        <div className="form-control">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            className="task-edit-name"
            value={taskName || ""}
            onChange={(e) => setTaskName(e.target.value)}
          />
        </div>
        <div className="form-control">
          <label htmlFor="completed">completed</label>
          <input
            type="checkbox"
            onChange={(e) => setTaskCompleted(e.target.checked)}
            checked={taskCompleted || false}
            name="completed"
            className="task-edit-completed"
          />
        </div>
        <button type="submit" className="block btn task-edit-btn">
          {loading ? "Loading..." : "edit"}
        </button>
        <div className={taskEdited ? "text-success form-alert" : "form-alert"}>
          {taskEdited ? "success, task edited" : ""}
        </div>
      </form>
      <Link to="/" className="btn back-link">
        back to tasks
      </Link>
    </div>
  );
};

export default EditTask;
