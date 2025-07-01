import fs from "fs/promises";
import path from "path";

const USERS_PATH = path.resolve(__dirname, "../../storage/mockUsers.json");

export async function findUserByEmailAndPassword(
  email: string,
  password: string
) {
  const file = await fs.readFile(USERS_PATH, "utf-8");
  const users = JSON.parse(file);

  return users.find(
    (user: any) => user.email === email && user.password === password
  );
}
