import { promises } from "fs";
const { writeFile } = promises;


export async function saveLocalFile(fileName, fileData, isJson = false) {
  try {

    
    console.log(`Saving local file: ${fileName}`);
    let saveData = fileData;
    if (isJson) {
      saveData = JSON.stringify(fileData, null, 2);
    }
    await writeFile(fileName, saveData);
    console.log(`Succesfully saved local file: ${fileName}`);
    return fileData;
  } catch (error) {
    throw error;
  }
}
