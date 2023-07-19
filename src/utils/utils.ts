const moment = require("moment-timezone");

export function getCurrentTime(): string {
  // hh:mm:ss - 12h
  // HH:mm:ss - 24h
  return moment().format("DD/MM/YYYY, HH:mm:ss");
}

export function logWithTime(message: string | any, ...rest: any[]): void {
  const currentTime: string = getCurrentTime();
  console.log(`[${currentTime}] ${message}`, ...rest);
}

export function logJSON(message: string, JSONData: JSON | object): void {
  const beautifiedJSON: string = JSON.stringify(JSONData, null, "\t");
  logWithTime(`${message}\n ${beautifiedJSON}`);
}

export function validateText(text: string, regex: RegExp): boolean {
  return new RegExp(regex, "g").test(text);
}
