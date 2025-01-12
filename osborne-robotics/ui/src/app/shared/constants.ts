export class Constants {
  static readonly SERVICE_REQUIRED_THRESHOLD = 5;

  // TODO: Move api info into environment.ts - maybe via config
  static readonly API_BASE = 'http://localhost:5286/';
  static readonly API_FORKLIFTS_BASE = 'forklifts';
  static readonly API_FORKLIFTS_GET_ALL = `${Constants.API_BASE}${Constants.API_FORKLIFTS_BASE}`;
  static readonly API_FORKLIFTS_UPLOAD_JSON = `${Constants.API_BASE}${Constants.API_FORKLIFTS_BASE}/upload-json`;
}
