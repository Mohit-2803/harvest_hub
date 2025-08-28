// src/lib/formatCurrency.ts
type FormatCurrencyOptions = {
  currency?: string; // e.g., 'INR', 'USD', 'EUR'
  locale?: string; // e.g., 'en-IN', 'en-US', 'de-DE'
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
};

export function formatCurrency(
  amount: number | string,
  {
    currency = "INR",
    locale = "en-IN",
    minimumFractionDigits = 2,
    maximumFractionDigits = 2,
  }: FormatCurrencyOptions = {}
) {
  const value = typeof amount === "string" ? Number(amount) : amount;
  if (!Number.isFinite(value)) return "";

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(value);
}
