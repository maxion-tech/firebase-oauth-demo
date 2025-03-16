
import { bsc, bscTestnet, ronin, saigon } from "wagmi/chains";
import { maxiMainnet, maxiTestnet } from "./chains";
import { CURRENT_APP_ENV } from "./wagmi";
import { APP_ENV } from "@/enums/app";

export const SUPPORT_CHAINS = {
  [APP_ENV.production]: [
    {
      ...bsc,
      customName: "BNB Chain",
    },
    {
      ...maxiMainnet,
      customName: "Maxi Network",
    },
    {
      ...ronin,
      customName: "Ronin Chain",
    },
    {
      ...saigon, // TODO: OBT change to ronin
      customName: "Saigon Chain",
    },
  ],
  [APP_ENV.development]: [
    {
      ...bscTestnet,
      customName: "BNB Chain",
    },
    {
      ...maxiTestnet,
      customName: "Maxi Network",
    },
    {
      ...ronin,
      customName: "Ronin Chain",
    },
    {
      ...saigon,
      customName: "Saigon Chain",
    },
  ],
};

export const roninChainId = SUPPORT_CHAINS[CURRENT_APP_ENV].find((chain) =>
  /Ronin/.test(chain.name)
)?.id as number;

export const saigonChainId = SUPPORT_CHAINS[CURRENT_APP_ENV].find((chain) =>
  /Saigon/.test(chain.name)
)?.id as number;

export const binanceChainId = SUPPORT_CHAINS[CURRENT_APP_ENV].find(
  (chain) => chain.nativeCurrency.name === "BNB"
)?.id as number;

export const maxiChainId = SUPPORT_CHAINS[CURRENT_APP_ENV].find(
  (chain) => chain.id === (CURRENT_APP_ENV === APP_ENV.production ? 899 : 898)
)?.id as number;
