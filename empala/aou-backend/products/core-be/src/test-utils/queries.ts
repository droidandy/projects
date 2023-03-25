export const instrumentQueryForLogos = (instrumentId: number) => `query Query {
    oneRandomInst(instIds: [${instrumentId}]) {
      ... on Instrument {
        symbol
        logos {
          ... on InstrumentLogos {
            instrument {
              id
              symbol
            }
            logo
            logoOriginal
            logoNormal
            logoThumbnail
            logoSquare
            logoSquareStrict
          }
          ... on InstNotFoundError {
            message
          }
          ... on TPSPDataFetchError {
            message
          }
        }
      }
    }
  }`;

export const instrumentLogosMutation = `mutation createInstrumentLogos($input: CreateInstrumentLogosInput!) {
    createInstrumentLogos(input: $input) {
      ... on CreateInstrumentLogosSuccess {
        logos {
          id
        }
      }
      ... on CreateInvalidInputError {
        message
      }
    }
  }`;
