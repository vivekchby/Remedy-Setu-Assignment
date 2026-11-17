require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

async function startServer() {
  if (!process.env.JWT_SECRET || !process.env.SALES_EMAIL || !process.env.SALES_PASSWORD) {
    throw new Error("JWT_SECRET, SALES_EMAIL and SALES_PASSWORD must be set in server/.env");
  }

  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Server startup failed:", error.message);
  process.exit(1);
});
