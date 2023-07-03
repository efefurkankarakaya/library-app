export function logWithTime() {}

export function logJSON(message: string, JSONData: JSON | object) {
  const beautifiedJSON = JSON.stringify(JSONData, null, "\t");
  console.log(`${message}\n ${beautifiedJSON}`);
}
