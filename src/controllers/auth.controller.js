import * as AuthService from "../services/auth.service.js";

export const register = async (req, res) => {
  const result = await AuthService.register(req.body);
  if (result.success) {
    // Set JWT in httpOnly cookie
    res.cookie("token", result.data.token, {
      httpOnly: true,
      secure: true, // Use secure cookies in production
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      domain: ".bramvanandel.dev",
      path: "/",
    });

    // Return user data (without token in response body for better security)
    res.status(201).json({
      user: result.data.user,
      message: "Registration successful",
    });
  } else {
    res.status(400).json({ error: result.error });
  }
};

export const login = async (req, res) => {
  const result = await AuthService.login(req.body);
  if (result.success) {
    // Set JWT in httpOnly cookie
    res.cookie("token", result.data.token, {
      httpOnly: true,
      secure: true, // Use secure cookies in production
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      domain: ".bramvanandel.dev",
      path: "/",
    });

    // Return user data (without token in response body for better security)
    res.status(200).json({
      user: result.data.user,
      message: "Login successful",
    });
  } else {
    res.status(401).json({ error: result.error });
  }
};

export const logout = async (req, res) => {
  // Clear the token cookie
  res.clearCookie("token");
  res.status(200).json({ message: "Logout successful" });
};
