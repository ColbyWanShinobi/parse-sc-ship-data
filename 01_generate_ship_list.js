#!/usr/bin/env node

/* eslint-disable no-console */

'use strict';

import { promises } from "fs";
const { access, mkdir } = promises;
import { JSDOM } from "jsdom";
import { dirname } from 'path';
import format from "html-format"
const htmlFormat = format;
import { saveLocalFile } from "./lib/saveLocalFile.js";
import { readLocalDir } from "./lib/readLocalDir.js";
import { readLocalFile } from "./lib/readLocalFile.js";
import { fileURLToPath } from 'url';

const allShipsUrl = 'https://robertsspaceindustries.com/api/store/getShips';
const dataDir = 'all-ship-data';

async function testForDataDirectory(dataPath) {
  try {
    await access(dataPath);
  } catch (error) {
    throw new Error(`Required data directory ${dataPath} not found`)
  }
}

async function createDataDirectory(dataPath) {
  try {
    await access(dataPath);
  } catch (error) {
    console.log(`Creating directory: ${dataPath}...`)
    await mkdir(dataPath);
  }
}

async function generateShipList () {
  console.log(`Generating temporary ship list...`);
  await testForDataDirectory(dataDir);

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  let dirPath = `${__dirname}/all-ship-data`;
  console.log(dirPath)
  let fileList = await readLocalDir(dirPath);
  console.log(fileList)
  let shipList = [];
  for (var fileName of fileList) {
    const filePath = `${dirPath}/${fileName}`;
    console.log(`Processing file: ${filePath}`);
    const fileData = JSON.parse(await readLocalFile(filePath));
    const html = htmlFormat(fileData.data.html);
    const fragment = JSDOM.fragment(html);
    const fragmentList = fragment.querySelector('ul').querySelectorAll('li');
    console.log(`Found ${fragmentList.length} ships...`);
    for (var ship of fragmentList) {
      let rawName = ship.querySelector('span.name.trans-02s').textContent;
      rawName = rawName.replace(/\s-\s/g, '#');
      const splitName = rawName.split('#');
      const neatName = splitName[0].split('\n');
      const shipName = neatName[0];
      const shipId = ship.getAttribute('data-ship-id');
      const shipLine = {
        id: shipId,
        name: shipName
      };
      shipList.push(shipLine);
    }
  }
  return shipList;
}

async function main(){
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const shipList = await generateShipList();
  await createDataDirectory(`${__dirname}/json`);
  await saveLocalFile(`${__dirname}/json/ships.json`, shipList, true);
  console.log(shipList)
}

main();
