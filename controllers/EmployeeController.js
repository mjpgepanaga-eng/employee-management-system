const Employee = require('../models/Employee');

const employeeController = {};

// List all employees
employeeController.list = async (req, res) => {
  try {
    const employees = await Employee.find({});
    res.render("employee/index", { employees }); // views/employee/index.ejs
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send("Internal server error");
  }
};

// Show single employee
employeeController.show = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).send("Employee not found");
    }
    res.render("employee/show", { employee }); // views/employee/show.ejs
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send("Internal server error");
  }
};

// Render create form
employeeController.create = (req, res) => {
  res.render("employee/create"); // views/employee/create.ejs
};

// Save new employee
employeeController.save = async (req, res) => {
  try {
    const employee = new Employee({
      name: req.body.name,
      address: req.body.address,
      position: req.body.position,
      salary: req.body.salary,
      updated_at: Date.now()
    });
    await employee.save();
    console.log("Successfully created an employee.");
    res.redirect("/employees/show/" + employee._id);
  } catch (err) {
    console.error("Save error:", err);
    if (err.name === 'ValidationError') {
      const validationErrors = Object.values(err.errors).map(error => error.message);
      return res.status(400).render("employee/create", { errors: validationErrors });
    }
    res.status(500).send("Internal server error");
  }
};

// Render edit form
employeeController.edit = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).send("Employee not found");
    }
    res.render("employee/edit", { employee }); // views/employee/edit.ejs
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send("Internal server error");
  }
};

// Update employee
employeeController.update = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!employee) {
      return res.status(404).send("Employee not found");
    }
    res.redirect("/employees/show/" + employee._id);
  } catch (err) {
    console.error("Update error:", err);
    res.status(400).render("employee/edit", { employee: req.body, error: "Failed to update employee: " + err.message });
  }
};

// Delete employee
employeeController.delete = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) {
      return res.status(404).send("Employee not found");
    }
    console.log("Employee deleted!");
    res.redirect("/employees");
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).send("Internal server error");
  }
};

module.exports = employeeController;
