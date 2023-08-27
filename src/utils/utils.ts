const moment = require("moment-timezone");

export function addPrefixToBase64(base64Text: string) {
  const prefix = "data:image/png;base64,";
  return prefix + base64Text;
}

export function isEmptyObject(value: {}): boolean {
  return isObject(value) && Object.keys(value).length === 0;
}

export function isObject(value: any): boolean {
  return !Array.isArray(value) && typeof value === "object" && value !== null;
}

export function isEmptyArray(array: []): boolean {
  return Array.isArray(array) && array.length === 0;
}

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
