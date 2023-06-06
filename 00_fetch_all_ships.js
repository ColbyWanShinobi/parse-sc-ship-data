#!/usr/bin/env node

/* eslint-disable no-console */

'use strict';

import { promises } from "fs";
const { access, mkdir } = promises;
import { postJson } from "./lib/postJson.js";
import { saveLocalFile } from "./lib/saveLocalFile.js";
import { relax } from "./lib/relax.js";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const allShipsUrl = 'https://robertsspaceindustries.com/api/store/getShips';
const dataDir = 'all-ship-data';

async function testForDataDirectory() {
  try {
    await access(dataDir);
  } catch (error) {
    await mkdir(dataDir);
  }
}

async function fetchAllShips(url) {
  await testForDataDirectory();
  
  const postOptions = {
    "storefront": "pledge"
  };

  const firstResult = await postJson(url, postOptions);
  const totalRows = firstResult.data.totalrows;
  const rowCount = firstResult.data.rowcount;
  const prelimCount = (totalRows / rowCount).toString().split('.');
  let pageCount = parseInt(prelimCount[0]);

  const pageRemainder = totalRows % pageCount;
  if (pageRemainder > 0) {
    pageCount++;
  }
  console.log(`Fetching ${pageCount} pages of ship items, ${totalRows} ships...`);

  for (let i = 1; i <= pageCount; i++) {
    console.log('');
    console.log(`Fetching Ship Page: ${i} of ${pageCount}`);
    postOptions.page = i;
    const result = await postJson(url, postOptions);
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const filePath = `${__dirname}/${dataDir}/all-ships-page-${i}.json`;
    
    await saveLocalFile(filePath, result, true);
    await relax();
  }
  console.log(`Successfully retreived: ${pageCount} pages`);
}

async function main(){
  //Get all ship data
  await fetchAllShips(allShipsUrl);
}

main();
