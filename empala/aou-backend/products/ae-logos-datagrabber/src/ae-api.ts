import axios, { AxiosError } from 'axios';
import { logger } from './lib/logger';

const { APEX_EXTEND_LOGOS_API_URL } = process.env;
const { APEX_EXTEND_LOGOS_API_SECRET } = process.env;
const { APEX_EXTEND_LOGOS_API_KEY } = process.env;

export const fetchLogos = async (ticker: string): Promise<InstrumentLogosResponse> => {
  try {
    const response = await axios(makeLogosUrl(ticker));
    const instrumentLogos = response.data as InstrumentLogosResponse;
    if (instrumentLogos.symbol) {
      return instrumentLogos;
    }
    const error = new Error(`Could not fetch logos. Result: ${instrumentLogos}`);
    logger.error(error);
    throw error;
  } catch (e) {
    const axiosError = e as AxiosError;
    if (axiosError) {
      logger.error(`Error fetching logos for ticker ${ticker}: ${axiosError.message}`);
      // eslint-disable-next-line @typescript-eslint/no-throw-literal
      throw axiosError.message; // Throw a string to avoid flooding log and logging the api secret
    }

    throw e;
  }
};

/* eslint-disable camelcase */
const makeLogosUrl = (ticker: string): string => `${APEX_EXTEND_LOGOS_API_URL}${ticker}?${new URLSearchParams({
  api_key: APEX_EXTEND_LOGOS_API_KEY,
  api_secret: APEX_EXTEND_LOGOS_API_SECRET,
})}`;
