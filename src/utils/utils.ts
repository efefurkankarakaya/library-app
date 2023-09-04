import moment from "moment-timezone";
import { TBase64 } from "../types/commonTypes";

export function addPrefixToBase64(base64Text: TBase64): string {
  // TODO: Add here a color page. If Base64 is falsy, then send base64 form of Red Screen.
  // TODO: Or if there's no base64 string, then return empty string and render a default image.
  if (base64Text) {
    const prefix = "data:image/png;base64,";
    return prefix + base64Text;
  }
  return "";
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

export function formatDate(date: string): string {
  return moment(date).format("DD/MM/YYYY, HH:mm:ss");
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

export function logJSON(JSONData: JSON | object, message: string = ""): void {
  const beautifiedJSON: string = JSON.stringify(JSONData, null, "\t");
  logWithTime(`${message}\n ${beautifiedJSON}`);
}

export function validateText(text: string, regex: RegExp): boolean {
  return new RegExp(regex, "g").test(text);
}
