const Lead = require("../models/Lead");

const ALLOWED_STATUSES = ["New", "Contacted", "Quoted", "Won", "Lost"];
const ALLOWED_PRODUCTS = ["Gemstones", "Rudraksha", "Puja services"];
const ALLOWED_BUSINESS_TYPES = ["Astrologer", "Retailer"];

async function createLead(req, res) {
  try {
    const { name, phone, city, businessType, productsOfInterest } = req.body;

    if (!name || !phone || !city || !businessType || !Array.isArray(productsOfInterest)) {
      return res.status(400).json({ message: "Please complete all required fields" });
    }

    if (!ALLOWED_BUSINESS_TYPES.includes(businessType)) {
      return res.status(400).json({ message: "Invalid business type" });
    }

    if (
      productsOfInterest.length === 0 ||
      productsOfInterest.some((item) => !ALLOWED_PRODUCTS.includes(item))
    ) {
      return res.status(400).json({ message: "Select valid products of interest" });
    }

    const lead = await Lead.create({
      name,
      phone,
      city,
      businessType,
      productsOfInterest
    });

    return res.status(201).json({
      message: "Enquiry submitted successfully",
      lead
    });
  } catch (error) {
    return res.status(500).json({ message: "Could not submit enquiry" });
  }
}

async function getLeads(req, res) {
  try {
    const { search = "", status = "" } = req.query;
    const filter = {};

    if (status && ALLOWED_STATUSES.includes(status)) {
      filter.status = status;
    }

    if (search.trim()) {
      const safeSearch = search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filter.$or = [
        { name: { $regex: safeSearch, $options: "i" } },
        { phone: { $regex: safeSearch, $options: "i" } }
      ];
    }

    const leads = await Lead.find(filter).sort({ createdAt: -1 });
    return res.json({ leads });
  } catch {
    return res.status(500).json({ message: "Could not fetch leads" });
  }
}

async function updateLead(req, res) {
  try {
    const { status, notes } = req.body;
    const updates = {};

    if (status !== undefined) {
      if (!ALLOWED_STATUSES.includes(status)) {
        return res.status(400).json({ message: "Invalid lead status" });
      }
      updates.status = status;
    }

    if (notes !== undefined) {
      if (typeof notes !== "string") {
        return res.status(400).json({ message: "Notes must be text" });
      }
      updates.notes = notes;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "No valid fields provided" });
    }

    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    return res.json({ message: "Lead updated", lead });
  } catch {
    return res.status(400).json({ message: "Could not update lead" });
  }
}

module.exports = { createLead, getLeads, updateLead };
