export const TimeDifference = (time1, time2) => {
  var diff = (time2.getTime() - time1.getTime()) / 1000;
  diff /= 60;
  return Math.abs(Math.round(diff));
};
