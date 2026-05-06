import { useEffect, useState } from "react";
import API from "../services/api";

export default function Dashboard() {

  const [tasks, setTasks] = useState([]);

  const [form, setForm] = useState({
    title: "",
    inputText: "",
    operation: "uppercase"
  });

  // FETCH TASKS
  const fetchTasks = async () => {

    try {

      const res = await API.get("/tasks");

      setTasks(res.data);

    } catch (error) {

      console.log(error);

    }

  };

  useEffect(() => {

    fetchTasks();

    const interval = setInterval(() => {
      fetchTasks();
    }, 3000);

    return () => clearInterval(interval);

  }, []);

  // HANDLE INPUT CHANGE
  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

  };

  // CREATE TASK
  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      await API.post("/tasks", form);

      fetchTasks();

      setForm({
        title: "",
        inputText: "",
        operation: "uppercase"
      });

    } catch (error) {

      console.log(error);

      alert("Task creation failed");

    }

  };

  return (

    <div style={{ padding: "30px" }}>

      <h1>AI Task Dashboard</h1>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          name="title"
          placeholder="Task Title"
          value={form.title}
          onChange={handleChange}
        />

        <br /><br />

        <textarea
          name="inputText"
          placeholder="Enter text"
          value={form.inputText}
          onChange={handleChange}
        />

        <br /><br />

        <select
          name="operation"
          value={form.operation}
          onChange={handleChange}
        >

          <option value="uppercase">
            Uppercase
          </option>

          <option value="lowercase">
            Lowercase
          </option>

          <option value="reverse">
            Reverse
          </option>

          <option value="wordcount">
            Word Count
          </option>

        </select>

        <br /><br />

        <button type="submit">
          Create Task
        </button>

      </form>

      <hr />

      <h2>Tasks</h2>

      {

        tasks.map((task) => (

          <div
            key={task._id}
            style={{
              border: "1px solid gray",
              padding: "10px",
              marginBottom: "10px"
            }}
          >

            <h3>{task.title}</h3>

            <p>
              <strong>Operation:</strong> {task.operation}
            </p>

            <p>
              <strong>Status:</strong> {task.status}
            </p>

            <p>
              <strong>Result:</strong> {task.result}
            </p>

            <p>
              <strong>Logs:</strong> {task.logs}
            </p>

          </div>

        ))

      }

    </div>

  );

}