const moment = require("moment-timezone");

export function logWithTime(message: string): void {
  const currentTime: string = moment().format("DD/MM/YYYY, hh:mm:ss");
  console.log(`[${currentTime}] ${message}`);
}

export function logJSON(message: string, JSONData: JSON | object): void {
  const beautifiedJSON: string = JSON.stringify(JSONData, null, "\t");
  logWithTime(`${message}\n ${beautifiedJSON}`);
}
