export function toFixed(amount: number, fixed: number): string {
  const re = new RegExp("^-?\\d+(?:.\\d{0," + (fixed || -1) + "})?");
  const match = amount.toString().match(re);
  return match ? match[0] : "0";
}
