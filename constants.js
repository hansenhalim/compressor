/**
 * Constants for purpose of visit mappings and other configuration values
 */

// Purpose of visit mappings
const PURPOSE_OF_VISIT_CODES = {
  "Bertamu aja": "POV 1",
  "Antar jemput warga": "POV 2",
  "Pengantaran Barang": "POV 3",
};

const PURPOSE_OF_VISIT_LABELS = {
  "POV 1": "Bertamu aja",
  "POV 2": "Antar jemput warga",
  "POV 3": "Pengantaran Barang",
};

// Formatting constants
const HEX_PADDING = {
  IDENTITY: 6,
  GATES: 2,
};

const IDENTITY_NUMBER_LENGTH = 6;
const MAX_GATE_COUNT = 8;

// Boolean encoding values
const BOOLEAN_VALUES = {
  TRUE: "01",
  FALSE: "00",
};

module.exports = {
  PURPOSE_OF_VISIT_CODES,
  PURPOSE_OF_VISIT_LABELS,
  HEX_PADDING,
  IDENTITY_NUMBER_LENGTH,
  MAX_GATE_COUNT,
  BOOLEAN_VALUES,
};