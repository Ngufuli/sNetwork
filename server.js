const express = require("express");
const mongoose = require("mongoose");

const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const posts = require("./routes/api/posts");

const app = express();
//DB Configuration
const db = require("./config/keys").mongoURI;
//Connecting to MongoDB
mongoose
  .connect(db)
  .then(() => console.log(`Database connected successfully`))
  .catch(err => console.log(err));

// app.use("/", (req, res) => res.send("Hello world"));

//Use routes
app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);

const port = process.env.PORT || 4321;

app.listen(port, () => console.log(`Server running on port ${port}`));
