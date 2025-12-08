export function toLocalISODate(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function fromLocalISODate(dateString: string | null): Date {
  if (!dateString) return new Date();

  const [year, month, day] = dateString.split('-').map((part) => Number(part));

  if ([year, month, day].some(Number.isNaN)) {
    return new Date();
  }

  return new Date(year, (month ?? 1) - 1, day ?? 1);
}
