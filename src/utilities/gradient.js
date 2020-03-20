export function getHealthScoreColor(score, isRunway) {
  // score   red  green blue
  // 100   = 8,   126,  225
  // 72    = 74,  204,  209
  // 50    = 165, 215,  112
  // 27    = 239, 175,  8
  // 0     = 223, 12,   12

  // we can use the same calculation for the healthscore and runway color
  // since the healthscore is on a 0-100 scale, and the runway is on a 0-18 scale
  // multiply by 100/18 to compensate when calculating runway color
  if (isRunway) score = (score * 100) / 18;

  // the highest score is 100, anything over that - just return the corresponding value for 100
  if (score >= 100) return "rgb(226, 24, 7)";

  // to calculate rgb on the fly - create a cubic curve of best fit
  // given the system of equations above for red, green, and blue
  const red = Math.trunc(
    0.000770947 * Math.pow(score, 3) -
      0.13546 * Math.pow(score, 2) +
      3.68655 * score +
      223.007
  );
  const green = Math.trunc(
    -0.0594275 * Math.pow(score, 2) + 6.98895 * score + 17.1979
  );
  const blue = Math.trunc(
    -0.00117439 * Math.pow(score, 3) +
      0.179523 * Math.pow(score, 2) -
      4.07829 * score +
      11.715
  );
  return `rgb(${red}, ${green}, ${blue})`;
}

export function getRunwayColor(months) {
  // 18 = 8,   126, 225
  // 13 = 74,  204, 209
  // 9  = 165, 215, 112
  // 5  = 239, 175, 8
  // 0  = 223, 12,  12

  const red = Math.trunc(
    0.123932 * Math.pow(months, 3) -
      3.98547 * Math.pow(months, 2) +
      19.6402 * months +
      223.321
  );
  const green = Math.trunc(
    0.0416667 * Math.pow(months, 3) -
      2.95241 * Math.pow(months, 2) +
      45.9766 * months +
      12.2835
  );
  const blue = Math.trunc(
    -0.204487 * Math.pow(months, 3) +
      5.63712 * Math.pow(months, 2) -
      23.381 * months +
      11.5939
  );
  return `rgb(${red}, ${green}, ${blue})`;
}

export function getHealthScoreCategory(score) {
  if (0 <= score && score <= 16) return "Danger";
  if (17 <= score && score <= 33) return "Risky";
  if (34 <= score && score <= 50) return "Moderate";
  if (51 <= score && score <= 66) return "Good";
  if (67 <= score && score <= 83) return "Great";
  if (64 <= score && score <= 100) return "Excellent";
  return "Unknown";
}
