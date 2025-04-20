import Employee from "../models/Employee.js";

export const createEmployee = async (req, res, next) => {
  try {
    const { fullName, email, phone, position, department, dateOfJoining } =
      req.body;

    if (
      !fullName ||
      !email ||
      !phone ||
      !position ||
      !department ||
      !dateOfJoining
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newEmployee = await Employee.create({
      fullName,
      email,
      phone,
      position,
      department,
      dateOfJoining,
    });

    res.status(201).json(newEmployee);
  } catch (error) {
    console.error("Error creating employee:", error);

    if (error.code === 11000) {
      return res.status(400).json({ message: "Email already exists" });
    }

    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};

export const getAllEmployees = async (req, res, next) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 });
    res.json(employees);
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};

export const getEmployeeById = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee)
      return res.status(404).json({ message: "Employee not found" });
    res.json(employee);
  } catch (error) {
    console.error("Error fetching employee:", error);
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};

export const updateEmployee = async (req, res, next) => {
  try {
    const { fullName, email, phone, position, department, dateOfJoining } =
      req.body;

    if (
      !fullName ||
      !email ||
      !phone ||
      !position ||
      !department ||
      !dateOfJoining
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const updated = await Employee.findByIdAndUpdate(
      req.params.id,
      {
        fullName,
        email,
        phone,
        position,
        department,
        dateOfJoining,
      },
      { new: true, runValidators: true }
    );

    if (!updated)
      return res.status(404).json({ message: "Employee not found" });
    res.json(updated);
  } catch (error) {
    console.error("Error updating employee:", error);

    if (error.code === 11000) {
      return res.status(400).json({ message: "Email already exists" });
    }

    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};

export const deleteEmployee = async (req, res, next) => {
  try {
    const deleted = await Employee.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "Employee not found" });
    res.json({ message: "Employee deleted successfully" });
  } catch (error) {
    console.error("Error deleting employee:", error);
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};
