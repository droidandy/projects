import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { ErrorHandling, MorganLogger } from './utils/error';
import { logger } from './utils/logger';
import {
  AuthRouter,
  AutostatRouter,
  VehicleRouter,
  ClientRouter,
  DealerRouter,
  CatalogRouter,
  UserRouter,
  ApplicationRouter,
  DadataRouter,
  BillingRouter,
  BlogRouter,
  BankingRouter,
  MarketingRouter,
  InstalmentRouter,
  DepositRouter,
  LeadRouter,
  PdfRouter,
  RemontRouter,
  LinksRouter,
  InsuranceRouter,
  AutotekaRoute,
} from './routes';
import { MARKETPLACE_URL, DEALER_OFFICE_URL, BLOG_URL, OKP_URL, CURRENT_ENV, ENVS } from './config';

const app: express.Application = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(MorganLogger);

if (CURRENT_ENV === ENVS.PRODUCTION) {
  app.use(
    cors({
      origin: [MARKETPLACE_URL, DEALER_OFFICE_URL, BLOG_URL, OKP_URL],
      allowedHeaders: ['x-request-id', 'content-type', 'authorization'],
      credentials: true,
    }),
  );
} else {
  app.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', request.headers.origin);
    response.header('Access-Control-Allow-Headers', 'x-request-id, content-type, authorization');
    response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.header('Access-Control-Allow-Credentials', 'true');
    next();
  });
}

app.use('/', AuthRouter, DadataRouter); // TODO remove
app.use('/auth', AuthRouter);
app.use('/autostat', AutostatRouter);
app.use('/dadata', DadataRouter);
app.use('/vehicle', VehicleRouter);
app.use('/client', ClientRouter);
app.use('/dealer', DealerRouter);
app.use('/catalog', CatalogRouter);
app.use('/user', UserRouter);
app.use('/application', ApplicationRouter);
app.use('/billing', BillingRouter);
app.use('/blog', BlogRouter);
app.use('/banking', BankingRouter);
app.use('/marketing', MarketingRouter);
app.use('/lead', LeadRouter);
app.use('/ping', async (req, res) => {
  res.send('pong');
});
app.use('/instalment', InstalmentRouter);
app.use('/pdf', PdfRouter);
app.use('/remont', RemontRouter);
app.use('/deposit', DepositRouter);
app.use('/links', LinksRouter);
app.use('/insurance', InsuranceRouter);
app.use('/autoteka', AutotekaRoute);

app.use(ErrorHandling);

app.listen(5000, function () {
  logger.info(`🚀  Server listening on port 5000`);
});
