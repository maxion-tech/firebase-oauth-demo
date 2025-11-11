export const SERVERS = {
  THAI: 'thai',
  GENESIS: 'genesis',
  LATAM: 'latam',
};

export const SERVER_LABELS = {
  [SERVERS.THAI]: 'Thai Dev',
  [SERVERS.GENESIS]: 'Genesis Dev',
  [SERVERS.LATAM]: 'Latam Dev',
};

export const SERVER_OPTIONS = [
  { value: SERVERS.THAI, label: SERVER_LABELS[SERVERS.THAI] },
  { value: SERVERS.GENESIS, label: SERVER_LABELS[SERVERS.GENESIS] },
  { value: SERVERS.LATAM, label: SERVER_LABELS[SERVERS.LATAM] },
];

export const DEFAULT_SERVER = SERVERS.THAI;
