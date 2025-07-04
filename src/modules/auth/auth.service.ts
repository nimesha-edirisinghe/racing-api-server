import fs from "fs/promises";
import path from "path";
import CryptoJS from "crypto-js";

const USERS_PATH = path.resolve(__dirname, "../../storage/mockUsers.json");

export async function findUserByEmailAndPassword(email: string, password: string) {
  const file = await fs.readFile(USERS_PATH, "utf-8");
  const users = JSON.parse(file);

  const user = users.find((u: any) => u.email === email);

  if (user) {
    // Encrypt the stored password to compare with the received encrypted password
    const encryptedStoredPassword = CryptoJS.SHA256(user.password || "").toString();

    // Compare encrypted passwords
    if (encryptedStoredPassword === password) {
      return user;
    }
  }

  return null;
}
