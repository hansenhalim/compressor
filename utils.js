/**
 * Converts a string to its hexadecimal representation
 * @param {string} str - The string to convert
 * @returns {string} Hexadecimal representation of the string
 */
function stringToHex(str) {
  return Array.from(str, (char) =>
    char.charCodeAt(0).toString(16).padStart(2, "0")
  ).join("");
}

/**
 * Converts hexadecimal string back to original string
 * @param {string} hex - The hexadecimal string to convert
 * @returns {string} Original string
 */
function hexToString(hex) {
  let result = "";
  for (let i = 0; i < hex.length; i += 2) {
    const byte = hex.substr(i, 2);
    if (byte.length === 2) {
      result += String.fromCharCode(parseInt(byte, 16));
    }
  }
  return result;
}

/**
 * Converts array of gate numbers to binary representation
 * @param {number[]} gates - Array of gate numbers (1-based)
 * @returns {number} Binary representation where each bit represents a gate
 */
function gatesToBinary(gates) {
  let binary = 0;
  gates.forEach((gate) => {
    binary |= 1 << (gate - 1);
  });
  return binary;
}

/**
 * Converts binary value back to array of gate numbers
 * @param {number} binaryValue - Binary value representing gates
 * @returns {number[]} Array of gate numbers (1-based)
 */
function binaryToGates(binaryValue) {
  const gates = [];
  for (let i = 0; i < 8; i++) {
    if (binaryValue & (1 << i)) {
      gates.push(i + 1);
    }
  }
  return gates;
}

/**
 * Formats a vehicle plate number by adding spaces between letters and numbers
 * @param {string} vehicleStr - The vehicle plate string without spaces
 * @returns {string} Formatted vehicle plate with spaces
 */
function formatVehiclePlate(vehicleStr) {
  return vehicleStr.replace(/^([A-Z]+)(\d+)([A-Z]+)$/, "$1 $2 $3");
}

/**
 * Formats a UUID string by adding dashes in the standard UUID format
 * @param {string} uuidStr - UUID string without dashes
 * @returns {string} Formatted UUID with dashes
 */
function formatUUID(uuidStr) {
  return uuidStr.replace(/^(.{8})(.{4})(.{4})(.{4})(.{12})$/, "$1-$2-$3-$4-$5");
}

export default {
  stringToHex,
  hexToString,
  gatesToBinary,
  binaryToGates,
  formatVehiclePlate,
  formatUUID,
};
