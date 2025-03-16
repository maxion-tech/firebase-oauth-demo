import { formatUnits, hexToBigInt } from "viem";
import { toFixed } from "./number";

export const formatWithCommas = (value: string | number) => {
  const parsedValue = typeof value === "string" ? parseFloat(value) : value;
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(parsedValue);
};

export const weiToEth = (wei: bigint, decimals = 18): number => {
  const value = wei ? Number(formatUnits(wei, decimals)) : 0;
  return Number(toFixed(value, 2));
};

export const zeroHex = hexToBigInt("0x0");
