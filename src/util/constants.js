// amount of milliseconds in one minute (60,000)
const MINUTE_MILLISECONDS = 60 * 1000;
// amount of decimal places to round formatted values to
const FORMAT_PLACES = 4;
// fractional beat divisions
const DIVISIONS_LIST = [1, 2, 4, 8, 16, 32, 64, 128, 256];
// definition of beat types as columns
const COLUMNS = {
  note: { text: 'BEATS', factor: 1 },
  triplet: { text: 'TRIPLETS', factor: 2 / 3 },
  dotted: { text: 'DOTTED', factor: 3 / 2 },
}

export {
  MINUTE_MILLISECONDS,
  FORMAT_PLACES,
  DIVISIONS_LIST,
  COLUMNS,
}
