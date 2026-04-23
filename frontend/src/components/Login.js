import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const navigate = useNavigate();
  const API = process.env.REACT_APP_API_URL;

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      const res = await axios.post(`${API}/api/login`, formData);
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Student Login</h2>
      <form onSubmit={handleSubmit}>
        <input className="form-control my-2" type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input className="form-control my-2" type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <button className="btn btn-success">Login</button>
      </form>
      <p className="mt-3">New student? <Link to="/">Register</Link></p>
    </div>
  );
}

export default Login;