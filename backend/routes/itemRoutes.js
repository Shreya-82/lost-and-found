const express = require("express");
const Item = require("../models/Item");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Add item
router.post("/items", authMiddleware, async (req, res) => {
  try {
    const { itemName, description, type, location, date, contactInfo } = req.body;

    const item = new Item({
      itemName,
      description,
      type,
      location,
      date,
      contactInfo,
      user: req.userId
    });

    await item.save();
    res.status(201).json({ message: "Item added successfully", item });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// View all items
router.get("/items", async (req, res) => {
  try {
    const items = await Item.find().populate("user", "name email");
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Search item by name
router.get("/items/search", async (req, res) => {
  try {
    const { name } = req.query;

    const items = await Item.find({
      itemName: { $regex: name, $options: "i" }
    });

    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// View item by ID
router.get("/items/:id", async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate("user", "name email");

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update item
router.put("/items/:id", authMiddleware, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    if (item.user.toString() !== req.userId) {
      return res.status(403).json({ message: "Unauthorized to update this item" });
    }

    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json({ message: "Item updated successfully", updatedItem });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete item
router.delete("/items/:id", authMiddleware, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    if (item.user.toString() !== req.userId) {
      return res.status(403).json({ message: "Unauthorized to delete this item" });
    }

    await Item.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;