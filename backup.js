const Employee = require('../models/Employee');

const employeeController = {};

employeeController.list = async (req, res) => {
    try {
        const employees = await Employee.find({});
        res.render("../views/employee/index", { employees });
    } catch (err) {
        console.error("Error:", err);
        res.status(500).send("Internal server error");
    }
};

employeeController.show = async (req, res) => {
    try{
        const employee = await Employee.findById(req.params.id);
        if(!employee){
            return res.status(404).send("Employee not found");
        }
        res.render("../views/employee/show", { employee });
    } catch(err) {
        console.error("Error:", err);
        res.status(500).send("Internal server error");
    }
};

employeeController.create = (req, res) => {
    res.render("../views/employee/create");
};

employeeController.save = async (req, res) => {
    try {
        const employee = new Employee({
            name: req.body.name,
            address: req.body.address,
            position: req.body.position,
            salary: req.body.salary,
            updated_at: Date.now() // Set updated_at to current timestamp
        });
        await employee.save();
        console.log("Successfully created an employee.");
        res.redirect("/employees/show/" + employee._id);
    } catch (err) {
        console.error(err);
        if (err.name === 'ValidationError') {
            const validationErrors = Object.values(err.errors).map(error => error.message);
            return res.status(400).render("../views/employee/create", { errors: validationErrors });
        }
        res.status(500).send("Internal server error");
    }
};

employeeController.edit = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if(!employee) {
            return res.status(404).send("Employee not found");
        }
        res.render("../views/employee/edit", { employee });
    } catch (err) {
        console.error("Errors:", err);
        res.status(500).send("Internal server error");
    }
};

employeeController.update = async (req, res) => {
    try {
        const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.redirect("/employees/show/" + employee._id);
    } catch (err) {
        console.error(err);
        res.status(400).render("../views/employee/edit", { employee: req.body, error: "Failed to update employee: " + err.message });
    }
};

employeeController.delete = async (req, res) => {
    try {
        const deletedEmployee = await Employee.findById(req.params.id);
        if(!deletedEmployee){
            return res.status(404).send("Employee not found");
        }
        console.log("Employee deleted!");
        res.redirect("/employees");
    } catch(err) {
        console.error(err);
        res.status(500).send("Internal server error");
    }
};

module.exports = employeeController;