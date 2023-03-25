import {
  Arg, Authorized, Ctx, ID, Mutation, Query, Resolver, UseMiddleware,
} from 'type-graphql';
import { getConnection, getRepository, Not } from 'typeorm';
import { ApolloError } from 'apollo-server';
import { EAccessRole } from '../security/auth-checker';
import { CreateErrorHandler } from '../utils/middlewares/error-handler';
import { CreateApplicationInput } from '../inputs/create-application';
import {
  AccountInputValidationError,
  CreateApplicationResult,
  CreateApplicationSuccess,
  TradeAccountAlreadyExistsError,
  UnsupportedAccountTypeError,
} from '../results/create-application';
import { Application } from '../models/application';
import { EApplicationStatus } from '../enums/onboarding/application-status';
import { ApplicationFormError, ApplicationStatus } from '../results/application-status';
import { OnboardingApplication } from '../apex-extend/onboarding/onboarding-application';
import { APEX_QUESTION_ID_TO_FIELD_NAME_MAP } from '../apex-extend/onboarding/application-questions-info';
import { createApexApplication, deleteApplication, sendApplicationAnswers } from '../apex-extend/onboarding/api-client';
import { EAccountType } from '../enums/onboarding/account-type';
import { ApplicationNotFoundResult, RemoveTradeAccountResult, RemoveTradeAccountSuccess } from '../results/remove-trade-account';
import { TradeAccountResolver } from './trade-account';

const { APEX_EXTEND_APPLICATIONS_USER_ID } = process.env;

@Resolver()
export class OnboardingResolver {
  @Authorized([EAccessRole.LAUNCHPAD_USER])
  @Mutation(() => CreateApplicationResult)
  @UseMiddleware(CreateErrorHandler)
  public async createApplication(
    @Ctx() ctx: any,
      @Arg('data', () => CreateApplicationInput, { nullable: false }) data: CreateApplicationInput,
  ): Promise<typeof CreateApplicationResult> {
    const userId = ctx.metadata.user.id;
    if (await this.isUserTradingAccountExists(userId, data.accountType)) {
      const result = new TradeAccountAlreadyExistsError();
      result.requestId = ctx.requestId;
      result.message = 'Current user already has trading account';
      return result;
    }

    const result = await getConnection().transaction(async (transactionalEntityManager) => {
      const tradeAccountData = await transactionalEntityManager.query(`
          SELECT *
          FROM unnest(string_to_array('${process.env.APEX_EXTEND_TRADE_ACCOUNT_ID}', ',')) as account_id
          WHERE account_id NOT IN (SELECT trade_account_id FROM launchpad_ae_onboarding.application WHERE trade_account_id IS NOT NULL)
          limit 1
      `);
      let tradeAccountId;
      if (tradeAccountData && tradeAccountData[0]) {
        tradeAccountId = tradeAccountData[0].account_id;
      } else {
        throw new ApolloError('A pool of precreated UAT trading accounts is empty');
      }
      const onboardingApplication = new OnboardingApplication();
      onboardingApplication.fillForm(data);

      const { validationErrors, unsupportedAccountErrors } = onboardingApplication.getErrors();
      if (unsupportedAccountErrors && unsupportedAccountErrors.length > 0) {
        const unsupportedAccountTypeError = new UnsupportedAccountTypeError();
        unsupportedAccountTypeError.requestId = ctx.requestId;
        unsupportedAccountTypeError.errors = unsupportedAccountErrors;
        return unsupportedAccountTypeError;
      }

      if (validationErrors && validationErrors.length > 0) {
        const accountInputValidationError = new AccountInputValidationError();
        accountInputValidationError.requestId = ctx.requestId;
        accountInputValidationError.errors = validationErrors;
        return accountInputValidationError;
      }

      const apexApplicationId = await createApexApplication(APEX_EXTEND_APPLICATIONS_USER_ID);

      const dbApplication = new Application();
      dbApplication.apexApplicationId = BigInt(apexApplicationId);
      dbApplication.status = EApplicationStatus.CREATED;
      dbApplication.userId = userId;
      dbApplication.accountType = data.accountType;
      await transactionalEntityManager.save(dbApplication);

      const createApplicationResponse = await sendApplicationAnswers(apexApplicationId, onboardingApplication.getForm());

      if (createApplicationResponse.answers.error && createApplicationResponse.answers.error.length > 0) {
        const apexValidationErrors: ApplicationFormError[] = [];

        // eslint-disable-next-line no-restricted-syntax
        for (const apexApplicationError of createApplicationResponse.answers.error) {
          const fieldName = APEX_QUESTION_ID_TO_FIELD_NAME_MAP.get(apexApplicationError.question_id);
          /* istanbul ignore next */
          const errors = apexApplicationError.errors?.data || [];
          apexValidationErrors.push({
            fieldName,
            errors,
          });
        }

        await transactionalEntityManager.update(Application, {
          id: dbApplication.id,
        }, {
          validationErrors: apexValidationErrors,
          status: EApplicationStatus.APPLICATION_VALIDATION_FAILED,
        });
      } else {
        await transactionalEntityManager.update(Application, {
          id: dbApplication.id,
        }, {
          status: EApplicationStatus.COMPLETED,
          tradeAccountId,
        });
      }

      await deleteApplication(apexApplicationId);

      const createApplicationSuccess = new CreateApplicationSuccess();
      createApplicationSuccess.applicationId = dbApplication.id;
      createApplicationSuccess.requestId = ctx.requestId;
      return createApplicationSuccess;
    });
    return result;
  }

  @Authorized([EAccessRole.LAUNCHPAD_USER])
  @Query(() => ApplicationStatus)
  public async getApplicationStatus(
    @Ctx() ctx: any,
      @Arg('applicationId', () => ID, { nullable: false }) applicationId: BigInt,
  ): Promise<ApplicationStatus> {
    const application = await getRepository(Application).findOne({
      id: applicationId,
    });
    const response = new ApplicationStatus();
    if (application.validationErrors && application.validationErrors.length > 0) {
      response.validationErrors = application.validationErrors;
    }
    response.status = application.status;
    response.requestId = ctx.requestId;
    if (application.status === EApplicationStatus.COMPLETED) {
      response.tradeAccountId = await TradeAccountResolver.getTradeAccountId(ctx.metadata.user.id);
    }
    return response;
  }

  @Authorized([EAccessRole.LAUNCHPAD_USER])
  @Mutation(() => RemoveTradeAccountResult)
  public async removeTradeAccount(
    @Ctx() ctx: any,
      @Arg('accountType', () => EAccountType, { nullable: false }) accountType: EAccountType,
  ): Promise<typeof RemoveTradeAccountResult> {
    const application = await getRepository(Application).findOne({
      status: EApplicationStatus.COMPLETED,
      userId: BigInt(ctx.metadata.user.id),
      accountType,
    });
    if (application) {
      const response = new RemoveTradeAccountSuccess();
      await application.remove();
      response.message = 'Successfully deleted';
      return response;
    }
    return new ApplicationNotFoundResult('Application not found', ctx.requestId);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private async isUserTradingAccountExists(userId: string | number, accountType: EAccountType) {
    const application = await getRepository(Application).findOne({
      userId: BigInt(userId),
      status: Not(EApplicationStatus.APPLICATION_VALIDATION_FAILED),
    });
    return !!application;
  }
}
