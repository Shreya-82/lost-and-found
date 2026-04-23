import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [formData, setFormData] = useState({
    itemName: "",
    description: "",
    type: "Lost",
    location: "",
    date: "",
    contactInfo: ""
  });

  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const API = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await axios.get(`${API}/api/items`);
      setItems(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addItem = async e => {
    e.preventDefault();

    try {
      await axios.post(`${API}/api/items`, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      alert("Item added successfully");
      fetchItems();
    } catch (error) {
      alert(error.response?.data?.message || "Error");
    }
  };

  const deleteItem = async id => {
    try {
      await axios.delete(`${API}/api/items/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      alert("Item deleted successfully");
      fetchItems();
    } catch (error) {
      alert(error.response?.data?.message || "Error");
    }
  };

  const searchItems = async () => {
    try {
      const res = await axios.get(`${API}/api/items/search?name=${search}`);
      setItems(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="container mt-4">
      <h2>Dashboard</h2>

      <h4 className="mt-4">Add Item</h4>
      <form onSubmit={addItem}>
        <input className="form-control my-2" name="itemName" placeholder="Item Name" onChange={handleChange} required />
        <input className="form-control my-2" name="description" placeholder="Description" onChange={handleChange} required />
        <select className="form-control my-2" name="type" onChange={handleChange}>
          <option value="Lost">Lost</option>
          <option value="Found">Found</option>
        </select>
        <input className="form-control my-2" name="location" placeholder="Location" onChange={handleChange} required />
        <input className="form-control my-2" type="date" name="date" onChange={handleChange} required />
        <input className="form-control my-2" name="contactInfo" placeholder="Contact Info" onChange={handleChange} required />
        <button className="btn btn-primary">Add Item</button>
      </form>

      <hr />

      <h4>Search Items</h4>
      <input
        className="form-control my-2"
        placeholder="Search by item name"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <button className="btn btn-info mb-3" onClick={searchItems}>Search</button>

      <h4>All Items</h4>
      {items.map(item => (
        <div key={item._id} className="card p-3 my-2">
          <h5>{item.itemName}</h5>
          <p>{item.description}</p>
          <p><strong>Type:</strong> {item.type}</p>
          <p><strong>Location:</strong> {item.location}</p>
          <p><strong>Contact:</strong> {item.contactInfo}</p>
          <button className="btn btn-danger" onClick={() => deleteItem(item._id)}>
            Delete
          </button>
        </div>
      ))}

      <button className="btn btn-secondary mt-3" onClick={logout}>Logout</button>
    </div>
  );
}

export default Dashboard;