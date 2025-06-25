export const SERVERS = {
  THAI: 'thai',
  GENESIS: 'genesis',
};

export const SERVER_LABELS = {
  [SERVERS.THAI]: 'Thai',
  [SERVERS.GENESIS]: 'Genesis',
};

export const SERVER_OPTIONS = [
  { value: SERVERS.THAI, label: SERVER_LABELS[SERVERS.THAI] },
  { value: SERVERS.GENESIS, label: SERVER_LABELS[SERVERS.GENESIS] },
];

export const DEFAULT_SERVER = SERVERS.THAI;
