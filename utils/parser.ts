export const shortAddress = (address?: string | null): string => {
  if (address) {
    return `${address.slice(0, 6)}...${address.slice(address.length - 4)}`;
  } else {
    return "...";
  }
};
