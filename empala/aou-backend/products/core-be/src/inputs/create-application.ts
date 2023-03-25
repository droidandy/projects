import { Field, InputType, Int } from 'type-graphql';
import { EAccountType } from '../enums/onboarding/account-type';
import { ECountry } from '../enums/country';
import { EVisaType } from '../enums/onboarding/visa-type';
import { EAccountLocationType } from '../enums/onboarding/account-location-type';
import { EEmploymentStatus } from '../enums/onboarding/employment-status';
import { EInvestmentObjective } from '../enums/onboarding/investment-objective';
import { EAnnualIncome } from '../enums/onboarding/annual-income';
import { ENetWorth } from '../enums/onboarding/net-worth';
import { ERiskTolerance } from '../enums/onboarding/risk-tolerance';
import { ELiquidityNeeds } from '../enums/onboarding/liquidity-needs';
import { ETimeHorizon } from '../enums/onboarding/time-horizon';
import { EInvestmentExperience } from '../enums/onboarding/investment-experiencs';
import { EDividendProceedsAction } from '../enums/onboarding/divident-proceeds-action';
import { EDividendProceedsSendFrequency } from '../enums/onboarding/divident-proceeds-send-frequency';
import { ESecuritiesAction } from '../enums/onboarding/securities-action';

@InputType()
export class CreateApplicationInput {
  @Field(() => EAccountType, { nullable: false, description: 'Account Type, at the current moment MARGIN and IRA accounts are not supported' })
  public accountType: EAccountType;

  @Field({ nullable: false, description: 'First Name' })
  public firstName: string;

  @Field({ nullable: false, description: 'Last Name' })
  public lastName: string;

  @Field({ nullable: true, description: 'Middle Name' })
  public middleName?: string;

  @Field({ nullable: false, description: 'Date of Birth' })
  public dateOfBirth: Date;

  @Field(() => ECountry, { nullable: false, description: 'Citizenship country, ISO 3166-1 alpha-3 code' })
  public citizenshipCountry: ECountry;

  @Field({ nullable: true, description: 'Are you a permanent resident of USA? Available if citizenshipCountry != USA' })
  public isPermanentUsResident?: boolean;

  @Field({ nullable: true, description: 'Are you a US resident and have a US Visa? Available isPermanentUsResident = false ' })
  public isUsResidentWithVisa?: boolean;

  @Field(() => EVisaType, { nullable: true, description: 'What is your visa type? Available if isUsResidentWithVisa=true' })
  public visaType?: EVisaType;

  @Field({ nullable: true, description: 'What is expiration date of your Visa? Available if isUsResidentWithVisa=true' })
  public visaExpiration?: Date;

  @Field(() => ECountry, { nullable: true, description: ' Available if isUsResidentWithVisa=false' })
  public birthCountry?: ECountry;

  @Field({ nullable: false, description: 'Social Security/TAX ID' })
  public ssn: string;

  @Field({ nullable: false, description: 'Email' })
  public email: string;

  @Field({ nullable: false, description: 'Phone number' })
  public phoneNumber: string;

  @Field(() => ECountry, { nullable: false, description: 'Residential address country, ISO 3166-1 alpha-3 code' })
  public residentialAddressCountry: ECountry;

  @Field({ nullable: false, description: 'Address Line 1' })
  public residentialAddressLine1: string;

  @Field({ nullable: true, description: 'Address Line 2' })
  public residentialAddressLine2?: string;

  @Field({ nullable: false, description: 'City' })
  public residentialAddressCity: string;

  @Field({ nullable: true, description: 'Region/Province' })
  public residentialAddressRegion?: string;

  @Field({ nullable: false, description: 'State' })
  public residentialAddressState: string;

  @Field({ nullable: false, description: 'Zip/Postal Code' })
  public residentialAddressZipCode: string;

  @Field({ nullable: false, description: 'Is your mailing address the same as your home address?' })
  public isMailingAddressSameAsResidentialAddress: boolean;

  @Field(() => ECountry, {
    nullable: true,
    description: 'Current mailing address country, ISO 3166-1 alpha-3 code, available if isMailingAddressSameAsResidentialAddress=false',
  })
  public mailingAddressCountry?: ECountry;

  @Field({ nullable: true, description: 'Current mailing address line 1, available if isMailingAddressSameAsResidentialAddress=false' })
  public mailingAddressLine1?: string;

  @Field({ nullable: true, description: 'Current mailing address line 2, available if isMailingAddressSameAsResidentialAddress=false' })
  public mailingAddressLine2?: string;

  @Field({ nullable: true, description: 'Current mailing address city, available if isMailingAddressSameAsResidentialAddress=false' })
  public mailingAddressCity?: string;

  @Field({ nullable: true, description: 'Current mailing address region/province, available if isMailingAddressSameAsResidentialAddress=false' })
  public mailingAddressRegion?: string;

  @Field({ nullable: true, description: 'Current mailing address state, available if isMailingAddressSameAsResidentialAddress=false' })
  public mailingAddressState?: string;

  @Field({ nullable: true, description: 'Current mailing address zip/postal code, available if isMailingAddressSameAsResidentialAddress=false' })
  public mailingAddressZipCode?: string;

  @Field({ nullable: false, description: 'Is the account maintained for a current or former politically exposed person or public official?' })
  public isAccountMaintainedForPoliticalOrPublicPerson: boolean;

  @Field({
    nullable: true,
    description: 'Please provide the names of that official and official\'s immediate family members. '
      + 'Available if isAccountMaintainedForPoliticalOrPublicPerson=true',
  })
  public officialNameAndFamilyMembersNames?: string;

  @Field({
    nullable: true,
    description: 'Please provide the name of the related political organization. '
      + 'Available if isAccountMaintainedForPoliticalOrPublicPerson=true',
  })
  public nameOfPoliticalOrganization?: string;

  @Field({ nullable: false, description: 'Is the account holder a control person of a publicly traded company? (Director, Officer, or 10% Stock Holder)' })
  public isAccountHolderIsControlHolderOfPublicCompany: boolean;

  @Field({
    nullable: true,
    description: 'Please list the name of the company(s) and the stock ticker symbol. '
      + 'Available if isAccountHolderIsControlHolderOfPublicCompany=true',
  })
  public listOfHoldedCompanies?: string;

  @Field({
    nullable: false,
    description: 'Are you, or anyone authorized to trade in your account, affiliated with or work with or work for a member '
      + 'firm of a stock exchange or FINRA?',
  })
  public isAffiliatedWithExchangeOrFINRA: boolean;

  @Field({ nullable: true, description: 'Name of firm. Available if isAffiliatedWithExchangeOrFINRA=true' })
  public nameOfAffiliatedFirm?: string;

  @Field({ nullable: false, description: 'Have you granted trading authorization to another party' })
  public isThirdPartyTradingAuthorizationGranted: boolean;

  @Field({ nullable: true, description: 'Name of agent. Available if isThirdPartyTradingAuthorizationGranted=true' })
  public nameOfThirdPartyAgent?: string;

  @Field(() => EAccountLocationType, { nullable: false, description: 'Please confirm type of account you are opening' })
  public accountLocationType: EAccountLocationType;

  @Field({ nullable: false, description: 'Are you 55 or older? If areYou55OrOlder=true, user should enter trusted contact information' })
  public areYou55OrOlder: boolean;

  @Field({ nullable: false, description: 'Do you want to add trusted contact information?' })
  public doYouWantToAddTrustedContactInformation: boolean;

  @Field({ nullable: true, description: 'Trusted Contact First Name' })
  public trustedContactFirstName?: string;

  @Field({ nullable: true, description: 'Trusted Contact Last Name' })
  public trustedContactLastName?: string;

  @Field({ nullable: true, description: 'Trusted Contact Phone Number' })
  public trustedContactPhoneNumber?: string;

  @Field({ nullable: true, description: 'Trusted Contact Email' })
  public trustedContactEmail?: string;

  @Field(() => ECountry, { nullable: true, description: 'Trusted Contact Country' })
  public trustedContactCountry?: ECountry;

  @Field({ nullable: true, description: 'Trusted Contact Address Line 1' })
  public trustedContactAddressLine1?: string;

  @Field({ nullable: true, description: 'Trusted Contact Address Line 2' })
  public trustedContactAddressLine2?: string;

  @Field({ nullable: true, description: 'Trusted Contact City' })
  public trustedContactCity?: string;

  @Field({ nullable: true, description: 'Trusted Contact Region' })
  public trustedContactRegion?: string;

  @Field({ nullable: true, description: 'Trusted Contact State' })
  public trustedContactState?: string;

  @Field({ nullable: true, description: 'Trusted Contact Zip/Postal Code' })
  public trustedContactZipCode?: string;

  @Field({
    nullable: true,
    description: 'Under FINRA Rule 4512 Apex Clearing Corporation is required to disclose to you (the customer) that Apex Clearing Corporation or an '
      + 'associated person of Apex Clearing Corporation is authorized to contact the trusted contact person and disclose information about the customer’s '
      + 'account to address possible financial exploitation, to confirm the specifics of the customer’s current contact information, health status, or the '
      + 'identity of any legal guardian, executor, trustee or holder of a power of attorney, or as otherwise permitted by FINRA Rule 2165.',
  })
  public trustedContactDisclosureAgreement?: boolean;

  @Field(() => EEmploymentStatus, { nullable: false, description: 'What is your employment status?' })
  public employmentStatus: EEmploymentStatus;

  @Field({ nullable: true, description: 'Employer. Available if employmentStatus=EMPLOYED' })
  public employer?: string;

  @Field({ nullable: true, description: 'Position. Available if employmentStatus=EMPLOYED' })
  public position?: string;

  @Field({ nullable: true, description: 'Source of income. Available if employmentStatus=UNEMPLOYED' })
  public sourceOfIncome?: string;

  @Field(() => EInvestmentObjective, { nullable: false, description: 'Investment Objective' })
  public investingObjective: EInvestmentObjective;

  @Field(() => EInvestmentObjective, { nullable: true, description: 'Secondary Investment Objective' })
  public secondaryInvestingObjective?: EInvestmentObjective;

  @Field(() => EAnnualIncome, { nullable: false, description: 'Annual income' })
  public annualIncome: EAnnualIncome;

  @Field(() => ENetWorth, { nullable: true, description: 'Liquid net worth' })
  public liquidNetWorth?: ENetWorth;

  @Field(() => ENetWorth, { nullable: false, description: 'Total Net Worth' })
  public totalNetWorth: ENetWorth;

  @Field(() => ERiskTolerance, { nullable: false, description: 'Risk tolerance' })
  public riskTolerance: ERiskTolerance;

  @Field(() => ELiquidityNeeds, { nullable: true, description: 'Liquidity Needs' })
  public liquidityNeeds?: ELiquidityNeeds;

  @Field(() => ETimeHorizon, { nullable: true, description: 'Time Horizon' })
  public timeHorizon?: ETimeHorizon;

  @Field(() => EInvestmentExperience, { nullable: false, description: 'Investment Experience' })
  public investmentExperience: EInvestmentExperience;

  @Field({ nullable: false, description: 'Tax bracket (%)' })
  public taxBracket: string;

  @Field({
    nullable: true,
    description: 'Select whether or not you would like to enroll your account into the Sweep Program. By enrolling in the Sweep Program, your credit balances,'
      + ' including dividends and proceeds from the sale of securities that are credited to your account, will automatically be swept.',
  })
  public enableSweepProgram?: boolean;

  @Field(() => ESecuritiesAction, { nullable: true, description: 'When Securities are sold. Available if enableSweepProgram=false' })
  public actionOnSecuritiesSold?: ESecuritiesAction;

  @Field({ nullable: true, description: 'Dividend Reinvestment' })
  public dividendReinvestment?: boolean;

  @Field(() => EDividendProceedsAction, { nullable: true, description: 'Dividend Proceeds. Available if dividendReinvestment=false' })
  public dividendProceeds?: EDividendProceedsAction;

  @Field(() => EDividendProceedsSendFrequency, {
    nullable: true,
    description: 'Dividend Proceeds Send Frequency. '
      + 'Available if dividendProceeds=SEND',
  })
  public dividendProceedsSendFrequency?: EDividendProceedsSendFrequency;

  @Field({ nullable: true, description: 'Would you like to complete Transfer on Death form? Available only for domestic applicants' })
  public completeTransferOfDeath?: boolean;

  @Field({ nullable: true, description: 'Are you married?' })
  public married?: boolean;

  @Field({
    nullable: true,
    description: 'Note: Spouse\'s signature is required if the spouse and\\/or Account Holder reside(s) in a Community Property or Marital Property State, '
      + 'and the spouse is not an account holder, or named as the sole primary beneficiary. By signing, spouse voluntarily and irrevocably consents to the '
      + 'beneficiary designation and to Apex paying all sums due upon death as designated above subject to the provisions of this '
      + 'Transfer on Death (TOD) Beneficiary Designation Form.',
  })
  public spouseSignatureAgreement?: boolean;

  @Field({ nullable: true, description: 'Signature of the spouse for TOD form' })
  public spouseSignature?: string;

  @Field({ nullable: true, description: 'Primary Beneficiary Legal Name' })
  public primaryBeneficiaryLegalName?: string;

  @Field({ nullable: true, description: 'Primary Beneficiary Date of Birth' })
  public primaryBeneficiaryDateOfBirth?: Date;

  @Field({ nullable: true, description: 'Primary Beneficiary Social Security Number' })
  public primaryBeneficiarySsn?: string;

  @Field(() => Int, { nullable: true, description: 'Share percentage' })
  public primaryBeneficiarySharePercentage?: number;

  @Field(() => ECountry, { nullable: true, description: 'Primary Beneficiary Mailing Address Country' })
  public primaryBeneficiaryMailingAddressCountry?: ECountry;

  @Field({ nullable: true, description: 'Primary Beneficiary Mailing Address Line1' })
  public primaryBeneficiaryMailingAddressLine1?: string;

  @Field({ nullable: true, description: 'Primary Beneficiary Mailing Address Line2' })
  public primaryBeneficiaryMailingAddressLine2?: string;

  @Field({ nullable: true, description: 'Primary Beneficiary Mailing Address City' })
  public primaryBeneficiaryMailingAddressCity?: string;

  @Field({ nullable: true, description: 'Primary Beneficiary Mailing Address Region/Provice' })
  public primaryBeneficiaryMailingAddressRegion?: string;

  @Field({ nullable: true, description: 'Primary Beneficiary Mailing Address State' })
  public primaryBeneficiaryMailingAddressState?: string;

  @Field({ nullable: true, description: 'Primary Beneficiary Mailing Address Zip/Postal Code' })
  public primaryBeneficiaryMailingAddressZipCode?: string;
  // Apex also allows to enter 4 more secondary beneficiaries

  @Field({
    nullable: true,
    description: '# Transfer on Death (TOD) Beneficiary Designation\\n  Please note that Transfer on Death Beneficiary Designations are not available to '
      + 'residents in all jurisdictions.\\n  Please also note that TOD Accounts are subject to receipt and acceptance by our clearing firm, Apex Clearing '
      + 'Corporation (\u201cApex\u201d). No TOD designation will be effected until all required documentation is received and accepted.\\n  ## Beneficiary '
      + 'Designation\\n  To my Broker\\/Dealer (You or Your):\\n  I (We) wish to create a transfer on death (TOD) registration for the account listed above. '
      + 'I (We) hereby designate the person(s) identified below ( Beneficiary(ies) ) to receive all monies, securities and other assets held in the account '
      + 'listed above upon my (our) death, or the death of the last surviving account owner in the case of a joint account. I (We) may change the designation '
      + 'of the beneficiary(ies) only by completing a new Transfer on Death Beneficiary Designation Form. The Beneficiary Designation may not be revoked or '
      + 'changed by will, codicil, trust document or other testamentary document. You may rely on the latest Beneficiary Designation in your possession and no '
      + 'change in Beneficiary shall be effective until actually received and accepted by you.\\n  I (We) understand that you have entered into an agreement '
      + 'with Apex with respect to the execution and clearance of securities. I (We also understand that because of the complex legal and tax issues involved, '
      + 'neither you nor Apex will advise whether the TOD designation is appropriate for tax or estate planning. I (We) acknowledge that the ability to '
      + 'register a securities account in TOD form is created by state law and not all states have enacted such laws. I (We) have been advised that I (we) '
      + 'should consult my (our) own legal and tax advisers before electing or revoking the TOD account designation as I (we) deem appropriate.\\n  I (We) '
      + 'hereby designate the person(s) named below as beneficiary(ies) to receive the assets remaining in the account listed above upon my (our) death:\\n  '
      + '### Primary Beneficiaries\\n  If a trust, please provide trust name as legal name.\\n  * Given Name: '
      + '`primaryBeneficiaries.beneficiaryName.givenName`\\n  * Family Name: `primaryBeneficiaries.beneficiaryName.familyName`\\n  * Legal Name: '
      + '`primaryBeneficiaries.beneficiaryName.legalName`\\n  * Street Address: `primaryBeneficiaries.mailingAddress.streetAddress`\\n  * City: '
      + '`primaryBeneficiaries.mailingAddress.city`\\n  * State: `primaryBeneficiaries.mailingAddress.state`\\n  * Postal Code: '
      + '`primaryBeneficiaries.mailingAddress.postalCode`\\n  * Country: `primaryBeneficiaries.mailingAddress.country`\\n  * Phone: '
      + '`primaryBeneficiaries.phoneNumber`\\n  * Date of Birth or Creation: `primaryBeneficiaries.dateOfBirthOrCreation`\\n  * Social Security Number or Tax '
      + 'ID: `primaryBeneficiaries.taxId`\\n  * Relationship to Account Owner: `primaryBeneficiaries.relationshipToAccountOwner`\\n  * Share Percentage: '
      + '`primaryBeneficiaries.sharePercentage`\\n  Please note: Share totals must equal 100%. Do not use fractional percentages or dollar amounts.\\n  '
      + '### Contingent Beneficiaries\\n  If a trust, please provide trust name as legal name.\\n  * Given Name: '
      + '`contingentBeneficiaries.beneficiaryName.givenName`\\n  * Family Name: `contingentBeneficiaries.beneficiaryName.familyName`\\n  * Legal Name: '
      + '`contingentBeneficiaries.beneficiaryName.legalName`\\n  * Street Address: `contingentBeneficiaries.mailingAddress.streetAddress`\\n  * City: '
      + '`contingentBeneficiaries.mailingAddress.city`\\n  * State: `contingentBeneficiaries.mailingAddress.state`\\n  * Postal Code: '
      + '`contingentBeneficiaries.mailingAddress.postalCode`\\n  * Country: `contingentBeneficiaries.mailingAddress.country`\\n  * Phone: '
      + '`contingentBeneficiaries.phoneNumber`\\n  * Date of Birth or Creation: `contingentBeneficiaries.dateOfBirthOrCreation`\\n  * Social Security Number '
      + 'or Tax ID: `contingentBeneficiaries.taxId`\\n  * Relationship to Account Owner: `contingentBeneficiaries.relationshipToAccountOwner`\\n  * '
      + 'Share Percentage: `contingentBeneficiaries.sharePercentage`\\n  Please note: Share totals must equal 100%. Do not use fractional percentages or '
      + 'dollar amounts.\\n  I (We) understand that upon my (our) death you many require my (our) Beneficiary(ies) to provide you with certain documents as '
      + 'you may deem necessary prior to instructing Apex to move the assets from my (our) TOD account into the Designated beneficiary(ies\u2019) '
      + 'account(s).\\n  I acknowledge and agree that upon my (our) death, distribution will be made to my (our) designated beneficiaries in the following '
      + 'manner:\\n  ### PRIMARY BENEFICIARY(IES)\\n  * Any interest I (We) may have in this account will be paid in equal proportions, unless otherwise '
      + 'indicated, to the primary\\n  beneficiary(ies) I have designated\\n  * If the death of one or more designated Primary Beneficiary(ies) precedes my '
      + '(our) death, the interest they would have received from this account will be paid, upon my (our) death, to my surviving Primary Beneficiary(ies) '
      + 'Pro Rata such that 100% is paid to the surviving primary beneficiary(ies)\\n  ### CONTINGENT BENEFICIARY(IES)\\n  * If none of my Primary '
      + 'Beneficiaries survives me (us), any interest I (We) have in this account will be paid in equal\\n  proportions unless otherwise indicated to the '
      + 'Contingent Beneficiary(ies) I (We) have designated\\n  * If the death of one or more designated Contingent Beneficiary precedes my (our) death, the '
      + 'interest they would have received from this account will be paid, upon my (our) death, to my surviving Contingent Beneficiary(ies) Pro Rata such that '
      + '100% is paid to the surviving Contingent beneficiary(ies)\\n  ### NO SURVIVING BENEFICIARY(IES)\\n  * If none of the Primary or Contingent '
      + 'beneficiaries I (We) have designated survives me (us), any interest I (We) may\\n  have in this account shall pass as if my (our) Transfer on Death '
      + 'instructions did not exist.\\n  I (We) understand and agree that Apex, may register and hold the securities in my (our) TOD account in Apex\u2019s '
      + 'name or other \u201cstreet\u201d or nominee name and that this will create no duty on Apex\u2019s part to determine registration or ownership of the '
      + 'account as a whole before or after my (our) death.\\n  In consideration for establishing this registration and accepting the Beneficiary Designation, '
      + 'I (we) (including my (our) estate(s), heirs, spouse, successors in interest, and all Beneficiaries named herein) shall indemnify and hold harmless '
      + 'you and Apex (and affiliates, directors, officers, control persons, agents and employees thereof) from and against all claims, actions, costs and '
      + 'liabilities, including attorneys\u2019 fees, by person or entity arising out of or relating to this account registration and transfers hereunder.\\n  '
      + '## Miscellaneous Provisions\\n  * Apex reserves the right the refuse to accept or renew this TOD Beneficiary Designation Form and may terminate it at '
      + 'any time in its sole discretion and for any reason.\\n  * If any provision hereof is or at any time should become inconsistent with any present or '
      + 'future law, rule or regulation of any securities or commodities exchange or of any state or other sovereign government or an agency or regulatory '
      + 'body thereof, and if any of these entities have jurisdiction over the subject matter of this TOD Beneficiary Designation Form, said provision shall '
      + 'be deemed to be superseded or modified to conform to such law, rule or regulation, but in all other respects the TOD Beneficiary Designation Form '
      + 'shall continue and remain in full force and effect.\\n  * The provisions of this TOD Beneficiary Designation Form, including indemnities stated '
      + 'herein, shall be binding upon the Account Holder\u2019s estate, Beneficiaries, heirs, executors, administrators, successors, and assigns, shall '
      + 'insure to the benefit of each of you and Apex as your respective successors, assigns and affiliated companies, and shall survive the termination of '
      + 'this TOD Beneficiary Designation Form or the TOD Account.',
  })
  public transferOnDeathBeneficiaryDesignation?: boolean;

  @Field({
    nullable: true,
    description: 'This Customer Account Agreement (the \\"Agreement\\") sets forth the respective rights and obligations of Apex Clearing Corporation '
      + '(\\"you\\" or \\"your\\" or \\"Apex\\") and the Customer\'s (as defined below) brokerage firm (the \\"Introducing Broker\\"), and the customer(s) '
      + 'identified on the New Account Application (the \\"Customer\\") in connection with the Customer\'s brokerage account with the Introducing Broker '
      + '(\\"the Account\\"). The Customer hereby agrees as follows with respect to the Account, which the Customer has established with the Introducing '
      + 'Broker for the purchase, sale or carrying of securities or contracts relating thereto and\\/or the borrowing of funds, which transactions are cleared'
      + ' through you. To help the government fight the funding of terrorism and money laundering, Federal law requires all financial institutions to obtain, '
      + 'verify, and record information that identifies each person who opens an account. In order to open an account, the Customer will provide information '
      + 'that will allow you to identify the Customer including, but not limited to, the Customer\'s name, address, date of birth, and the Customer\'s '
      + 'driver\'s license or other identifying documents.\\n  1.  **Applicable Rules and Regulations.** All transactions for the Account shall be subject to '
      + 'the constitution, rules, regulations, customs and usages of the exchange or market and its clearing house, if any, upon which such transactions are '
      + 'executed, except as otherwise specifically provided in this Agreement.\\n  2.  **Definitions.** \\"Obligations\\" means all indebtedness, debit '
      + 'balances, liabilities or other obligations of any kind of the Customer to you, whether now existing or hereafter arising. \\"Securities and other '
      + 'property\\" shall include, but shall not be limited to, money, securities, commodities or other property of every kind and nature and all contracts '
      + 'and options relating thereto, whether for present or future delivery.\\n  3.  **Breach; Security Interest.** Whenever in your discretion you consider '
      + 'it necessary for your protection, or for the protection of the Customer\'s Introducing Broker or in the event of, but not limited to; (i) any breach '
      + 'by the Customer of this or any other agreement with you or (ii) the Customer\'s failure to pay for securities and other property purchased or to '
      + 'deliver securities and other property sold, you may sell any or all securities and other property held in any of the Customer\'s accounts (either '
      + 'individually or jointly with others), cancel or complete any open orders for the purchase or sale of any securities and other property, and\\/or '
      + 'borrow or buy-in any securities and other property required to make delivery against any sale, including a short sale, effected for the Customer, all '
      + 'without notice or demand for deposit of collateral, other notice of sale or purchase, or other notice or advertisement, each of which is expressly '
      + 'waived by the Customer, and\\/or you may require the Customer to deposit cash or adequate collateral to the Customer\'s account prior to any '
      + 'settlement date in order to assure the performance or payment of any open contractual commitments and\\/or unsettled transactions. You have the '
      + 'right to refuse to execute securities transactions for the Customer at any time and for any reason. Any and all securities and other property '
      + 'belonging to the Customer or in which the Customer may have an interest held by you or carried in any of the Customer\'s accounts with you ('
      + 'either individually or jointly with others) shall be subject to a first and prior security interest and lien for the discharge of the Customer\'s '
      + 'obligations to you, wherever or however arising and without regard to whether or not you have made advances with respect to such securities and '
      + 'other property, and you are hereby authorized to sell and\\/or purchase any and all securities and other property in any of the Customer\'s accounts, '
      + 'and\\/or to transfer any such securities and other property among any of the Customer\'s accounts to the fullest extent of the law and without notice '
      + 'where allowed. The losses, costs and expenses, including but not limited to reasonable attorneys\' fees and expenses, incurred and payable or paid by '
      + 'you in the (i) collection of a debit balance and\\/or any unpaid deficiency in the accounts of the Customer with you or (ii) defense of any matter '
      + 'arising out of the Customer\'s securities transactions, shall be payable to you by the Customer. The Customer understands that because of '
      + 'circumstances beyond the Broker-Dealer\'s control, its customers\' voting rights may be impaired. For example, if the stock of a company that '
      + 'another customer has purchased has not yet been received from the seller(s), then other customers\' abilities to vote that company\'s stock '
      + 'could be impaired until those shares are received. In addition, if the stock of a company that the Customer has purchased has not yet been received '
      + 'from the seller(s), then payments received by the Customer from the Introducing Broker, in lieu of the dividends on that stock not yet received, may '
      + 'receive tax treatment less favorable than that accorded to dividends.\\n  4.  **Cancellation.** You are authorized, in your discretion, should you '
      + 'for any reason whatsoever deem it necessary for your protection, without notice, to cancel any outstanding order, to close out the accounts of the '
      + 'Customer, in whole or in part, or to close out any commitment made on behalf of the Customer.\\n  5.  **Payment of Indebtedness Upon Demand.** The '
      + 'Customer shall at all times be liable for the payment upon demand of any obligations owing from the Customer to you, and the Customer shall be liable '
      + 'to you for any deficiency remaining in any such accounts in the event of the liquidation thereof (as contemplated in Paragraph 3 of this Agreement or '
      + 'otherwise), in whole or in part, by you or by the Customer; and the Customer shall make payment of such obligations upon demand.\\n  6.  **Accounts '
      + 'Carried as Clearing Broker.** The Customer understands that you are carrying the accounts of the Customer as clearing broker by arrangement with the '
      + 'Customer\'s Introducing Broker through whose courtesy the account of the Customer has been introduced to you. Until receipt from the Customer of '
      + 'written notice to the contrary, you may accept from and rely upon the Customer\'s Introducing Broker for (a) orders for the purchase or sale in '
      + 'said account of securities and other property, and (b) any other instructions concerning the Customer\'s accounts. The Customer represents that '
      + 'the Customer understands that you act only to clear trades introduced by the Customer\'s Introducing Broker and to effect other back office functions '
      + 'for the Customer\'s introducing broker. The Customer confirms to you that the Customer is relying for any advice concerning the Customer\'s accounts '
      + 'solely on the Customer\'s Introducing Broker. The Customer understands that all representatives, employees and other agents with whom the Customer '
      + 'communicates concerning the Customer\'s account are agents of the Introducing Broker, and not your representatives, employees or other agents and the '
      + 'Customer will in no way hold you liable for any trading losses that the Customer may incur. The Customer understands that you are not a principal of '
      + 'or partner with, and do not control in any way, the Introducing Broker or its representatives, employees or other agents. The Customer understands '
      + 'that you will not review the Customer\'s accounts and will have no responsibility for trades made in the Customer\'s accounts. You shall not be '
      + 'responsible or liable for any acts or omissions of the Introducing Broker or its representatives, employees or other agents. Notwithstanding the '
      + 'foregoing, in the event that the Customer initiates a claim against you in your capacity as clearing broker and does not prevail, the Customer '
      + 'shall be responsible for the costs and expenses associated with your defense of such claim. The Customer understands you shall be entitled to '
      + 'exercise and enforce directly against the Customer all rights granted to the Introducing Broker.\\n  1.  **Accounts Carried as Custodian.** In some '
      + 'cases the Customer\'s account is being carried by arrangement with the Customer\'s Investment Advisor or Investment Manager, who uses you as their '
      + 'Broker-Dealer custodian. The Customer acknowledges that your role as custodian is to hold or custody account assets, distribute or collect funds on '
      + 'behalf of the Customer\'s account, execute and clear trades under instruction of the Customer\'s Investment Advisor or Investment Manager, generate '
      + 'account statements and provide other custodial services as may be mandated by various regulatory standards and requirements. The Customer understands '
      + 'that in the capacity as custodian, you will not offer investment advice, review the Customer\'s accounts, and will have no responsibility for trades '
      + 'made in the Customer\'s accounts. Additionally, in your capacity as custodian, you will not verify the accuracy of management fees that the Customer '
      + 'pays to Investment Advisors or Investment Managers pursuant to the terms of the Investment Management Agreement executed between the Customer and the '
      + 'Investment Advisor or Investment Manager. Notwithstanding the foregoing, in the event that the Customer initiates a claim against you in your '
      + 'capacity as custodial broker and does not prevail, the Customer shall be responsible for the costs and expenses associated with your defense of '
      + 'such claim.\\n  7.  **Communications.** You may send communications to the Customer at the Customer\'s address on the New Account Application or at '
      + 'such other address as the Customer may hereafter give you in writing, and all communications so sent, whether by mail, telegraph, or otherwise, '
      + 'shall be deemed given to the Customer personally, whether actually received or not. Reports of execution of orders and statements of accounts of the '
      + 'Customer shall be conclusive if not objected to in writing to you, the former within five (5) days and the latter within ten (10) days, after '
      + 'forwarding by you by mail or otherwise. In consideration of your sending any mail to me in care of a Post Office Box Address or a third party, I '
      + 'hereby agree that \\"all correspondence of any nature whatsoever\\" sent to me in such address will have the same force and effect as if it had been '
      + 'delivered to me personally.\\n  8.  **ARBITRATION AGREEMENT. THIS AGREEMENT CONTAINS A PREDISPUTE ARBITRATION CLAUSE. BY SIGNING AN ARBITRATION '
      + 'AGREEMENT THE PARTIES AGREE AS FOLLOWS:**\\n  1. **ALL PARTIES TO THIS AGREEMENT ARE GIVING UP THE RIGHT TO SUE EACH OTHER IN COURT, INCLUDING THE '
      + 'RIGHT TO A TRIAL BY JURY EXCEPT AS PROVIDED BY THE RULES OF THE ARBITRATION FORUM IN WHICH A CLAIM IS FILED;**\\n  2. **ARBITRATION AWARDS ARE '
      + 'GENERALLY FINAL AND BINDING; A PARTY\'S ABILITY TO HAVE A COURT REVERSE OR MODIFY AN ARBITRATION AWARD IS VERY LIMITED.**\\n  3. **THE ABILITY OF '
      + 'THE PARTIES TO OBTAIN DOCUMENTS, WITNESS STATEMENTS AND OTHER DISCOVERY IS GENERALLY MORE LIMITED IN ARBITRATION THAN IN COURT PROCEEDINGS;**\\n  '
      + '4. **THE ARBITRATORS DO NOT HAVE TO EXPLAIN THE REASON(S) FOR THEIR AWARD UNLESS, IN AN ELIGIBLE CASE, A JOINT REQUEST FOR AN EXPLAINED DECISION HAS '
      + 'BEEN SUBMITTED BY ALL PARTIES TO THE PANEL AT LEAST 20 DAYS PRIOR TO THE FIRST SCHEDULED HEARING DATE.**\\n  5. **THE PANEL OF ARBITRATORS MAY '
      + 'INCLUDE A MINORITY OF ARBITRATORS WHO WERE OR ARE AFFILIATED WITH THE SECURITIES INDUSTRY.**\\n  6. **THE RULES OF SOME ARBITRATION FORUMS MAY IMPOSE '
      + 'TIME LIMITS FOR BRINGING A CLAIM IN ARBITRATION. IN SOME CASES, A CLAIM THAT IS INELIGIBLE FOR ARBITRATION MAY BE BROUGHT IN COURT.**\\n  7. **THE '
      + 'RULES OF THE ARBITRATION FORUM IN WHICH THE CLAIM IS FILED, AND ANY AMENDMENTS THERETO, SHALL BE INCORPORATED INTO THIS AGREEMENT.**\\n  **THE '
      + 'FOLLOWING ARBITRATION AGREEMENT SHOULD BE READ IN CONJUNCTION WITH THE DISCLOSURES ABOVE. ANY AND ALL CONTROVERSIES, DISPUTES OR CLAIMS BETWEEN '
      + 'THE CUSTOMER AND YOU, OR THE INTRODUCING BROKER, OR THE AGENTS, REPRESENTATIVES, EMPLOYEES, DIRECTORS, OFFICERS OR CONTROL PERSONS OF YOU OR THE '
      + 'INTRODUCING BROKER, ARISING OUT OF, IN CONNECTION WITH, FROM OR WITH RESPECT TO (a) ANY PROVISIONS OF OR THE VALIDITY OF THIS AGREEMENT OR ANY '
      + 'RELATED AGREEMENTS, (b) THE RELATIONSHIP OF THE PARTIES HERETO, OR \\\\(c\\\\) ANY CONTROVERSY ARISING OUT OF YOUR BUSINESS, THE INTRODUCING '
      + 'BROKER\'S BUSINESS OR THE CUSTOMER\'S ACCOUNTS, SHALL BE CONDUCTED PURSUANT TO THE CODE OF ARBITRATION PROCEDURE OF THE FINANCIAL INDUSTRY REGULATORY '
      + 'AUTHORITY (\\"FINRA\\"). THE DECISION AND AWARD OF THE ARBITRATOR(S) SHALL BE CONCLUSIVE AND BINDING UPON ALL PARTIES, AND ANY JUDGMENT UPON ANY '
      + 'AWARD RENDERED MAY BE ENTERED IN A COURT HAVING JURISDICTION THEREOF, AND NEITHER PARTY SHALL OPPOSE SUCH ENTRY.**\\n  No person shall bring a '
      + 'putative or certified class action to arbitration, nor seek to enforce any pre-dispute arbitration agreement against any person who has initiated in '
      + 'court a putative class action; or who is a member of a putative class who has not opted out of the class with respect to any claims encompassed by '
      + 'the putative class action until: (i) the class certification is denied; or (ii) the class is de-certified; or (iii) the customer is excluded from '
      + 'the class by the court. Such forbearance to enforce an agreement to arbitrate shall not constitute a waiver of any rights under this agreement except '
      + 'to the extent stated herein.\\n  9.  **Representations.** The Customer represents that the Customer is of majority age. The Customer represents '
      + 'either that the Customer is not an employee of any exchange, or of any corporation of which any exchange owns a majority of the capital stock, or '
      + 'of a member of any exchange, or of a member firm or member corporation registered on any exchange or of a bank, trust company, insurance company '
      + 'or of any corporation, firm or individual engaged in the business dealing either as broker or as principal in securities, bills of exchange, '
      + 'acceptances or other forms of commercial paper, or alternatively, that the Customer has obtained and will provide to you additional documentation '
      + 'which may include information required under FINRA Rule 3210 from its employer authorizing the Customer to open and maintain an account with you.\\n  '
      + 'If the Customer is a corporation, partnership, trust or other entity, the Customer represents that its governing instruments permit this Agreement, '
      + 'that this Agreement has been authorized by all applicable persons and that the signatory on the New Account Application is authorized to bind the '
      + 'Customer. The Customer represents that the Customer shall comply with all applicable laws, rules and regulations in connection with the Customer\'s '
      + 'account. The Customer further represents that no one except the Customer has an interest in the account or accounts of the Customer with you.\\n  '
      + '10. **Joint Accounts.** If the New Account Application indicates that the Account shall consist of more than one person, the Customer\'s obligations '
      + 'under this Agreement shall be joint and several. References to the \\"Customer\\" shall include each of the customers identified on the New Account '
      + 'Application. You may rely on transfer or other instructions from any one of the Customers in a joint account, and such instructions shall be binding '
      + 'on each of the Customers. You may deliver securities or other property to, and send confirmations; notices, statements and communications of every '
      + 'kind, to any one of the Customers, and such action shall be binding on each of the Customers. Notwithstanding the foregoing, you are authorized in '
      + 'your discretion to require joint action by the joint tenants with respect to any matter concerning the joint account, including but not limited to '
      + 'the giving or cancellation of orders and the withdrawal of money or securities. In the case of Tenants by the Entirety accounts, joint action will '
      + 'be required for all matters concerning the joint account. Tenants by Entirety is not recognized in certain jurisdictions, and, where not expressly '
      + 'allowed, will not be a permitted designation of the account.\\n  11. **Other Agreements.** If the Customer trades any options, the Customer agrees '
      + 'to be bound by the terms of your Customer Option Agreement. The Customer understands that copies of these agreements are available from you and, to '
      + 'the extent applicable, are incorporated by reference herein. The terms of these other agreements are in addition to the provisions of this Agreement '
      + 'and any other written agreements between you and the Customer.\\n  12. **Data Not Guaranteed.** The Customer expressly agrees that any data or '
      + 'online reports is provided to the Customer without warranties of any kind, express or implied, including but not limited to, the implied warranties '
      + 'of merchantability, fitness of a particular purpose or non-infringement. The Customer acknowledges that the information contained in any reports '
      + 'provided by you is obtained from sources believed to be reliable but is not guaranteed as to its accuracy of completeness. Such information could '
      + 'include technical or other inaccuracies, errors or omissions. In no event shall you or any of your affiliates be liable to the Customer or any third '
      + 'party for the accuracy, timeliness, or completeness of any information made available to the Customer or for any decision made or taken by the '
      + 'Customer in reliance upon such information. In no event shall you or your affiliated entities be liable for any special incidental, indirect or '
      + 'consequential damages whatsoever, including, without limitation, those resulting from loss of use, data or profits, whether or not advised of the '
      + 'possibility of damages, and on any theory of liability, arising out of or in connection with the use of any reports provided by you or with the delay '
      + 'or inability to use such reports.\\n  13. **Payment for Order Flow Disclosure.** Depending on the security traded and absent specific direction from '
      + 'the Customer, equity and option orders are routed to market centers (i.e., broker-dealers, primary exchanges or electronic communication networks) '
      + 'for execution. Routing decisions are based on a number of factors including the size of the order, the opportunity for price improvement and the '
      + 'quality of order executions, and decisions are regularly reviewed to ensure the duty of best execution is met. You or the Introducing Broker may '
      + 'receive compensation or other consideration for the placing of orders with market centers for execution. The amount of the compensation depends on '
      + 'the agreement reached with each venue. The source and nature of compensation relating to the Customer\'s transactions will be furnished upon written '
      + 'request.\\n  14. **Credit Check.** You are authorized, in your discretion, should you for any reason deem it necessary for your protection to request '
      + 'and obtain a consumer credit report for the Customer.\\n  15. **Miscellaneous.** If any provision of this Agreement is held to be invalid or '
      + 'unenforceable, it shall not affect any other provision of this Agreement. The headings of each section of this Agreement are descriptive only and do '
      + 'not modify or qualify any provision of this Agreement. This Agreement and its enforcement shall be governed by the laws of the state of Texas and '
      + 'shall cover individually and collectively all accounts which the Customer has previously opened, now has open or may open or reopen with you, or any '
      + 'introducing broker, and any and all previous, current and future transactions in such accounts. Except as provided in this Agreement, no provision of '
      + 'this Agreement may be altered, modified or amended unless in writing signed by your authorized representative. This Agreement and all provisions '
      + 'shall inure to the benefit of you and your successors, whether by merger, consolidation or otherwise, your assigns, the Introducing Broker, and all '
      + 'other persons specified in Paragraph 8. You shall not be liable for losses caused directly or indirectly by any events beyond your reasonable '
      + 'control, including without limitation, government restrictions, exchange or market rulings, suspension of trading or unusually heavy trading in '
      + 'securities, a general change in economic, political or financial conditions, war or strikes. You may transfer the accounts of the Customer to your '
      + 'successors and assigns. This Agreement shall be binding upon the Customer and the heirs, executors, administrators, successors and assigns of the '
      + 'Customer. Failure to insist on strict compliance with this Agreement is not considered a waiver of your rights under this Agreement. At your '
      + 'discretion, you may terminate this Agreement at any time on notice to the Customer, the Customer will continue to be responsible for any obligation '
      + 'incurred by the Customer prior to termination. The Customer may not assign the Customer\'s rights or delegate the Customer\'s obligations under '
      + 'this Agreement, in whole or in part, without your prior consent.\\n  16. **Sweep Program.** If the Customer elects to participate in a sweep program, '
      + 'the Customer acknowledges and agrees that: (a) the Customer has read and understands the sweep program    terms and conditions available at '
      + 'http:\\/\\/www.apexclearing.com\\/disclosures\\/ ; (b) you may make changes to your sweep programs and products at any time, in your sole discretion '
      + 'and with or without notice to Customer; (c) the free credit balances in the Customer\'s Account may begin being included in the sweep program upon '
      + 'Account opening; and (d) you have no obligation to monitor the applicable sweep program elected for the Customer\'s Account or to make '
      + 'recommendations about, or changes to, the sweep program that might be beneficial to the Customer.\\n  17. **SIPC Protection.** As a member of '
      + 'the Securities Investor Protection Corporation (SIPC), funds are available to meet customer claims up to a ceiling of \\\\$500,000, including a '
      + 'maximum of \\\\$250,000 for cash claims. For additional information regarding SIPC coverage, including a brochure, please contact SIPC at (202) '
      + '371-8300 or visit www.sipc.org. Apex has purchased an additional insurance policy through a group of London Underwriters (with Lloyd\'s of London '
      + 'Syndicates as the Lead Underwriter) to supplement SIPC protection. This additional insurance policy becomes available to customers in the event '
      + 'that SIPC limits are exhausted and provides protection for securities and cash up to certain limits. Similar to SIPC protection, this additional '
      + 'insurance does not protect against a loss in the market value of securities.\\n  18. **Tax Treaty Eligibility.** This agreement shall serve as '
      + 'the Customer\'s certification that you are eligible to receive tax treaty benefits between the country or (of) residence indicated on the new '
      + 'account form and the country (ies) of origin holding jurisdiction over the instruments held within the customer\'s account.\\n  19. **Trusted '
      + 'Contacts.** Under FINRA Rule 4512 Apex Clearing Corporation is required to disclose to you (the customer) that Apex Clearing Corporation or an '
      + 'associated person of Apex Clearing Corporation is authorized to contact the trusted contact person and disclose information about the '
      + 'customer\'s account to address possible financial exploitation, to confirm the specifics of the customer\'s current contact information, health '
      + 'status, or the identity of any legal guardian, executor, trustee or holder of a power of attorney, or as otherwise permitted by FINRA Rule '
      + '2165.\\n  20. **ACH Agreement.** If I request Automated Clearinghouse (\\"ACH\\") transactions from my Account at Clearing Firm, I authorize '
      + 'Clearing Firm to originate or facilitate transfer credits\\/debits to\\/from my eligible bank account. Transactions sent through the NACHA '
      + 'network will be subject to all applicable rules of NACHA and all rules set forth in Federal Reserve Operating circulars or other applicable '
      + 'laws and regulations. ACH deposits to my brokerage account are provisional. If the beneficiary bank does not receive final and complete payment '
      + 'for a payment order transferred through ACH, the beneficiary bank is entitled to recover from the beneficiary any provisional credit and Clearing '
      + 'Firm may charge my account for the transaction amount. I understand Clearing Firm or my Broker may not notify me of any returned or rejected ACH '
      + 'transfers. I agree to hold Clearing Firm and Clearing Firm\'s agents free of liability for compliance with these instructions. I hereby agree to '
      + 'hold harmless Clearing Firm and each of its affiliates, offices, directors, employees, and agents against, any claims, judgments, expenses, '
      + 'liabilities or costs of defense or settlement relating to: (a) any refusal or failure to initiate or honor any credit or debit request, by Clearing '
      + 'Firm or my Broker, whether (i) due to a lack of funds necessary to credit my account; (ii) due to inadvertence, error caused by similarity of '
      + 'account holder names or (iii) otherwise provided Clearing Firm has not acted in bad faith; (b) if the routing number is incorrect or the routing '
      + 'number or other information changes at another U.S. financial institution or (c) any loss, damage, liability or claim arising, directly or '
      + 'indirectly, from any error, delay or failure which is caused by circumstances beyond Clearing Firm\'s direct control. To the extent permitted by '
      + 'applicable law or regulation, Clearing Firm hereby disclaims all warranties, express or implied, and in no event shall Clearing Firm be liable for '
      + 'any special indirect, incidental, or consequential damages whatsoever resulting from the ACH electronic service or any ACH transactions. Nothing in '
      + 'this herein shall constitute a commitment or undertaking by Clearing Firm or my Broker to effect any ACH transaction or otherwise act upon my '
      + 'instructions or those of my Broker with respect to any account at Clearing Firm. This authorization shall remain in full force and effect until I '
      + 'revoke authorization by written notification to my Broker that is forwarded to Clearing Firm. I understand that Clearing Firm has the right to '
      + 'terminate or suspend the ACH agreement at any time and without notice.\\n  ---\\n  # Privacy Policy\\n  Apex Clearing Corporation (\\"Apex\\") '
      + 'carries your account as a clearing broker by arrangement with your broker-dealer or registered investment advisor as Apex\'s introducing client. At '
      + 'Apex, we understand that privacy is an important issue for customers of our introducing firms. It is our policy to respect the privacy of all '
      + 'accounts that we maintain as clearing broker and to protect the security and confidentiality of non-public personal information relating to those '
      + 'accounts. Please note that this policy generally applies to former customers of Apex as well as current customers.\\n  ### Personal Information '
      + 'Collected\\n  In order to service your account as a clearing broker, information is provided to Apex by your introducing firm who collects '
      + 'information from you in order to provide the financial services that you have requested. The information collected by your introducing firm and '
      + 'provided to Apex or otherwise obtained by Apex may come from the following sources and is not limited to:\\n  * Information included in your '
      + 'applications or forms, such as your name, address, telephone number, social security number, occupation, and income;\\n  * Information relating to '
      + 'your transactions, including account balances, positions, and activity;\\n  * Information which may be received from consumer reporting agencies, '
      + 'such as credit bureau reports;\\n  * Information relating to your creditworthiness;\\n  * Information which may be received from other sources with '
      + 'your consent or with the consent of your introducing firm.\\n  In addition to servicing your account, Apex may make use of your personal information '
      + 'for analysis purposes, for example, to draw conclusions, detect patterns or determine preferences.\\n  ## Sharing of Non-public Personal '
      + 'Information\\n  Apex does not disclose non-public personal information relating to current or former customers of introducing firms to any third '
      + 'parties, except as required or permitted by law, including but not limited to any obligations of Apex under the USA PATRIOT Act, and in order to '
      + 'facilitate the clearing of customer transactions in the ordinary course of business.\\n  Apex has multiple affiliates and relationships with third '
      + 'party companies. Examples of these companies include financial and non-financial companies that perform services such as data processing and '
      + 'companies that perform securities executions on your behalf. We may share information among our affiliates and third parties, as permitted by law, '
      + 'in order to better service your financial needs and to pursue legitimate business interests, including to carry out, monitor and analyze our '
      + 'business, systems and operations.\\n  ## Security\\n  Apex strives to ensure that our systems are secure and that they meet industry standards. We '
      + 'seek to protect non-public personal information that is provided to Apex by your introducing firm or otherwise obtained by Apex by implementing '
      + 'physical and electronic safeguards. Where we believe appropriate, we employ firewalls, encryption technology, user authentication systems (i.e. '
      + 'passwords and personal identification numbers) and access control mechanisms to control access to systems and data. Apex endeavors to ensure that '
      + 'third party service providers who may have access to non-public personal information are following appropriate standards of security and '
      + 'confidentiality. Further, we instruct our employees to use strict standards of care in handling the personal financial information of customers. '
      + 'As a general policy, our staff will not discuss or disclose information regarding an account except; 1) with authorized personnel of your '
      + 'introducing firm, 2) as required by law or pursuant to regulatory request, or 3) as authorized by Apex to a third party or affiliate providing '
      + 'services to your account or pursuing Apex\'s legitimate business interests.\\n  ## Access to Your Information\\n  You may access your account '
      + 'information through a variety of media offered by your introducing firm and Apex (i.e. statements or online services). Please contact your '
      + 'introducing firm if you require any additional information. Apex may use \\"cookies\\" in order to provide better service, to facilitate its '
      + 'customers\' use of the website, to track usage of the website, and to address security hazards. A cookie is a small piece of information that a '
      + 'website stores on a personal computer, and which it can later retrieve.\\n  ## Changes to Apex\'s Privacy Policy\\n  Apex reserves the right to '
      + 'make changes to this policy.\\n  ## How to Get in Touch with Apex about this Privacy Policy\\n  For reference, this Privacy Policy is available on '
      + 'our website at www.apexclearing.com. For more information relating to Apex\'s Privacy Policy or to limit our sharing of your personal information, '
      + 'please contact:\\n  Apex Clearing Corporation\\n  Attn: Compliance Department\\n  350 N. St. Paul St., Suite 1300\\n  Dallas, Texas 75201\\n  '
      + '214-765-1055',
  })
  public customerAccountAgreement?: boolean;

  // """Required if accountType=MARGIN""", currently not supported
  // marginAndShortAgreement: boolean;

  @Field({
    nullable: false,
    description: 'This Customer Account Agreement (the "Agreement") sets forth the respective rights and obligations of Apex Clearing Corporation ("you" or '
      + '"your" or "Apex") and the Customer\'s (as defined below) brokerage firm (the "Introducing Broker"), and the customer(s) identified on the New '
      + 'Account Application (the "Customer") in connection with the Customer\'s brokerage account with the Introducing Broker ("the Account"). The Customer '
      + 'hereby agrees as follows with respect to the Account, which the Customer has established with the Introducing Broker for the purchase, sale or '
      + 'carrying of securities or contracts relating thereto and/or the borrowing of funds, which transactions are cleared through you. To help the '
      + 'government fight the funding of terrorism and money laundering, Federal law requires all financial institutions to obtain, verify, and record '
      + 'information that identifies each person who opens an account. In order to open an account, the Customer will provide information that will allow you '
      + 'to identify the Customer including, but not limited to, the Customer\'s name, address, date of birth, and the Customer\'s driver\'s license or other '
      + 'identifying documents. 1. **Applicable Rules and Regulations.** All transactions for the Account shall be subject to the constitution, rules, '
      + 'regulations, customs and usages of the exchange or market and its clearing house, if any, upon which such transactions are executed, except as '
      + 'otherwise specifically provided in this Agreement. 2. **Definitions.** "Obligations" means all indebtedness, debit balances, liabilities or other '
      + 'obligations of any kind of the Customer to you, whether now existing or hereafter arising. "Securities and other property" shall include, but shall '
      + 'not be limited to, money, securities, commodities or other property of every kind and nature and all contracts and options relating thereto, whether '
      + 'for present or future delivery. 3. **Breach; Security Interest.** Whenever in your discretion you consider it necessary for your protection, or for '
      + 'the protection of the Customer\'s Introducing Broker or in the event of, but not limited to; (i) any breach by the Customer of this or any other '
      + 'agreement with you or (ii) the Customer\'s failure to pay for securities and other property purchased or to deliver securities and other property '
      + 'sold, you may sell any or all securities and other property held in any of the Customer\'s accounts (either individually or jointly with others), '
      + 'cancel or complete any open orders for the purchase or sale of any securities and other property, and/or borrow or buy-in any securities and other '
      + 'property required to make delivery against any sale, including a short sale, effected for the Customer, all without notice or demand for deposit of '
      + 'collateral, other notice of sale or purchase, or other notice or advertisement, each of which is expressly waived by the Customer, and/or you may '
      + 'require the Customer to deposit cash or adequate collateral to the Customer\'s account prior to any settlement date in order to assure the '
      + 'performance or payment of any open contractual commitments and/or unsettled transactions. You have the right to refuse to execute securities '
      + 'transactions for the Customer at any time and for any reason. Any and all securities and other property belonging to the Customer or in which the '
      + 'Customer may have an interest held by you or carried in any of the Customer\'s accounts with you (either individually or jointly with others) shall '
      + 'be subject to a first and prior security interest and lien for the discharge of the Customer\'s obligations to you, wherever or however arising and '
      + 'without regard to whether or not you have made advances with respect to such securities and other property, and you are hereby authorized to sell '
      + 'and/or purchase any and all securities and other property in any of the Customer\'s accounts, and/or to transfer any such securities and other '
      + 'property among any of the Customer\'s accounts to the fullest extent of the law and without notice where allowed. The losses, costs and expenses, '
      + 'including but not limited to reasonable attorneys\' fees and expenses, incurred and payable or paid by you in the (i) collection of a debit balance '
      + 'and/or any unpaid deficiency in the accounts of the Customer with you or (ii) defense of any matter arising out of the Customer\'s securities '
      + 'transactions, shall be payable to you by the Customer. The Customer understands that because of circumstances beyond the Broker-Dealer\'s control, '
      + 'its customers\' voting rights may be impaired. For example, if the stock of a company that another customer has purchased has not yet been received '
      + 'from the seller(s), then other customers\' abilities to vote that company\'s stock could be impaired until those shares are received. In addition, '
      + 'if the stock of a company that the Customer has purchased has not yet been received from the seller(s), then payments received by the Customer from '
      + 'the Introducing Broker, in lieu of the dividends on that stock not yet received, may receive tax treatment less favorable than that accorded to '
      + 'dividends. 4. **Cancellation.** You are authorized, in your discretion, should you for any reason whatsoever deem it necessary for your protection, '
      + 'without notice, to cancel any outstanding order, to close out the accounts of the Customer, in whole or in part, or to close out any commitment made '
      + 'on behalf of the Customer. 5. **Payment of Indebtedness Upon Demand.** The Customer shall at all times be liable for the payment upon demand of any '
      + 'obligations owing from the Customer to you, and the Customer shall be liable to you for any deficiency remaining in any such accounts in the event '
      + 'of the liquidation thereof (as contemplated in Paragraph 3 of this Agreement or otherwise), in whole or in part, by you or by the Customer; and the '
      + 'Customer shall make payment of such obligations upon demand. 6. **Accounts Carried as Clearing Broker.** The Customer understands that you are '
      + 'carrying the accounts of the Customer as clearing broker by arrangement with the Customer\'s Introducing Broker through whose courtesy the '
      + 'account of the Customer has been introduced to you. Until receipt from the Customer of written notice to the contrary, you may accept from and '
      + 'rely upon the Customer\'s Introducing Broker for (a) orders for the purchase or sale in said account of securities and other property, and (b) '
      + 'any other instructions concerning the Customer\'s accounts. The Customer represents that the Customer understands that you act only to clear '
      + 'trades introduced by the Customer\'s Introducing Broker and to effect other back office functions for the Customer\'s introducing broker. The '
      + 'Customer confirms to you that the Customer is relying for any advice concerning the Customer\'s accounts solely on the Customer\'s Introducing '
      + 'Broker. The Customer understands that all representatives, employees and other agents with whom the Customer communicates concerning the '
      + 'Customer\'s account are agents of the Introducing Broker, and not your representatives, employees or other agents and the Customer will in no way '
      + 'hold you liable for any trading losses that the Customer may incur. The Customer understands that you are not a principal of or partner with, and do '
      + 'not control in any way, the Introducing Broker or its representatives, employees or other agents. The Customer understands that you will not review '
      + 'the Customer\'s accounts and will have no responsibility for trades made in the Customer\'s accounts. You shall not be responsible or liable for any '
      + 'acts or omissions of the Introducing Broker or its representatives, employees or other agents. Notwithstanding the foregoing, in the event that the '
      + 'Customer initiates a claim against you in your capacity as clearing broker and does not prevail, the Customer shall be responsible for the costs and '
      + 'expenses associated with your defense of such claim. The Customer understands you shall be entitled to exercise and enforce directly against the '
      + 'Customer all rights granted to the Introducing Broker. 1. **Accounts Carried as Custodian.** In some cases the Customer\'s account is being '
      + 'carried by arrangement with the Customer\'s Investment Advisor or Investment Manager, who uses you as their Broker-Dealer custodian. The Customer '
      + 'acknowledges that your role as custodian is to hold or custody account assets, distribute or collect funds on behalf of the Customer\'s account, '
      + 'execute and clear trades under instruction of the Customer\'s Investment Advisor or Investment Manager, generate account statements and provide '
      + 'other custodial services as may be mandated by various regulatory standards and requirements. The Customer understands that in the capacity as '
      + 'custodian, you will not offer investment advice, review the Customer\'s accounts, and will have no responsibility for trades made in the '
      + 'Customer\'s accounts. Additionally, in your capacity as custodian, you will not verify the accuracy of management fees that the Customer '
      + 'pays to Investment Advisors or Investment Managers pursuant to the terms of the Investment Management Agreement executed between the '
      + 'Customer and the Investment Advisor or Investment Manager. Notwithstanding the foregoing, in the event that the Customer initiates a '
      + 'claim against you in your capacity as custodial broker and does not prevail, the Customer shall be responsible for the costs and '
      + 'expenses associated with your defense of such claim. 7. **Communications.** You may send communications to the Customer at the '
      + 'Customer\'s address on the New Account Application or at such other address as the Customer may hereafter give you in writing, and all '
      + 'communications so sent, whether by mail, telegraph, or otherwise, shall be deemed given to the Customer personally, whether actually received '
      + 'or not. Reports of execution of orders and statements of accounts of the Customer shall be conclusive if not objected to in writing to you, the '
      + 'former within five (5) days and the latter within ten (10) days, after forwarding by you by mail or otherwise. In consideration of your sending any '
      + 'mail to me in care of a Post Office Box Address or a third party, I hereby agree that "all correspondence of any nature whatsoever" sent to me in '
      + 'such address will have the same force and effect as if it had been delivered to me personally. 8. **ARBITRATION AGREEMENT. THIS AGREEMENT '
      + 'CONTAINS A PREDISPUTE ARBITRATION CLAUSE. BY SIGNING AN ARBITRATION AGREEMENT THE PARTIES AGREE AS FOLLOWS:** 1. **ALL PARTIES TO THIS AGREEMENT '
      + 'ARE GIVING UP THE RIGHT TO SUE EACH OTHER IN COURT, INCLUDING THE RIGHT TO A TRIAL BY JURY EXCEPT AS PROVIDED BY THE RULES OF THE ARBITRATION '
      + 'FORUM IN WHICH A CLAIM IS FILED;** 2. **ARBITRATION AWARDS ARE GENERALLY FINAL AND BINDING; A PARTY\'S ABILITY TO HAVE A COURT REVERSE OR '
      + 'MODIFY AN ARBITRATION AWARD IS VERY LIMITED.** 3. **THE ABILITY OF THE PARTIES TO OBTAIN DOCUMENTS, WITNESS STATEMENTS AND OTHER DISCOVERY IS '
      + 'GENERALLY MORE LIMITED IN ARBITRATION THAN IN COURT PROCEEDINGS;** 4. **THE ARBITRATORS DO NOT HAVE TO EXPLAIN THE REASON(S) FOR THEIR AWARD '
      + 'UNLESS, IN AN ELIGIBLE CASE, A JOINT REQUEST FOR AN EXPLAINED DECISION HAS BEEN SUBMITTED BY ALL PARTIES TO THE PANEL AT LEAST 20 DAYS PRIOR TO '
      + 'THE FIRST SCHEDULED HEARING DATE.** 5. **THE PANEL OF ARBITRATORS MAY INCLUDE A MINORITY OF ARBITRATORS WHO WERE OR ARE AFFILIATED WITH THE '
      + 'SECURITIES INDUSTRY.** 6. **THE RULES OF SOME ARBITRATION FORUMS MAY IMPOSE TIME LIMITS FOR BRINGING A CLAIM IN ARBITRATION. IN SOME CASES, '
      + 'A CLAIM THAT IS INELIGIBLE FOR ARBITRATION MAY BE BROUGHT IN COURT.** 7. **THE RULES OF THE ARBITRATION FORUM IN WHICH THE CLAIM IS FILED, '
      + 'AND ANY AMENDMENTS THERETO, SHALL BE INCORPORATED INTO THIS AGREEMENT.** **THE FOLLOWING ARBITRATION AGREEMENT SHOULD BE READ IN CONJUNCTION '
      + 'WITH THE DISCLOSURES ABOVE. ANY AND ALL CONTROVERSIES, DISPUTES OR CLAIMS BETWEEN THE CUSTOMER AND YOU, OR THE INTRODUCING BROKER, OR THE '
      + 'AGENTS, REPRESENTATIVES, EMPLOYEES, DIRECTORS, OFFICERS OR CONTROL PERSONS OF YOU OR THE INTRODUCING BROKER, ARISING OUT OF, IN CONNECTION '
      + 'WITH, FROM OR WITH RESPECT TO (a) ANY PROVISIONS OF OR THE VALIDITY OF THIS AGREEMENT OR ANY RELATED AGREEMENTS, (b) THE RELATIONSHIP OF THE '
      + 'PARTIES HERETO, OR \\(c\\) ANY CONTROVERSY ARISING OUT OF YOUR BUSINESS, THE INTRODUCING BROKER\'S BUSINESS OR THE CUSTOMER\'S ACCOUNTS, SHALL '
      + 'BE CONDUCTED PURSUANT TO THE CODE OF ARBITRATION PROCEDURE OF THE FINANCIAL INDUSTRY REGULATORY AUTHORITY ("FINRA"). THE DECISION AND AWARD OF '
      + 'THE ARBITRATOR(S) SHALL BE CONCLUSIVE AND BINDING UPON ALL PARTIES, AND ANY JUDGMENT UPON ANY AWARD RENDERED MAY BE ENTERED IN A COURT HAVING '
      + 'JURISDICTION THEREOF, AND NEITHER PARTY SHALL OPPOSE SUCH ENTRY.** No person shall bring a putative or certified class action to arbitration, nor '
      + 'seek to enforce any pre-dispute arbitration agreement against any person who has initiated in court a putative class action; or who is a member of '
      + 'a putative class who has not opted out of the class with respect to any claims encompassed by the putative class action until: (i) the class '
      + 'certification is denied; or (ii) the class is de-certified; or (iii) the customer is excluded from the class by the court. Such forbearance to '
      + 'enforce an agreement to arbitrate shall not constitute a waiver of any rights under this agreement except to the extent stated herein. 9. '
      + '**Representations.** The Customer represents that the Customer is of majority age. The Customer represents either that the Customer is not '
      + 'an employee of any exchange, or of any corporation of which any exchange owns a majority of the capital stock, or of a member of any '
      + 'exchange, or of a member firm or member corporation registered on any exchange or of a bank, trust company, insurance company or of any '
      + 'corporation, firm or individual engaged in the business dealing either as broker or as principal in securities, bills of exchange, acceptances '
      + 'or other forms of commercial paper, or alternatively, that the Customer has obtained and will provide to you additional documentation which may '
      + 'include information required under FINRA Rule 3210 from its employer authorizing the Customer to open and maintain an account with you. If the '
      + 'Customer is a corporation, partnership, trust or other entity, the Customer represents that its governing instruments permit this Agreement, that '
      + 'this Agreement has been authorized by all applicable persons and that the signatory on the New Account Application is authorized to bind the '
      + 'Customer. The Customer represents that the Customer shall comply with all applicable laws, rules and regulations in connection with the '
      + 'Customer\'s account. The Customer further represents that no one except the Customer has an interest in the account or accounts of the '
      + 'Customer with you. 10. **Joint Accounts.** If the New Account Application indicates that the Account shall consist of more than one '
      + 'person, the Customer\'s obligations under this Agreement shall be joint and several. References to the "Customer" shall include each '
      + 'of the customers identified on the New Account Application. You may rely on transfer or other instructions from any one of the '
      + 'Customers in a joint account, and such instructions shall be binding on each of the Customers. You may deliver securities or '
      + 'other property to, and send confirmations; notices, statements and communications of every kind, to any one of the Customers, '
      + 'and such action shall be binding on each of the Customers. Notwithstanding the foregoing, you are authorized in your discretion to '
      + 'require joint action by the joint tenants with respect to any matter concerning the joint account, including but not limited to the giving '
      + 'or cancellation of orders and the withdrawal of money or securities. In the case of Tenants by the Entirety accounts, joint action will be required '
      + 'for all matters concerning the joint account. Tenants by Entirety is not recognized in certain jurisdictions, and, where not expressly allowed, will '
      + 'not be a permitted designation of the account. 11. **Other Agreements.** If the Customer trades any options, the Customer agrees to be bound by the '
      + 'terms of your Customer Option Agreement. The Customer understands that copies of these agreements are available from you and, to the extent '
      + 'applicable, are incorporated by reference herein. The terms of these other agreements are in addition to the provisions of this Agreement and any '
      + 'other written agreements between you and the Customer. 12. **Data Not Guaranteed.** The Customer expressly agrees that any data or online reports is '
      + 'provided to the Customer without warranties of any kind, express or implied, including but not limited to, the implied warranties of merchantability, '
      + 'fitness of a particular purpose or non-infringement. The Customer acknowledges that the information contained in any reports provided by you is '
      + 'obtained from sources believed to be reliable but is not guaranteed as to its accuracy of completeness. Such information could include technical or '
      + 'other inaccuracies, errors or omissions. In no event shall you or any of your affiliates be liable to the Customer or any third party for the '
      + 'accuracy, timeliness, or completeness of any information made available to the Customer or for any decision made or taken by the Customer in reliance'
      + ' upon such information. In no event shall you or your affiliated entities be liable for any special incidental, indirect or consequential damages '
      + 'whatsoever, including, without limitation, those resulting from loss of use, data or profits, whether or not advised of the possibility of damages, '
      + 'and on any theory of liability, arising out of or in connection with the use of any reports provided by you or with the delay or inability to use '
      + 'such reports. 13. **Payment for Order Flow Disclosure.** Depending on the security traded and absent specific direction from the Customer, equity '
      + 'and option orders are routed to market centers (i.e., broker-dealers, primary exchanges or electronic communication networks) for execution. Routing '
      + 'decisions are based on a number of factors including the size of the order, the opportunity for price improvement and the quality of order '
      + 'executions, and decisions are regularly reviewed to ensure the duty of best execution is met. You or the Introducing Broker may receive '
      + 'compensation or other consideration for the placing of orders with market centers for execution. The amount of the compensation depends on the '
      + 'agreement reached with each venue. The source and nature of compensation relating to the Customer\'s transactions will be furnished upon '
      + 'written request. 14. **Credit Check.** You are authorized, in your discretion, should you for any reason deem it necessary for your protection '
      + 'to request and obtain a consumer credit report for the Customer. 15. **Miscellaneous.** If any provision of this Agreement is held to be invalid '
      + 'or unenforceable, it shall not affect any other provision of this Agreement. The headings of each section of this Agreement are descriptive only '
      + 'and do not modify or qualify any provision of this Agreement. This Agreement and its enforcement shall be governed by the laws of the state of '
      + 'Texas and shall cover individually and collectively all accounts which the Customer has previously opened, now has open or may open or reopen '
      + 'with you, or any introducing broker, and any and all previous, current and future transactions in such accounts. Except as provided in this '
      + 'Agreement, no provision of this Agreement may be altered, modified or amended unless in writing signed by your authorized representative. This '
      + 'Agreement and all provisions shall inure to the benefit of you and your successors, whether by merger, consolidation or otherwise, your assigns, '
      + 'the Introducing Broker, and all other persons specified in Paragraph 8. You shall not be liable for losses caused directly or indirectly by any '
      + 'events beyond your reasonable control, including without limitation, government restrictions, exchange or market rulings, suspension of trading '
      + 'or unusually heavy trading in securities, a general change in economic, political or financial conditions, war or strikes. You may transfer the '
      + 'accounts of the Customer to your successors and assigns. This Agreement shall be binding upon the Customer and the heirs, executors, administrators, '
      + 'successors and assigns of the Customer. Failure to insist on strict compliance with this Agreement is not considered a waiver of your rights under '
      + 'this Agreement. At your discretion, you may terminate this Agreement at any time on notice to the Customer, the Customer will continue to be '
      + 'responsible for any obligation incurred by the Customer prior to termination. The Customer may not assign the Customer\'s rights or delegate the '
      + 'Customer\'s obligations under this Agreement, in whole or in part, without your prior consent. 16. **Sweep Program.** If the Customer elects to '
      + 'participate in a sweep program, the Customer acknowledges and agrees that: (a) the Customer has read and understands the sweep program terms and '
      + 'conditions available at http://www.apexclearing.com/disclosures/ ; (b) you may make changes to your sweep programs and products at any time, in '
      + 'your sole discretion and with or without notice to Customer; (c) the free credit balances in the Customer\'s Account may begin being included in '
      + 'the sweep program upon Account opening; and (d) you have no obligation to monitor the applicable sweep program elected for the Customer\'s '
      + 'Account or to make recommendations about, or changes to, the sweep program that might be beneficial to the Customer. 17. **SIPC '
      + 'Protection.** As a member of the Securities Investor Protection Corporation (SIPC), funds are available to meet customer claims up '
      + 'to a ceiling of \\$500,000, including a maximum of \\$250,000 for cash claims. For additional information regarding SIPC coverage, including a '
      + 'brochure, please contact SIPC at (202) 371-8300 or visit www.sipc.org. Apex has purchased an additional insurance policy through a group of '
      + 'London Underwriters (with Lloyd\'s of London Syndicates as the Lead Underwriter) to supplement SIPC protection. This additional insurance '
      + 'policy becomes available to customers in the event that SIPC limits are exhausted and provides protection for securities and cash up to '
      + 'certain limits. Similar to SIPC protection, this additional insurance does not protect against a loss in the market value of securities. '
      + '18. **Tax Treaty Eligibility.** This agreement shall serve as the Customer\'s certification that you are eligible to receive tax treaty benefits '
      + 'between the country or (of) residence indicated on the new account form and the country (ies) of origin holding jurisdiction over the instruments '
      + 'held within the customer\'s account. 19. **Trusted Contacts.** Under FINRA Rule 4512 Apex Clearing Corporation is required to disclose to you ('
      + 'the customer) that Apex Clearing Corporation or an associated person of Apex Clearing Corporation is authorized to contact the trusted contact '
      + 'person and disclose information about the customer\'s account to address possible financial exploitation, to confirm the specifics of the '
      + 'customer\'s current contact information, health status, or the identity of any legal guardian, executor, trustee or holder of a power of attorney, '
      + 'or as otherwise permitted by FINRA Rule 2165. 20. **ACH Agreement.** If I request Automated Clearinghouse ("ACH") transactions from my Account at '
      + 'Clearing Firm, I authorize Clearing Firm to originate or facilitate transfer credits/debits to/from my eligible bank account. Transactions sent '
      + 'through the NACHA network will be subject to all applicable rules of NACHA and all rules set forth in Federal Reserve Operating circulars or '
      + 'other applicable laws and regulations. ACH deposits to my brokerage account are provisional. If the beneficiary bank does not receive final and '
      + 'complete payment for a payment order transferred through ACH, the beneficiary bank is entitled to recover from the beneficiary any provisional '
      + 'credit and Clearing Firm may charge my account for the transaction amount. I understand Clearing Firm or my Broker may not notify me of any '
      + 'returned or rejected ACH transfers. I agree to hold Clearing Firm and Clearing Firm\'s agents free of liability for compliance with these '
      + 'instructions. I hereby agree to hold harmless Clearing Firm and each of its affiliates, offices, directors, employees, and agents against, '
      + 'any claims, judgments, expenses, liabilities or costs of defense or settlement relating to: (a) any refusal or failure to initiate or honor any '
      + 'credit or debit request, by Clearing Firm or my Broker, whether (i) due to a lack of funds necessary to credit my account; (ii) due to '
      + 'inadvertence, error caused by similarity of account holder names or (iii) otherwise provided Clearing Firm has not acted in bad faith; (b) if the '
      + 'routing number is incorrect or the routing number or other information changes at another U.S. financial institution or (c) any loss, damage, '
      + 'liability or claim arising, directly or indirectly, from any error, delay or failure which is caused by circumstances beyond Clearing Firm\'s '
      + 'direct control. To the extent permitted by applicable law or regulation, Clearing Firm hereby disclaims all warranties, express or implied, and '
      + 'in no event shall Clearing Firm be liable for any special indirect, incidental, or consequential damages whatsoever resulting from the ACH '
      + 'electronic service or any ACH transactions. Nothing in this herein shall constitute a commitment or undertaking by Clearing Firm or my '
      + 'Broker to effect any ACH transaction or otherwise act upon my instructions or those of my Broker with respect to any account at Clearing Firm. '
      + 'This authorization shall remain in full force and effect until I revoke authorization by written notification to my Broker that is forwarded to '
      + 'Clearing Firm. I understand that Clearing Firm has the right to terminate or suspend the ACH agreement at any time and without notice. --- # '
      + 'Privacy Policy Apex Clearing Corporation ("Apex") carries your account as a clearing broker by arrangement with your broker-dealer or '
      + 'registered investment advisor as Apex\'s introducing client. At Apex, we understand that privacy is an important issue for customers of our '
      + 'introducing firms. It is our policy to respect the privacy of all accounts that we maintain as clearing broker and to protect the security '
      + 'and confidentiality of non-public personal information relating to those accounts. Please note that this policy generally applies to former '
      + 'customers of Apex as well as current customers. ### Personal Information Collected In order to service your account as a clearing broker, '
      + 'information is provided to Apex by your introducing firm who collects information from you in order to provide the financial services that you '
      + 'have requested. The information collected by your introducing firm and provided to Apex or otherwise obtained by Apex may come from the following '
      + 'sources and is not limited to: * Information included in your applications or forms, such as your name, address, telephone number, social security '
      + 'number, occupation, and income; * Information relating to your transactions, including account balances, positions, and activity; * Information '
      + 'which may be received from consumer reporting agencies, such as credit bureau reports; * Information relating to your creditworthiness; * '
      + 'Information which may be received from other sources with your consent or with the consent of your introducing firm. In addition to servicing '
      + 'your account, Apex may make use of your personal information for analysis purposes, for example, to draw conclusions, detect patterns or determine '
      + 'preferences. ## Sharing of Non-public Personal Information Apex does not disclose non-public personal information relating to current or former '
      + 'customers of introducing firms to any third parties, except as required or permitted by law, including but not limited to any obligations of Apex '
      + 'under the USA PATRIOT Act, and in order to facilitate the clearing of customer transactions in the ordinary course of business. Apex has multiple '
      + 'affiliates and relationships with third party companies. Examples of these companies include financial and non-financial companies that perform '
      + 'services such as data processing and companies that perform securities executions on your behalf. We may share information among our affiliates '
      + 'and third parties, as permitted by law, in order to better service your financial needs and to pursue legitimate business interests, including '
      + 'to carry out, monitor and analyze our business, systems and operations. ## Security Apex strives to ensure that our systems are secure and '
      + 'that they meet industry standards. We seek to protect non-public personal information that is provided to Apex by your introducing firm or '
      + 'otherwise obtained by Apex by implementing physical and electronic safeguards. Where we believe appropriate, we employ firewalls, encryption '
      + 'technology, user authentication systems (i.e. passwords and personal identification numbers) and access control mechanisms to control access to '
      + 'systems and data. Apex endeavors to ensure that third party service providers who may have access to non-public personal information are following '
      + 'appropriate standards of security and confidentiality. Further, we instruct our employees to use strict standards of care in handling the personal '
      + 'financial information of customers. As a general policy, our staff will not discuss or disclose information regarding an account except; 1) with '
      + 'authorized personnel of your introducing firm, 2) as required by law or pursuant to regulatory request, or 3) as authorized by Apex to a third '
      + 'party or affiliate providing services to your account or pursuing Apex\'s legitimate business interests. ## Access to Your Information You may '
      + 'access your account information through a variety of media offered by your introducing firm and Apex (i.e. statements or online services). '
      + 'Please contact your introducing firm if you require any additional information. Apex may use "cookies" in order to provide better service, '
      + 'to facilitate its customers\' use of the website, to track usage of the website, and to address security hazards. A cookie is a small piece '
      + 'of information that a website stores on a personal computer, and which it can later retrieve. ## Changes to Apex\'s Privacy Policy Apex '
      + 'reserves the right to make changes to this policy. ## How to Get in Touch with Apex about this Privacy Policy For reference, this Privacy '
      + 'Policy is available on our website at www.apexclearing.com. For more information relating to Apex\'s Privacy Policy or to limit our sharing '
      + 'of your personal information, please contact: Apex Clearing Corporation Attn: Compliance Department 350 N. St. Paul St., Suite 1300 Dallas, '
      + 'Texas 75201 214-765-1055\n',
  })
  public customerAccountAgreementCustodian: boolean;

  //  foreignAccountAgreement: boolean;

  @Field({ nullable: false, description: 'Signature of primary applicant' })
  public signaturePrimaryApplicant: string;
}
