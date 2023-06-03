import fetch from 'node-fetch';

export async function postJson (url, inputJson) {
  return fetch( url, {
    method: 'POST',
    body: JSON.stringify(inputJson),
    headers: { 'Content-Type': 'application/json' }
    })
    .then(res => {
      if (!res.ok) {
        console.log(`Found Bad Response: ${res.status}`);
        throw(res.statusText);
      }
      return res;
    })
    .then(res => res.json())
    .catch(error => {
      console.log(error);
      throw error;
    });
}
