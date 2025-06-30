const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");

// ✅ Temporary Students (Class 9 - Sections A to D)
const students = [
  { id: "1", name: 'Ali Khan', rollNo: '01', class: '9', section: 'A', performance: 'Excellent' },
  { id: "2", name: 'Sara Ahmed', rollNo: '02', class: '9', section: 'A', performance: 'Very Good' },
  { id: "3", name: 'Usman Raza', rollNo: '03', class: '9', section: 'A', performance: 'Good' },
  { id: "4", name: 'Zara Khan', rollNo: '04', class: '9', section: 'B', performance: 'Good' },
  { id: "5", name: 'Bilal Ahmed', rollNo: '05', class: '9', section: 'C', performance: 'Average' },
  { id: "6", name: 'Farah Iqbal', rollNo: '06', class: '9', section: 'D', performance: 'Excellent' }
];

// Route: /admin (show all classes)
router.get("/", (req, res) => {
  res.render("classes");
});

// Route: /admin/:class (show sections of a class)
router.get("/:class", (req, res) => {
  const classId = req.params.class;
  res.render("sections", { classId });
});

// Route: /admin/:class/section/:section (show students of that class + section)


// Route: /admin/student/:id (show single student)
router.get("/student/:id", (req, res) => {
  const { id } = req.params;
  const checkId = students.find(student => student.id === id);

  if (!checkId) {
    return res.status(404).send("❌ Student not found");
  }

  res.render("student-details", { checkId });
});

module.exports = router;

