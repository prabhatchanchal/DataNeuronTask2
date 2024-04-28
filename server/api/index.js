const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const morgan = require("morgan");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const { incrementCounter, getCounter } = require("./utils");
const User = require("../models/users.model");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Swagger documentation
// Swagger options
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Task 2",
      version: "1.0.0",
      description: "API documentation for Task 1",
    },
  },
  apis: ["./index.js"],
};

// Initialize Swagger
const swaggerDocs = swaggerJsDoc(swaggerOptions);

// Serve Swagger UI
app.use("https://dataneurontask2-34yr.onrender.com/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Define API routes

/**
 * @swagger
 * /api:
 *   get:
 *     summary: Get list of users.
 *     description: Returns a list of users.
 *     responses:
 *       200:
 *         description: A JSON array of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     type: string
 */
app.get("https://dataneurontask2-34yr.onrender.com/api", (req, res) => {
  res.json({ users: ["user1", "user2", "user3"] });
});

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users.
 *     description: Retrieves a list of all users from the database.
 *     responses:
 *       200:
 *         description: A list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Internal server error.
 */
app.get("https://dataneurontask2-34yr.onrender.com/api/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Error fetching users" });
  }
});

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update a user by ID.
 *     description: Updates the data of a user specified by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to update.
 *         schema:
 *           type: string
 *       - in: body
 *         name: user
 *         description: User object with updated data.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             data:
 *               type: string
 *     responses:
 *       200:
 *         description: User updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */
app.put("https://dataneurontask2-34yr.onrender.com/api/users/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { data: req.body.data },
      { new: true }
    );
    incrementCounter("update");
    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Error updating user" });
  }
});

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Add a new user.
 *     description: Adds a new user to the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request. Invalid user data.
 *       500:
 *         description: Internal server error.
 */
app.post("https://dataneurontask2-34yr.onrender.com/api/users", async (req, res) => {
  try {
    const newUser = new User(req.body);
    const savedUser = await newUser.save();
    incrementCounter("add");
    res.status(201).json(savedUser);
  } catch (error) {
    console.error("Error adding user:", error);
    if (error.name === "ValidationError") {
      res.status(400).json({ error: "Invalid user data" });
    } else {
      res.status(500).json({ error: "Error adding user" });
    }
  }
});

/**
 * @swagger
 * /api/count:
 *   get:
 *     summary: Get count of add and count operations.
 *     description: Returns the count of add and count operations.
 *     responses:
 *       200:
 *         description: The count object containing add and count.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 add:
 *                   type: number
 *                   description: The count of add operations.
 *                update:
 *                  type: number
 *                 description: The count of update operations.
 */
app.get("https://dataneurontask2-34yr.onrender.com/api/count", async (req, res) => {
  const counter = await getCounter();
  res.json(counter);
});

/**
 * @swagger
 * /api/count/add:
 *   post:
 *     summary: Increment the add counter.
 *     description: Increments the add counter and returns a success message.
 *     responses:
 *       200:
 *         description: A success message.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: The success message.
 */
app.post("https://dataneurontask2-34yr.onrender.com/api/count/add", async (req, res) => {
  await incrementCounter("add");
  res.json({ message: "Counter incremented" });
});

/**
 * @swagger
 * /api/count/update:
 *   post:
 *     summary: Increment the update counter.
 *     description: Increments the update counter and returns a success message.
 *     responses:
 *       200:
 *         description: A success message.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: The success message.
 */
app.post("https://dataneurontask2-34yr.onrender.com/api/count/update", async (req, res) => {
  await incrementCounter("update");
  res.json({ message: "Counter incremented" });
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(
    "mongodb+srv://PrabhatKumar:prabhat55@cluster0.duuuqor.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });
