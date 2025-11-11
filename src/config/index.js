import { SERVERS } from '../constants/servers';

export const apiUrls = {
  [SERVERS.THAI]: 'https://maxi-web.landverse.dev.maxion.gg/api',
  [SERVERS.GENESIS]: 'https://rolgapis.dev.maxion.gg',
  [SERVERS.LATAM]: 'https://rolaapis.dev.maxion.gg',
};

export const marketplaceApiUrls = {
  [SERVERS.THAI]: 'https://maxi-apps.landverse.dev.maxion.gg/api',
};

export const cdnUrls = {
  [SERVERS.THAI]: 'https://image-worker.maxion.gg/landverse/image-th/collection',
  [SERVERS.GENESIS]: 'https://cdn.maxion.gg/landverse/image-genesis/collection',
  [SERVERS.LATAM]: 'https://cdn.maxion.gg/landverse/image-genesis/collection',
};
