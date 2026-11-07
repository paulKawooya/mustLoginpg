// Import Express
const express = require("express");
const bcrypt = require("bcryptjs");

// Create Express application
const app = express();

// Set the port number
const PORT = 3000;

// Temporary storage for registered users
const users = [];

// Middleware
app.use(express.urlencoded({ extended: true }));

// Allow Node.js to access HTML files in the public folder
app.use(express.static("public"));


// ==============================
// SIGN UP ROUTE
// ==============================

app.post("/api/signup", async (req, res) => {

    // Get information submitted through the form
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const confirm = req.body.confirm;

    // Check whether passwords match
    if (password !== confirm) {
        return res.send("Passwords do not match!");
    }

    // Check password length
    if (password.length < 8) {
        return res.send("Password must have at least 8 characters.");
    }

    // Check whether email already exists
    const existingUser = users.find(user => user.email === email);

    if (existingUser) {
        return res.send("This email is already registered!");
    }

    // Encrypt the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = {
        name: name,
        email: email,
        password: hashedPassword
    };

    // Save user in the temporary users array
    users.push(newUser);

    res.send("Account created successfully! You can now login.");

});


// ==============================
// LOGIN ROUTE
// ==============================

app.post("/api/login", async (req, res) => {

    // Get login information
    const email = req.body.email;
    const password = req.body.password;

    // Find the user by email
    const user = users.find(user => user.email === email);

    // Check if user exists
    if (!user) {
        return res.send("User not found. Please create an account.");
    }

    // Compare entered password with encrypted password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
        res.send("Login successful! Welcome to MUST, " + user.name);
    } else {
        res.send("Incorrect password. Please try again.");
    }

});


// ==============================
// START SERVER
// ==============================

app.listen(PORT, () => {
    console.log(`MUST server is running at http://localhost:${PORT}`);
});