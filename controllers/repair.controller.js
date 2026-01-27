import repairModel from "../model/repair.model.js";

// ================= CREATE REPAIR =================
export const createRepair = async (req, res) => {
  try {
    const {
      user_name,
      email,
      mobile,
      product_type,
      describation,
    } = req.body;

    // 🔍 Basic validation
    if (!user_name || !email || !mobile || !product_type) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be filled",
      });
    }

    // 🚫 Check existing repair request (email OR mobile)
    const existingRepair = await repairModel.findOne({
      $or: [{ email }, { mobile }],
    });

    if (existingRepair) {
      return res.status(409).json({
        success: false,
        message: "Repair request already exists with this email or mobile",
      });
    }

    // ✅ Create repair request
    const repair = await repairModel.create({
      user_name,
      email,
      mobile,
      product_type,
      describation,
    });

    res.status(201).json({
      success: true,
      message: "Repair request submitted successfully",
      data: repair,
    });
  } catch (error) {
    console.error("Repair Create Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while creating repair request",
    });
  }
};


/* =====================================================
   GET ALL REPAIR REQUESTS
   GET /api/repair/all
   ===================================================== */
export const getAllRepairs = async (req, res) => {
  try {
    const repairs = await repairModel
      .find()
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Repair requests fetched successfully",
      count: repairs.length,
      data: repairs,
    });
  } catch (error) {
    console.error("getAllRepairs Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch repair requests",
    });
  }
};

/* =====================================================
   GET SINGLE REPAIR BY ID
   GET /api/repair/:id
   ===================================================== */
export const getRepairById = async (req, res) => {
  try {
    const { id } = req.params;

    const repair = await repairModel.findById(id);

    if (!repair) {
      return res.status(404).json({
        success: false,
        message: "Repair request not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Repair request fetched successfully",
      data: repair,
    });
  } catch (error) {
    console.error("getRepairById Error:", error);

    // Invalid MongoDB ObjectId
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid repair ID",
      });
    }

    res.status(500).json({
      success: false,
      message: "Error fetching repair request",
    });
  }
};

/* =====================================================
   DELETE REPAIR REQUEST
   DELETE /api/repair/:id
   ===================================================== */
export const deleteRepair = async (req, res) => {
  try {
    const { id } = req.params;

    const repair = await repairModel.findByIdAndDelete(id);

    if (!repair) {
      return res.status(404).json({
        success: false,
        message: "Repair request not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Repair request deleted successfully",
    });
  } catch (error) {
    console.error("deleteRepair Error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid repair ID",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to delete repair request",
    });
  }
};
