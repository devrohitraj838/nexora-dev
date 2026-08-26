const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios"); 

// ================= Register User =================

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

// ================= Login User =================

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

// ================= GitHub OAuth Auth Route =================
// Redirects the user to GitHub's secure login portal
const githubAuth = (req, res) => {
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=https://nexora-dev.onrender.com/api/auth/github/callback&scope=read:user user:email repo`;
  res.redirect(githubAuthUrl);
};

// ================= GitHub OAuth Callback =================
// Handles the redirect back from GitHub, fetches user data, and issues a JWT
const githubCallback = async (req, res) => {
  const { code } = req.query;

  try {
    // 1. Trade the code for an Access Token
    const tokenResponse = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      },
      { headers: { Accept: "application/json" } }
    );

    const accessToken = tokenResponse.data.access_token;

    // 2. Use the token to fetch the user's GitHub profile
    const userResponse = await axios.get("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const githubData = userResponse.data;

    // 3. Find or Create the user in your MongoDB database
    let user = await User.findOne({ githubId: githubData.id });

    if (!user) {
      // If not, check if they exist from a previous manual email/password signup
      if (githubData.email) {
        user = await User.findOne({ email: githubData.email });
      }

      if (user) {

        user.githubId = githubData.id;
        user.githubUsername = githubData.login;
        user.avatar = githubData.avatar_url;
        await user.save();
      } else {
     
        user = await User.create({
          name: githubData.name || githubData.login,
          email: githubData.email, 
          githubId: githubData.id,
          githubUsername: githubData.login,
          avatar: githubData.avatar_url,
        });
      }
    }

   
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

 
    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
    res.redirect(`${clientUrl}/login?token=${token}&name=${encodeURIComponent(user.name)}&githubUsername=${user.githubUsername}`);

  } catch (error) {
    console.error("GitHub OAuth Error:", error.message);
    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
    res.redirect(`${clientUrl}/login?error=oauth_failed`);
  }
};


const onboardUser = async (req, res) => {
  try {
    const { role, year, goal } = req.body;
    
  
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id, 
      {
        $set: {
          isOnboarded: true,
          profile: { role, year, goal }
        }
      },
      { new: true } 
    ).select("-password"); 

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Onboarding saving error:", error);
    res.status(500).json({ message: "Server error during onboarding" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  githubAuth,
  githubCallback,
  onboardUser // <-- Added here!
};