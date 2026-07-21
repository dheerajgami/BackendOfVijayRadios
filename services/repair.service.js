import repairModel from "../model/repair.model.js";

export const createRepair = async (repairData) => {
  const { user_name, email, mobile, product_type, describation } = repairData;

  if (!user_name || !email || !mobile || !product_type) {
    const error = new Error("All required fields must be filled");
    error.status = 400;
    throw error;
  }

  const existingRepair = await repairModel.findOne({
    $or: [{ email }, { mobile }],
  });

  if (existingRepair) {
    const error = new Error("Repair request already exists with this email or mobile");
    error.status = 409;
    throw error;
  }

  const repair = await repairModel.create({
    user_name,
    email,
    mobile,
    product_type,
    describation,
  });

  return repair;
};

export const getAllRepairs = async () => {
  return await repairModel.find().sort({ createdAt: -1 });
};

export const getRepairById = async (id) => {
  const repair = await repairModel.findById(id);

  if (!repair) {
    const error = new Error("Repair request not found");
    error.status = 404;
    throw error;
  }

  return repair;
};

export const deleteRepair = async (id) => {
  const repair = await repairModel.findByIdAndDelete(id);

  if (!repair) {
    const error = new Error("Repair request not found");
    error.status = 404;
    throw error;
  }

  return repair;
};

export const updateRepairStatus = async (id, status) => {
  if (!["pending", "in-progress", "completed", "cancelled"].includes(status)) {
    const error = new Error("Invalid status value");
    error.status = 400;
    throw error;
  }

  const repair = await repairModel.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  );

  if (!repair) {
    const error = new Error("Repair request not found");
    error.status = 404;
    throw error;
  }

  return repair;
};
