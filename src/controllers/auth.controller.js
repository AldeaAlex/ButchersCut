import bcrypt from "bcryptjs";
import { prisma } from "../db/prisma.js";

export function showLoginPage(req, res) {
  return res.render("auth/login", {
    title: "Admin login",
  });
}

export async function loginAdmin(req, res) {
  const { email, password } = req.body;

  const admin = await prisma.admin.findUnique({
    where: { email },
  });

  if (!admin) {
    req.flash("error", "Email sau parolă incorectă.");
    return res.redirect("/admin/login");
  }

  const isPasswordValid = await bcrypt.compare(password, admin.passwordHash);

  if (!isPasswordValid) {
    req.flash("error", "Email sau parolă incorectă.");
    return res.redirect("/admin/login");
  }

  req.session.admin = {
    id: admin.id,
    email: admin.email,
  };

  return res.redirect("/admin/dashboard");
}

export function logoutAdmin(req, res) {
  req.session.destroy(() => {
    return res.redirect("/admin/login");
  });
}