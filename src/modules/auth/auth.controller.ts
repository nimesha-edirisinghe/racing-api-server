import { Request, Response } from "express";
import { findUserByEmailAndPassword } from "./auth.service";

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: "Email and password are required" });
    return;
  }

  const user = await findUserByEmailAndPassword(email, password);

  if (!user) {
    res.status(401).send("Invalid credentials");
    return;
  }

  const { id, name, role, token } = user;

  res.json({ user: { id, name, email, role }, token });
};
