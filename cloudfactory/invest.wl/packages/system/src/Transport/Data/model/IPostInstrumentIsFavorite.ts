export interface IPostInstrumentIsFavoriteRequest {
  instrumentId: number;
  isFavorite: boolean;
  classCode?: string;
  securCode?: string;
}

export interface IPostInstrumentIsFavoriteResponse {
}
