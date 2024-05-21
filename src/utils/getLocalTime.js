export default function getLocalDateTime(date) {
  const newDate = new Date(date);
  return newDate.toLocaleString().toUpperCase();
}
