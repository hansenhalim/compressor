const {
  stringToHex,
  hexToString,
  gatesToBinary,
  binaryToGates,
  formatVehiclePlate,
  formatUUID,
} = require("./utils");

const {
  PURPOSE_OF_VISIT_CODES,
  PURPOSE_OF_VISIT_LABELS,
  HEX_PADDING,
  IDENTITY_NUMBER_LENGTH,
  BOOLEAN_VALUES,
} = require("./constants");

/**
 * Compresses payload data into a more compact format using hexadecimal encoding
 * @param {Object} payload - The payload object to compress
 * @param {string} payload.identity_number - Identity number with asterisks
 * @param {string} payload.fullname - Full name of the person
 * @param {string} payload.vehicle_plate_number - Vehicle plate number
 * @param {string} payload.purpose_of_visit - Purpose of the visit
 * @param {string} payload.destination_name - Destination name
 * @param {number[]} payload.allowed_gate_for_enter - Array of allowed entry gates
 * @param {number[]} payload.allowed_gate_for_exit - Array of allowed exit gates
 * @param {string} payload.visit_id - UUID of the visit
 * @param {number} payload.transit_at - Timestamp of transit
 * @param {boolean} payload.visited_gate_4 - Whether gate 4 was visited
 * @param {string} payload.notes - Additional notes
 * @returns {string} Compressed payload with hexadecimal encoded values
 */
function compress(payload) {
  const compressedData = {};

  // Extract first and last 3 digits from identity number
  const identityDigits = payload.identity_number
    .replace(/\*/g, "")
    .match(/^(\d{3}).*(\d{3})$/);
  const combinedIdentityDigits = identityDigits[1] + identityDigits[2];
  compressedData.identity_number = parseInt(combinedIdentityDigits)
    .toString(16)
    .padStart(HEX_PADDING.IDENTITY, "0");

  compressedData.fullname = stringToHex(payload.fullname);

  // Remove spaces from vehicle plate number before encoding
  const cleanVehiclePlate = payload.vehicle_plate_number.replace(/\s+/g, "");
  compressedData.vehicle_plate_number = stringToHex(cleanVehiclePlate);

  // Map purpose of visit to code or use original value
  const purposeCode =
    PURPOSE_OF_VISIT_CODES[payload.purpose_of_visit] ||
    payload.purpose_of_visit;
  compressedData.purpose_of_visit = stringToHex(purposeCode);

  compressedData.destination_name = stringToHex(payload.destination_name);

  // Convert gate arrays to binary and then to hex
  const enterGatesBinary = gatesToBinary(payload.allowed_gate_for_enter);
  compressedData.allowed_gate_for_enter = enterGatesBinary
    .toString(16)
    .padStart(HEX_PADDING.GATES, "0");

  const exitGatesBinary = gatesToBinary(payload.allowed_gate_for_exit);
  compressedData.allowed_gate_for_exit = exitGatesBinary
    .toString(16)
    .padStart(HEX_PADDING.GATES, "0");

  // Remove dashes from UUID
  compressedData.visit_id = payload.visit_id.replace(/-/g, "");

  compressedData.transit_at = payload.transit_at.toString(16);

  compressedData.visited_gate_4 = payload.visited_gate_4
    ? BOOLEAN_VALUES.TRUE
    : BOOLEAN_VALUES.FALSE;

  compressedData.notes = stringToHex(payload.notes);

  // Return concatenated string of all values separated by 1c HEX
  const separator = "1c"; // 1c HEX character (File Separator)
  return Object.values(compressedData).join(separator);
}

/**
 * Decompresses concatenated string back to original payload format
 * @param {string} compressedString - The compressed concatenated string with 1c HEX separators
 * @returns {Object} Original payload object with readable values
 */
function decompress(compressedString) {
  const originalPayload = {};

  // Split the concatenated string by 1c HEX separator
  const separator = "1c";
  const values = compressedString.split(separator);

  // Map values back to their original properties
  const [
    identityHex,
    fullnameHex,
    vehiclePlateHex,
    purposeHex,
    destinationHex,
    enterGatesHex,
    exitGatesHex,
    visitId,
    transitAtHex,
    visitedGate4,
    notesHex,
  ] = values;

  // Reconstruct identity number with asterisks
  const identityDigits = parseInt(identityHex, 16)
    .toString()
    .padStart(IDENTITY_NUMBER_LENGTH, "0");
  const firstThreeDigits = identityDigits.substring(0, 3);
  const lastThreeDigits = identityDigits.substring(3, 6);
  originalPayload.identity_number = `${firstThreeDigits}**********${lastThreeDigits}`;

  originalPayload.fullname = hexToString(fullnameHex);

  // Decode and format vehicle plate number
  const vehicleString = hexToString(vehiclePlateHex);
  originalPayload.vehicle_plate_number = formatVehiclePlate(vehicleString);

  // Decode purpose of visit and map back to label
  const purposeCode = hexToString(purposeHex);
  originalPayload.purpose_of_visit =
    PURPOSE_OF_VISIT_LABELS[purposeCode] || purposeCode;

  originalPayload.destination_name = hexToString(destinationHex);

  // Convert hex gate values back to arrays
  const enterGatesValue = parseInt(enterGatesHex, 16);
  originalPayload.allowed_gate_for_enter = binaryToGates(enterGatesValue);

  const exitGatesValue = parseInt(exitGatesHex, 16);
  originalPayload.allowed_gate_for_exit = binaryToGates(exitGatesValue);

  // Reconstruct UUID with dashes
  originalPayload.visit_id = formatUUID(visitId);

  originalPayload.transit_at = parseInt(transitAtHex, 16);

  originalPayload.visited_gate_4 = visitedGate4 === BOOLEAN_VALUES.TRUE;

  originalPayload.notes = hexToString(notesHex);

  return originalPayload;
}

// Example usage and testing
const samplePayload = {
  identity_number: "317**********001",
  fullname: "JO**L DOE",
  vehicle_plate_number: "BE 1199 AA",
  purpose_of_visit: "Service AC Rumah",
  destination_name: "AA-1",
  allowed_gate_for_enter: [1, 2],
  allowed_gate_for_exit: [3, 4],
  visit_id: "f3d5c6a8-1eab-4b1a-a8d4-092cf15b65e9",
  transit_at: 1758092777,
  visited_gate_4: false,
  notes: "lorem ipsum",
};

console.log("📋 Original Payload:");
console.log(JSON.stringify(samplePayload, null, 2));

const originalSize = Buffer.byteLength(JSON.stringify(samplePayload), "utf8");

const compressedData = compress(samplePayload);
const compressedSize = compressedData.length / 2; // Each hex pair represents 1 byte

console.log("\n🗜️  Compression Results:");
console.log(`Original size: ${originalSize} bytes`);
console.log(`Compressed size: ${compressedSize} bytes`);
console.log(
  `Compression ratio: ${(
    ((originalSize - compressedSize) / originalSize) *
    100
  ).toFixed(1)}%`
);
console.log(`Size reduction: ${originalSize - compressedSize} bytes saved`);

console.log("\n📦 Compressed Data:");
console.log(compressedData);

const decompressedPayload = decompress(compressedData);
console.log("\n📂 Decompressed Payload:");
console.log(JSON.stringify(decompressedPayload, null, 2));

console.log("\n✅ Verification:");
console.log(
  `Data integrity: ${
    JSON.stringify(samplePayload) === JSON.stringify(decompressedPayload)
      ? "PASSED"
      : "FAILED"
  }`
);

module.exports = {
  compress,
  decompress,
};
