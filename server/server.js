const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const healthRoutes = require("./routes/healthRoutes");
const authRoutes = require("./routes/authRoutes");
const carRoutes = require("./routes/carRoutes");
const enquiryRoutes = require("./routes/enquiryRoutes");
const adminRoutes = require("./routes/adminRoutes");
const priceRoutes = require("./routes/priceRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

dotenv.config();

console.log("Server CWD:", process.cwd());

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/cars", carRoutes);
app.use("/api/enquiries", enquiryRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/price", priceRoutes);

// Debug: list registered routes (demo/dev convenience)
app.get("/api/_debug/routes", (_req, res) => {
  const router = app.router || app._router;
  const stack = router?.stack || [];
  const routes = [];

  for (const layer of stack) {
    if (layer?.route?.path) {
      const methods = Object.keys(layer.route.methods || {}).filter((m) => layer.route.methods[m]);
      routes.push({ path: layer.route.path, methods });
    }
  }

  res.json({ ok: true, routes });
});

app.get("/", (_req, res) => {
  res.send("Used Car Marketplace API");
});

// Error handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to start server:", err?.message || err);
    process.exit(1);
  });

