function convertMS(milliseconds: number) {
  let days: number, hours: number, minutes: number, seconds: number;
  seconds = Math.floor(milliseconds / 1000);
  minutes = Math.floor(seconds / 60);
  seconds = seconds % 60;
  hours = Math.floor(minutes / 60);
  minutes = minutes % 60;
  days = Math.floor(hours / 24);
  hours = hours % 24;
  return { days, hours, minutes, seconds };
}

export default convertMS;
