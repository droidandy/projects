interface InstrumentToProcess {
  id: BigInt;
  symbol: string;
}

interface InstrumentLogosResponse {
  logo: string | null;
  logo_original: string | null;
  logo_normal: string | null;
  logo_thumbnail: string | null;
  logo_square: string | null;
  logo_square_strict: string | null;
  symbol: string;
  name: string;
}
