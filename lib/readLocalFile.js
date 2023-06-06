import { promises } from "fs";
const { readFile } = promises;

export async function readLocalFile(filePath) {
  try {
    console.log(`Reading local file: ${filePath}`);
    const fileData = await readFile(filePath, 'utf8');
    console.log(`Succesfully read local file: ${filePath}`);
    return fileData;
  } catch (error) {
    throw error;
  }
}
