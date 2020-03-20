import Moment from "moment";

export function getOutOfCashDate(cash, expenses, sales) {
  const rate = sales - expenses;

  // if cash flow is positive we will never reach an 'out-of-cash' date
  // cap the date to 18 months in the future
  if (rate >= 0) return Moment().add(18, "months");

  const ratePerDay = Math.abs(rate) / 30;
  const daysRemaining = cash / ratePerDay;
  return Moment().add(daysRemaining, "days");
}
