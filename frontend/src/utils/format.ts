export const formatCurrency = (amount: number | string | undefined | null): string => {
  const num = typeof amount === 'string' ? parseFloat(amount) : (amount ?? 0);
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  }).format(num);
};

export const formatDate = (date: string | undefined | null): string => {
  if (!date) return '—';
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date));
};

export const formatMonth = (month: string): string => {
  // month is "YYYY-MM"
  const [year, mon] = month.split('-');
  const date = new Date(Number(year), Number(mon) - 1, 1);
  return new Intl.DateTimeFormat('en-GB', { month: 'short', year: 'numeric' }).format(date);
};
