const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares');
const { v4: uuid } = require('uuid');

const connection = require('../db'); // ✅ Import your MySQL connection

// 🔐 Admin Dashboard
router.get('/dashboard', verifyToken, (req, res) => {
  res.render('admin-dashboard', { admin: req.admin });
});

// ✅ Corrected: Show all classes (GET /admin/classes)
router.get('/classes', (req, res) => {
  const q = "SELECT DISTINCT class FROM student";

  connection.query(q, (err, result) => {
    if (err) return res.send(err);
    res.render('admin/show-classes', { result });
  });
});
// Route: /admin/:class → Show all sections of that class
router.get('/:class', (req, res) => {
  const { class: classId } = req.params;

  const q = `SELECT DISTINCT section FROM student WHERE class = ?`;

  connection.query(q, [classId], (err, result) => {
    if (err) return res.send("❌ DB Error: " + err);

    res.render('admin/show-sections', {
      classId,
      sections: result // result is array of sections
    });
  });
});
router.get("/:class/section/:section", (req, res) => {
  const { class: classId, section } = req.params;

  const q = "SELECT id, name, roll_no, class, section, performance FROM student WHERE class = ? AND section = ?";

  connection.query(q, [classId, section], (err, result) => {
    if (err) return res.send("❌ Database error: " + err);

    res.render("admin/students", { classId, section, students: result });
  });
});

router.get("/section/:section/student/:rollno", (req, res) => {
  const { section, rollno } = req.params;

  const q = `
    SELECT id, name, roll_no, class, section, performance, created_at 
    FROM student 
    WHERE section = ? AND roll_no = ?
  `;

  connection.query(q, [section, rollno], (err, result) => {
    if (err) return res.send("❌ Database error: " + err);
    if (result.length === 0) return res.send("❌ Student not found");

    // 🟢 Render student details page
    res.render("admin/students-details", { student: result[0] });
  });
});
router.get("/:class/section/:section/add", (req, res) => {
  let { class: classid, section } = req.params;
  res.render("admin/add-student", { classid, section });
});

router.post("/:class/section/:section/add", (req, res) => {
  const { class: classid, section } = req.params;
  const { name, rollNo, performance } = req.body;

  const q = `
    INSERT INTO student (name, roll_no, performance, class, section)
    VALUES (?, ?, ?, ?, ?)
  `;

  connection.query(q, [name, rollNo, performance, classid, section], (err, result) => {
    if (err) return res.send("❌ Database Error: " + err);

    res.redirect(`/admin/${classid}/section/${section}`);
  });
});
// admin.js

router.get("/:class/section/:section/:id/edit", (req, res) => {
  const { class: classId, section, id } = req.params;

  const q = "SELECT * FROM student WHERE id = ?";
  connection.query(q, [id], (err, result) => {
    if (err) return res.send("❌ DB Error: " + err);
    if (result.length === 0) return res.send("❌ Student not found");

    res.render("admin/edit-student", {
      student: result[0],
      classId,
      section,
    });
  });
});

router.post("/:class/section/:section/:id/edit", (req, res) => {
  const { name, roll_no, performance } = req.body;
  const { id, class: classId, section } = req.params;

  const q = `
    UPDATE student 
    SET name = ?, roll_no = ?, performance = ? 
    WHERE id = ?
  `;

  connection.query(q, [name, roll_no, performance, id], (err, result) => {
    if (err) return res.send("❌ Update error: " + err);

    // 🔄 Redirect back to students list of that class and section
    res.redirect(`/admin/${classId}/section/${section}`);
  });
});
router.post("/:class/section/:section/:id/delete", (req, res) => {
  const { id, class: classId, section } = req.params;

  const q = "DELETE FROM student WHERE id = ?";

  connection.query(q, [id], (err, result) => {
    if (err) return res.send("❌ Delete error: " + err);

    // Redirect back to students list of that class and section
    res.redirect(`/admin/${classId}/section/${section}`);
  });
});
router.get("/sarestudents", (req, res) => {
  const q = "SELECT * FROM student";

  connection.query(q, (err, result) => {
    if (err) return res.send("❌ DB Error: " + err);
    res.render("admin/sare-students", { students: result });
  });
});


module.exports = router;
