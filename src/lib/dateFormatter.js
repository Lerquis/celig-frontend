export function formatDateToDDMMYYYY(dateString, exactTime = true) {
  const date = new Date(dateString);

  // Ajustar a tu zona horaria local
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return exactTime
    ? `${day}/${month}/${year} ${hours}:${minutes}`
    : `${day}/${month}/${year}`;
}
