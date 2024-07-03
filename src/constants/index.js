import { cmsFirebase, platformFirebase } from '../config/firebaseConfig';

export const ProviderType = Object.freeze({
  PLATFORM: 'PLATFORM',
  CMS: 'CMS',
});

export const providers = [
  {
    name: 'Maxion Platform',
    type: ProviderType.PLATFORM,
    firebaseApp: platformFirebase,
  },
  { name: 'Maxion CMS', type: ProviderType.CMS, firebaseApp: cmsFirebase },
];
