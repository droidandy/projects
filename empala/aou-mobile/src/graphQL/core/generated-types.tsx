import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
import * as React from 'react';
import * as ApolloReactComponents from '@apollo/client/react/components';
import * as ApolloReactHoc from '@apollo/client/react/hoc';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
const defaultOptions = {};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any;
  OrderId: any;
};

export type AccountInputValidationError = {
  __typename?: 'AccountInputValidationError';
  errors: Array<AccountInputValidationErrorMessage>;
  requestId: Scalars['String'];
};

export type AccountInputValidationErrorMessage = {
  __typename?: 'AccountInputValidationErrorMessage';
  message: Scalars['String'];
  reason: EAccountValidationErrorType;
  fieldName: Scalars['String'];
};

export type Achievement = {
  __typename?: 'Achievement';
  id: Scalars['ID'];
  name: Scalars['String'];
  level: Scalars['Int'];
  icon: Scalars['String'];
};

export type AnyOrder = RegularOrder | FractionalOrder | NotionalOrder;

export type Application = {
  __typename?: 'Application';
  id: Scalars['ID'];
  status: EApplicationStatus;
  validationErrors?: Maybe<Array<ApplicationFormError>>;
  userId: Scalars['ID'];
  accountType: EAccountType;
  tradeAccountId?: Maybe<Scalars['String']>;
};

export type ApplicationFormError = {
  __typename?: 'ApplicationFormError';
  fieldName: Scalars['String'];
  errors: Array<Scalars['String']>;
};

export type ApplicationNotFoundResult = TypeWithMessageAndRequestId & {
  __typename?: 'ApplicationNotFoundResult';
  message: Scalars['String'];
  requestId: Scalars['String'];
};

export type ApplicationStatus = {
  __typename?: 'ApplicationStatus';
  status: EApplicationStatus;
  requestId: Scalars['String'];
  validationErrors?: Maybe<Array<ApplicationFormError>>;
  tradeAccountId?: Maybe<Scalars['String']>;
};

export type CancelResult = CancelSuccess | OrderError | TpspDataFetchError;

export type CancelSuccess = {
  __typename?: 'CancelSuccess';
  /** ID of the order that was cancelled. */
  orderId: Scalars['OrderId'];
};

export type CommStack = {
  __typename?: 'CommStack';
  id: Scalars['ID'];
  name: Scalars['String'];
  instruments: Array<Instrument>;
};

export type CommStackInstrumentsArgs = {
  nMax?: Maybe<Scalars['Int']>;
};

export type CommStacks = {
  __typename?: 'CommStacks';
  commStacks: Array<CommStack>;
};

/** Used for communityStacks query */
export type CommStacksResult = CommStacks;

export type CreateApplicationInput = {
  /** Account Type, at the current moment MARGIN and IRA accounts are not supported */
  accountType: EAccountType;
  /** First Name */
  firstName: Scalars['String'];
  /** Last Name */
  lastName: Scalars['String'];
  /** Middle Name */
  middleName?: Maybe<Scalars['String']>;
  /** Date of Birth */
  dateOfBirth: Scalars['DateTime'];
  /** Citizenship country, ISO 3166-1 alpha-3 code */
  citizenshipCountry: ECountry;
  /** Are you a permanent resident of USA? Available if citizenshipCountry != USA */
  isPermanentUsResident?: Maybe<Scalars['Boolean']>;
  /** Are you a US resident and have a US Visa? Available isPermanentUsResident = false  */
  isUsResidentWithVisa?: Maybe<Scalars['Boolean']>;
  /** What is your visa type? Available if isUsResidentWithVisa=true */
  visaType?: Maybe<EVisaType>;
  /** What is expiration date of your Visa? Available if isUsResidentWithVisa=true */
  visaExpiration?: Maybe<Scalars['DateTime']>;
  /**  Available if isUsResidentWithVisa=false */
  birthCountry?: Maybe<ECountry>;
  /** Social Security/TAX ID */
  ssn: Scalars['String'];
  /** Email */
  email: Scalars['String'];
  /** Phone number */
  phoneNumber: Scalars['String'];
  /** Residential address country, ISO 3166-1 alpha-3 code */
  residentialAddressCountry: ECountry;
  /** Address Line 1 */
  residentialAddressLine1: Scalars['String'];
  /** Address Line 2 */
  residentialAddressLine2?: Maybe<Scalars['String']>;
  /** City */
  residentialAddressCity: Scalars['String'];
  /** Region/Province */
  residentialAddressRegion?: Maybe<Scalars['String']>;
  /** State */
  residentialAddressState: Scalars['String'];
  /** Zip/Postal Code */
  residentialAddressZipCode: Scalars['String'];
  /** Is your mailing address the same as your home address? */
  isMailingAddressSameAsResidentialAddress: Scalars['Boolean'];
  /** Current mailing address country, ISO 3166-1 alpha-3 code, available if isMailingAddressSameAsResidentialAddress=false */
  mailingAddressCountry?: Maybe<ECountry>;
  /** Current mailing address line 1, available if isMailingAddressSameAsResidentialAddress=false */
  mailingAddressLine1?: Maybe<Scalars['String']>;
  /** Current mailing address line 2, available if isMailingAddressSameAsResidentialAddress=false */
  mailingAddressLine2?: Maybe<Scalars['String']>;
  /** Current mailing address city, available if isMailingAddressSameAsResidentialAddress=false */
  mailingAddressCity?: Maybe<Scalars['String']>;
  /** Current mailing address region/province, available if isMailingAddressSameAsResidentialAddress=false */
  mailingAddressRegion?: Maybe<Scalars['String']>;
  /** Current mailing address state, available if isMailingAddressSameAsResidentialAddress=false */
  mailingAddressState?: Maybe<Scalars['String']>;
  /** Current mailing address zip/postal code, available if isMailingAddressSameAsResidentialAddress=false */
  mailingAddressZipCode?: Maybe<Scalars['String']>;
  /** Is the account maintained for a current or former politically exposed person or public official? */
  isAccountMaintainedForPoliticalOrPublicPerson: Scalars['Boolean'];
  /** Please provide the names of that official and official's immediate family members. Available if isAccountMaintainedForPoliticalOrPublicPerson=true */
  officialNameAndFamilyMembersNames?: Maybe<Scalars['String']>;
  /** Please provide the name of the related political organization. Available if isAccountMaintainedForPoliticalOrPublicPerson=true */
  nameOfPoliticalOrganization?: Maybe<Scalars['String']>;
  /** Is the account holder a control person of a publicly traded company? (Director, Officer, or 10% Stock Holder) */
  isAccountHolderIsControlHolderOfPublicCompany: Scalars['Boolean'];
  /** Please list the name of the company(s) and the stock ticker symbol. Available if isAccountHolderIsControlHolderOfPublicCompany=true */
  listOfHoldedCompanies?: Maybe<Scalars['String']>;
  /** Are you, or anyone authorized to trade in your account, affiliated with or work with or work for a member firm of a stock exchange or FINRA? */
  isAffiliatedWithExchangeOrFINRA: Scalars['Boolean'];
  /** Name of firm. Available if isAffiliatedWithExchangeOrFINRA=true */
  nameOfAffiliatedFirm?: Maybe<Scalars['String']>;
  /** Have you granted trading authorization to another party */
  isThirdPartyTradingAuthorizationGranted: Scalars['Boolean'];
  /** Name of agent. Available if isThirdPartyTradingAuthorizationGranted=true */
  nameOfThirdPartyAgent?: Maybe<Scalars['String']>;
  /** Please confirm type of account you are opening */
  accountLocationType: EAccountLocationType;
  /** Are you 55 or older? If areYou55OrOlder=true, user should enter trusted contact information */
  areYou55OrOlder: Scalars['Boolean'];
  /** Do you want to add trusted contact information? */
  doYouWantToAddTrustedContactInformation: Scalars['Boolean'];
  /** Trusted Contact First Name */
  trustedContactFirstName?: Maybe<Scalars['String']>;
  /** Trusted Contact Last Name */
  trustedContactLastName?: Maybe<Scalars['String']>;
  /** Trusted Contact Phone Number */
  trustedContactPhoneNumber?: Maybe<Scalars['String']>;
  /** Trusted Contact Email */
  trustedContactEmail?: Maybe<Scalars['String']>;
  /** Trusted Contact Country */
  trustedContactCountry?: Maybe<ECountry>;
  /** Trusted Contact Address Line 1 */
  trustedContactAddressLine1?: Maybe<Scalars['String']>;
  /** Trusted Contact Address Line 2 */
  trustedContactAddressLine2?: Maybe<Scalars['String']>;
  /** Trusted Contact City */
  trustedContactCity?: Maybe<Scalars['String']>;
  /** Trusted Contact Region */
  trustedContactRegion?: Maybe<Scalars['String']>;
  /** Trusted Contact State */
  trustedContactState?: Maybe<Scalars['String']>;
  /** Trusted Contact Zip/Postal Code */
  trustedContactZipCode?: Maybe<Scalars['String']>;
  /** Under FINRA Rule 4512 Apex Clearing Corporation is required to disclose to you (the customer) that Apex Clearing Corporation or an associated person of Apex Clearing Corporation is authorized to contact the trusted contact person and disclose information about the customer’s account to address possible financial exploitation, to confirm the specifics of the customer’s current contact information, health status, or the identity of any legal guardian, executor, trustee or holder of a power of attorney, or as otherwise permitted by FINRA Rule 2165. */
  trustedContactDisclosureAgreement?: Maybe<Scalars['Boolean']>;
  /** What is your employment status? */
  employmentStatus: EEmploymentStatus;
  /** Employer. Available if employmentStatus=EMPLOYED */
  employer?: Maybe<Scalars['String']>;
  /** Position. Available if employmentStatus=EMPLOYED */
  position?: Maybe<Scalars['String']>;
  /** Source of income. Available if employmentStatus=UNEMPLOYED */
  sourceOfIncome?: Maybe<Scalars['String']>;
  /** Investment Objective */
  investingObjective: EInvestmentObjective;
  /** Secondary Investment Objective */
  secondaryInvestingObjective?: Maybe<EInvestmentObjective>;
  /** Annual income */
  annualIncome: EAnnualIncome;
  /** Liquid net worth */
  liquidNetWorth?: Maybe<ENetWorth>;
  /** Total Net Worth */
  totalNetWorth: ENetWorth;
  /** Risk tolerance */
  riskTolerance: ERiskTolerance;
  /** Liquidity Needs */
  liquidityNeeds?: Maybe<ELiquidityNeeds>;
  /** Time Horizon */
  timeHorizon?: Maybe<ETimeHorizon>;
  /** Investment Experience */
  investmentExperience: EInvestmentExperience;
  /** Tax bracket (%) */
  taxBracket: Scalars['String'];
  /** Select whether or not you would like to enroll your account into the Sweep Program. By enrolling in the Sweep Program, your credit balances, including dividends and proceeds from the sale of securities that are credited to your account, will automatically be swept. */
  enableSweepProgram?: Maybe<Scalars['Boolean']>;
  /** When Securities are sold. Available if enableSweepProgram=false */
  actionOnSecuritiesSold?: Maybe<ESecuritiesAction>;
  /** Dividend Reinvestment */
  dividendReinvestment?: Maybe<Scalars['Boolean']>;
  /** Dividend Proceeds. Available if dividendReinvestment=false */
  dividendProceeds?: Maybe<EDividendProceedsAction>;
  /** Dividend Proceeds Send Frequency. Available if dividendProceeds=SEND */
  dividendProceedsSendFrequency?: Maybe<EDividendProceedsSendFrequency>;
  /** Would you like to complete Transfer on Death form? Available only for domestic applicants */
  completeTransferOfDeath?: Maybe<Scalars['Boolean']>;
  /** Are you married? */
  married?: Maybe<Scalars['Boolean']>;
  /** Note: Spouse's signature is required if the spouse and\/or Account Holder reside(s) in a Community Property or Marital Property State, and the spouse is not an account holder, or named as the sole primary beneficiary. By signing, spouse voluntarily and irrevocably consents to the beneficiary designation and to Apex paying all sums due upon death as designated above subject to the provisions of this Transfer on Death (TOD) Beneficiary Designation Form. */
  spouseSignatureAgreement?: Maybe<Scalars['Boolean']>;
  /** Signature of the spouse for TOD form */
  spouseSignature?: Maybe<Scalars['String']>;
  /** Primary Beneficiary Legal Name */
  primaryBeneficiaryLegalName?: Maybe<Scalars['String']>;
  /** Primary Beneficiary Date of Birth */
  primaryBeneficiaryDateOfBirth?: Maybe<Scalars['DateTime']>;
  /** Primary Beneficiary Social Security Number */
  primaryBeneficiarySsn?: Maybe<Scalars['String']>;
  /** Share percentage */
  primaryBeneficiarySharePercentage?: Maybe<Scalars['Int']>;
  /** Primary Beneficiary Mailing Address Country */
  primaryBeneficiaryMailingAddressCountry?: Maybe<ECountry>;
  /** Primary Beneficiary Mailing Address Line1 */
  primaryBeneficiaryMailingAddressLine1?: Maybe<Scalars['String']>;
  /** Primary Beneficiary Mailing Address Line2 */
  primaryBeneficiaryMailingAddressLine2?: Maybe<Scalars['String']>;
  /** Primary Beneficiary Mailing Address City */
  primaryBeneficiaryMailingAddressCity?: Maybe<Scalars['String']>;
  /** Primary Beneficiary Mailing Address Region/Provice */
  primaryBeneficiaryMailingAddressRegion?: Maybe<Scalars['String']>;
  /** Primary Beneficiary Mailing Address State */
  primaryBeneficiaryMailingAddressState?: Maybe<Scalars['String']>;
  /** Primary Beneficiary Mailing Address Zip/Postal Code */
  primaryBeneficiaryMailingAddressZipCode?: Maybe<Scalars['String']>;
  /** # Transfer on Death (TOD) Beneficiary Designation\n  Please note that Transfer on Death Beneficiary Designations are not available to residents in all jurisdictions.\n  Please also note that TOD Accounts are subject to receipt and acceptance by our clearing firm, Apex Clearing Corporation (“Apex”). No TOD designation will be effected until all required documentation is received and accepted.\n  ## Beneficiary Designation\n  To my Broker\/Dealer (You or Your):\n  I (We) wish to create a transfer on death (TOD) registration for the account listed above. I (We) hereby designate the person(s) identified below ( Beneficiary(ies) ) to receive all monies, securities and other assets held in the account listed above upon my (our) death, or the death of the last surviving account owner in the case of a joint account. I (We) may change the designation of the beneficiary(ies) only by completing a new Transfer on Death Beneficiary Designation Form. The Beneficiary Designation may not be revoked or changed by will, codicil, trust document or other testamentary document. You may rely on the latest Beneficiary Designation in your possession and no change in Beneficiary shall be effective until actually received and accepted by you.\n  I (We) understand that you have entered into an agreement with Apex with respect to the execution and clearance of securities. I (We also understand that because of the complex legal and tax issues involved, neither you nor Apex will advise whether the TOD designation is appropriate for tax or estate planning. I (We) acknowledge that the ability to register a securities account in TOD form is created by state law and not all states have enacted such laws. I (We) have been advised that I (we) should consult my (our) own legal and tax advisers before electing or revoking the TOD account designation as I (we) deem appropriate.\n  I (We) hereby designate the person(s) named below as beneficiary(ies) to receive the assets remaining in the account listed above upon my (our) death:\n  ### Primary Beneficiaries\n  If a trust, please provide trust name as legal name.\n  * Given Name: `primaryBeneficiaries.beneficiaryName.givenName`\n  * Family Name: `primaryBeneficiaries.beneficiaryName.familyName`\n  * Legal Name: `primaryBeneficiaries.beneficiaryName.legalName`\n  * Street Address: `primaryBeneficiaries.mailingAddress.streetAddress`\n  * City: `primaryBeneficiaries.mailingAddress.city`\n  * State: `primaryBeneficiaries.mailingAddress.state`\n  * Postal Code: `primaryBeneficiaries.mailingAddress.postalCode`\n  * Country: `primaryBeneficiaries.mailingAddress.country`\n  * Phone: `primaryBeneficiaries.phoneNumber`\n  * Date of Birth or Creation: `primaryBeneficiaries.dateOfBirthOrCreation`\n  * Social Security Number or Tax ID: `primaryBeneficiaries.taxId`\n  * Relationship to Account Owner: `primaryBeneficiaries.relationshipToAccountOwner`\n  * Share Percentage: `primaryBeneficiaries.sharePercentage`\n  Please note: Share totals must equal 100%. Do not use fractional percentages or dollar amounts.\n  ### Contingent Beneficiaries\n  If a trust, please provide trust name as legal name.\n  * Given Name: `contingentBeneficiaries.beneficiaryName.givenName`\n  * Family Name: `contingentBeneficiaries.beneficiaryName.familyName`\n  * Legal Name: `contingentBeneficiaries.beneficiaryName.legalName`\n  * Street Address: `contingentBeneficiaries.mailingAddress.streetAddress`\n  * City: `contingentBeneficiaries.mailingAddress.city`\n  * State: `contingentBeneficiaries.mailingAddress.state`\n  * Postal Code: `contingentBeneficiaries.mailingAddress.postalCode`\n  * Country: `contingentBeneficiaries.mailingAddress.country`\n  * Phone: `contingentBeneficiaries.phoneNumber`\n  * Date of Birth or Creation: `contingentBeneficiaries.dateOfBirthOrCreation`\n  * Social Security Number or Tax ID: `contingentBeneficiaries.taxId`\n  * Relationship to Account Owner: `contingentBeneficiaries.relationshipToAccountOwner`\n  * Share Percentage: `contingentBeneficiaries.sharePercentage`\n  Please note: Share totals must equal 100%. Do not use fractional percentages or dollar amounts.\n  I (We) understand that upon my (our) death you many require my (our) Beneficiary(ies) to provide you with certain documents as you may deem necessary prior to instructing Apex to move the assets from my (our) TOD account into the Designated beneficiary(ies’) account(s).\n  I acknowledge and agree that upon my (our) death, distribution will be made to my (our) designated beneficiaries in the following manner:\n  ### PRIMARY BENEFICIARY(IES)\n  * Any interest I (We) may have in this account will be paid in equal proportions, unless otherwise indicated, to the primary\n  beneficiary(ies) I have designated\n  * If the death of one or more designated Primary Beneficiary(ies) precedes my (our) death, the interest they would have received from this account will be paid, upon my (our) death, to my surviving Primary Beneficiary(ies) Pro Rata such that 100% is paid to the surviving primary beneficiary(ies)\n  ### CONTINGENT BENEFICIARY(IES)\n  * If none of my Primary Beneficiaries survives me (us), any interest I (We) have in this account will be paid in equal\n  proportions unless otherwise indicated to the Contingent Beneficiary(ies) I (We) have designated\n  * If the death of one or more designated Contingent Beneficiary precedes my (our) death, the interest they would have received from this account will be paid, upon my (our) death, to my surviving Contingent Beneficiary(ies) Pro Rata such that 100% is paid to the surviving Contingent beneficiary(ies)\n  ### NO SURVIVING BENEFICIARY(IES)\n  * If none of the Primary or Contingent beneficiaries I (We) have designated survives me (us), any interest I (We) may\n  have in this account shall pass as if my (our) Transfer on Death instructions did not exist.\n  I (We) understand and agree that Apex, may register and hold the securities in my (our) TOD account in Apex’s name or other “street” or nominee name and that this will create no duty on Apex’s part to determine registration or ownership of the account as a whole before or after my (our) death.\n  In consideration for establishing this registration and accepting the Beneficiary Designation, I (we) (including my (our) estate(s), heirs, spouse, successors in interest, and all Beneficiaries named herein) shall indemnify and hold harmless you and Apex (and affiliates, directors, officers, control persons, agents and employees thereof) from and against all claims, actions, costs and liabilities, including attorneys’ fees, by person or entity arising out of or relating to this account registration and transfers hereunder.\n  ## Miscellaneous Provisions\n  * Apex reserves the right the refuse to accept or renew this TOD Beneficiary Designation Form and may terminate it at any time in its sole discretion and for any reason.\n  * If any provision hereof is or at any time should become inconsistent with any present or future law, rule or regulation of any securities or commodities exchange or of any state or other sovereign government or an agency or regulatory body thereof, and if any of these entities have jurisdiction over the subject matter of this TOD Beneficiary Designation Form, said provision shall be deemed to be superseded or modified to conform to such law, rule or regulation, but in all other respects the TOD Beneficiary Designation Form shall continue and remain in full force and effect.\n  * The provisions of this TOD Beneficiary Designation Form, including indemnities stated herein, shall be binding upon the Account Holder’s estate, Beneficiaries, heirs, executors, administrators, successors, and assigns, shall insure to the benefit of each of you and Apex as your respective successors, assigns and affiliated companies, and shall survive the termination of this TOD Beneficiary Designation Form or the TOD Account. */
  transferOnDeathBeneficiaryDesignation?: Maybe<Scalars['Boolean']>;
  /** This Customer Account Agreement (the \"Agreement\") sets forth the respective rights and obligations of Apex Clearing Corporation (\"you\" or \"your\" or \"Apex\") and the Customer's (as defined below) brokerage firm (the \"Introducing Broker\"), and the customer(s) identified on the New Account Application (the \"Customer\") in connection with the Customer's brokerage account with the Introducing Broker (\"the Account\"). The Customer hereby agrees as follows with respect to the Account, which the Customer has established with the Introducing Broker for the purchase, sale or carrying of securities or contracts relating thereto and\/or the borrowing of funds, which transactions are cleared through you. To help the government fight the funding of terrorism and money laundering, Federal law requires all financial institutions to obtain, verify, and record information that identifies each person who opens an account. In order to open an account, the Customer will provide information that will allow you to identify the Customer including, but not limited to, the Customer's name, address, date of birth, and the Customer's driver's license or other identifying documents.\n  1.  **Applicable Rules and Regulations.** All transactions for the Account shall be subject to the constitution, rules, regulations, customs and usages of the exchange or market and its clearing house, if any, upon which such transactions are executed, except as otherwise specifically provided in this Agreement.\n  2.  **Definitions.** \"Obligations\" means all indebtedness, debit balances, liabilities or other obligations of any kind of the Customer to you, whether now existing or hereafter arising. \"Securities and other property\" shall include, but shall not be limited to, money, securities, commodities or other property of every kind and nature and all contracts and options relating thereto, whether for present or future delivery.\n  3.  **Breach; Security Interest.** Whenever in your discretion you consider it necessary for your protection, or for the protection of the Customer's Introducing Broker or in the event of, but not limited to; (i) any breach by the Customer of this or any other agreement with you or (ii) the Customer's failure to pay for securities and other property purchased or to deliver securities and other property sold, you may sell any or all securities and other property held in any of the Customer's accounts (either individually or jointly with others), cancel or complete any open orders for the purchase or sale of any securities and other property, and\/or borrow or buy-in any securities and other property required to make delivery against any sale, including a short sale, effected for the Customer, all without notice or demand for deposit of collateral, other notice of sale or purchase, or other notice or advertisement, each of which is expressly waived by the Customer, and\/or you may require the Customer to deposit cash or adequate collateral to the Customer's account prior to any settlement date in order to assure the performance or payment of any open contractual commitments and\/or unsettled transactions. You have the right to refuse to execute securities transactions for the Customer at any time and for any reason. Any and all securities and other property belonging to the Customer or in which the Customer may have an interest held by you or carried in any of the Customer's accounts with you (either individually or jointly with others) shall be subject to a first and prior security interest and lien for the discharge of the Customer's obligations to you, wherever or however arising and without regard to whether or not you have made advances with respect to such securities and other property, and you are hereby authorized to sell and\/or purchase any and all securities and other property in any of the Customer's accounts, and\/or to transfer any such securities and other property among any of the Customer's accounts to the fullest extent of the law and without notice where allowed. The losses, costs and expenses, including but not limited to reasonable attorneys' fees and expenses, incurred and payable or paid by you in the (i) collection of a debit balance and\/or any unpaid deficiency in the accounts of the Customer with you or (ii) defense of any matter arising out of the Customer's securities transactions, shall be payable to you by the Customer. The Customer understands that because of circumstances beyond the Broker-Dealer's control, its customers' voting rights may be impaired. For example, if the stock of a company that another customer has purchased has not yet been received from the seller(s), then other customers' abilities to vote that company's stock could be impaired until those shares are received. In addition, if the stock of a company that the Customer has purchased has not yet been received from the seller(s), then payments received by the Customer from the Introducing Broker, in lieu of the dividends on that stock not yet received, may receive tax treatment less favorable than that accorded to dividends.\n  4.  **Cancellation.** You are authorized, in your discretion, should you for any reason whatsoever deem it necessary for your protection, without notice, to cancel any outstanding order, to close out the accounts of the Customer, in whole or in part, or to close out any commitment made on behalf of the Customer.\n  5.  **Payment of Indebtedness Upon Demand.** The Customer shall at all times be liable for the payment upon demand of any obligations owing from the Customer to you, and the Customer shall be liable to you for any deficiency remaining in any such accounts in the event of the liquidation thereof (as contemplated in Paragraph 3 of this Agreement or otherwise), in whole or in part, by you or by the Customer; and the Customer shall make payment of such obligations upon demand.\n  6.  **Accounts Carried as Clearing Broker.** The Customer understands that you are carrying the accounts of the Customer as clearing broker by arrangement with the Customer's Introducing Broker through whose courtesy the account of the Customer has been introduced to you. Until receipt from the Customer of written notice to the contrary, you may accept from and rely upon the Customer's Introducing Broker for (a) orders for the purchase or sale in said account of securities and other property, and (b) any other instructions concerning the Customer's accounts. The Customer represents that the Customer understands that you act only to clear trades introduced by the Customer's Introducing Broker and to effect other back office functions for the Customer's introducing broker. The Customer confirms to you that the Customer is relying for any advice concerning the Customer's accounts solely on the Customer's Introducing Broker. The Customer understands that all representatives, employees and other agents with whom the Customer communicates concerning the Customer's account are agents of the Introducing Broker, and not your representatives, employees or other agents and the Customer will in no way hold you liable for any trading losses that the Customer may incur. The Customer understands that you are not a principal of or partner with, and do not control in any way, the Introducing Broker or its representatives, employees or other agents. The Customer understands that you will not review the Customer's accounts and will have no responsibility for trades made in the Customer's accounts. You shall not be responsible or liable for any acts or omissions of the Introducing Broker or its representatives, employees or other agents. Notwithstanding the foregoing, in the event that the Customer initiates a claim against you in your capacity as clearing broker and does not prevail, the Customer shall be responsible for the costs and expenses associated with your defense of such claim. The Customer understands you shall be entitled to exercise and enforce directly against the Customer all rights granted to the Introducing Broker.\n  1.  **Accounts Carried as Custodian.** In some cases the Customer's account is being carried by arrangement with the Customer's Investment Advisor or Investment Manager, who uses you as their Broker-Dealer custodian. The Customer acknowledges that your role as custodian is to hold or custody account assets, distribute or collect funds on behalf of the Customer's account, execute and clear trades under instruction of the Customer's Investment Advisor or Investment Manager, generate account statements and provide other custodial services as may be mandated by various regulatory standards and requirements. The Customer understands that in the capacity as custodian, you will not offer investment advice, review the Customer's accounts, and will have no responsibility for trades made in the Customer's accounts. Additionally, in your capacity as custodian, you will not verify the accuracy of management fees that the Customer pays to Investment Advisors or Investment Managers pursuant to the terms of the Investment Management Agreement executed between the Customer and the Investment Advisor or Investment Manager. Notwithstanding the foregoing, in the event that the Customer initiates a claim against you in your capacity as custodial broker and does not prevail, the Customer shall be responsible for the costs and expenses associated with your defense of such claim.\n  7.  **Communications.** You may send communications to the Customer at the Customer's address on the New Account Application or at such other address as the Customer may hereafter give you in writing, and all communications so sent, whether by mail, telegraph, or otherwise, shall be deemed given to the Customer personally, whether actually received or not. Reports of execution of orders and statements of accounts of the Customer shall be conclusive if not objected to in writing to you, the former within five (5) days and the latter within ten (10) days, after forwarding by you by mail or otherwise. In consideration of your sending any mail to me in care of a Post Office Box Address or a third party, I hereby agree that \"all correspondence of any nature whatsoever\" sent to me in such address will have the same force and effect as if it had been delivered to me personally.\n  8.  **ARBITRATION AGREEMENT. THIS AGREEMENT CONTAINS A PREDISPUTE ARBITRATION CLAUSE. BY SIGNING AN ARBITRATION AGREEMENT THE PARTIES AGREE AS FOLLOWS:**\n  1. **ALL PARTIES TO THIS AGREEMENT ARE GIVING UP THE RIGHT TO SUE EACH OTHER IN COURT, INCLUDING THE RIGHT TO A TRIAL BY JURY EXCEPT AS PROVIDED BY THE RULES OF THE ARBITRATION FORUM IN WHICH A CLAIM IS FILED;**\n  2. **ARBITRATION AWARDS ARE GENERALLY FINAL AND BINDING; A PARTY'S ABILITY TO HAVE A COURT REVERSE OR MODIFY AN ARBITRATION AWARD IS VERY LIMITED.**\n  3. **THE ABILITY OF THE PARTIES TO OBTAIN DOCUMENTS, WITNESS STATEMENTS AND OTHER DISCOVERY IS GENERALLY MORE LIMITED IN ARBITRATION THAN IN COURT PROCEEDINGS;**\n  4. **THE ARBITRATORS DO NOT HAVE TO EXPLAIN THE REASON(S) FOR THEIR AWARD UNLESS, IN AN ELIGIBLE CASE, A JOINT REQUEST FOR AN EXPLAINED DECISION HAS BEEN SUBMITTED BY ALL PARTIES TO THE PANEL AT LEAST 20 DAYS PRIOR TO THE FIRST SCHEDULED HEARING DATE.**\n  5. **THE PANEL OF ARBITRATORS MAY INCLUDE A MINORITY OF ARBITRATORS WHO WERE OR ARE AFFILIATED WITH THE SECURITIES INDUSTRY.**\n  6. **THE RULES OF SOME ARBITRATION FORUMS MAY IMPOSE TIME LIMITS FOR BRINGING A CLAIM IN ARBITRATION. IN SOME CASES, A CLAIM THAT IS INELIGIBLE FOR ARBITRATION MAY BE BROUGHT IN COURT.**\n  7. **THE RULES OF THE ARBITRATION FORUM IN WHICH THE CLAIM IS FILED, AND ANY AMENDMENTS THERETO, SHALL BE INCORPORATED INTO THIS AGREEMENT.**\n  **THE FOLLOWING ARBITRATION AGREEMENT SHOULD BE READ IN CONJUNCTION WITH THE DISCLOSURES ABOVE. ANY AND ALL CONTROVERSIES, DISPUTES OR CLAIMS BETWEEN THE CUSTOMER AND YOU, OR THE INTRODUCING BROKER, OR THE AGENTS, REPRESENTATIVES, EMPLOYEES, DIRECTORS, OFFICERS OR CONTROL PERSONS OF YOU OR THE INTRODUCING BROKER, ARISING OUT OF, IN CONNECTION WITH, FROM OR WITH RESPECT TO (a) ANY PROVISIONS OF OR THE VALIDITY OF THIS AGREEMENT OR ANY RELATED AGREEMENTS, (b) THE RELATIONSHIP OF THE PARTIES HERETO, OR \\(c\\) ANY CONTROVERSY ARISING OUT OF YOUR BUSINESS, THE INTRODUCING BROKER'S BUSINESS OR THE CUSTOMER'S ACCOUNTS, SHALL BE CONDUCTED PURSUANT TO THE CODE OF ARBITRATION PROCEDURE OF THE FINANCIAL INDUSTRY REGULATORY AUTHORITY (\"FINRA\"). THE DECISION AND AWARD OF THE ARBITRATOR(S) SHALL BE CONCLUSIVE AND BINDING UPON ALL PARTIES, AND ANY JUDGMENT UPON ANY AWARD RENDERED MAY BE ENTERED IN A COURT HAVING JURISDICTION THEREOF, AND NEITHER PARTY SHALL OPPOSE SUCH ENTRY.**\n  No person shall bring a putative or certified class action to arbitration, nor seek to enforce any pre-dispute arbitration agreement against any person who has initiated in court a putative class action; or who is a member of a putative class who has not opted out of the class with respect to any claims encompassed by the putative class action until: (i) the class certification is denied; or (ii) the class is de-certified; or (iii) the customer is excluded from the class by the court. Such forbearance to enforce an agreement to arbitrate shall not constitute a waiver of any rights under this agreement except to the extent stated herein.\n  9.  **Representations.** The Customer represents that the Customer is of majority age. The Customer represents either that the Customer is not an employee of any exchange, or of any corporation of which any exchange owns a majority of the capital stock, or of a member of any exchange, or of a member firm or member corporation registered on any exchange or of a bank, trust company, insurance company or of any corporation, firm or individual engaged in the business dealing either as broker or as principal in securities, bills of exchange, acceptances or other forms of commercial paper, or alternatively, that the Customer has obtained and will provide to you additional documentation which may include information required under FINRA Rule 3210 from its employer authorizing the Customer to open and maintain an account with you.\n  If the Customer is a corporation, partnership, trust or other entity, the Customer represents that its governing instruments permit this Agreement, that this Agreement has been authorized by all applicable persons and that the signatory on the New Account Application is authorized to bind the Customer. The Customer represents that the Customer shall comply with all applicable laws, rules and regulations in connection with the Customer's account. The Customer further represents that no one except the Customer has an interest in the account or accounts of the Customer with you.\n  10. **Joint Accounts.** If the New Account Application indicates that the Account shall consist of more than one person, the Customer's obligations under this Agreement shall be joint and several. References to the \"Customer\" shall include each of the customers identified on the New Account Application. You may rely on transfer or other instructions from any one of the Customers in a joint account, and such instructions shall be binding on each of the Customers. You may deliver securities or other property to, and send confirmations; notices, statements and communications of every kind, to any one of the Customers, and such action shall be binding on each of the Customers. Notwithstanding the foregoing, you are authorized in your discretion to require joint action by the joint tenants with respect to any matter concerning the joint account, including but not limited to the giving or cancellation of orders and the withdrawal of money or securities. In the case of Tenants by the Entirety accounts, joint action will be required for all matters concerning the joint account. Tenants by Entirety is not recognized in certain jurisdictions, and, where not expressly allowed, will not be a permitted designation of the account.\n  11. **Other Agreements.** If the Customer trades any options, the Customer agrees to be bound by the terms of your Customer Option Agreement. The Customer understands that copies of these agreements are available from you and, to the extent applicable, are incorporated by reference herein. The terms of these other agreements are in addition to the provisions of this Agreement and any other written agreements between you and the Customer.\n  12. **Data Not Guaranteed.** The Customer expressly agrees that any data or online reports is provided to the Customer without warranties of any kind, express or implied, including but not limited to, the implied warranties of merchantability, fitness of a particular purpose or non-infringement. The Customer acknowledges that the information contained in any reports provided by you is obtained from sources believed to be reliable but is not guaranteed as to its accuracy of completeness. Such information could include technical or other inaccuracies, errors or omissions. In no event shall you or any of your affiliates be liable to the Customer or any third party for the accuracy, timeliness, or completeness of any information made available to the Customer or for any decision made or taken by the Customer in reliance upon such information. In no event shall you or your affiliated entities be liable for any special incidental, indirect or consequential damages whatsoever, including, without limitation, those resulting from loss of use, data or profits, whether or not advised of the possibility of damages, and on any theory of liability, arising out of or in connection with the use of any reports provided by you or with the delay or inability to use such reports.\n  13. **Payment for Order Flow Disclosure.** Depending on the security traded and absent specific direction from the Customer, equity and option orders are routed to market centers (i.e., broker-dealers, primary exchanges or electronic communication networks) for execution. Routing decisions are based on a number of factors including the size of the order, the opportunity for price improvement and the quality of order executions, and decisions are regularly reviewed to ensure the duty of best execution is met. You or the Introducing Broker may receive compensation or other consideration for the placing of orders with market centers for execution. The amount of the compensation depends on the agreement reached with each venue. The source and nature of compensation relating to the Customer's transactions will be furnished upon written request.\n  14. **Credit Check.** You are authorized, in your discretion, should you for any reason deem it necessary for your protection to request and obtain a consumer credit report for the Customer.\n  15. **Miscellaneous.** If any provision of this Agreement is held to be invalid or unenforceable, it shall not affect any other provision of this Agreement. The headings of each section of this Agreement are descriptive only and do not modify or qualify any provision of this Agreement. This Agreement and its enforcement shall be governed by the laws of the state of Texas and shall cover individually and collectively all accounts which the Customer has previously opened, now has open or may open or reopen with you, or any introducing broker, and any and all previous, current and future transactions in such accounts. Except as provided in this Agreement, no provision of this Agreement may be altered, modified or amended unless in writing signed by your authorized representative. This Agreement and all provisions shall inure to the benefit of you and your successors, whether by merger, consolidation or otherwise, your assigns, the Introducing Broker, and all other persons specified in Paragraph 8. You shall not be liable for losses caused directly or indirectly by any events beyond your reasonable control, including without limitation, government restrictions, exchange or market rulings, suspension of trading or unusually heavy trading in securities, a general change in economic, political or financial conditions, war or strikes. You may transfer the accounts of the Customer to your successors and assigns. This Agreement shall be binding upon the Customer and the heirs, executors, administrators, successors and assigns of the Customer. Failure to insist on strict compliance with this Agreement is not considered a waiver of your rights under this Agreement. At your discretion, you may terminate this Agreement at any time on notice to the Customer, the Customer will continue to be responsible for any obligation incurred by the Customer prior to termination. The Customer may not assign the Customer's rights or delegate the Customer's obligations under this Agreement, in whole or in part, without your prior consent.\n  16. **Sweep Program.** If the Customer elects to participate in a sweep program, the Customer acknowledges and agrees that: (a) the Customer has read and understands the sweep program    terms and conditions available at http:\/\/www.apexclearing.com\/disclosures\/ ; (b) you may make changes to your sweep programs and products at any time, in your sole discretion and with or without notice to Customer; (c) the free credit balances in the Customer's Account may begin being included in the sweep program upon Account opening; and (d) you have no obligation to monitor the applicable sweep program elected for the Customer's Account or to make recommendations about, or changes to, the sweep program that might be beneficial to the Customer.\n  17. **SIPC Protection.** As a member of the Securities Investor Protection Corporation (SIPC), funds are available to meet customer claims up to a ceiling of \\$500,000, including a maximum of \\$250,000 for cash claims. For additional information regarding SIPC coverage, including a brochure, please contact SIPC at (202) 371-8300 or visit www.sipc.org. Apex has purchased an additional insurance policy through a group of London Underwriters (with Lloyd's of London Syndicates as the Lead Underwriter) to supplement SIPC protection. This additional insurance policy becomes available to customers in the event that SIPC limits are exhausted and provides protection for securities and cash up to certain limits. Similar to SIPC protection, this additional insurance does not protect against a loss in the market value of securities.\n  18. **Tax Treaty Eligibility.** This agreement shall serve as the Customer's certification that you are eligible to receive tax treaty benefits between the country or (of) residence indicated on the new account form and the country (ies) of origin holding jurisdiction over the instruments held within the customer's account.\n  19. **Trusted Contacts.** Under FINRA Rule 4512 Apex Clearing Corporation is required to disclose to you (the customer) that Apex Clearing Corporation or an associated person of Apex Clearing Corporation is authorized to contact the trusted contact person and disclose information about the customer's account to address possible financial exploitation, to confirm the specifics of the customer's current contact information, health status, or the identity of any legal guardian, executor, trustee or holder of a power of attorney, or as otherwise permitted by FINRA Rule 2165.\n  20. **ACH Agreement.** If I request Automated Clearinghouse (\"ACH\") transactions from my Account at Clearing Firm, I authorize Clearing Firm to originate or facilitate transfer credits\/debits to\/from my eligible bank account. Transactions sent through the NACHA network will be subject to all applicable rules of NACHA and all rules set forth in Federal Reserve Operating circulars or other applicable laws and regulations. ACH deposits to my brokerage account are provisional. If the beneficiary bank does not receive final and complete payment for a payment order transferred through ACH, the beneficiary bank is entitled to recover from the beneficiary any provisional credit and Clearing Firm may charge my account for the transaction amount. I understand Clearing Firm or my Broker may not notify me of any returned or rejected ACH transfers. I agree to hold Clearing Firm and Clearing Firm's agents free of liability for compliance with these instructions. I hereby agree to hold harmless Clearing Firm and each of its affiliates, offices, directors, employees, and agents against, any claims, judgments, expenses, liabilities or costs of defense or settlement relating to: (a) any refusal or failure to initiate or honor any credit or debit request, by Clearing Firm or my Broker, whether (i) due to a lack of funds necessary to credit my account; (ii) due to inadvertence, error caused by similarity of account holder names or (iii) otherwise provided Clearing Firm has not acted in bad faith; (b) if the routing number is incorrect or the routing number or other information changes at another U.S. financial institution or (c) any loss, damage, liability or claim arising, directly or indirectly, from any error, delay or failure which is caused by circumstances beyond Clearing Firm's direct control. To the extent permitted by applicable law or regulation, Clearing Firm hereby disclaims all warranties, express or implied, and in no event shall Clearing Firm be liable for any special indirect, incidental, or consequential damages whatsoever resulting from the ACH electronic service or any ACH transactions. Nothing in this herein shall constitute a commitment or undertaking by Clearing Firm or my Broker to effect any ACH transaction or otherwise act upon my instructions or those of my Broker with respect to any account at Clearing Firm. This authorization shall remain in full force and effect until I revoke authorization by written notification to my Broker that is forwarded to Clearing Firm. I understand that Clearing Firm has the right to terminate or suspend the ACH agreement at any time and without notice.\n  ---\n  # Privacy Policy\n  Apex Clearing Corporation (\"Apex\") carries your account as a clearing broker by arrangement with your broker-dealer or registered investment advisor as Apex's introducing client. At Apex, we understand that privacy is an important issue for customers of our introducing firms. It is our policy to respect the privacy of all accounts that we maintain as clearing broker and to protect the security and confidentiality of non-public personal information relating to those accounts. Please note that this policy generally applies to former customers of Apex as well as current customers.\n  ### Personal Information Collected\n  In order to service your account as a clearing broker, information is provided to Apex by your introducing firm who collects information from you in order to provide the financial services that you have requested. The information collected by your introducing firm and provided to Apex or otherwise obtained by Apex may come from the following sources and is not limited to:\n  * Information included in your applications or forms, such as your name, address, telephone number, social security number, occupation, and income;\n  * Information relating to your transactions, including account balances, positions, and activity;\n  * Information which may be received from consumer reporting agencies, such as credit bureau reports;\n  * Information relating to your creditworthiness;\n  * Information which may be received from other sources with your consent or with the consent of your introducing firm.\n  In addition to servicing your account, Apex may make use of your personal information for analysis purposes, for example, to draw conclusions, detect patterns or determine preferences.\n  ## Sharing of Non-public Personal Information\n  Apex does not disclose non-public personal information relating to current or former customers of introducing firms to any third parties, except as required or permitted by law, including but not limited to any obligations of Apex under the USA PATRIOT Act, and in order to facilitate the clearing of customer transactions in the ordinary course of business.\n  Apex has multiple affiliates and relationships with third party companies. Examples of these companies include financial and non-financial companies that perform services such as data processing and companies that perform securities executions on your behalf. We may share information among our affiliates and third parties, as permitted by law, in order to better service your financial needs and to pursue legitimate business interests, including to carry out, monitor and analyze our business, systems and operations.\n  ## Security\n  Apex strives to ensure that our systems are secure and that they meet industry standards. We seek to protect non-public personal information that is provided to Apex by your introducing firm or otherwise obtained by Apex by implementing physical and electronic safeguards. Where we believe appropriate, we employ firewalls, encryption technology, user authentication systems (i.e. passwords and personal identification numbers) and access control mechanisms to control access to systems and data. Apex endeavors to ensure that third party service providers who may have access to non-public personal information are following appropriate standards of security and confidentiality. Further, we instruct our employees to use strict standards of care in handling the personal financial information of customers. As a general policy, our staff will not discuss or disclose information regarding an account except; 1) with authorized personnel of your introducing firm, 2) as required by law or pursuant to regulatory request, or 3) as authorized by Apex to a third party or affiliate providing services to your account or pursuing Apex's legitimate business interests.\n  ## Access to Your Information\n  You may access your account information through a variety of media offered by your introducing firm and Apex (i.e. statements or online services). Please contact your introducing firm if you require any additional information. Apex may use \"cookies\" in order to provide better service, to facilitate its customers' use of the website, to track usage of the website, and to address security hazards. A cookie is a small piece of information that a website stores on a personal computer, and which it can later retrieve.\n  ## Changes to Apex's Privacy Policy\n  Apex reserves the right to make changes to this policy.\n  ## How to Get in Touch with Apex about this Privacy Policy\n  For reference, this Privacy Policy is available on our website at www.apexclearing.com. For more information relating to Apex's Privacy Policy or to limit our sharing of your personal information, please contact:\n  Apex Clearing Corporation\n  Attn: Compliance Department\n  350 N. St. Paul St., Suite 1300\n  Dallas, Texas 75201\n  214-765-1055 */
  customerAccountAgreement?: Maybe<Scalars['Boolean']>;
  /** This Customer Account Agreement (the "Agreement") sets forth the respective rights and obligations of Apex Clearing Corporation ("you" or "your" or "Apex") and the Customer's (as defined below) brokerage firm (the "Introducing Broker"), and the customer(s) identified on the New Account Application (the "Customer") in connection with the Customer's brokerage account with the Introducing Broker ("the Account"). The Customer hereby agrees as follows with respect to the Account, which the Customer has established with the Introducing Broker for the purchase, sale or carrying of securities or contracts relating thereto and/or the borrowing of funds, which transactions are cleared through you. To help the government fight the funding of terrorism and money laundering, Federal law requires all financial institutions to obtain, verify, and record information that identifies each person who opens an account. In order to open an account, the Customer will provide information that will allow you to identify the Customer including, but not limited to, the Customer's name, address, date of birth, and the Customer's driver's license or other identifying documents. 1. **Applicable Rules and Regulations.** All transactions for the Account shall be subject to the constitution, rules, regulations, customs and usages of the exchange or market and its clearing house, if any, upon which such transactions are executed, except as otherwise specifically provided in this Agreement. 2. **Definitions.** "Obligations" means all indebtedness, debit balances, liabilities or other obligations of any kind of the Customer to you, whether now existing or hereafter arising. "Securities and other property" shall include, but shall not be limited to, money, securities, commodities or other property of every kind and nature and all contracts and options relating thereto, whether for present or future delivery. 3. **Breach; Security Interest.** Whenever in your discretion you consider it necessary for your protection, or for the protection of the Customer's Introducing Broker or in the event of, but not limited to; (i) any breach by the Customer of this or any other agreement with you or (ii) the Customer's failure to pay for securities and other property purchased or to deliver securities and other property sold, you may sell any or all securities and other property held in any of the Customer's accounts (either individually or jointly with others), cancel or complete any open orders for the purchase or sale of any securities and other property, and/or borrow or buy-in any securities and other property required to make delivery against any sale, including a short sale, effected for the Customer, all without notice or demand for deposit of collateral, other notice of sale or purchase, or other notice or advertisement, each of which is expressly waived by the Customer, and/or you may require the Customer to deposit cash or adequate collateral to the Customer's account prior to any settlement date in order to assure the performance or payment of any open contractual commitments and/or unsettled transactions. You have the right to refuse to execute securities transactions for the Customer at any time and for any reason. Any and all securities and other property belonging to the Customer or in which the Customer may have an interest held by you or carried in any of the Customer's accounts with you (either individually or jointly with others) shall be subject to a first and prior security interest and lien for the discharge of the Customer's obligations to you, wherever or however arising and without regard to whether or not you have made advances with respect to such securities and other property, and you are hereby authorized to sell and/or purchase any and all securities and other property in any of the Customer's accounts, and/or to transfer any such securities and other property among any of the Customer's accounts to the fullest extent of the law and without notice where allowed. The losses, costs and expenses, including but not limited to reasonable attorneys' fees and expenses, incurred and payable or paid by you in the (i) collection of a debit balance and/or any unpaid deficiency in the accounts of the Customer with you or (ii) defense of any matter arising out of the Customer's securities transactions, shall be payable to you by the Customer. The Customer understands that because of circumstances beyond the Broker-Dealer's control, its customers' voting rights may be impaired. For example, if the stock of a company that another customer has purchased has not yet been received from the seller(s), then other customers' abilities to vote that company's stock could be impaired until those shares are received. In addition, if the stock of a company that the Customer has purchased has not yet been received from the seller(s), then payments received by the Customer from the Introducing Broker, in lieu of the dividends on that stock not yet received, may receive tax treatment less favorable than that accorded to dividends. 4. **Cancellation.** You are authorized, in your discretion, should you for any reason whatsoever deem it necessary for your protection, without notice, to cancel any outstanding order, to close out the accounts of the Customer, in whole or in part, or to close out any commitment made on behalf of the Customer. 5. **Payment of Indebtedness Upon Demand.** The Customer shall at all times be liable for the payment upon demand of any obligations owing from the Customer to you, and the Customer shall be liable to you for any deficiency remaining in any such accounts in the event of the liquidation thereof (as contemplated in Paragraph 3 of this Agreement or otherwise), in whole or in part, by you or by the Customer; and the Customer shall make payment of such obligations upon demand. 6. **Accounts Carried as Clearing Broker.** The Customer understands that you are carrying the accounts of the Customer as clearing broker by arrangement with the Customer's Introducing Broker through whose courtesy the account of the Customer has been introduced to you. Until receipt from the Customer of written notice to the contrary, you may accept from and rely upon the Customer's Introducing Broker for (a) orders for the purchase or sale in said account of securities and other property, and (b) any other instructions concerning the Customer's accounts. The Customer represents that the Customer understands that you act only to clear trades introduced by the Customer's Introducing Broker and to effect other back office functions for the Customer's introducing broker. The Customer confirms to you that the Customer is relying for any advice concerning the Customer's accounts solely on the Customer's Introducing Broker. The Customer understands that all representatives, employees and other agents with whom the Customer communicates concerning the Customer's account are agents of the Introducing Broker, and not your representatives, employees or other agents and the Customer will in no way hold you liable for any trading losses that the Customer may incur. The Customer understands that you are not a principal of or partner with, and do not control in any way, the Introducing Broker or its representatives, employees or other agents. The Customer understands that you will not review the Customer's accounts and will have no responsibility for trades made in the Customer's accounts. You shall not be responsible or liable for any acts or omissions of the Introducing Broker or its representatives, employees or other agents. Notwithstanding the foregoing, in the event that the Customer initiates a claim against you in your capacity as clearing broker and does not prevail, the Customer shall be responsible for the costs and expenses associated with your defense of such claim. The Customer understands you shall be entitled to exercise and enforce directly against the Customer all rights granted to the Introducing Broker. 1. **Accounts Carried as Custodian.** In some cases the Customer's account is being carried by arrangement with the Customer's Investment Advisor or Investment Manager, who uses you as their Broker-Dealer custodian. The Customer acknowledges that your role as custodian is to hold or custody account assets, distribute or collect funds on behalf of the Customer's account, execute and clear trades under instruction of the Customer's Investment Advisor or Investment Manager, generate account statements and provide other custodial services as may be mandated by various regulatory standards and requirements. The Customer understands that in the capacity as custodian, you will not offer investment advice, review the Customer's accounts, and will have no responsibility for trades made in the Customer's accounts. Additionally, in your capacity as custodian, you will not verify the accuracy of management fees that the Customer pays to Investment Advisors or Investment Managers pursuant to the terms of the Investment Management Agreement executed between the Customer and the Investment Advisor or Investment Manager. Notwithstanding the foregoing, in the event that the Customer initiates a claim against you in your capacity as custodial broker and does not prevail, the Customer shall be responsible for the costs and expenses associated with your defense of such claim. 7. **Communications.** You may send communications to the Customer at the Customer's address on the New Account Application or at such other address as the Customer may hereafter give you in writing, and all communications so sent, whether by mail, telegraph, or otherwise, shall be deemed given to the Customer personally, whether actually received or not. Reports of execution of orders and statements of accounts of the Customer shall be conclusive if not objected to in writing to you, the former within five (5) days and the latter within ten (10) days, after forwarding by you by mail or otherwise. In consideration of your sending any mail to me in care of a Post Office Box Address or a third party, I hereby agree that "all correspondence of any nature whatsoever" sent to me in such address will have the same force and effect as if it had been delivered to me personally. 8. **ARBITRATION AGREEMENT. THIS AGREEMENT CONTAINS A PREDISPUTE ARBITRATION CLAUSE. BY SIGNING AN ARBITRATION AGREEMENT THE PARTIES AGREE AS FOLLOWS:** 1. **ALL PARTIES TO THIS AGREEMENT ARE GIVING UP THE RIGHT TO SUE EACH OTHER IN COURT, INCLUDING THE RIGHT TO A TRIAL BY JURY EXCEPT AS PROVIDED BY THE RULES OF THE ARBITRATION FORUM IN WHICH A CLAIM IS FILED;** 2. **ARBITRATION AWARDS ARE GENERALLY FINAL AND BINDING; A PARTY'S ABILITY TO HAVE A COURT REVERSE OR MODIFY AN ARBITRATION AWARD IS VERY LIMITED.** 3. **THE ABILITY OF THE PARTIES TO OBTAIN DOCUMENTS, WITNESS STATEMENTS AND OTHER DISCOVERY IS GENERALLY MORE LIMITED IN ARBITRATION THAN IN COURT PROCEEDINGS;** 4. **THE ARBITRATORS DO NOT HAVE TO EXPLAIN THE REASON(S) FOR THEIR AWARD UNLESS, IN AN ELIGIBLE CASE, A JOINT REQUEST FOR AN EXPLAINED DECISION HAS BEEN SUBMITTED BY ALL PARTIES TO THE PANEL AT LEAST 20 DAYS PRIOR TO THE FIRST SCHEDULED HEARING DATE.** 5. **THE PANEL OF ARBITRATORS MAY INCLUDE A MINORITY OF ARBITRATORS WHO WERE OR ARE AFFILIATED WITH THE SECURITIES INDUSTRY.** 6. **THE RULES OF SOME ARBITRATION FORUMS MAY IMPOSE TIME LIMITS FOR BRINGING A CLAIM IN ARBITRATION. IN SOME CASES, A CLAIM THAT IS INELIGIBLE FOR ARBITRATION MAY BE BROUGHT IN COURT.** 7. **THE RULES OF THE ARBITRATION FORUM IN WHICH THE CLAIM IS FILED, AND ANY AMENDMENTS THERETO, SHALL BE INCORPORATED INTO THIS AGREEMENT.** **THE FOLLOWING ARBITRATION AGREEMENT SHOULD BE READ IN CONJUNCTION WITH THE DISCLOSURES ABOVE. ANY AND ALL CONTROVERSIES, DISPUTES OR CLAIMS BETWEEN THE CUSTOMER AND YOU, OR THE INTRODUCING BROKER, OR THE AGENTS, REPRESENTATIVES, EMPLOYEES, DIRECTORS, OFFICERS OR CONTROL PERSONS OF YOU OR THE INTRODUCING BROKER, ARISING OUT OF, IN CONNECTION WITH, FROM OR WITH RESPECT TO (a) ANY PROVISIONS OF OR THE VALIDITY OF THIS AGREEMENT OR ANY RELATED AGREEMENTS, (b) THE RELATIONSHIP OF THE PARTIES HERETO, OR \(c\) ANY CONTROVERSY ARISING OUT OF YOUR BUSINESS, THE INTRODUCING BROKER'S BUSINESS OR THE CUSTOMER'S ACCOUNTS, SHALL BE CONDUCTED PURSUANT TO THE CODE OF ARBITRATION PROCEDURE OF THE FINANCIAL INDUSTRY REGULATORY AUTHORITY ("FINRA"). THE DECISION AND AWARD OF THE ARBITRATOR(S) SHALL BE CONCLUSIVE AND BINDING UPON ALL PARTIES, AND ANY JUDGMENT UPON ANY AWARD RENDERED MAY BE ENTERED IN A COURT HAVING JURISDICTION THEREOF, AND NEITHER PARTY SHALL OPPOSE SUCH ENTRY.** No person shall bring a putative or certified class action to arbitration, nor seek to enforce any pre-dispute arbitration agreement against any person who has initiated in court a putative class action; or who is a member of a putative class who has not opted out of the class with respect to any claims encompassed by the putative class action until: (i) the class certification is denied; or (ii) the class is de-certified; or (iii) the customer is excluded from the class by the court. Such forbearance to enforce an agreement to arbitrate shall not constitute a waiver of any rights under this agreement except to the extent stated herein. 9. **Representations.** The Customer represents that the Customer is of majority age. The Customer represents either that the Customer is not an employee of any exchange, or of any corporation of which any exchange owns a majority of the capital stock, or of a member of any exchange, or of a member firm or member corporation registered on any exchange or of a bank, trust company, insurance company or of any corporation, firm or individual engaged in the business dealing either as broker or as principal in securities, bills of exchange, acceptances or other forms of commercial paper, or alternatively, that the Customer has obtained and will provide to you additional documentation which may include information required under FINRA Rule 3210 from its employer authorizing the Customer to open and maintain an account with you. If the Customer is a corporation, partnership, trust or other entity, the Customer represents that its governing instruments permit this Agreement, that this Agreement has been authorized by all applicable persons and that the signatory on the New Account Application is authorized to bind the Customer. The Customer represents that the Customer shall comply with all applicable laws, rules and regulations in connection with the Customer's account. The Customer further represents that no one except the Customer has an interest in the account or accounts of the Customer with you. 10. **Joint Accounts.** If the New Account Application indicates that the Account shall consist of more than one person, the Customer's obligations under this Agreement shall be joint and several. References to the "Customer" shall include each of the customers identified on the New Account Application. You may rely on transfer or other instructions from any one of the Customers in a joint account, and such instructions shall be binding on each of the Customers. You may deliver securities or other property to, and send confirmations; notices, statements and communications of every kind, to any one of the Customers, and such action shall be binding on each of the Customers. Notwithstanding the foregoing, you are authorized in your discretion to require joint action by the joint tenants with respect to any matter concerning the joint account, including but not limited to the giving or cancellation of orders and the withdrawal of money or securities. In the case of Tenants by the Entirety accounts, joint action will be required for all matters concerning the joint account. Tenants by Entirety is not recognized in certain jurisdictions, and, where not expressly allowed, will not be a permitted designation of the account. 11. **Other Agreements.** If the Customer trades any options, the Customer agrees to be bound by the terms of your Customer Option Agreement. The Customer understands that copies of these agreements are available from you and, to the extent applicable, are incorporated by reference herein. The terms of these other agreements are in addition to the provisions of this Agreement and any other written agreements between you and the Customer. 12. **Data Not Guaranteed.** The Customer expressly agrees that any data or online reports is provided to the Customer without warranties of any kind, express or implied, including but not limited to, the implied warranties of merchantability, fitness of a particular purpose or non-infringement. The Customer acknowledges that the information contained in any reports provided by you is obtained from sources believed to be reliable but is not guaranteed as to its accuracy of completeness. Such information could include technical or other inaccuracies, errors or omissions. In no event shall you or any of your affiliates be liable to the Customer or any third party for the accuracy, timeliness, or completeness of any information made available to the Customer or for any decision made or taken by the Customer in reliance upon such information. In no event shall you or your affiliated entities be liable for any special incidental, indirect or consequential damages whatsoever, including, without limitation, those resulting from loss of use, data or profits, whether or not advised of the possibility of damages, and on any theory of liability, arising out of or in connection with the use of any reports provided by you or with the delay or inability to use such reports. 13. **Payment for Order Flow Disclosure.** Depending on the security traded and absent specific direction from the Customer, equity and option orders are routed to market centers (i.e., broker-dealers, primary exchanges or electronic communication networks) for execution. Routing decisions are based on a number of factors including the size of the order, the opportunity for price improvement and the quality of order executions, and decisions are regularly reviewed to ensure the duty of best execution is met. You or the Introducing Broker may receive compensation or other consideration for the placing of orders with market centers for execution. The amount of the compensation depends on the agreement reached with each venue. The source and nature of compensation relating to the Customer's transactions will be furnished upon written request. 14. **Credit Check.** You are authorized, in your discretion, should you for any reason deem it necessary for your protection to request and obtain a consumer credit report for the Customer. 15. **Miscellaneous.** If any provision of this Agreement is held to be invalid or unenforceable, it shall not affect any other provision of this Agreement. The headings of each section of this Agreement are descriptive only and do not modify or qualify any provision of this Agreement. This Agreement and its enforcement shall be governed by the laws of the state of Texas and shall cover individually and collectively all accounts which the Customer has previously opened, now has open or may open or reopen with you, or any introducing broker, and any and all previous, current and future transactions in such accounts. Except as provided in this Agreement, no provision of this Agreement may be altered, modified or amended unless in writing signed by your authorized representative. This Agreement and all provisions shall inure to the benefit of you and your successors, whether by merger, consolidation or otherwise, your assigns, the Introducing Broker, and all other persons specified in Paragraph 8. You shall not be liable for losses caused directly or indirectly by any events beyond your reasonable control, including without limitation, government restrictions, exchange or market rulings, suspension of trading or unusually heavy trading in securities, a general change in economic, political or financial conditions, war or strikes. You may transfer the accounts of the Customer to your successors and assigns. This Agreement shall be binding upon the Customer and the heirs, executors, administrators, successors and assigns of the Customer. Failure to insist on strict compliance with this Agreement is not considered a waiver of your rights under this Agreement. At your discretion, you may terminate this Agreement at any time on notice to the Customer, the Customer will continue to be responsible for any obligation incurred by the Customer prior to termination. The Customer may not assign the Customer's rights or delegate the Customer's obligations under this Agreement, in whole or in part, without your prior consent. 16. **Sweep Program.** If the Customer elects to participate in a sweep program, the Customer acknowledges and agrees that: (a) the Customer has read and understands the sweep program terms and conditions available at http://www.apexclearing.com/disclosures/ ; (b) you may make changes to your sweep programs and products at any time, in your sole discretion and with or without notice to Customer; (c) the free credit balances in the Customer's Account may begin being included in the sweep program upon Account opening; and (d) you have no obligation to monitor the applicable sweep program elected for the Customer's Account or to make recommendations about, or changes to, the sweep program that might be beneficial to the Customer. 17. **SIPC Protection.** As a member of the Securities Investor Protection Corporation (SIPC), funds are available to meet customer claims up to a ceiling of \$500,000, including a maximum of \$250,000 for cash claims. For additional information regarding SIPC coverage, including a brochure, please contact SIPC at (202) 371-8300 or visit www.sipc.org. Apex has purchased an additional insurance policy through a group of London Underwriters (with Lloyd's of London Syndicates as the Lead Underwriter) to supplement SIPC protection. This additional insurance policy becomes available to customers in the event that SIPC limits are exhausted and provides protection for securities and cash up to certain limits. Similar to SIPC protection, this additional insurance does not protect against a loss in the market value of securities. 18. **Tax Treaty Eligibility.** This agreement shall serve as the Customer's certification that you are eligible to receive tax treaty benefits between the country or (of) residence indicated on the new account form and the country (ies) of origin holding jurisdiction over the instruments held within the customer's account. 19. **Trusted Contacts.** Under FINRA Rule 4512 Apex Clearing Corporation is required to disclose to you (the customer) that Apex Clearing Corporation or an associated person of Apex Clearing Corporation is authorized to contact the trusted contact person and disclose information about the customer's account to address possible financial exploitation, to confirm the specifics of the customer's current contact information, health status, or the identity of any legal guardian, executor, trustee or holder of a power of attorney, or as otherwise permitted by FINRA Rule 2165. 20. **ACH Agreement.** If I request Automated Clearinghouse ("ACH") transactions from my Account at Clearing Firm, I authorize Clearing Firm to originate or facilitate transfer credits/debits to/from my eligible bank account. Transactions sent through the NACHA network will be subject to all applicable rules of NACHA and all rules set forth in Federal Reserve Operating circulars or other applicable laws and regulations. ACH deposits to my brokerage account are provisional. If the beneficiary bank does not receive final and complete payment for a payment order transferred through ACH, the beneficiary bank is entitled to recover from the beneficiary any provisional credit and Clearing Firm may charge my account for the transaction amount. I understand Clearing Firm or my Broker may not notify me of any returned or rejected ACH transfers. I agree to hold Clearing Firm and Clearing Firm's agents free of liability for compliance with these instructions. I hereby agree to hold harmless Clearing Firm and each of its affiliates, offices, directors, employees, and agents against, any claims, judgments, expenses, liabilities or costs of defense or settlement relating to: (a) any refusal or failure to initiate or honor any credit or debit request, by Clearing Firm or my Broker, whether (i) due to a lack of funds necessary to credit my account; (ii) due to inadvertence, error caused by similarity of account holder names or (iii) otherwise provided Clearing Firm has not acted in bad faith; (b) if the routing number is incorrect or the routing number or other information changes at another U.S. financial institution or (c) any loss, damage, liability or claim arising, directly or indirectly, from any error, delay or failure which is caused by circumstances beyond Clearing Firm's direct control. To the extent permitted by applicable law or regulation, Clearing Firm hereby disclaims all warranties, express or implied, and in no event shall Clearing Firm be liable for any special indirect, incidental, or consequential damages whatsoever resulting from the ACH electronic service or any ACH transactions. Nothing in this herein shall constitute a commitment or undertaking by Clearing Firm or my Broker to effect any ACH transaction or otherwise act upon my instructions or those of my Broker with respect to any account at Clearing Firm. This authorization shall remain in full force and effect until I revoke authorization by written notification to my Broker that is forwarded to Clearing Firm. I understand that Clearing Firm has the right to terminate or suspend the ACH agreement at any time and without notice. --- # Privacy Policy Apex Clearing Corporation ("Apex") carries your account as a clearing broker by arrangement with your broker-dealer or registered investment advisor as Apex's introducing client. At Apex, we understand that privacy is an important issue for customers of our introducing firms. It is our policy to respect the privacy of all accounts that we maintain as clearing broker and to protect the security and confidentiality of non-public personal information relating to those accounts. Please note that this policy generally applies to former customers of Apex as well as current customers. ### Personal Information Collected In order to service your account as a clearing broker, information is provided to Apex by your introducing firm who collects information from you in order to provide the financial services that you have requested. The information collected by your introducing firm and provided to Apex or otherwise obtained by Apex may come from the following sources and is not limited to: * Information included in your applications or forms, such as your name, address, telephone number, social security number, occupation, and income; * Information relating to your transactions, including account balances, positions, and activity; * Information which may be received from consumer reporting agencies, such as credit bureau reports; * Information relating to your creditworthiness; * Information which may be received from other sources with your consent or with the consent of your introducing firm. In addition to servicing your account, Apex may make use of your personal information for analysis purposes, for example, to draw conclusions, detect patterns or determine preferences. ## Sharing of Non-public Personal Information Apex does not disclose non-public personal information relating to current or former customers of introducing firms to any third parties, except as required or permitted by law, including but not limited to any obligations of Apex under the USA PATRIOT Act, and in order to facilitate the clearing of customer transactions in the ordinary course of business. Apex has multiple affiliates and relationships with third party companies. Examples of these companies include financial and non-financial companies that perform services such as data processing and companies that perform securities executions on your behalf. We may share information among our affiliates and third parties, as permitted by law, in order to better service your financial needs and to pursue legitimate business interests, including to carry out, monitor and analyze our business, systems and operations. ## Security Apex strives to ensure that our systems are secure and that they meet industry standards. We seek to protect non-public personal information that is provided to Apex by your introducing firm or otherwise obtained by Apex by implementing physical and electronic safeguards. Where we believe appropriate, we employ firewalls, encryption technology, user authentication systems (i.e. passwords and personal identification numbers) and access control mechanisms to control access to systems and data. Apex endeavors to ensure that third party service providers who may have access to non-public personal information are following appropriate standards of security and confidentiality. Further, we instruct our employees to use strict standards of care in handling the personal financial information of customers. As a general policy, our staff will not discuss or disclose information regarding an account except; 1) with authorized personnel of your introducing firm, 2) as required by law or pursuant to regulatory request, or 3) as authorized by Apex to a third party or affiliate providing services to your account or pursuing Apex's legitimate business interests. ## Access to Your Information You may access your account information through a variety of media offered by your introducing firm and Apex (i.e. statements or online services). Please contact your introducing firm if you require any additional information. Apex may use "cookies" in order to provide better service, to facilitate its customers' use of the website, to track usage of the website, and to address security hazards. A cookie is a small piece of information that a website stores on a personal computer, and which it can later retrieve. ## Changes to Apex's Privacy Policy Apex reserves the right to make changes to this policy. ## How to Get in Touch with Apex about this Privacy Policy For reference, this Privacy Policy is available on our website at www.apexclearing.com. For more information relating to Apex's Privacy Policy or to limit our sharing of your personal information, please contact: Apex Clearing Corporation Attn: Compliance Department 350 N. St. Paul St., Suite 1300 Dallas, Texas 75201 214-765-1055 */
  customerAccountAgreementCustodian: Scalars['Boolean'];
  /** Signature of primary applicant */
  signaturePrimaryApplicant: Scalars['String'];
};

export type CreateApplicationResult =
  | CreateApplicationSuccess
  | UnsupportedAccountTypeError
  | AccountInputValidationError
  | TradeAccountAlreadyExistsError
  | InternalProcessingError;

export type CreateApplicationSuccess = {
  __typename?: 'CreateApplicationSuccess';
  applicationId: Scalars['ID'];
  requestId: Scalars['String'];
};

export type CreateExchangeAlreadyExistsError = TypeWithMessageAndRequestId & {
  __typename?: 'CreateExchangeAlreadyExistsError';
  message: Scalars['String'];
  requestId: Scalars['String'];
};

export type CreateExchangeInput = {
  name: Scalars['String'];
};

/** Used for Exchange mutation calls */
export type CreateExchangeResult = CreateExchangeSuccess | CreateExchangeAlreadyExistsError | CreateInvalidInputError;

export type CreateExchangeSuccess = {
  __typename?: 'CreateExchangeSuccess';
  exchange: Exchange;
};

export type CreateFractionalOrderInput = {
  /** ID of the security/instrument to send to the market. */
  instId: Scalars['ID'];
  transactionType: ETransactionType;
  /** The fractional number of shares to execute. Note that only the first 5 decimal places are used, any more get rounded. */
  quantity: Scalars['Float'];
};

export type CreateHunchInput = {
  targetPrice: Scalars['Float'];
  instId: Scalars['ID'];
  byDate: Scalars['DateTime'];
  description?: Maybe<Scalars['String']>;
};

export type CreateInstrumentError = {
  __typename?: 'CreateInstrumentError';
  symbol?: Maybe<Scalars['String']>;
  cusip?: Maybe<Scalars['String']>;
  country: Scalars['String'];
  exchangeName?: Maybe<Scalars['String']>;
  errorMessage: Scalars['String'];
};

export type CreateInstrumentInput = {
  exchangeName: Scalars['String'];
  symbol: Scalars['String'];
  cusip?: Maybe<Scalars['String']>;
  sedol?: Maybe<Scalars['String']>;
  type: EInstrumentType;
  description?: Maybe<Scalars['String']>;
  shortDescription: Scalars['String'];
  country: ECountry;
};

export type CreateInstrumentLogosInput = {
  instId: Scalars['ID'];
  logo?: Maybe<Scalars['String']>;
  logoOriginal?: Maybe<Scalars['String']>;
  logoNormal?: Maybe<Scalars['String']>;
  logoThumbnail?: Maybe<Scalars['String']>;
  logoSquare?: Maybe<Scalars['String']>;
  logoSquareStrict?: Maybe<Scalars['String']>;
};

export type CreateInstrumentLogosResult = CreateInstrumentLogosSuccess | CreateInvalidInputError;

export type CreateInstrumentLogosSuccess = {
  __typename?: 'CreateInstrumentLogosSuccess';
  logos: InstrumentLogos;
};

export type CreateInstrumentResult = CreateInstrumentSuccess;

export type CreateInstrumentSuccess = {
  __typename?: 'CreateInstrumentSuccess';
  instruments: Array<Instrument>;
  errors?: Maybe<Array<CreateInstrumentError>>;
};

export type CreateInvalidInputError = TypeWithMessageAndRequestId & {
  __typename?: 'CreateInvalidInputError';
  message: Scalars['String'];
  requestId: Scalars['String'];
  errorCode: EValidationErrorCode;
};

export type CreateNotionalOrderInput = {
  /** ID of the security/instrument to send to the market. */
  instId: Scalars['ID'];
  transactionType: ETransactionType;
  /** The expected value of the entire order, i.e. shares * price.  Note that only the first 2 decimal places are used, any more get rounded. */
  notionalValue: Scalars['Float'];
};

export type CreateOrderInput = {
  /** ID of the security/instrument to send to the market. */
  instId: Scalars['ID'];
  transactionType: ETransactionType;
  /**
   * MARKET - Execute order without condition at the best price at the moment
   * LIMIT - Execute at the price stated in the limitPrice field order better
   * STOP - Execute a MARKET order when the price moves past the price stated in the stopPrice field
   * STOP_LIMIT - Execute a LIMIT order at the price stated in limitPx when the price moves past the price stated in the stopPx field.
   */
  orderType: EOrderType;
  /** Number of shares to execute. */
  quantity: Scalars['Int'];
  /** Execute at this price or better when the orderType is LIMIT or STOP_LIMIT. */
  limitPrice?: Maybe<Scalars['Float']>;
  /** When orderType is STOP or STOP_LIMIT, this price will be used to trigger the order. */
  stopPrice?: Maybe<Scalars['Float']>;
};

export type CreateStackInput = {
  name: Scalars['String'];
  instIds: Array<Scalars['ID']>;
};

export type CreateTagsInput = {
  instId: Scalars['ID'];
  themeIds: Array<Scalars['ID']>;
};

export type CreateUserAlreadyExistsError = TypeWithMessageAndRequestId & {
  __typename?: 'CreateUserAlreadyExistsError';
  message: Scalars['String'];
  requestId: Scalars['String'];
};

export type CreateUserFollowResult = CreateUserFollowSuccess | CreateInvalidInputError | NotAllowedError;

export type CreateUserFollowSuccess = {
  __typename?: 'CreateUserFollowSuccess';
  userFollow: UserFollow;
};

/** Used for Hunch mutation calls */
export type CreateUserHunchResult = CreateUserHunchSuccess | InstNotFoundError | CreateInvalidInputError;

export type CreateUserHunchSuccess = {
  __typename?: 'CreateUserHunchSuccess';
  hunch: Hunch;
};

export type CreateUserInput = {
  fullName: Scalars['String'];
  bio?: Maybe<Scalars['String']>;
  avatar?: Maybe<Scalars['String']>;
  /** # AOU-524 -> AOU-82 */
  tags: Array<CreateTagsInput>;
  /** # AOU-365 -> AOU-76 */
  stacks: Array<CreateStackInput>;
};

/** Used for User mutation calls */
export type CreateUserResult =
  | CreateUserSuccess
  | CreateUserAlreadyExistsError
  | CreateInvalidInputError
  | InstNotFoundError;

/** Used for Investack mutation calls */
export type CreateUserStackResult = CreateUserStackSuccess | InstNotFoundError | CreateInvalidInputError;

export type CreateUserStackSuccess = {
  __typename?: 'CreateUserStackSuccess';
  stack: Stack;
};

export type CreateUserSuccess = {
  __typename?: 'CreateUserSuccess';
  user: User;
};

/** Used for currentUser query */
export type CurrentUserResult = User;

export type DeleteInvalidInputError = TypeWithMessageAndRequestId & {
  __typename?: 'DeleteInvalidInputError';
  message: Scalars['String'];
  requestId: Scalars['String'];
  errorCode: EValidationErrorCode;
};

/** Used for delete mutation calls */
export type DeleteResult = DeleteSuccess | DeleteInvalidInputError;

export type DeleteSuccess = {
  __typename?: 'DeleteSuccess';
  deleteIds: Array<Scalars['ID']>;
};

export enum EAccountLocationType {
  Domestic = 'DOMESTIC',
  Foreign = 'FOREIGN',
}

export enum EAccountType {
  Cash = 'CASH',
}

export enum EAccountValidationErrorType {
  InvalidDateOfBirth = 'INVALID_DATE_OF_BIRTH',
  TrustedContactMissingFor_55OrOlderUser = 'TRUSTED_CONTACT_MISSING_FOR_55_OR_OLDER_USER',
  MissingTrustedContactFields = 'MISSING_TRUSTED_CONTACT_FIELDS',
  MissingEmploymentStatusFields = 'MISSING_EMPLOYMENT_STATUS_FIELDS',
  MissingTransferOnDeathFields = 'MISSING_TRANSFER_ON_DEATH_FIELDS',
  MissingTransferOnDeathAgreement = 'MISSING_TRANSFER_ON_DEATH_AGREEMENT',
  MissingCustomerAgreement = 'MISSING_CUSTOMER_AGREEMENT',
  MissingCustomerCustodianAgreement = 'MISSING_CUSTOMER_CUSTODIAN_AGREEMENT',
  MissingPrimaryApplicantSignature = 'MISSING_PRIMARY_APPLICANT_SIGNATURE',
  MissingMailingAddressFields = 'MISSING_MAILING_ADDRESS_FIELDS',
  MissingThirdPartyAuthorizedTradingAgent = 'MISSING_THIRD_PARTY_AUTHORIZED_TRADING_AGENT',
}

export enum EAnnualIncome {
  Under_25000 = 'UNDER_25000',
  From_25001To_50000 = 'FROM_25001_TO_50000',
  From_50001To_100000 = 'FROM_50001_TO_100000',
  From_100001To_200000 = 'FROM_100001_TO_200000',
  From_200001To_300000 = 'FROM_200001_TO_300000',
  From_300001To_500000 = 'FROM_300001_TO_500000',
  From_500001To_1200001 = 'FROM_500001_TO_1200001',
  Over_1200001 = 'OVER_1200001',
}

export enum EApplicationStatus {
  Created = 'CREATED',
  InReview = 'IN_REVIEW',
  Completed = 'COMPLETED',
  ApplicationValidationFailed = 'APPLICATION_VALIDATION_FAILED',
}

export enum ECountry {
  Afg = 'AFG',
  Ala = 'ALA',
  Alb = 'ALB',
  Dza = 'DZA',
  Asm = 'ASM',
  And = 'AND',
  Ago = 'AGO',
  Aia = 'AIA',
  Ata = 'ATA',
  Atg = 'ATG',
  Arg = 'ARG',
  Arm = 'ARM',
  Abw = 'ABW',
  Aus = 'AUS',
  Aut = 'AUT',
  Aze = 'AZE',
  Bhs = 'BHS',
  Bhr = 'BHR',
  Bgd = 'BGD',
  Brb = 'BRB',
  Blr = 'BLR',
  Bel = 'BEL',
  Blz = 'BLZ',
  Ben = 'BEN',
  Bmu = 'BMU',
  Btn = 'BTN',
  Bol = 'BOL',
  Bes = 'BES',
  Bih = 'BIH',
  Bwa = 'BWA',
  Bvt = 'BVT',
  Bra = 'BRA',
  Iot = 'IOT',
  Brn = 'BRN',
  Bgr = 'BGR',
  Bfa = 'BFA',
  Bdi = 'BDI',
  Cpv = 'CPV',
  Khm = 'KHM',
  Cmr = 'CMR',
  Can = 'CAN',
  Cym = 'CYM',
  Caf = 'CAF',
  Tcd = 'TCD',
  Chl = 'CHL',
  Chn = 'CHN',
  Cxr = 'CXR',
  Cck = 'CCK',
  Col = 'COL',
  Com = 'COM',
  Cog = 'COG',
  Cod = 'COD',
  Cok = 'COK',
  Cri = 'CRI',
  Civ = 'CIV',
  Hrv = 'HRV',
  Cub = 'CUB',
  Cuw = 'CUW',
  Cyp = 'CYP',
  Cze = 'CZE',
  Dnk = 'DNK',
  Dji = 'DJI',
  Dma = 'DMA',
  Dom = 'DOM',
  Ecu = 'ECU',
  Egy = 'EGY',
  Slv = 'SLV',
  Gnq = 'GNQ',
  Eri = 'ERI',
  Est = 'EST',
  Eth = 'ETH',
  Flk = 'FLK',
  Fro = 'FRO',
  Fji = 'FJI',
  Fin = 'FIN',
  Fra = 'FRA',
  Guf = 'GUF',
  Pyf = 'PYF',
  Atf = 'ATF',
  Gab = 'GAB',
  Gmb = 'GMB',
  Geo = 'GEO',
  Deu = 'DEU',
  Gha = 'GHA',
  Gib = 'GIB',
  Grc = 'GRC',
  Grl = 'GRL',
  Grd = 'GRD',
  Glp = 'GLP',
  Gum = 'GUM',
  Gtm = 'GTM',
  Ggy = 'GGY',
  Gin = 'GIN',
  Gnb = 'GNB',
  Guy = 'GUY',
  Hti = 'HTI',
  Hmd = 'HMD',
  Vat = 'VAT',
  Hnd = 'HND',
  Hkg = 'HKG',
  Hun = 'HUN',
  Isl = 'ISL',
  Ind = 'IND',
  Idn = 'IDN',
  Irn = 'IRN',
  Irq = 'IRQ',
  Irl = 'IRL',
  Imn = 'IMN',
  Isr = 'ISR',
  Ita = 'ITA',
  Jam = 'JAM',
  Jpn = 'JPN',
  Jey = 'JEY',
  Jor = 'JOR',
  Kaz = 'KAZ',
  Ken = 'KEN',
  Kir = 'KIR',
  Prk = 'PRK',
  Kor = 'KOR',
  Kwt = 'KWT',
  Kgz = 'KGZ',
  Lao = 'LAO',
  Lva = 'LVA',
  Lbn = 'LBN',
  Lso = 'LSO',
  Lbr = 'LBR',
  Lby = 'LBY',
  Lie = 'LIE',
  Ltu = 'LTU',
  Lux = 'LUX',
  Mac = 'MAC',
  Mkd = 'MKD',
  Mdg = 'MDG',
  Mwi = 'MWI',
  Mys = 'MYS',
  Mdv = 'MDV',
  Mli = 'MLI',
  Mlt = 'MLT',
  Mhl = 'MHL',
  Mtq = 'MTQ',
  Mrt = 'MRT',
  Mus = 'MUS',
  Myt = 'MYT',
  Mex = 'MEX',
  Fsm = 'FSM',
  Mda = 'MDA',
  Mco = 'MCO',
  Mng = 'MNG',
  Mne = 'MNE',
  Msr = 'MSR',
  Mar = 'MAR',
  Moz = 'MOZ',
  Mmr = 'MMR',
  Nam = 'NAM',
  Nru = 'NRU',
  Npl = 'NPL',
  Nld = 'NLD',
  Ncl = 'NCL',
  Nzl = 'NZL',
  Nic = 'NIC',
  Ner = 'NER',
  Nga = 'NGA',
  Niu = 'NIU',
  Nfk = 'NFK',
  Mnp = 'MNP',
  Nor = 'NOR',
  Omn = 'OMN',
  Pak = 'PAK',
  Plw = 'PLW',
  Pse = 'PSE',
  Pan = 'PAN',
  Png = 'PNG',
  Pry = 'PRY',
  Per = 'PER',
  Phl = 'PHL',
  Pcn = 'PCN',
  Pol = 'POL',
  Prt = 'PRT',
  Pri = 'PRI',
  Qat = 'QAT',
  Reu = 'REU',
  Rou = 'ROU',
  Rus = 'RUS',
  Rwa = 'RWA',
  Blm = 'BLM',
  Shn = 'SHN',
  Kna = 'KNA',
  Lca = 'LCA',
  Maf = 'MAF',
  Spm = 'SPM',
  Vct = 'VCT',
  Wsm = 'WSM',
  Smr = 'SMR',
  Stp = 'STP',
  Sau = 'SAU',
  Sen = 'SEN',
  Srb = 'SRB',
  Syc = 'SYC',
  Sle = 'SLE',
  Sgp = 'SGP',
  Sxm = 'SXM',
  Svk = 'SVK',
  Svn = 'SVN',
  Slb = 'SLB',
  Som = 'SOM',
  Zaf = 'ZAF',
  Sgs = 'SGS',
  Ssd = 'SSD',
  Esp = 'ESP',
  Lka = 'LKA',
  Sdn = 'SDN',
  Sur = 'SUR',
  Sjm = 'SJM',
  Swz = 'SWZ',
  Swe = 'SWE',
  Che = 'CHE',
  Syr = 'SYR',
  Twn = 'TWN',
  Tjk = 'TJK',
  Tza = 'TZA',
  Tha = 'THA',
  Tls = 'TLS',
  Tgo = 'TGO',
  Tkl = 'TKL',
  Ton = 'TON',
  Tto = 'TTO',
  Tun = 'TUN',
  Tur = 'TUR',
  Tkm = 'TKM',
  Tca = 'TCA',
  Tuv = 'TUV',
  Uga = 'UGA',
  Ukr = 'UKR',
  Are = 'ARE',
  Gbr = 'GBR',
  Usa = 'USA',
  Umi = 'UMI',
  Ury = 'URY',
  Uzb = 'UZB',
  Vut = 'VUT',
  Ven = 'VEN',
  Vnm = 'VNM',
  Vgb = 'VGB',
  Vir = 'VIR',
  Wlf = 'WLF',
  Esh = 'ESH',
  Yem = 'YEM',
  Zmb = 'ZMB',
  Zwe = 'ZWE',
}

export enum EDividendProceedsAction {
  Send = 'SEND',
  Hold = 'HOLD',
}

export enum EDividendProceedsSendFrequency {
  Daily = 'DAILY',
  Weekly = 'WEEKLY',
  Monthly = 'MONTHLY',
}

export enum EEmploymentStatus {
  Employed = 'EMPLOYED',
  Unemployed = 'UNEMPLOYED',
  Retired = 'RETIRED',
  Student = 'STUDENT',
}

export enum EFeed {
  MorningStar = 'MORNING_STAR',
  Apex = 'APEX',
}

export enum EInstrumentType {
  Stock = 'STOCK',
  Etf = 'ETF',
}

export enum EInvestmentExperience {
  None = 'NONE',
  Limited = 'LIMITED',
  Good = 'GOOD',
  Extensive = 'EXTENSIVE',
}

export enum EInvestmentObjective {
  CapitalPreservation = 'CAPITAL_PRESERVATION',
  Income = 'INCOME',
  Growth = 'GROWTH',
  Speculation = 'SPECULATION',
  GrowthIncome = 'GROWTH_INCOME',
  MaximumGrowth = 'MAXIMUM_GROWTH',
  Balanced = 'BALANCED',
  Other = 'OTHER',
}

export enum ELiquidityNeeds {
  VeryImportant = 'VERY_IMPORTANT',
  SomewhatImportant = 'SOMEWHAT_IMPORTANT',
  NotImportant = 'NOT_IMPORTANT',
}

export enum ENetWorth {
  Under_50000 = 'UNDER_50000',
  From_50001To_100000 = 'FROM_50001_TO_100000',
  From_100001To_200000 = 'FROM_100001_TO_200000',
  From_200001To_500000 = 'FROM_200001_TO_500000',
  From_500001To_1000000 = 'FROM_500001_TO_1000000',
  From_1000001To_5000000 = 'FROM_1000001_TO_5000000',
  Over_5000001 = 'OVER_5000001',
}

/** Defines a type to retrieve orders filtered by various statuses */
export enum EOrderListingType {
  /** Used to lookup the order initiated by a particular position */
  Cost = 'COST',
  /** All orders that have been executed in the current trading day */
  Executed = 'EXECUTED',
  /** The last ten orders placed */
  Latest = 'LATEST',
  /** All orders that are currently open */
  Open = 'OPEN',
  /** All of the orders placed in the current trading day */
  Today = 'TODAY',
}

/** Status of the order */
export enum EOrderStatus {
  /** Order is received, but not accepted at the exchange yet */
  Placed = 'PLACED',
  /** Order is received and accepted at the exchange */
  AcceptedAtExchange = 'ACCEPTED_AT_EXCHANGE',
  /** Order is cancelled with no fills at all */
  Cancelled = 'CANCELLED',
  /** Order is filled and is no longer open */
  Filled = 'FILLED',
  /** Order is partially filled and is still open */
  PartiallyFilled = 'PARTIALLY_FILLED',
  /** Cancel request is received, but not cancelled at the exchange yet */
  WaitingForCancellation = 'WAITING_FOR_CANCELLATION',
  /** Order is rejected and is no longer open */
  Rejected = 'REJECTED',
  /** The replace request is received, but not replaced at the exhange yet */
  WaitingForCancelReplace = 'WAITING_FOR_CANCEL_REPLACE',
  /** Unkown error with the order */
  Unknown = 'UNKNOWN',
}

/** Defines a type for placing various kinds of orders (for POC; others pending) */
export enum EOrderType {
  /** Execute order without condition at the best price at the moment */
  Market = 'MARKET',
  /** Execute at the price stated in the limitPrice field order better */
  Limit = 'LIMIT',
  /** Execute a MARKET order when the price moves past the price stated in the stopPrice field */
  Stop = 'STOP',
  /** Execute a LIMIT order at the price stated in limitPrice when the price moves past the price stated in the stopPrice field */
  StopLimit = 'STOP_LIMIT',
}

export enum ERiskTolerance {
  Low = 'LOW',
  Medium = 'MEDIUM',
  High = 'HIGH',
}

export enum ESecuritiesAction {
  HoldProceeds = 'HOLD_PROCEEDS',
  SendProceeds = 'SEND_PROCEEDS',
}

export enum ETimeHorizon {
  Short = 'SHORT',
  Average = 'AVERAGE',
  Long = 'LONG',
}

export enum ETransactionType {
  Buy = 'BUY',
  Sell = 'SELL',
}

export enum EUnsupportedAccountErrorReason {
  NonCashAccountType = 'NON_CASH_ACCOUNT_TYPE',
  NonDomesticAccount = 'NON_DOMESTIC_ACCOUNT',
  NonUsCitizen = 'NON_US_CITIZEN',
  PoliticalOrPublicPerson = 'POLITICAL_OR_PUBLIC_PERSON',
  PublicCompany_10PercentShareHolder = 'PUBLIC_COMPANY_10_PERCENT_SHARE_HOLDER',
  AffiliatedWithExchangeOrFinra = 'AFFILIATED_WITH_EXCHANGE_OR_FINRA',
}

export enum EValidationErrorCode {
  Duplicate = 'DUPLICATE',
  ReferentialIntegrity = 'REFERENTIAL_INTEGRITY',
  Null = 'NULL',
  Check = 'CHECK',
}

export enum EVisaType {
  E1 = 'E1',
  E2 = 'E2',
  E3 = 'E3',
  F1 = 'F1',
  H1B = 'H1B',
  L1 = 'L1',
  O1 = 'O1',
  Tn1 = 'TN1',
  G4 = 'G4',
}

export type Exchange = {
  __typename?: 'Exchange';
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type Exchanges = {
  __typename?: 'Exchanges';
  exchanges: Array<Exchange>;
};

/** Used for exchanges query */
export type ExchangesResult = Exchanges;

export type FractionalOrder = {
  __typename?: 'FractionalOrder';
  orderId: Scalars['OrderId'];
  instrument: Instrument;
  transactionType: ETransactionType;
  /** The current status of this order. */
  status: EOrderStatus;
  /** Number of shares that have been filled so far. */
  executedQuantity: Scalars['Float'];
  /** Number of shares that are still waiting to be filled. */
  remainingQuantity: Scalars['Float'];
  /** The price where the shares were executed. */
  executedPrice: Scalars['Float'];
  /** The date and time when the order was placed. */
  createdAt: Scalars['DateTime'];
  /** Number of fractional shares that were originally placed in this order. */
  fractionalOrderQuantity: Scalars['Float'];
};

export type Hunch = {
  __typename?: 'Hunch';
  id: Scalars['ID'];
  priceChangePercentage?: Maybe<Scalars['Float']>;
  targetPrice: Scalars['Float'];
  currentPrice?: Maybe<Scalars['Float']>;
  instrument: Instrument;
  byDate: Scalars['DateTime'];
  description?: Maybe<Scalars['String']>;
};

export type HunchFollow = {
  __typename?: 'HunchFollow';
  id: Scalars['ID'];
  userFollowed: User;
  follower: User;
};

export type InstNotFoundError = TypeWithMessageAndRequestId & {
  __typename?: 'InstNotFoundError';
  message: Scalars['String'];
  requestId: Scalars['String'];
};

export type InstTags = {
  __typename?: 'InstTags';
  ids: Array<Scalars['ID']>;
  themes: Array<Theme>;
  instrument: Instrument;
};

export type Instrument = {
  __typename?: 'Instrument';
  id: Scalars['ID'];
  symbol: Scalars['String'];
  type: EInstrumentType;
  country: ECountry;
  cusip?: Maybe<Scalars['String']>;
  /** Will return closing price for now */
  currentPrice?: Maybe<Scalars['Float']>;
  currentPriceDate?: Maybe<Scalars['DateTime']>;
  currentPriceFeed?: Maybe<EFeed>;
  priceChangePercentage: Scalars['Float'];
  yesterdayClosePrice?: Maybe<Scalars['Float']>;
  yesterdayClosePriceDate?: Maybe<Scalars['DateTime']>;
  yesterdayClosePriceFeed?: Maybe<EFeed>;
  askCurrentPrice: Scalars['Float'];
  bidCurrentPrice: Scalars['Float'];
  isLookupExactMatch?: Maybe<Scalars['Boolean']>;
  themes: Array<Theme>;
  description: Scalars['String'];
  shortDescription: Scalars['String'];
  name: Scalars['String'];
  exchange: Exchange;
  stacks: Array<Stack>;
  hunches: Array<Hunch>;
  feeds: Array<EFeed>;
  logos: InstrumentLogosResult;
};

export type InstrumentThemesArgs = {
  nMax?: Maybe<Scalars['Int']>;
};

export type InstrumentStacksArgs = {
  nMax?: Maybe<Scalars['Int']>;
};

export type InstrumentHunchesArgs = {
  nMax?: Maybe<Scalars['Int']>;
};

export type InstrumentFeed = {
  __typename?: 'InstrumentFeed';
  id: Scalars['ID'];
  feed: EFeed;
};

export type InstrumentLogos = {
  __typename?: 'InstrumentLogos';
  id: Scalars['ID'];
  instrument: Instrument;
  logo?: Maybe<Scalars['String']>;
  logoOriginal?: Maybe<Scalars['String']>;
  logoNormal?: Maybe<Scalars['String']>;
  logoThumbnail?: Maybe<Scalars['String']>;
  logoSquare?: Maybe<Scalars['String']>;
  logoSquareStrict?: Maybe<Scalars['String']>;
};

export type InstrumentLogosResult = InstrumentLogos | InstNotFoundError | TpspDataFetchError;

export type InstrumentNameChangeInput = {
  oldSymbol: Scalars['String'];
  newSymbol: Scalars['String'];
  exchangeName: Scalars['String'];
};

export type Instruments = {
  __typename?: 'Instruments';
  instruments: Array<Instrument>;
};

/** Used for instruments query */
export type InstrumentsResult = Instruments | TooManyItemsRequestedError;

export type InternalProcessingError = {
  __typename?: 'InternalProcessingError';
  requestId: Scalars['String'];
  message: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createExchange: CreateExchangeResult;
  createInstruments: CreateInstrumentResult;
  refreshPricesMaterializedView: RefreshPricesViewSuccess;
  createUserHunch: CreateUserHunchResult;
  deleteUserHunches: DeleteResult;
  createInstrumentLogos: CreateInstrumentLogosResult;
  createApplication: CreateApplicationResult;
  removeTradeAccount: RemoveTradeAccountResult;
  createUserStack: CreateUserStackResult;
  deleteUserStacks: DeleteResult;
  /** API for cancelling an order using its orderId. */
  cancelOrder: CancelResult;
  /** Before placing an order, use this API first for the purpose of order validation.Expected price and quantity are returned.  This API is for transacting a whole number of shares, not fractional. */
  previewRegularOrder: OrderPreviewResult;
  /** Before placing an order, use this API first for the purpose of order validation.  Expected price and quantity are returned.  This only API supports selling a fractional number shares at this time, not buying. */
  previewFractionalOrder: OrderPreviewResult;
  /** Before placing an order, use this API first for the purpose of order validation.  Expected price and quantity are returned.  This API is for buying and selling by total/notional order value instead or specifying the number of shares. */
  previewNotionalOrder: OrderPreviewResult;
  /** This is the API for placig an order and sending it to the market.  The same validation is done as with the preview API but an order ID is returned after successful placement.  This API is for transacting a whole number of shares, not fractional. */
  placeRegularOrder: OrderPlacementResult;
  /** This is the API for placing an order and sending it to the market.  The same validation is done as with the preview API but an order ID is returned after successful placement.  This only API supports selling a fractional number shares at this time, not buying. */
  placeFractionalOrder: OrderPlacementResult;
  /** This is the API for placing an order and sending it to the market.  The same validation is done as with the preview API but an order ID is returned after successful placement.  This API is for buying and selling by total/notional order value instead or specifying the number of shares. */
  placeNotionalOrder: OrderPlacementResult;
  /** NO AUTH - AOU-412 -> FE AOU-64 */
  createUser: CreateUserResult;
  /** AOU-366 -> AOU-532 */
  createUserFollow: CreateUserFollowResult;
  /** AOU-366 -> AOU-532 */
  deleteUserFollows: DeleteResult;
};

export type MutationCreateExchangeArgs = {
  input: CreateExchangeInput;
};

export type MutationCreateInstrumentsArgs = {
  nameChanges?: Maybe<Array<InstrumentNameChangeInput>>;
  feed: EFeed;
  instruments: Array<CreateInstrumentInput>;
};

export type MutationCreateUserHunchArgs = {
  data: CreateHunchInput;
};

export type MutationDeleteUserHunchesArgs = {
  hunchIds: Array<Scalars['ID']>;
};

export type MutationCreateInstrumentLogosArgs = {
  input: CreateInstrumentLogosInput;
};

export type MutationCreateApplicationArgs = {
  data: CreateApplicationInput;
};

export type MutationRemoveTradeAccountArgs = {
  accountType: EAccountType;
};

export type MutationCreateUserStackArgs = {
  data: CreateStackInput;
};

export type MutationDeleteUserStacksArgs = {
  stackIds: Array<Scalars['ID']>;
};

export type MutationCancelOrderArgs = {
  orderId: Scalars['OrderId'];
};

export type MutationPreviewRegularOrderArgs = {
  data: CreateOrderInput;
};

export type MutationPreviewFractionalOrderArgs = {
  data: CreateFractionalOrderInput;
};

export type MutationPreviewNotionalOrderArgs = {
  data: CreateNotionalOrderInput;
};

export type MutationPlaceRegularOrderArgs = {
  data: CreateOrderInput;
};

export type MutationPlaceFractionalOrderArgs = {
  data: CreateFractionalOrderInput;
};

export type MutationPlaceNotionalOrderArgs = {
  data: CreateNotionalOrderInput;
};

export type MutationCreateUserArgs = {
  data: CreateUserInput;
};

export type MutationCreateUserFollowArgs = {
  followedUserId: Scalars['ID'];
};

export type MutationDeleteUserFollowsArgs = {
  userFollowIds: Array<Scalars['ID']>;
};

export type NotAllowedError = TypeWithMessageAndRequestId & {
  __typename?: 'NotAllowedError';
  message: Scalars['String'];
  requestId: Scalars['String'];
};

export type NotionalOrder = {
  __typename?: 'NotionalOrder';
  orderId: Scalars['OrderId'];
  instrument: Instrument;
  transactionType: ETransactionType;
  /** The current status of this order. */
  status: EOrderStatus;
  /** Number of shares that have been filled so far. */
  executedQuantity: Scalars['Float'];
  /** Number of shares that are still waiting to be filled. */
  remainingQuantity: Scalars['Float'];
  /** The price where the shares were executed. */
  executedPrice: Scalars['Float'];
  /** The date and time when the order was placed. */
  createdAt: Scalars['DateTime'];
  /** Number of fractional shares that were originally placed in this order. */
  notionalValue: Scalars['Float'];
};

/** Used for oneRandomInstrument query */
export type OneRandomInstrumentResult = Instrument | InstNotFoundError;

export type OrderError = TypeWithMessageAndRequestId & {
  __typename?: 'OrderError';
  message: Scalars['String'];
  requestId: Scalars['String'];
};

export type OrderPlacementResult = OrderPlacementSuccess | OrderError | TpspDataFetchError;

export type OrderPlacementSuccess = {
  __typename?: 'OrderPlacementSuccess';
  /** ID of the order that was placed, can be used to get the status of the order. */
  orderId: Scalars['OrderId'];
};

export type OrderPreviewResult = OrderPreviewSuccess | OrderError | TpspDataFetchError;

export type OrderPreviewSuccess = {
  __typename?: 'OrderPreviewSuccess';
  /** The number of shares that are expected to be executed if the previewed order is placed. */
  expectedQuantity: Scalars['Float'];
  /** The fill price that is expected if the previewed order is placed. */
  expectedPrice: Scalars['Float'];
};

export type OrderStatusResult = OrderStatusSuccess | OrderError;

export type OrderStatusSuccess = {
  __typename?: 'OrderStatusSuccess';
  order: AnyOrder;
};

export type OrdersResult = OrdersSuccess | OrderError;

export type OrdersSuccess = {
  __typename?: 'OrdersSuccess';
  orders: Array<AnyOrder>;
};

export type Portfolio = {
  __typename?: 'Portfolio';
  portfolioEntries: PortfolioEntriesResult;
};

export type PortfolioEntries = {
  __typename?: 'PortfolioEntries';
  entries: Array<PortfolioEntry>;
};

export type PortfolioEntriesResult = PortfolioEntries | OrderError | TpspDataFetchError;

export type PortfolioEntry = {
  __typename?: 'PortfolioEntry';
  instrument: Instrument;
  /** The number of shares owned of the current instrument */
  quantity: Scalars['Float'];
  /** The amount that was originally paid for this instrument */
  costBasis: Scalars['Float'];
  /** The total value of all shares held in this instrument */
  currentValue: Scalars['Float'];
  /** The gain/loss in value since the shares of this instrument were purchased */
  gain: Scalars['Float'];
  /** The gain/loss percentage in value since the shares of this instrument were purchased */
  gainPercentage: Scalars['Float'];
};

export type Query = {
  __typename?: 'Query';
  /** NO AUTH - AOU-362, AOU-411 -> AOU-78 */
  communityStacks: CommStacksResult;
  exchanges: ExchangesResult;
  instrumentsInfo: InstrumentsResult;
  /** NO AUTH - AOU-351 -> AOU-75 */
  instruments: InstrumentsResult;
  /** NO AUTH - AOU-519 -> AOU-82 */
  oneRandomInst: OneRandomInstrumentResult;
  getApplicationStatus: ApplicationStatus;
  /** NO AUTH - AOU-359, AOU-517 -> AOU-73, AOU-82 */
  themes: ThemesResult;
  /** Returns the order matching the provided order id. */
  orderStatus: OrderStatusResult;
  /** Returns all the orders filtered by listing type. */
  orders: OrdersResult;
  /** NO AUTH - AOU-376->AOU-80 */
  topUsers: TopUsersResult;
  /** NO AUTH - AOU-472 -> AOU-64 */
  userExists: UserExistsResult;
  currentUser: CurrentUserResult;
};

export type QueryCommunityStacksArgs = {
  nMax?: Maybe<Scalars['Int']>;
};

export type QueryExchangesArgs = {
  name?: Maybe<Scalars['String']>;
};

export type QueryInstrumentsInfoArgs = {
  country?: Maybe<ECountry>;
  feed?: Maybe<EFeed>;
  symbols?: Maybe<Array<Scalars['String']>>;
};

export type QueryInstrumentsArgs = {
  nMax?: Maybe<Scalars['Int']>;
  onlyTraded?: Maybe<Scalars['Boolean']>;
  pattern: Scalars['String'];
};

export type QueryOneRandomInstArgs = {
  instIds: Array<Scalars['ID']>;
};

export type QueryGetApplicationStatusArgs = {
  applicationId: Scalars['ID'];
};

export type QueryThemesArgs = {
  nMax?: Maybe<Scalars['Int']>;
};

export type QueryOrderStatusArgs = {
  orderId: Scalars['OrderId'];
};

export type QueryOrdersArgs = {
  orderListingType: EOrderListingType;
};

export type QueryTopUsersArgs = {
  nMax?: Maybe<Scalars['Int']>;
};

export type QueryUserExistsArgs = {
  email: Scalars['String'];
};

export type RefreshPricesViewSuccess = {
  __typename?: 'RefreshPricesViewSuccess';
  success: Scalars['Boolean'];
};

export type RegularOrder = {
  __typename?: 'RegularOrder';
  orderId: Scalars['OrderId'];
  instrument: Instrument;
  transactionType: ETransactionType;
  /** The current status of this order. */
  status: EOrderStatus;
  /** Number of shares that have been filled so far. */
  executedQuantity: Scalars['Float'];
  /** Number of shares that are still waiting to be filled. */
  remainingQuantity: Scalars['Float'];
  /** The price where the shares were executed. */
  executedPrice: Scalars['Float'];
  /** The date and time when the order was placed. */
  createdAt: Scalars['DateTime'];
  orderType: EOrderType;
  /** Number of shares that were originally placed in this order. */
  orderQuantity: Scalars['Int'];
  /** The limit price of the order, used with LIMIT and STOP_LIMIT order types. */
  limitPrice: Scalars['Float'];
  /** The stop price of the order, used with STOP and STOP_LIMIT order types. */
  stopPrice: Scalars['Float'];
};

/** Used for remove Application mutation */
export type RemoveTradeAccountResult = RemoveTradeAccountSuccess | ApplicationNotFoundResult;

export type RemoveTradeAccountSuccess = {
  __typename?: 'RemoveTradeAccountSuccess';
  message: Scalars['String'];
};

export type Stack = {
  __typename?: 'Stack';
  id: Scalars['ID'];
  name: Scalars['String'];
  instruments: Array<Instrument>;
  /** AOU-528 -> AOU-58 */
  totalValue?: Maybe<Scalars['Float']>;
  percentageChange?: Maybe<Scalars['Float']>;
};

export type StackInstrumentsArgs = {
  nMax?: Maybe<Scalars['Int']>;
};

export type StackFollow = {
  __typename?: 'StackFollow';
  id: Scalars['ID'];
  userFollowed: User;
  follower: User;
};

/** Third-party Service Provider Error.  Used when we encounter an error communicating with an external service. */
export type TpspDataFetchError = TypeWithMessageAndRequestId & {
  __typename?: 'TPSPDataFetchError';
  message: Scalars['String'];
  requestId: Scalars['String'];
};

export type Tags = {
  __typename?: 'Tags';
  id: Scalars['ID'];
  themes: Array<Theme>;
  instrument: Instrument;
};

export type Theme = {
  __typename?: 'Theme';
  id: Scalars['ID'];
  name: Scalars['String'];
  instruments: Array<Instrument>;
};

export type ThemeInstrumentsArgs = {
  nMax?: Maybe<Scalars['Int']>;
};

export type Themes = {
  __typename?: 'Themes';
  themes: Array<Theme>;
};

/** Used for themes query */
export type ThemesResult = Themes;

export type TooManyItemsRequestedError = TypeWithMessageAndRequestId & {
  __typename?: 'TooManyItemsRequestedError';
  message: Scalars['String'];
  requestId: Scalars['String'];
};

export type TopUsers = {
  __typename?: 'TopUsers';
  users: Array<User>;
};

/** Used for topUsers query */
export type TopUsersResult = TopUsers;

export type TradeAccountAlreadyExistsError = {
  __typename?: 'TradeAccountAlreadyExistsError';
  message: Scalars['String'];
  requestId: Scalars['String'];
};

export type TypeWithMessageAndRequestId = {
  message: Scalars['String'];
  requestId: Scalars['String'];
};

export type UnsupportedAccountParameter = {
  __typename?: 'UnsupportedAccountParameter';
  message: Scalars['String'];
  reason: EUnsupportedAccountErrorReason;
  fieldName: Scalars['String'];
};

export type UnsupportedAccountTypeError = {
  __typename?: 'UnsupportedAccountTypeError';
  errors: Array<UnsupportedAccountParameter>;
  requestId: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  id: Scalars['ID'];
  /** AOU-460 -> AOU-437 */
  userName: Scalars['String'];
  email: Scalars['String'];
  /** AOU-460 -> AOU-437 */
  fullName: Scalars['String'];
  /** AOU-460 -> AOU-437 */
  bio: Scalars['String'];
  /** AOU-460 -> AOU-437 */
  avatar: Scalars['String'];
  tags: Array<Tags>;
  /** AOU-523 -> AOU-108 */
  instTags: Array<InstTags>;
  /** AOU-521 -> AOU-58 */
  stacks: Array<Stack>;
  /** AOU-520 -> AOU-59 */
  hunches: Array<Hunch>;
  /** AOU-451 -> AOU-83 */
  achievements: Array<Achievement>;
  /** AOU-515 -> AOU-437 */
  followedStacks: Array<Stack>;
  /** AOU-463 -> AOU-437 */
  followedHunches: Array<Hunch>;
  /** AOU-522 -> AOU-532, AOU-437, users given user follows */
  followedUsers: Array<User>;
  /** AOU-650 -> AOU-532, AOU-437, users that follow given user */
  followers: Array<User>;
  /** AOU-460 -> AOU-437 */
  nHunches: Scalars['Int'];
  /** AOU-460 -> AOU-437 */
  nStacks: Scalars['Int'];
  /** AOU-460 -> AOU-437, number of users following given user */
  nFollowers: Scalars['Int'];
  /** AOU-460 -> AOU-437, number of users given user follows */
  nFollowedUsers: Scalars['Int'];
  /** BETA */
  canTrade: Scalars['Boolean'];
  /** AOU-526 -> AOU-437 */
  huncherPercentage: Scalars['Float'];
  /** The summary of all positions including gains the user has in the market grouped by instrument */
  portfolio: Portfolio;
};

export type UserTagsArgs = {
  nMax?: Maybe<Scalars['Int']>;
};

export type UserInstTagsArgs = {
  nMax?: Maybe<Scalars['Int']>;
};

export type UserStacksArgs = {
  nMax?: Maybe<Scalars['Int']>;
};

export type UserHunchesArgs = {
  nMax?: Maybe<Scalars['Int']>;
};

export type UserAchievementsArgs = {
  nMax?: Maybe<Scalars['Int']>;
};

export type UserFollowedStacksArgs = {
  nMax?: Maybe<Scalars['Int']>;
};

export type UserFollowedHunchesArgs = {
  nMax?: Maybe<Scalars['Int']>;
};

export type UserFollowedUsersArgs = {
  nMax?: Maybe<Scalars['Int']>;
};

export type UserFollowersArgs = {
  nMax?: Maybe<Scalars['Int']>;
};

export type UserExists = {
  __typename?: 'UserExists';
  exists: Scalars['Boolean'];
};

/** Used for userExists query */
export type UserExistsResult = UserExists;

export type UserFollow = {
  __typename?: 'UserFollow';
  id: Scalars['ID'];
  userFollowed: User;
  follower: User;
};

export type CreateUserMutationVariables = Exact<{
  createUserData: CreateUserInput;
}>;

export type CreateUserMutation = { __typename?: 'Mutation' } & {
  createUser:
    | ({ __typename?: 'CreateUserSuccess' } & { user: { __typename?: 'User' } & Pick<User, 'id'> })
    | ({ __typename?: 'CreateUserAlreadyExistsError' } & Pick<CreateUserAlreadyExistsError, 'message'>)
    | ({ __typename?: 'CreateInvalidInputError' } & Pick<CreateInvalidInputError, 'message' | 'errorCode'>)
    | ({ __typename?: 'InstNotFoundError' } & Pick<InstNotFoundError, 'message'>);
};

export type CreateUserFollowMutationMutationVariables = Exact<{
  createUserFollowFollowedUserId: Scalars['ID'];
}>;

export type CreateUserFollowMutationMutation = { __typename?: 'Mutation' } & {
  createUserFollow:
    | ({ __typename?: 'CreateUserFollowSuccess' } & {
        userFollow: { __typename?: 'UserFollow' } & Pick<UserFollow, 'id'>;
      })
    | ({ __typename?: 'CreateInvalidInputError' } & Pick<CreateInvalidInputError, 'message' | 'errorCode'>)
    | ({ __typename?: 'NotAllowedError' } & Pick<NotAllowedError, 'message'>);
};

export type CreateUserHunchMutationVariables = Exact<{
  createUserHunchData: CreateHunchInput;
}>;

export type CreateUserHunchMutation = { __typename?: 'Mutation' } & {
  createUserHunch:
    | ({ __typename?: 'CreateUserHunchSuccess' } & {
        hunch: { __typename?: 'Hunch' } & Pick<Hunch, 'id' | 'targetPrice' | 'byDate'> & {
            instrument: { __typename?: 'Instrument' } & Pick<Instrument, 'id'>;
          };
      })
    | ({ __typename?: 'InstNotFoundError' } & Pick<InstNotFoundError, 'message'>)
    | ({ __typename?: 'CreateInvalidInputError' } & Pick<CreateInvalidInputError, 'message' | 'errorCode'>);
};

export type CreateUserStackMutationMutationVariables = Exact<{
  createUserStackData: CreateStackInput;
}>;

export type CreateUserStackMutationMutation = { __typename?: 'Mutation' } & {
  createUserStack:
    | ({ __typename?: 'CreateUserStackSuccess' } & { stack: { __typename?: 'Stack' } & Pick<Stack, 'id' | 'name'> })
    | ({ __typename?: 'InstNotFoundError' } & Pick<InstNotFoundError, 'message'>)
    | ({ __typename?: 'CreateInvalidInputError' } & Pick<CreateInvalidInputError, 'message' | 'errorCode'>);
};

export type DeleteUserFollowsMutationVariables = Exact<{
  deleteUserFollowsUserFollowIds: Array<Scalars['ID']> | Scalars['ID'];
}>;

export type DeleteUserFollowsMutation = { __typename?: 'Mutation' } & {
  deleteUserFollows:
    | ({ __typename?: 'DeleteSuccess' } & Pick<DeleteSuccess, 'deleteIds'>)
    | ({ __typename?: 'DeleteInvalidInputError' } & Pick<DeleteInvalidInputError, 'message' | 'errorCode'>);
};

export type DeleteUserHunchesMutationVariables = Exact<{
  deleteUserHunchesHunchIds: Array<Scalars['ID']> | Scalars['ID'];
}>;

export type DeleteUserHunchesMutation = { __typename?: 'Mutation' } & {
  deleteUserHunches:
    | ({ __typename?: 'DeleteSuccess' } & Pick<DeleteSuccess, 'deleteIds'>)
    | ({ __typename?: 'DeleteInvalidInputError' } & Pick<DeleteInvalidInputError, 'message' | 'errorCode'>);
};

export type DeleteUserStacksMutationVariables = Exact<{
  deleteUserStacksStackIds: Array<Scalars['ID']> | Scalars['ID'];
}>;

export type DeleteUserStacksMutation = { __typename?: 'Mutation' } & {
  deleteUserStacks:
    | ({ __typename?: 'DeleteSuccess' } & Pick<DeleteSuccess, 'deleteIds'>)
    | ({ __typename?: 'DeleteInvalidInputError' } & Pick<DeleteInvalidInputError, 'message' | 'errorCode'>);
};

export type CommunityStacksQueryVariables = Exact<{ [key: string]: never }>;

export type CommunityStacksQuery = { __typename?: 'Query' } & {
  communityStacks: { __typename?: 'CommStacks' } & {
    commStacks: Array<{ __typename?: 'CommStack' } & Pick<CommStack, 'id'> & { text: CommStack['name'] }>;
  };
};

export type CompanySearchQueryVariables = Exact<{
  instrumentsPattern: Scalars['String'];
  instrumentsNMax: Scalars['Int'];
}>;

export type CompanySearchQuery = { __typename?: 'Query' } & {
  instruments:
    | ({ __typename?: 'Instruments' } & {
        instruments: Array<
          { __typename?: 'Instrument' } & Pick<
            Instrument,
            'id' | 'name' | 'symbol' | 'description' | 'currentPrice' | 'priceChangePercentage'
          >
        >;
      })
    | { __typename?: 'TooManyItemsRequestedError' };
};

export type GetCurrentUserQueryVariables = Exact<{ [key: string]: never }>;

export type GetCurrentUserQuery = { __typename?: 'Query' } & {
  currentUser: { __typename?: 'User' } & Pick<
    User,
    'id' | 'userName' | 'email' | 'bio' | 'fullName' | 'nStacks' | 'nHunches' | 'nFollowers' | 'avatar'
  > & {
      hunches: Array<
        { __typename?: 'Hunch' } & Pick<
          Hunch,
          'id' | 'byDate' | 'priceChangePercentage' | 'targetPrice' | 'currentPrice'
        > & { instrument: { __typename?: 'Instrument' } & Pick<Instrument, 'name' | 'symbol'> }
      >;
      stacks: Array<
        { __typename?: 'Stack' } & Pick<Stack, 'id' | 'name' | 'totalValue' | 'percentageChange'> & {
            instruments: Array<{ __typename?: 'Instrument' } & Pick<Instrument, 'id' | 'name' | 'currentPrice'>>;
          }
      >;
      followers: Array<{ __typename?: 'User' } & Pick<User, 'id' | 'userName' | 'avatar'>>;
      followedUsers: Array<{ __typename?: 'User' } & Pick<User, 'id' | 'userName' | 'avatar'>>;
    };
};

export type GetCurrentUserHunchesQueryVariables = Exact<{ [key: string]: never }>;

export type GetCurrentUserHunchesQuery = { __typename?: 'Query' } & {
  currentUser: { __typename?: 'User' } & Pick<User, 'id'> & {
      hunches: Array<
        { __typename?: 'Hunch' } & Pick<Hunch, 'id' | 'description' | 'priceChangePercentage' | 'targetPrice'> & {
            instrument: { __typename?: 'Instrument' } & Pick<
              Instrument,
              'id' | 'symbol' | 'currentPrice' | 'priceChangePercentage' | 'description' | 'shortDescription' | 'name'
            >;
          }
      >;
      followedHunches: Array<
        { __typename?: 'Hunch' } & Pick<Hunch, 'id' | 'description' | 'targetPrice' | 'priceChangePercentage'> & {
            instrument: { __typename?: 'Instrument' } & Pick<
              Instrument,
              'id' | 'symbol' | 'currentPrice' | 'priceChangePercentage' | 'description' | 'shortDescription' | 'name'
            >;
          }
      >;
    };
};

export type GetCurrentUserStacksQueryVariables = Exact<{ [key: string]: never }>;

export type GetCurrentUserStacksQuery = { __typename?: 'Query' } & {
  currentUser: { __typename?: 'User' } & {
    stacks: Array<
      { __typename?: 'Stack' } & Pick<Stack, 'id' | 'name' | 'totalValue' | 'percentageChange'> & {
          instruments: Array<
            { __typename?: 'Instrument' } & Pick<
              Instrument,
              'id' | 'symbol' | 'currentPrice' | 'priceChangePercentage' | 'description' | 'shortDescription' | 'name'
            >
          >;
        }
    >;
    followedStacks: Array<
      { __typename?: 'Stack' } & Pick<Stack, 'id' | 'name' | 'totalValue' | 'percentageChange'> & {
          instruments: Array<
            { __typename?: 'Instrument' } & Pick<
              Instrument,
              'id' | 'symbol' | 'currentPrice' | 'priceChangePercentage' | 'description' | 'shortDescription' | 'name'
            >
          >;
        }
    >;
  };
};

export type GetFollowedUsersQueryVariables = Exact<{ [key: string]: never }>;

export type GetFollowedUsersQuery = { __typename?: 'Query' } & {
  currentUser: { __typename?: 'User' } & {
    followedUsers: Array<{ __typename?: 'User' } & Pick<User, 'id' | 'userName' | 'email' | 'fullName' | 'avatar'>>;
  };
};

export type GetInvestopeersQueryVariables = Exact<{ [key: string]: never }>;

export type GetInvestopeersQuery = { __typename?: 'Query' } & {
  topUsers: { __typename?: 'TopUsers' } & {
    users: Array<
      { __typename?: 'User' } & Pick<
        User,
        'id' | 'fullName' | 'userName' | 'bio' | 'nFollowers' | 'nHunches' | 'nStacks' | 'avatar'
      >
    >;
  };
};

export type OneRandomInstQueryVariables = Exact<{
  oneRandomInstInstIds: Array<Scalars['ID']> | Scalars['ID'];
}>;

export type OneRandomInstQuery = { __typename?: 'Query' } & {
  oneRandomInst:
    | ({ __typename?: 'Instrument' } & Pick<Instrument, 'id' | 'symbol' | 'description' | 'name'> & {
          themes: Array<{ __typename?: 'Theme' } & Pick<Theme, 'id' | 'name'>>;
          stacks: Array<{ __typename?: 'Stack' } & Pick<Stack, 'id'>>;
          hunches: Array<{ __typename?: 'Hunch' } & Pick<Hunch, 'id'>>;
        })
    | { __typename?: 'InstNotFoundError' };
};

export type GetThemesQueryVariables = Exact<{ [key: string]: never }>;

export type GetThemesQuery = { __typename?: 'Query' } & { themes: { __typename?: 'Themes' } & ThemesFieldsFragment };

export type ThemesFieldsFragment = { __typename?: 'Themes' } & {
  themes: Array<
    { __typename?: 'Theme' } & Pick<Theme, 'id' | 'name'> & {
        instruments: Array<{ __typename?: 'Instrument' } & Pick<Instrument, 'id' | 'description'>>;
      }
  >;
};

export const ThemesFieldsFragmentDoc = gql`
  fragment ThemesFields on Themes {
    themes {
      id
      name
      instruments {
        id
        description
      }
    }
  }
`;
export const CreateUserDocument = gql`
  mutation CreateUser($createUserData: CreateUserInput!) {
    createUser(data: $createUserData) {
      ... on CreateUserSuccess {
        user {
          id
        }
      }
      ... on CreateUserAlreadyExistsError {
        message
      }
      ... on CreateInvalidInputError {
        message
        errorCode
      }
      ... on InstNotFoundError {
        message
      }
    }
  }
`;
export type CreateUserMutationFn = Apollo.MutationFunction<CreateUserMutation, CreateUserMutationVariables>;
export type CreateUserComponentProps = Omit<
  ApolloReactComponents.MutationComponentOptions<CreateUserMutation, CreateUserMutationVariables>,
  'mutation'
>;

export const CreateUserComponent = (props: CreateUserComponentProps) => (
  <ApolloReactComponents.Mutation<CreateUserMutation, CreateUserMutationVariables>
    mutation={CreateUserDocument}
    {...props}
  />
);

export type CreateUserProps<TChildProps = {}, TDataName extends string = 'mutate'> = {
  [key in TDataName]: Apollo.MutationFunction<CreateUserMutation, CreateUserMutationVariables>;
} &
  TChildProps;
export function withCreateUser<TProps, TChildProps = {}, TDataName extends string = 'mutate'>(
  operationOptions?: ApolloReactHoc.OperationOption<
    TProps,
    CreateUserMutation,
    CreateUserMutationVariables,
    CreateUserProps<TChildProps, TDataName>
  >,
) {
  return ApolloReactHoc.withMutation<
    TProps,
    CreateUserMutation,
    CreateUserMutationVariables,
    CreateUserProps<TChildProps, TDataName>
  >(CreateUserDocument, {
    alias: 'createUser',
    ...operationOptions,
  });
}

/**
 * __useCreateUserMutation__
 *
 * To run a mutation, you first call `useCreateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createUserMutation, { data, loading, error }] = useCreateUserMutation({
 *   variables: {
 *      createUserData: // value for 'createUserData'
 *   },
 * });
 */
export function useCreateUserMutation(
  baseOptions?: Apollo.MutationHookOptions<CreateUserMutation, CreateUserMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<CreateUserMutation, CreateUserMutationVariables>(CreateUserDocument, options);
}
export type CreateUserMutationHookResult = ReturnType<typeof useCreateUserMutation>;
export type CreateUserMutationResult = Apollo.MutationResult<CreateUserMutation>;
export type CreateUserMutationOptions = Apollo.BaseMutationOptions<CreateUserMutation, CreateUserMutationVariables>;
export const CreateUserFollowMutationDocument = gql`
  mutation CreateUserFollowMutation($createUserFollowFollowedUserId: ID!) {
    createUserFollow(followedUserId: $createUserFollowFollowedUserId) {
      ... on CreateUserFollowSuccess {
        userFollow {
          id
        }
      }
      ... on CreateInvalidInputError {
        message
        errorCode
      }
      ... on NotAllowedError {
        message
      }
    }
  }
`;
export type CreateUserFollowMutationMutationFn = Apollo.MutationFunction<
  CreateUserFollowMutationMutation,
  CreateUserFollowMutationMutationVariables
>;
export type CreateUserFollowMutationComponentProps = Omit<
  ApolloReactComponents.MutationComponentOptions<
    CreateUserFollowMutationMutation,
    CreateUserFollowMutationMutationVariables
  >,
  'mutation'
>;

export const CreateUserFollowMutationComponent = (props: CreateUserFollowMutationComponentProps) => (
  <ApolloReactComponents.Mutation<CreateUserFollowMutationMutation, CreateUserFollowMutationMutationVariables>
    mutation={CreateUserFollowMutationDocument}
    {...props}
  />
);

export type CreateUserFollowMutationProps<TChildProps = {}, TDataName extends string = 'mutate'> = {
  [key in TDataName]: Apollo.MutationFunction<
    CreateUserFollowMutationMutation,
    CreateUserFollowMutationMutationVariables
  >;
} &
  TChildProps;
export function withCreateUserFollowMutation<TProps, TChildProps = {}, TDataName extends string = 'mutate'>(
  operationOptions?: ApolloReactHoc.OperationOption<
    TProps,
    CreateUserFollowMutationMutation,
    CreateUserFollowMutationMutationVariables,
    CreateUserFollowMutationProps<TChildProps, TDataName>
  >,
) {
  return ApolloReactHoc.withMutation<
    TProps,
    CreateUserFollowMutationMutation,
    CreateUserFollowMutationMutationVariables,
    CreateUserFollowMutationProps<TChildProps, TDataName>
  >(CreateUserFollowMutationDocument, {
    alias: 'createUserFollowMutation',
    ...operationOptions,
  });
}

/**
 * __useCreateUserFollowMutationMutation__
 *
 * To run a mutation, you first call `useCreateUserFollowMutationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateUserFollowMutationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createUserFollowMutationMutation, { data, loading, error }] = useCreateUserFollowMutationMutation({
 *   variables: {
 *      createUserFollowFollowedUserId: // value for 'createUserFollowFollowedUserId'
 *   },
 * });
 */
export function useCreateUserFollowMutationMutation(
  baseOptions?: Apollo.MutationHookOptions<CreateUserFollowMutationMutation, CreateUserFollowMutationMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<CreateUserFollowMutationMutation, CreateUserFollowMutationMutationVariables>(
    CreateUserFollowMutationDocument,
    options,
  );
}
export type CreateUserFollowMutationMutationHookResult = ReturnType<typeof useCreateUserFollowMutationMutation>;
export type CreateUserFollowMutationMutationResult = Apollo.MutationResult<CreateUserFollowMutationMutation>;
export type CreateUserFollowMutationMutationOptions = Apollo.BaseMutationOptions<
  CreateUserFollowMutationMutation,
  CreateUserFollowMutationMutationVariables
>;
export const CreateUserHunchDocument = gql`
  mutation CreateUserHunch($createUserHunchData: CreateHunchInput!) {
    createUserHunch(data: $createUserHunchData) {
      ... on CreateUserHunchSuccess {
        hunch {
          id
          targetPrice
          instrument {
            id
          }
          byDate
        }
      }
      ... on InstNotFoundError {
        message
      }
      ... on CreateInvalidInputError {
        message
        errorCode
      }
    }
  }
`;
export type CreateUserHunchMutationFn = Apollo.MutationFunction<
  CreateUserHunchMutation,
  CreateUserHunchMutationVariables
>;
export type CreateUserHunchComponentProps = Omit<
  ApolloReactComponents.MutationComponentOptions<CreateUserHunchMutation, CreateUserHunchMutationVariables>,
  'mutation'
>;

export const CreateUserHunchComponent = (props: CreateUserHunchComponentProps) => (
  <ApolloReactComponents.Mutation<CreateUserHunchMutation, CreateUserHunchMutationVariables>
    mutation={CreateUserHunchDocument}
    {...props}
  />
);

export type CreateUserHunchProps<TChildProps = {}, TDataName extends string = 'mutate'> = {
  [key in TDataName]: Apollo.MutationFunction<CreateUserHunchMutation, CreateUserHunchMutationVariables>;
} &
  TChildProps;
export function withCreateUserHunch<TProps, TChildProps = {}, TDataName extends string = 'mutate'>(
  operationOptions?: ApolloReactHoc.OperationOption<
    TProps,
    CreateUserHunchMutation,
    CreateUserHunchMutationVariables,
    CreateUserHunchProps<TChildProps, TDataName>
  >,
) {
  return ApolloReactHoc.withMutation<
    TProps,
    CreateUserHunchMutation,
    CreateUserHunchMutationVariables,
    CreateUserHunchProps<TChildProps, TDataName>
  >(CreateUserHunchDocument, {
    alias: 'createUserHunch',
    ...operationOptions,
  });
}

/**
 * __useCreateUserHunchMutation__
 *
 * To run a mutation, you first call `useCreateUserHunchMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateUserHunchMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createUserHunchMutation, { data, loading, error }] = useCreateUserHunchMutation({
 *   variables: {
 *      createUserHunchData: // value for 'createUserHunchData'
 *   },
 * });
 */
export function useCreateUserHunchMutation(
  baseOptions?: Apollo.MutationHookOptions<CreateUserHunchMutation, CreateUserHunchMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<CreateUserHunchMutation, CreateUserHunchMutationVariables>(
    CreateUserHunchDocument,
    options,
  );
}
export type CreateUserHunchMutationHookResult = ReturnType<typeof useCreateUserHunchMutation>;
export type CreateUserHunchMutationResult = Apollo.MutationResult<CreateUserHunchMutation>;
export type CreateUserHunchMutationOptions = Apollo.BaseMutationOptions<
  CreateUserHunchMutation,
  CreateUserHunchMutationVariables
>;
export const CreateUserStackMutationDocument = gql`
  mutation CreateUserStackMutation($createUserStackData: CreateStackInput!) {
    createUserStack(data: $createUserStackData) {
      ... on CreateUserStackSuccess {
        stack {
          id
          name
        }
      }
      ... on InstNotFoundError {
        message
      }
      ... on CreateInvalidInputError {
        message
        errorCode
      }
    }
  }
`;
export type CreateUserStackMutationMutationFn = Apollo.MutationFunction<
  CreateUserStackMutationMutation,
  CreateUserStackMutationMutationVariables
>;
export type CreateUserStackMutationComponentProps = Omit<
  ApolloReactComponents.MutationComponentOptions<
    CreateUserStackMutationMutation,
    CreateUserStackMutationMutationVariables
  >,
  'mutation'
>;

export const CreateUserStackMutationComponent = (props: CreateUserStackMutationComponentProps) => (
  <ApolloReactComponents.Mutation<CreateUserStackMutationMutation, CreateUserStackMutationMutationVariables>
    mutation={CreateUserStackMutationDocument}
    {...props}
  />
);

export type CreateUserStackMutationProps<TChildProps = {}, TDataName extends string = 'mutate'> = {
  [key in TDataName]: Apollo.MutationFunction<
    CreateUserStackMutationMutation,
    CreateUserStackMutationMutationVariables
  >;
} &
  TChildProps;
export function withCreateUserStackMutation<TProps, TChildProps = {}, TDataName extends string = 'mutate'>(
  operationOptions?: ApolloReactHoc.OperationOption<
    TProps,
    CreateUserStackMutationMutation,
    CreateUserStackMutationMutationVariables,
    CreateUserStackMutationProps<TChildProps, TDataName>
  >,
) {
  return ApolloReactHoc.withMutation<
    TProps,
    CreateUserStackMutationMutation,
    CreateUserStackMutationMutationVariables,
    CreateUserStackMutationProps<TChildProps, TDataName>
  >(CreateUserStackMutationDocument, {
    alias: 'createUserStackMutation',
    ...operationOptions,
  });
}

/**
 * __useCreateUserStackMutationMutation__
 *
 * To run a mutation, you first call `useCreateUserStackMutationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateUserStackMutationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createUserStackMutationMutation, { data, loading, error }] = useCreateUserStackMutationMutation({
 *   variables: {
 *      createUserStackData: // value for 'createUserStackData'
 *   },
 * });
 */
export function useCreateUserStackMutationMutation(
  baseOptions?: Apollo.MutationHookOptions<CreateUserStackMutationMutation, CreateUserStackMutationMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<CreateUserStackMutationMutation, CreateUserStackMutationMutationVariables>(
    CreateUserStackMutationDocument,
    options,
  );
}
export type CreateUserStackMutationMutationHookResult = ReturnType<typeof useCreateUserStackMutationMutation>;
export type CreateUserStackMutationMutationResult = Apollo.MutationResult<CreateUserStackMutationMutation>;
export type CreateUserStackMutationMutationOptions = Apollo.BaseMutationOptions<
  CreateUserStackMutationMutation,
  CreateUserStackMutationMutationVariables
>;
export const DeleteUserFollowsDocument = gql`
  mutation DeleteUserFollows($deleteUserFollowsUserFollowIds: [ID!]!) {
    deleteUserFollows(userFollowIds: $deleteUserFollowsUserFollowIds) {
      ... on DeleteSuccess {
        deleteIds
      }
      ... on DeleteInvalidInputError {
        message
        errorCode
      }
    }
  }
`;
export type DeleteUserFollowsMutationFn = Apollo.MutationFunction<
  DeleteUserFollowsMutation,
  DeleteUserFollowsMutationVariables
>;
export type DeleteUserFollowsComponentProps = Omit<
  ApolloReactComponents.MutationComponentOptions<DeleteUserFollowsMutation, DeleteUserFollowsMutationVariables>,
  'mutation'
>;

export const DeleteUserFollowsComponent = (props: DeleteUserFollowsComponentProps) => (
  <ApolloReactComponents.Mutation<DeleteUserFollowsMutation, DeleteUserFollowsMutationVariables>
    mutation={DeleteUserFollowsDocument}
    {...props}
  />
);

export type DeleteUserFollowsProps<TChildProps = {}, TDataName extends string = 'mutate'> = {
  [key in TDataName]: Apollo.MutationFunction<DeleteUserFollowsMutation, DeleteUserFollowsMutationVariables>;
} &
  TChildProps;
export function withDeleteUserFollows<TProps, TChildProps = {}, TDataName extends string = 'mutate'>(
  operationOptions?: ApolloReactHoc.OperationOption<
    TProps,
    DeleteUserFollowsMutation,
    DeleteUserFollowsMutationVariables,
    DeleteUserFollowsProps<TChildProps, TDataName>
  >,
) {
  return ApolloReactHoc.withMutation<
    TProps,
    DeleteUserFollowsMutation,
    DeleteUserFollowsMutationVariables,
    DeleteUserFollowsProps<TChildProps, TDataName>
  >(DeleteUserFollowsDocument, {
    alias: 'deleteUserFollows',
    ...operationOptions,
  });
}

/**
 * __useDeleteUserFollowsMutation__
 *
 * To run a mutation, you first call `useDeleteUserFollowsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteUserFollowsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteUserFollowsMutation, { data, loading, error }] = useDeleteUserFollowsMutation({
 *   variables: {
 *      deleteUserFollowsUserFollowIds: // value for 'deleteUserFollowsUserFollowIds'
 *   },
 * });
 */
export function useDeleteUserFollowsMutation(
  baseOptions?: Apollo.MutationHookOptions<DeleteUserFollowsMutation, DeleteUserFollowsMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<DeleteUserFollowsMutation, DeleteUserFollowsMutationVariables>(
    DeleteUserFollowsDocument,
    options,
  );
}
export type DeleteUserFollowsMutationHookResult = ReturnType<typeof useDeleteUserFollowsMutation>;
export type DeleteUserFollowsMutationResult = Apollo.MutationResult<DeleteUserFollowsMutation>;
export type DeleteUserFollowsMutationOptions = Apollo.BaseMutationOptions<
  DeleteUserFollowsMutation,
  DeleteUserFollowsMutationVariables
>;
export const DeleteUserHunchesDocument = gql`
  mutation deleteUserHunches($deleteUserHunchesHunchIds: [ID!]!) {
    deleteUserHunches(hunchIds: $deleteUserHunchesHunchIds) {
      ... on DeleteSuccess {
        deleteIds
      }
      ... on DeleteInvalidInputError {
        message
        errorCode
      }
    }
  }
`;
export type DeleteUserHunchesMutationFn = Apollo.MutationFunction<
  DeleteUserHunchesMutation,
  DeleteUserHunchesMutationVariables
>;
export type DeleteUserHunchesComponentProps = Omit<
  ApolloReactComponents.MutationComponentOptions<DeleteUserHunchesMutation, DeleteUserHunchesMutationVariables>,
  'mutation'
>;

export const DeleteUserHunchesComponent = (props: DeleteUserHunchesComponentProps) => (
  <ApolloReactComponents.Mutation<DeleteUserHunchesMutation, DeleteUserHunchesMutationVariables>
    mutation={DeleteUserHunchesDocument}
    {...props}
  />
);

export type DeleteUserHunchesProps<TChildProps = {}, TDataName extends string = 'mutate'> = {
  [key in TDataName]: Apollo.MutationFunction<DeleteUserHunchesMutation, DeleteUserHunchesMutationVariables>;
} &
  TChildProps;
export function withDeleteUserHunches<TProps, TChildProps = {}, TDataName extends string = 'mutate'>(
  operationOptions?: ApolloReactHoc.OperationOption<
    TProps,
    DeleteUserHunchesMutation,
    DeleteUserHunchesMutationVariables,
    DeleteUserHunchesProps<TChildProps, TDataName>
  >,
) {
  return ApolloReactHoc.withMutation<
    TProps,
    DeleteUserHunchesMutation,
    DeleteUserHunchesMutationVariables,
    DeleteUserHunchesProps<TChildProps, TDataName>
  >(DeleteUserHunchesDocument, {
    alias: 'deleteUserHunches',
    ...operationOptions,
  });
}

/**
 * __useDeleteUserHunchesMutation__
 *
 * To run a mutation, you first call `useDeleteUserHunchesMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteUserHunchesMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteUserHunchesMutation, { data, loading, error }] = useDeleteUserHunchesMutation({
 *   variables: {
 *      deleteUserHunchesHunchIds: // value for 'deleteUserHunchesHunchIds'
 *   },
 * });
 */
export function useDeleteUserHunchesMutation(
  baseOptions?: Apollo.MutationHookOptions<DeleteUserHunchesMutation, DeleteUserHunchesMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<DeleteUserHunchesMutation, DeleteUserHunchesMutationVariables>(
    DeleteUserHunchesDocument,
    options,
  );
}
export type DeleteUserHunchesMutationHookResult = ReturnType<typeof useDeleteUserHunchesMutation>;
export type DeleteUserHunchesMutationResult = Apollo.MutationResult<DeleteUserHunchesMutation>;
export type DeleteUserHunchesMutationOptions = Apollo.BaseMutationOptions<
  DeleteUserHunchesMutation,
  DeleteUserHunchesMutationVariables
>;
export const DeleteUserStacksDocument = gql`
  mutation deleteUserStacks($deleteUserStacksStackIds: [ID!]!) {
    deleteUserStacks(stackIds: $deleteUserStacksStackIds) {
      ... on DeleteSuccess {
        deleteIds
      }
      ... on DeleteInvalidInputError {
        message
        errorCode
      }
    }
  }
`;
export type DeleteUserStacksMutationFn = Apollo.MutationFunction<
  DeleteUserStacksMutation,
  DeleteUserStacksMutationVariables
>;
export type DeleteUserStacksComponentProps = Omit<
  ApolloReactComponents.MutationComponentOptions<DeleteUserStacksMutation, DeleteUserStacksMutationVariables>,
  'mutation'
>;

export const DeleteUserStacksComponent = (props: DeleteUserStacksComponentProps) => (
  <ApolloReactComponents.Mutation<DeleteUserStacksMutation, DeleteUserStacksMutationVariables>
    mutation={DeleteUserStacksDocument}
    {...props}
  />
);

export type DeleteUserStacksProps<TChildProps = {}, TDataName extends string = 'mutate'> = {
  [key in TDataName]: Apollo.MutationFunction<DeleteUserStacksMutation, DeleteUserStacksMutationVariables>;
} &
  TChildProps;
export function withDeleteUserStacks<TProps, TChildProps = {}, TDataName extends string = 'mutate'>(
  operationOptions?: ApolloReactHoc.OperationOption<
    TProps,
    DeleteUserStacksMutation,
    DeleteUserStacksMutationVariables,
    DeleteUserStacksProps<TChildProps, TDataName>
  >,
) {
  return ApolloReactHoc.withMutation<
    TProps,
    DeleteUserStacksMutation,
    DeleteUserStacksMutationVariables,
    DeleteUserStacksProps<TChildProps, TDataName>
  >(DeleteUserStacksDocument, {
    alias: 'deleteUserStacks',
    ...operationOptions,
  });
}

/**
 * __useDeleteUserStacksMutation__
 *
 * To run a mutation, you first call `useDeleteUserStacksMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteUserStacksMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteUserStacksMutation, { data, loading, error }] = useDeleteUserStacksMutation({
 *   variables: {
 *      deleteUserStacksStackIds: // value for 'deleteUserStacksStackIds'
 *   },
 * });
 */
export function useDeleteUserStacksMutation(
  baseOptions?: Apollo.MutationHookOptions<DeleteUserStacksMutation, DeleteUserStacksMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<DeleteUserStacksMutation, DeleteUserStacksMutationVariables>(
    DeleteUserStacksDocument,
    options,
  );
}
export type DeleteUserStacksMutationHookResult = ReturnType<typeof useDeleteUserStacksMutation>;
export type DeleteUserStacksMutationResult = Apollo.MutationResult<DeleteUserStacksMutation>;
export type DeleteUserStacksMutationOptions = Apollo.BaseMutationOptions<
  DeleteUserStacksMutation,
  DeleteUserStacksMutationVariables
>;
export const CommunityStacksDocument = gql`
  query CommunityStacks {
    communityStacks {
      ... on CommStacks {
        commStacks {
          id
          text: name
        }
      }
    }
  }
`;
export type CommunityStacksComponentProps = Omit<
  ApolloReactComponents.QueryComponentOptions<CommunityStacksQuery, CommunityStacksQueryVariables>,
  'query'
>;

export const CommunityStacksComponent = (props: CommunityStacksComponentProps) => (
  <ApolloReactComponents.Query<CommunityStacksQuery, CommunityStacksQueryVariables>
    query={CommunityStacksDocument}
    {...props}
  />
);

export type CommunityStacksProps<TChildProps = {}, TDataName extends string = 'data'> = {
  [key in TDataName]: ApolloReactHoc.DataValue<CommunityStacksQuery, CommunityStacksQueryVariables>;
} &
  TChildProps;
export function withCommunityStacks<TProps, TChildProps = {}, TDataName extends string = 'data'>(
  operationOptions?: ApolloReactHoc.OperationOption<
    TProps,
    CommunityStacksQuery,
    CommunityStacksQueryVariables,
    CommunityStacksProps<TChildProps, TDataName>
  >,
) {
  return ApolloReactHoc.withQuery<
    TProps,
    CommunityStacksQuery,
    CommunityStacksQueryVariables,
    CommunityStacksProps<TChildProps, TDataName>
  >(CommunityStacksDocument, {
    alias: 'communityStacks',
    ...operationOptions,
  });
}

/**
 * __useCommunityStacksQuery__
 *
 * To run a query within a React component, call `useCommunityStacksQuery` and pass it any options that fit your needs.
 * When your component renders, `useCommunityStacksQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCommunityStacksQuery({
 *   variables: {
 *   },
 * });
 */
export function useCommunityStacksQuery(
  baseOptions?: Apollo.QueryHookOptions<CommunityStacksQuery, CommunityStacksQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<CommunityStacksQuery, CommunityStacksQueryVariables>(CommunityStacksDocument, options);
}
export function useCommunityStacksLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<CommunityStacksQuery, CommunityStacksQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<CommunityStacksQuery, CommunityStacksQueryVariables>(CommunityStacksDocument, options);
}
export type CommunityStacksQueryHookResult = ReturnType<typeof useCommunityStacksQuery>;
export type CommunityStacksLazyQueryHookResult = ReturnType<typeof useCommunityStacksLazyQuery>;
export type CommunityStacksQueryResult = Apollo.QueryResult<CommunityStacksQuery, CommunityStacksQueryVariables>;
export const CompanySearchDocument = gql`
  query CompanySearch($instrumentsPattern: String!, $instrumentsNMax: Int!) {
    instruments(pattern: $instrumentsPattern, nMax: $instrumentsNMax) {
      ... on Instruments {
        instruments {
          id
          name
          symbol
          description
          currentPrice
          priceChangePercentage
        }
      }
    }
  }
`;
export type CompanySearchComponentProps = Omit<
  ApolloReactComponents.QueryComponentOptions<CompanySearchQuery, CompanySearchQueryVariables>,
  'query'
> &
  ({ variables: CompanySearchQueryVariables; skip?: boolean } | { skip: boolean });

export const CompanySearchComponent = (props: CompanySearchComponentProps) => (
  <ApolloReactComponents.Query<CompanySearchQuery, CompanySearchQueryVariables>
    query={CompanySearchDocument}
    {...props}
  />
);

export type CompanySearchProps<TChildProps = {}, TDataName extends string = 'data'> = {
  [key in TDataName]: ApolloReactHoc.DataValue<CompanySearchQuery, CompanySearchQueryVariables>;
} &
  TChildProps;
export function withCompanySearch<TProps, TChildProps = {}, TDataName extends string = 'data'>(
  operationOptions?: ApolloReactHoc.OperationOption<
    TProps,
    CompanySearchQuery,
    CompanySearchQueryVariables,
    CompanySearchProps<TChildProps, TDataName>
  >,
) {
  return ApolloReactHoc.withQuery<
    TProps,
    CompanySearchQuery,
    CompanySearchQueryVariables,
    CompanySearchProps<TChildProps, TDataName>
  >(CompanySearchDocument, {
    alias: 'companySearch',
    ...operationOptions,
  });
}

/**
 * __useCompanySearchQuery__
 *
 * To run a query within a React component, call `useCompanySearchQuery` and pass it any options that fit your needs.
 * When your component renders, `useCompanySearchQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCompanySearchQuery({
 *   variables: {
 *      instrumentsPattern: // value for 'instrumentsPattern'
 *      instrumentsNMax: // value for 'instrumentsNMax'
 *   },
 * });
 */
export function useCompanySearchQuery(
  baseOptions: Apollo.QueryHookOptions<CompanySearchQuery, CompanySearchQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<CompanySearchQuery, CompanySearchQueryVariables>(CompanySearchDocument, options);
}
export function useCompanySearchLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<CompanySearchQuery, CompanySearchQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<CompanySearchQuery, CompanySearchQueryVariables>(CompanySearchDocument, options);
}
export type CompanySearchQueryHookResult = ReturnType<typeof useCompanySearchQuery>;
export type CompanySearchLazyQueryHookResult = ReturnType<typeof useCompanySearchLazyQuery>;
export type CompanySearchQueryResult = Apollo.QueryResult<CompanySearchQuery, CompanySearchQueryVariables>;
export const GetCurrentUserDocument = gql`
  query getCurrentUser {
    currentUser {
      ... on User {
        id
        userName
        email
        bio
        fullName
        nStacks
        nHunches
        nFollowers
        avatar
        hunches {
          id
          instrument {
            name
            symbol
          }
          byDate
          priceChangePercentage
          byDate
          targetPrice
          currentPrice
        }
        stacks {
          id
          name
          instruments {
            id
            name
            currentPrice
          }
          totalValue
          percentageChange
        }
        followers {
          id
          userName
          avatar
        }
        followedUsers {
          id
          userName
          avatar
        }
      }
    }
  }
`;
export type GetCurrentUserComponentProps = Omit<
  ApolloReactComponents.QueryComponentOptions<GetCurrentUserQuery, GetCurrentUserQueryVariables>,
  'query'
>;

export const GetCurrentUserComponent = (props: GetCurrentUserComponentProps) => (
  <ApolloReactComponents.Query<GetCurrentUserQuery, GetCurrentUserQueryVariables>
    query={GetCurrentUserDocument}
    {...props}
  />
);

export type GetCurrentUserProps<TChildProps = {}, TDataName extends string = 'data'> = {
  [key in TDataName]: ApolloReactHoc.DataValue<GetCurrentUserQuery, GetCurrentUserQueryVariables>;
} &
  TChildProps;
export function withGetCurrentUser<TProps, TChildProps = {}, TDataName extends string = 'data'>(
  operationOptions?: ApolloReactHoc.OperationOption<
    TProps,
    GetCurrentUserQuery,
    GetCurrentUserQueryVariables,
    GetCurrentUserProps<TChildProps, TDataName>
  >,
) {
  return ApolloReactHoc.withQuery<
    TProps,
    GetCurrentUserQuery,
    GetCurrentUserQueryVariables,
    GetCurrentUserProps<TChildProps, TDataName>
  >(GetCurrentUserDocument, {
    alias: 'getCurrentUser',
    ...operationOptions,
  });
}

/**
 * __useGetCurrentUserQuery__
 *
 * To run a query within a React component, call `useGetCurrentUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCurrentUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCurrentUserQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetCurrentUserQuery(
  baseOptions?: Apollo.QueryHookOptions<GetCurrentUserQuery, GetCurrentUserQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetCurrentUserQuery, GetCurrentUserQueryVariables>(GetCurrentUserDocument, options);
}
export function useGetCurrentUserLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetCurrentUserQuery, GetCurrentUserQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetCurrentUserQuery, GetCurrentUserQueryVariables>(GetCurrentUserDocument, options);
}
export type GetCurrentUserQueryHookResult = ReturnType<typeof useGetCurrentUserQuery>;
export type GetCurrentUserLazyQueryHookResult = ReturnType<typeof useGetCurrentUserLazyQuery>;
export type GetCurrentUserQueryResult = Apollo.QueryResult<GetCurrentUserQuery, GetCurrentUserQueryVariables>;
export const GetCurrentUserHunchesDocument = gql`
  query getCurrentUserHunches {
    currentUser {
      ... on User {
        id
        hunches {
          id
          description
          instrument {
            id
            symbol
            currentPrice
            priceChangePercentage
            description
            shortDescription
            name
          }
          priceChangePercentage
          targetPrice
        }
        followedHunches {
          id
          description
          instrument {
            id
            symbol
            currentPrice
            priceChangePercentage
            description
            shortDescription
            name
          }
          targetPrice
          priceChangePercentage
        }
      }
    }
  }
`;
export type GetCurrentUserHunchesComponentProps = Omit<
  ApolloReactComponents.QueryComponentOptions<GetCurrentUserHunchesQuery, GetCurrentUserHunchesQueryVariables>,
  'query'
>;

export const GetCurrentUserHunchesComponent = (props: GetCurrentUserHunchesComponentProps) => (
  <ApolloReactComponents.Query<GetCurrentUserHunchesQuery, GetCurrentUserHunchesQueryVariables>
    query={GetCurrentUserHunchesDocument}
    {...props}
  />
);

export type GetCurrentUserHunchesProps<TChildProps = {}, TDataName extends string = 'data'> = {
  [key in TDataName]: ApolloReactHoc.DataValue<GetCurrentUserHunchesQuery, GetCurrentUserHunchesQueryVariables>;
} &
  TChildProps;
export function withGetCurrentUserHunches<TProps, TChildProps = {}, TDataName extends string = 'data'>(
  operationOptions?: ApolloReactHoc.OperationOption<
    TProps,
    GetCurrentUserHunchesQuery,
    GetCurrentUserHunchesQueryVariables,
    GetCurrentUserHunchesProps<TChildProps, TDataName>
  >,
) {
  return ApolloReactHoc.withQuery<
    TProps,
    GetCurrentUserHunchesQuery,
    GetCurrentUserHunchesQueryVariables,
    GetCurrentUserHunchesProps<TChildProps, TDataName>
  >(GetCurrentUserHunchesDocument, {
    alias: 'getCurrentUserHunches',
    ...operationOptions,
  });
}

/**
 * __useGetCurrentUserHunchesQuery__
 *
 * To run a query within a React component, call `useGetCurrentUserHunchesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCurrentUserHunchesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCurrentUserHunchesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetCurrentUserHunchesQuery(
  baseOptions?: Apollo.QueryHookOptions<GetCurrentUserHunchesQuery, GetCurrentUserHunchesQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetCurrentUserHunchesQuery, GetCurrentUserHunchesQueryVariables>(
    GetCurrentUserHunchesDocument,
    options,
  );
}
export function useGetCurrentUserHunchesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetCurrentUserHunchesQuery, GetCurrentUserHunchesQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetCurrentUserHunchesQuery, GetCurrentUserHunchesQueryVariables>(
    GetCurrentUserHunchesDocument,
    options,
  );
}
export type GetCurrentUserHunchesQueryHookResult = ReturnType<typeof useGetCurrentUserHunchesQuery>;
export type GetCurrentUserHunchesLazyQueryHookResult = ReturnType<typeof useGetCurrentUserHunchesLazyQuery>;
export type GetCurrentUserHunchesQueryResult = Apollo.QueryResult<
  GetCurrentUserHunchesQuery,
  GetCurrentUserHunchesQueryVariables
>;
export const GetCurrentUserStacksDocument = gql`
  query getCurrentUserStacks {
    currentUser {
      ... on User {
        stacks {
          id
          name
          instruments {
            id
            symbol
            currentPrice
            priceChangePercentage
            description
            shortDescription
            name
          }
          totalValue
          percentageChange
        }
        followedStacks {
          id
          name
          instruments {
            id
            symbol
            currentPrice
            priceChangePercentage
            description
            shortDescription
            name
          }
          totalValue
          percentageChange
        }
      }
    }
  }
`;
export type GetCurrentUserStacksComponentProps = Omit<
  ApolloReactComponents.QueryComponentOptions<GetCurrentUserStacksQuery, GetCurrentUserStacksQueryVariables>,
  'query'
>;

export const GetCurrentUserStacksComponent = (props: GetCurrentUserStacksComponentProps) => (
  <ApolloReactComponents.Query<GetCurrentUserStacksQuery, GetCurrentUserStacksQueryVariables>
    query={GetCurrentUserStacksDocument}
    {...props}
  />
);

export type GetCurrentUserStacksProps<TChildProps = {}, TDataName extends string = 'data'> = {
  [key in TDataName]: ApolloReactHoc.DataValue<GetCurrentUserStacksQuery, GetCurrentUserStacksQueryVariables>;
} &
  TChildProps;
export function withGetCurrentUserStacks<TProps, TChildProps = {}, TDataName extends string = 'data'>(
  operationOptions?: ApolloReactHoc.OperationOption<
    TProps,
    GetCurrentUserStacksQuery,
    GetCurrentUserStacksQueryVariables,
    GetCurrentUserStacksProps<TChildProps, TDataName>
  >,
) {
  return ApolloReactHoc.withQuery<
    TProps,
    GetCurrentUserStacksQuery,
    GetCurrentUserStacksQueryVariables,
    GetCurrentUserStacksProps<TChildProps, TDataName>
  >(GetCurrentUserStacksDocument, {
    alias: 'getCurrentUserStacks',
    ...operationOptions,
  });
}

/**
 * __useGetCurrentUserStacksQuery__
 *
 * To run a query within a React component, call `useGetCurrentUserStacksQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCurrentUserStacksQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCurrentUserStacksQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetCurrentUserStacksQuery(
  baseOptions?: Apollo.QueryHookOptions<GetCurrentUserStacksQuery, GetCurrentUserStacksQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetCurrentUserStacksQuery, GetCurrentUserStacksQueryVariables>(
    GetCurrentUserStacksDocument,
    options,
  );
}
export function useGetCurrentUserStacksLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetCurrentUserStacksQuery, GetCurrentUserStacksQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetCurrentUserStacksQuery, GetCurrentUserStacksQueryVariables>(
    GetCurrentUserStacksDocument,
    options,
  );
}
export type GetCurrentUserStacksQueryHookResult = ReturnType<typeof useGetCurrentUserStacksQuery>;
export type GetCurrentUserStacksLazyQueryHookResult = ReturnType<typeof useGetCurrentUserStacksLazyQuery>;
export type GetCurrentUserStacksQueryResult = Apollo.QueryResult<
  GetCurrentUserStacksQuery,
  GetCurrentUserStacksQueryVariables
>;
export const GetFollowedUsersDocument = gql`
  query getFollowedUsers {
    currentUser {
      ... on User {
        followedUsers {
          id
          userName
          email
          fullName
          avatar
        }
      }
    }
  }
`;
export type GetFollowedUsersComponentProps = Omit<
  ApolloReactComponents.QueryComponentOptions<GetFollowedUsersQuery, GetFollowedUsersQueryVariables>,
  'query'
>;

export const GetFollowedUsersComponent = (props: GetFollowedUsersComponentProps) => (
  <ApolloReactComponents.Query<GetFollowedUsersQuery, GetFollowedUsersQueryVariables>
    query={GetFollowedUsersDocument}
    {...props}
  />
);

export type GetFollowedUsersProps<TChildProps = {}, TDataName extends string = 'data'> = {
  [key in TDataName]: ApolloReactHoc.DataValue<GetFollowedUsersQuery, GetFollowedUsersQueryVariables>;
} &
  TChildProps;
export function withGetFollowedUsers<TProps, TChildProps = {}, TDataName extends string = 'data'>(
  operationOptions?: ApolloReactHoc.OperationOption<
    TProps,
    GetFollowedUsersQuery,
    GetFollowedUsersQueryVariables,
    GetFollowedUsersProps<TChildProps, TDataName>
  >,
) {
  return ApolloReactHoc.withQuery<
    TProps,
    GetFollowedUsersQuery,
    GetFollowedUsersQueryVariables,
    GetFollowedUsersProps<TChildProps, TDataName>
  >(GetFollowedUsersDocument, {
    alias: 'getFollowedUsers',
    ...operationOptions,
  });
}

/**
 * __useGetFollowedUsersQuery__
 *
 * To run a query within a React component, call `useGetFollowedUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFollowedUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFollowedUsersQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetFollowedUsersQuery(
  baseOptions?: Apollo.QueryHookOptions<GetFollowedUsersQuery, GetFollowedUsersQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetFollowedUsersQuery, GetFollowedUsersQueryVariables>(GetFollowedUsersDocument, options);
}
export function useGetFollowedUsersLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetFollowedUsersQuery, GetFollowedUsersQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetFollowedUsersQuery, GetFollowedUsersQueryVariables>(GetFollowedUsersDocument, options);
}
export type GetFollowedUsersQueryHookResult = ReturnType<typeof useGetFollowedUsersQuery>;
export type GetFollowedUsersLazyQueryHookResult = ReturnType<typeof useGetFollowedUsersLazyQuery>;
export type GetFollowedUsersQueryResult = Apollo.QueryResult<GetFollowedUsersQuery, GetFollowedUsersQueryVariables>;
export const GetInvestopeersDocument = gql`
  query getInvestopeers {
    topUsers {
      ... on TopUsers {
        users {
          id
          fullName
          userName
          nFollowers
          nHunches
          nStacks
        }
      }
    }
  }
`;
export type GetInvestopeersComponentProps = Omit<
  ApolloReactComponents.QueryComponentOptions<GetInvestopeersQuery, GetInvestopeersQueryVariables>,
  'query'
>;

export const GetInvestopeersComponent = (props: GetInvestopeersComponentProps) => (
  <ApolloReactComponents.Query<GetInvestopeersQuery, GetInvestopeersQueryVariables>
    query={GetInvestopeersDocument}
    {...props}
  />
);

export type GetInvestopeersProps<TChildProps = {}, TDataName extends string = 'data'> = {
  [key in TDataName]: ApolloReactHoc.DataValue<GetInvestopeersQuery, GetInvestopeersQueryVariables>;
} &
  TChildProps;
export function withGetInvestopeers<TProps, TChildProps = {}, TDataName extends string = 'data'>(
  operationOptions?: ApolloReactHoc.OperationOption<
    TProps,
    GetInvestopeersQuery,
    GetInvestopeersQueryVariables,
    GetInvestopeersProps<TChildProps, TDataName>
  >,
) {
  return ApolloReactHoc.withQuery<
    TProps,
    GetInvestopeersQuery,
    GetInvestopeersQueryVariables,
    GetInvestopeersProps<TChildProps, TDataName>
  >(GetInvestopeersDocument, {
    alias: 'getInvestopeers',
    ...operationOptions,
  });
}

/**
 * __useGetInvestopeersQuery__
 *
 * To run a query within a React component, call `useGetInvestopeersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetInvestopeersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetInvestopeersQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetInvestopeersQuery(
  baseOptions?: Apollo.QueryHookOptions<GetInvestopeersQuery, GetInvestopeersQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetInvestopeersQuery, GetInvestopeersQueryVariables>(GetInvestopeersDocument, options);
}
export function useGetInvestopeersLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetInvestopeersQuery, GetInvestopeersQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetInvestopeersQuery, GetInvestopeersQueryVariables>(GetInvestopeersDocument, options);
}
export type GetInvestopeersQueryHookResult = ReturnType<typeof useGetInvestopeersQuery>;
export type GetInvestopeersLazyQueryHookResult = ReturnType<typeof useGetInvestopeersLazyQuery>;
export type GetInvestopeersQueryResult = Apollo.QueryResult<GetInvestopeersQuery, GetInvestopeersQueryVariables>;
export const OneRandomInstDocument = gql`
  query OneRandomInst($instIds: [ID!]!) {
    oneRandomInst(instIds: $instIds) {
      ... on Instrument {
        id
        symbol
        description
        name
        themes {
          id
          name
        }
      }
    }
  }
`;
export type OneRandomInstComponentProps = Omit<
  ApolloReactComponents.QueryComponentOptions<OneRandomInstQuery, OneRandomInstQueryVariables>,
  'query'
> &
  ({ variables: OneRandomInstQueryVariables; skip?: boolean } | { skip: boolean });

export const OneRandomInstComponent = (props: OneRandomInstComponentProps) => (
  <ApolloReactComponents.Query<OneRandomInstQuery, OneRandomInstQueryVariables>
    query={OneRandomInstDocument}
    {...props}
  />
);

export type OneRandomInstProps<TChildProps = {}, TDataName extends string = 'data'> = {
  [key in TDataName]: ApolloReactHoc.DataValue<OneRandomInstQuery, OneRandomInstQueryVariables>;
} &
  TChildProps;
export function withOneRandomInst<TProps, TChildProps = {}, TDataName extends string = 'data'>(
  operationOptions?: ApolloReactHoc.OperationOption<
    TProps,
    OneRandomInstQuery,
    OneRandomInstQueryVariables,
    OneRandomInstProps<TChildProps, TDataName>
  >,
) {
  return ApolloReactHoc.withQuery<
    TProps,
    OneRandomInstQuery,
    OneRandomInstQueryVariables,
    OneRandomInstProps<TChildProps, TDataName>
  >(OneRandomInstDocument, {
    alias: 'oneRandomInst',
    ...operationOptions,
  });
}

/**
 * __useOneRandomInstQuery__
 *
 * To run a query within a React component, call `useOneRandomInstQuery` and pass it any options that fit your needs.
 * When your component renders, `useOneRandomInstQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOneRandomInstQuery({
 *   variables: {
 *      oneRandomInstInstIds: // value for 'oneRandomInstInstIds'
 *   },
 * });
 */
export function useOneRandomInstQuery(
  baseOptions: Apollo.QueryHookOptions<OneRandomInstQuery, OneRandomInstQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<OneRandomInstQuery, OneRandomInstQueryVariables>(OneRandomInstDocument, options);
}
export function useOneRandomInstLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<OneRandomInstQuery, OneRandomInstQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<OneRandomInstQuery, OneRandomInstQueryVariables>(OneRandomInstDocument, options);
}
export type OneRandomInstQueryHookResult = ReturnType<typeof useOneRandomInstQuery>;
export type OneRandomInstLazyQueryHookResult = ReturnType<typeof useOneRandomInstLazyQuery>;
export type OneRandomInstQueryResult = Apollo.QueryResult<OneRandomInstQuery, OneRandomInstQueryVariables>;
export const GetThemesDocument = gql`
  query GetThemes {
    themes {
      ...ThemesFields
    }
  }
  ${ThemesFieldsFragmentDoc}
`;
export type GetThemesComponentProps = Omit<
  ApolloReactComponents.QueryComponentOptions<GetThemesQuery, GetThemesQueryVariables>,
  'query'
>;

export const GetThemesComponent = (props: GetThemesComponentProps) => (
  <ApolloReactComponents.Query<GetThemesQuery, GetThemesQueryVariables> query={GetThemesDocument} {...props} />
);

export type GetThemesProps<TChildProps = {}, TDataName extends string = 'data'> = {
  [key in TDataName]: ApolloReactHoc.DataValue<GetThemesQuery, GetThemesQueryVariables>;
} &
  TChildProps;
export function withGetThemes<TProps, TChildProps = {}, TDataName extends string = 'data'>(
  operationOptions?: ApolloReactHoc.OperationOption<
    TProps,
    GetThemesQuery,
    GetThemesQueryVariables,
    GetThemesProps<TChildProps, TDataName>
  >,
) {
  return ApolloReactHoc.withQuery<
    TProps,
    GetThemesQuery,
    GetThemesQueryVariables,
    GetThemesProps<TChildProps, TDataName>
  >(GetThemesDocument, {
    alias: 'getThemes',
    ...operationOptions,
  });
}

/**
 * __useGetThemesQuery__
 *
 * To run a query within a React component, call `useGetThemesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetThemesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetThemesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetThemesQuery(baseOptions?: Apollo.QueryHookOptions<GetThemesQuery, GetThemesQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetThemesQuery, GetThemesQueryVariables>(GetThemesDocument, options);
}
export function useGetThemesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetThemesQuery, GetThemesQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetThemesQuery, GetThemesQueryVariables>(GetThemesDocument, options);
}
export type GetThemesQueryHookResult = ReturnType<typeof useGetThemesQuery>;
export type GetThemesLazyQueryHookResult = ReturnType<typeof useGetThemesLazyQuery>;
export type GetThemesQueryResult = Apollo.QueryResult<GetThemesQuery, GetThemesQueryVariables>;
