export const invoiceStatus = (invoice, today = new Date()) => {
  if (invoice.status === "Betald") {
    return "Betald";
  }

  if (!invoice.due) {
    return "Obetald";
  }

  const [year, month, day] = invoice.due.split("-").map(Number);

  const dueDate = new Date(year, month - 1, day);

  const todayDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );

  if (dueDate < todayDate) {
    return "Förfallen";
  }

  return "Obetald";
};
