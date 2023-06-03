export async function relax(interval = 0) {
  const min = 3000;
  const max = 5000;
  let timeout = interval * 1000;
  if (!interval){
    // Returns a random integer between min (include) and max (include)
    timeout = Math.floor(Math.random() * (max - min + 1)) + min;
  }
  await new Promise(r => {
    console.log(`Waiting ${timeout} random milliseconds before next the fetch...`)
    setTimeout(r, timeout)
  });
}
