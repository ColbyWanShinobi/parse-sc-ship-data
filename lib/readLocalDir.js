import { promises } from "fs";
const { readdir } = promises;

export async function readLocalDir(filePath) {
  try {
    console.log(`Reading local directory: ${filePath}`);
    const fileData = await readdir(filePath);
    console.log(`Succesfully read local file: ${filePath}`);
    return fileData;
  } catch (error) {
    throw error;
  }
}
