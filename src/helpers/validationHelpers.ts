import { validateText } from "../utils/utils";

export function isTextEmpty(text: string): boolean {
  return text === "";
}

export function validateName(name: string): boolean {
  const nameRegex = /[a-zA-ZçğıöşüÇĞİÖŞÜ ]{2,}/g;
  return validateText(name, nameRegex);
}

export function validatePhoneNumber(phoneNumber: string): boolean {
  /* 
  Regex 1: /0 [+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[\s0-9]{4}[\s0-9]{3}[\s0-9]{3}$/
  Valid Inputs: 0 (555) 555 55 55

  Regex 2: /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s0-9]{9}$/
  Valid Inputs: (555)-555 55 55, (555) 555 55 55, (555) 555-5555
  */
  const phoneNumberRegex = /0 [+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[\s0-9]{4}[\s0-9]{3}[\s0-9]{3}$/;
  return validateText(phoneNumber, phoneNumberRegex);
}

export function validateEmailAddress(email: string): boolean {
  // const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  /**
   * https://stackoverflow.com/questions/201323/how-can-i-validate-an-email-address-using-a-regular-expression
   * https://emailregex.com/
   * General Email Regex (RFC 5322 Official Standard)
   */
  const emailRegex =
    /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/g;
  return validateText(email, emailRegex);
}

// https://stackoverflow.com/questions/1054022/best-way-to-store-password-in-database
export function validatePassword(password: string): boolean {
  /*
   * https://stackoverflow.com/questions/19605150/regex-for-password-must-contain-at-least-eight-characters-at-least-one-number-a
   * At least one upper case Turkish-keyboard letter, (?=.*?[A-ZÇĞİÖŞÜ])
   * At least one lower case Turkish-keyboard letter, (?=.*?[a-zçğıöşü])
   * At least one digit, (?=.*?[0-9])
   * At least one special character, (?=.*?[#.?,!+@_$%^&*-])
   * Minimum 8-characters length .{8,} (with the anchors)
   *
   NOTE: [*-_] pattern can be interpreted as: *-_ matches a single character in the range between * (index 42) and _ (index 95) (case sensitive)
   Therefore, the dash (-) symbol should be used at the end of the pattern if required to be use as a character.
   */
  const passwordRegex = /^(?=.*?[A-ZÇĞİÖŞÜ])(?=.*?[a-zçğıöşü])(?=.*?[0-9])(?=.*?[#.?,!+@_$%^&*-]).{8,}$/g;
  return validateText(password, passwordRegex);
}

export function confirmPassword(password: string, confirm: string): boolean {
  return password === confirm;
}
