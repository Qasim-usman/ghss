const express = require('express');
const router = express.Router();

// Home Page Route
router.get('/', (req, res) => {
  res.render('home'); // views/home.ejs will be rendered
});
router.get("/about", (req, res) => {
  res.render("about");
});
router.get("/contact", (req, res) => {
  res.render("contact");
});



module.exports = router;
