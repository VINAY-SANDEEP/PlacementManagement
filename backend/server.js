require("dotenv").config();

const express = require("express");
const cors = require("cors");
const newsRoutes = require("./routes/newsRoutes");
const connectDB = require("./config/db");
const notesRoutes = require("./routes/notesRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const placementRoutes = require("./routes/placementRoutes");
const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use("/api/notes", notesRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/placements", placementRoutes);
app.use("/api/news", newsRoutes);
app.get("/", (req, res) => {
    res.send("Campus Placement API Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server Running on Port ${PORT}`);
});