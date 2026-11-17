const express = require("express");
const {
  createLead,
  getLeads,
  updateLead
} = require("../controllers/leadController");
const protect = require("../middleware/auth");

const router = express.Router();

router.post("/", createLead);
router.get("/", protect, getLeads);
router.patch("/:id", protect, updateLead);

module.exports = router;
