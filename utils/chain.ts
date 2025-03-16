import { roninChainId, saigonChainId } from "@/config/supportChains";

export const isRonin = (chainId: number | undefined): boolean => {
  return chainId
    ? chainId === roninChainId || chainId === saigonChainId
    : false;
};
