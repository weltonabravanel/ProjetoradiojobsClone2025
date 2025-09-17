export interface RadioStation {
  changeuuid: string;
  stationuuid: string;
  name: string;
  url: string;
  url_resolved: string;
  homepage: string;
  favicon: string;
  tags: string;
  country: string;
  countrycode: string;
  state: string;
  language: string;
  votes: number;
  codec: string;
  bitrate: number;
  hls: number;
  lastcheckok: number;
  lastchecktime: string;
  lastcheckoktime: string;
  lastlocalchecktime: string;
  clicktimestamp: string;
  clickcount: number;
  clicktrend: number;
  geo_lat?: number;
  geo_long?: number;
}

export type RadioStationSortKey = 
  | 'name'
  | 'country'
  | 'votes'
  | 'clickcount'
  | 'clicktrend';

export interface RadioFilters {
  search: string;
  country: string;
  language: string;
  tag: string;
}