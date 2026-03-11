export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(time: bigint | undefined | null): string {
  if (!time) return "—";
  return new Date(Number(time) / 1_000_000).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatDateInput(time: bigint | undefined | null): string {
  if (!time) return "";
  return new Date(Number(time) / 1_000_000).toISOString().split("T")[0];
}

export function parseDate(value: string): bigint {
  return BigInt(new Date(value).getTime()) * 1_000_000n;
}
