function getLocalDateTime(date) {
  const newDate = new Date(date);
  return newDate.toLocaleString().toUpperCase();
}

export default function LocalDateTime({ date, style, splitDate, splitTime }) {
  let localTime = getLocalDateTime(date);
  if (splitDate) {
    localTime = localTime.split(',')[0];
  }
  if (splitTime) {
    localTime = localTime.split(',')[1].trim();
  }
  return <span style={style}>{localTime}</span>;
}
