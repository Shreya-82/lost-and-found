import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
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
      await axios.post(`${API}/api/register`, formData);
      alert("Registration successful");
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Error");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Student Registration</h2>
      <form onSubmit={handleSubmit}>
        <input className="form-control my-2" type="text" name="name" placeholder="Name" onChange={handleChange} required />
        <input className="form-control my-2" type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input className="form-control my-2" type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <button className="btn btn-primary">Register</button>
      </form>
      <p className="mt-3">Already registered? <Link to="/login">Login</Link></p>
    </div>
  );
}

export default Register;