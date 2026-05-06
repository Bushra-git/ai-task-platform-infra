import { useState } from "react";
import API from "../services/api";

export default function Login() {

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const res = await API.post("/auth/login", form);

      // Save token
      localStorage.setItem("token", res.data.token);

      // Redirect to dashboard
      window.location.href = "/dashboard";

    } catch (error) {

      console.log(error);

      alert("Login Failed");

    }

  };

  return (

    <div style={{ padding: "30px" }}>

      <h1>Login</h1>

      <form onSubmit={handleSubmit}>

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
        />

        <br /><br />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
        />

        <br /><br />

        <button type="submit">
          Login
        </button>

      </form>

    </div>

  );

}