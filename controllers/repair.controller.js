import * as repairService from "../services/repair.service.js";

// ================= CREATE REPAIR =================
export const createRepair = async (req, res) => {
  try {
    const repair = await repairService.createRepair(req.body);

    res.status(201).json({
      success: true,
      message: "Repair request submitted successfully",
      data: repair,
    });
  } catch (error) {
    console.error("Repair Create Error:", error);
    const status = error.status || 500;
    res.status(status).json({
      success: false,
      message: error.status ? error.message : "Server error while creating repair request",
    });
  }
};


/* =====================================================
   GET ALL REPAIR REQUESTS
   GET /api/repair/all
   ===================================================== */
export const getAllRepairs = async (req, res) => {
  try {
    const repairs = await repairService.getAllRepairs();

    res.status(200).json({
      success: true,
      message: "Repair requests fetched successfully",
      count: repairs.length,
      data: repairs,
    });
  } catch (error) {
    console.error("getAllRepairs Error:", error);
    const status = error.status || 500;
    res.status(status).json({
      success: false,
      message: error.status ? error.message : "Failed to fetch repair requests",
    });
  }
};

/* =====================================================
   GET SINGLE REPAIR BY ID
   GET /api/repair/:id
   ===================================================== */
export const getRepairById = async (req, res) => {
  try {
    const repair = await repairService.getRepairById(req.params.id);

    res.status(200).json({
      success: true,
      message: "Repair request fetched successfully",
      data: repair,
    });
  } catch (error) {
    console.error("getRepairById Error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid repair ID",
      });
    }

    const status = error.status || 500;
    res.status(status).json({
      success: false,
      message: error.status ? error.message : "Error fetching repair request",
    });
  }
};

/* =====================================================
   DELETE REPAIR REQUEST
   DELETE /api/repair/:id
   ===================================================== */
export const deleteRepair = async (req, res) => {
  try {
    await repairService.deleteRepair(req.params.id);

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

    const status = error.status || 500;
    res.status(status).json({
      success: false,
      message: error.status ? error.message : "Failed to delete repair request",
    });
  }
};

/* =====================================================
   UPDATE REPAIR STATUS (ADMIN)
   PATCH /api/repair/:id/status
   ===================================================== */
export const updateRepairStatus = async (req, res) => {
  try {
    const repair = await repairService.updateRepairStatus(req.params.id, req.body.status);

    res.status(200).json({
      success: true,
      message: "Repair status updated successfully",
      data: repair,
    });
  } catch (error) {
    console.error("updateRepairStatus Error:", error);
    const status = error.status || 500;
    res.status(status).json({
      success: false,
      message: error.status ? error.message : "Failed to update repair status",
    });
  }
};
