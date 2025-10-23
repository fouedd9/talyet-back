const bcrypt = require("bcrypt");
const {
  createAccessToken,
  createRefreshToken,
  verifyRefreshToken,
} = require("../utils/tokens");
const { hashToken } = require("../utils/hash");
const userModel = require("../models/userModel");
const refreshModel = require("../models/refreshModel");

function cookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  };
}

async function register(req, res) {
  const { name, password } = req.body;
  const email = req.body.email.toLowerCase();
  try {
    const exists = await userModel.findByEmail(email);
    if (exists) return res.status(400).json({ error: "Email déjà utilisé" });
    if (!name || !email || !password) {
      return res
        .status(404)
        .json({ message: "Tout les champs sont obligatoire" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await userModel.createUser({ name, email, passwordHash });
    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
}

async function login(req, res) {
  const { email, password } = req.body;
  const emailLower = email.toLowerCase();
  try {
    const user = await userModel.findByEmail(emailLower);
    if (!user) return res.status(401).json({ message: "User introuvable" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok)
      return res
        .status(401)
        .json({ success: false, message: "mot de passe incorrect" });

    const payload = { id: user.id, name: user.name, email: user.emailLower };
    const accessToken = createAccessToken(payload);
    const refreshToken = createRefreshToken({ id: user.id });

    // stocker hash en DB
    const hashed = hashToken(refreshToken);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await refreshModel.store(hashed, user.id, expiresAt);

    // cookie httpOnly
    res.cookie("refreshToken", refreshToken, cookieOptions());

    const { password: _, ...safeUser } = user;
    res.json({
      success: true,
      accessToken,
      user: safeUser,
      message: "Login successful",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
}

async function refresh(req, res) {
  // console.log("Refresh token endpoint called");

  try {
    const token = req.cookies.refreshToken;
    if (!token)
      return res.status(401).json({ error: "Refresh token manquant" });

    // verify signature
    let payload;
    try {
      payload = verifyRefreshToken(token);
    } catch (err) {
      return res.status(403).json({ error: "Refresh token invalide" });
    }
    // check DB
    const tokenHash = hashToken(token);
    const db = await refreshModel.findByHash(tokenHash);
    // console.log({ db });

    if (!db) return res.status(403).json({ error: "Refresh token invalide" });
    if (new Date(db.expires_at) < new Date()) {
      await refreshModel.deleteByHash(tokenHash);
      return res.status(403).json({ error: "Refresh token expiré" });
    }

    // OK -> rotate: supprimer ancien, créer un nouveau refresh + access
    await refreshModel.deleteByHash(tokenHash);

    const user = await userModel.findById(payload.id);
    if (!user)
      return res.status(404).json({ error: "Utilisateur introuvable" });

    const newPayload = { id: user.id, name: user.name, email: user.email };
    const newAccess = createAccessToken(newPayload);
    const newRefresh = createRefreshToken({ id: user.id });
    const newHash = hashToken(newRefresh);
    const newExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await refreshModel.store(newHash, user.id, newExpires);

    res.cookie("refreshToken", newRefresh, cookieOptions());

    res.json({ accessToken: newAccess });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
}

async function logout(req, res) {
  try {
    const token = req.cookies.refreshToken;
    if (token) {
      const hashed = hashToken(token);
      await refreshModel.deleteByHash(hashed);
    }
    res.clearCookie("refreshToken", cookieOptions());
    res.json({ message: "Logout successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
}

async function dashboard(req, res) {
  try {
    const user = await userModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "Utilisateur introuvable" });
    }

    return res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
}

module.exports = { register, login, refresh, logout, dashboard };
