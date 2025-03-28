const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;

// Set up Handlebars as the view engine
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public"))); // Ensure your CSS and assets are accessible

// Routes
app.get("/", (req, res) => {
  res.render("index");
});

app.post("/generate", (req, res) => {
  const formData = req.body;
  const { name, gender, number, ...guests } = formData;

  // Convert number of guests to integer
  const guestCount = parseInt(number, 10);

  // Determine the pronoun based on gender
  const pronoun = gender === "female" ? "she's" : "he's";

  // Extract guest names dynamically
  let guestList = [];
  for (let i = 1; i <= guestCount; i++) {
    if (guests[`guest${i}`]) {
      guestList.push(guests[`guest${i}`]);
    }
  }

  // Define the songs (split into words)
  const happyBirthday = `Happy birthday to you Happy birthday to you Happy birthday dear ${name} Happy birthday to you!`.split(" ");
  const goodFellow = `For ${pronoun} a jolly good fellow For ${pronoun} a jolly good fellow For ${pronoun} a jolly good fellow which nobody can deny!`.split(" ");

  // Combine both songs
  let allWords = [...happyBirthday, ...goodFellow];

  // Assign words to guests in sequence
  let assignedWords = [];
  for (let i = 0; i < allWords.length; i++) {
    let singer = guestList[i % guestList.length]; // Rotate through guests
    assignedWords.push(`${singer}: ${allWords[i]}`);
  }

  // Render "happy" template with the assigned words
  res.render("happy", { name, assignedWords });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
