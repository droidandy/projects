import React, { FC, useRef, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { Box, Grid, Typography, useBreakpoints, useDebounce } from '@marketplace/ui-kit';
import { Tabs } from 'components/Credit';
import { selectUserPhone } from 'store/user';
import { useFinanceCreditStandalone } from 'store/finance/credit/standalone';
import { CreditPurpose } from 'types/CreditPurpose';
import { AdditionalData, EmploymentData, PassportAndAddressData, PersonalData } from 'types/CreditFormDataTypes';
import { useApplication } from 'store/profile/application';
import { Condition } from 'containers/Finance/Credit/types/Condition';
import { FormData, SimpleCreditStepsData, SimpleCreditStep } from 'containers/Finance/Credit/types/CreditFormTypes';
import { proofDocumentSimpleCreditTypeOptions } from 'constants/creditEmployment';
import {
  AdditionalDataForm,
  EmploymentDataForm,
  PersonalDataForm,
  PassportAddressDataForm,
} from '../../components/Form';
import { SuccessPopup } from '../../components';
import { CONDITION_ANALYTICS_MAP } from '../../constants/conditions';

interface Props {
  lastCondition: Condition;
  disableCalculator?: (isDisabled?: boolean) => void;
  formStartPosition?: React.MutableRefObject<HTMLDivElement | null>;
  title?: string;
  closeModalUrl?: string;
  setCreditPurpose?: React.Dispatch<React.SetStateAction<CreditPurpose>>;
  creditPurpose?: CreditPurpose;
}

const tabs = ['Персональные\u00A0данные', 'Паспортные\u00A0данные', 'Дополнительно', 'Работодатель\u00A0и\u00A0доход'];

enum SendState {
  INITIAL,
  CREATE,
  BASIC,
  ADD_ADDITIONAL,
  ADD_JOB,
  SEND,
}

const CreditContainer: FC<Props> = ({
  lastCondition,
  disableCalculator,
  formStartPosition,
  closeModalUrl,
  setCreditPurpose,
  creditPurpose: stateCreditPurpose,
}) => {
  const { isMobile } = useBreakpoints();
  const router = useRouter();
  const creditPurpose =
    stateCreditPurpose || lastCondition === Condition.JUST_MONEY
      ? CreditPurpose.OTHER_CONSUMER_NEEDS
      : CreditPurpose.BUYING_VEHICLE;
  const {
    amount,
    loading,
    creditStep,
    setCreditStep,
    sendBasicCreditApplication,
    sendAdditionalInfo,
    sumbitCreditFirstStep,
    sendLastStep,
    sendCreditStepsData,
    fireStepAnalytics,
  } = useFinanceCreditStandalone();

  const {
    simpleCredit: { savedStep, savedData },
  } = useApplication();
  const isAuto = lastCondition !== Condition.JUST_MONEY;
  const mounted = useRef<boolean>(false);
  const [activeTab, setActiveTab] = useState(SimpleCreditStep.Personal);
  const [successPopupIsVisible, setSuccessPopupIsVisible] = useState(false);
  const [creditStepsData, setCreditStepsData] = useState<SimpleCreditStepsData>({});
  const [sendState, setSendState] = useState(SendState.INITIAL);
  const [pendingBuffer, setPendingBuffer] = useState(Promise.resolve());
  const userPhone = useSelector(selectUserPhone);

  const handleSubmit =
    <Data extends unknown>(key: SimpleCreditStep) =>
    (values: Data) => {
      const newData = { ...creditStepsData, [key]: values };
      setCreditStepsData(newData);
      if (activeTab === SimpleCreditStep.Personal) {
        pendingBuffer.finally(() => sumbitCreditFirstStep(newData, isAuto, lastCondition));
      }
      if (activeTab === SimpleCreditStep.Passport) {
        setSendState(SendState.BASIC);
      }
      if (activeTab === SimpleCreditStep.Additional) {
        setSendState(SendState.ADD_ADDITIONAL);
      }
      if (activeTab === SimpleCreditStep.Employment) {
        setSendState(SendState.ADD_JOB);
      }
    };

  const resetAllForms = useCallback(() => {
    setActiveTab(SimpleCreditStep.Personal);
    setCreditStepsData({});
    setSendState(SendState.INITIAL);
    disableCalculator?.(false);
  }, [setActiveTab, setCreditStepsData, setSendState, disableCalculator]);

  const callbackOnClose = useCallback(() => {
    resetAllForms();
    setSuccessPopupIsVisible(false);
    router.push(closeModalUrl || '/finance');
  }, [router, resetAllForms, closeModalUrl]);

  const handleBlur = useDebounce((values?: FormData, ban: boolean = false) => {
    if (ban || !values) return;
    const newData: SimpleCreditStepsData = { ...creditStepsData, [activeTab]: values };
    setPendingBuffer(sendCreditStepsData(activeTab, newData) as unknown as Promise<void>);
  }, 300);

  useEffect(() => {
    // Это нужно, чтобы не прокручивалось при создании компонента
    if (!mounted.current) {
      mounted.current = true;
    } else {
      formStartPosition?.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [activeTab, formStartPosition]);

  useEffect(() => {
    if (sendState === SendState.BASIC) {
      pendingBuffer.finally(() => sendBasicCreditApplication(creditStepsData, lastCondition));
    }
    if (sendState === SendState.ADD_ADDITIONAL) {
      pendingBuffer.finally(() => sendAdditionalInfo(creditStepsData, creditPurpose, lastCondition));
    }
    if (sendState === SendState.ADD_JOB) {
      pendingBuffer.finally(() =>
        sendLastStep(
          creditStepsData,
          (creditStepsData[SimpleCreditStep.Personal] as PersonalData).phone,
          lastCondition,
        ),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sendState]);

  useEffect(() => {
    if (creditStep) setActiveTab(creditStep);
    if (creditStep === SimpleCreditStep.Passport) {
      disableCalculator?.();
    }
    if (creditStep === SimpleCreditStep.Final) {
      setSuccessPopupIsVisible(true);
    }
  }, [creditStep, disableCalculator]);

  useEffect(() => {
    setCreditStep(SimpleCreditStep.Personal);
    resetAllForms();
  }, [lastCondition, resetAllForms, setCreditStep]);

  useEffect(() => {
    if (!savedData || savedStep === null || savedStep === undefined) {
      return;
    }
    if (savedStep) {
      setActiveTab(savedStep);
      setCreditStep(savedStep);
    }
    if (savedData) setCreditStepsData(savedData as SimpleCreditStepsData);
  }, [savedStep, savedData, setCreditStep]);

  useEffect(() => {
    if (activeTab === SimpleCreditStep.Personal || creditStep === activeTab) {
      return;
    }

    fireStepAnalytics(activeTab, CONDITION_ANALYTICS_MAP[lastCondition]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  return (
    <Box bgcolor="grey.200" p={isMobile ? '2.5rem 1.25rem' : '2.5rem'} borderRadius="0 0 0.5rem 0.5rem">
      <SuccessPopup isVisible={successPopupIsVisible} handleClose={callbackOnClose} />
      <Grid container direction="column" wrap="nowrap">
        <Box maxWidth="100%" mb={isMobile ? '1.875rem' : '2.5rem'}>
          <Tabs tabs={tabs} activeTab={activeTab} isOnlyActiveStepHaveTitle />
        </Box>
        <div ref={formStartPosition} />
        <>
          {activeTab === SimpleCreditStep.Personal && (
            <PersonalDataForm
              initialValues={creditStepsData[SimpleCreditStep.Personal] as PersonalData}
              onSubmit={handleSubmit<PersonalData>(SimpleCreditStep.Personal)}
              phone={userPhone}
              isLoading={loading}
              onBlur={(values) => handleBlur(values, true)}
              setCreditPurpose={setCreditPurpose}
            />
          )}
          {activeTab === SimpleCreditStep.Passport && (
            <PassportAddressDataForm
              initialValues={creditStepsData[SimpleCreditStep.Passport] as PassportAndAddressData}
              onSubmit={handleSubmit<PassportAndAddressData>(SimpleCreditStep.Passport)}
              isLoading={loading}
              onBlur={handleBlur}
              isSimpleCredit
            />
          )}
          {activeTab === SimpleCreditStep.Additional && (
            <AdditionalDataForm
              initialValues={creditStepsData[SimpleCreditStep.Additional] as AdditionalData}
              onSubmit={handleSubmit<AdditionalData>(SimpleCreditStep.Additional)}
              isLoading={loading}
              onBlur={handleBlur}
              userPhone={userPhone || (creditStepsData[SimpleCreditStep.Personal] as PersonalData).phone}
              isSimpleCredit
            />
          )}
          {(activeTab === SimpleCreditStep.Employment || activeTab === SimpleCreditStep.Final) && (
            <EmploymentDataForm
              initialValues={creditStepsData[SimpleCreditStep.Employment] as EmploymentData}
              creditAmount={amount}
              onSubmit={handleSubmit<EmploymentData>(SimpleCreditStep.Employment)}
              isLoading={loading}
              onBlur={handleBlur}
              proofDocumentTypeOptionsMap={proofDocumentSimpleCreditTypeOptions}
            />
          )}
        </>
      </Grid>
    </Box>
  );
};

const CreditContainerFull: FC<Props> = ({
  lastCondition,
  disableCalculator,
  formStartPosition,
  title,
  closeModalUrl,
  setCreditPurpose,
  creditPurpose,
}) => {
  const { isMobile } = useBreakpoints();
  return (
    <>
      {title ? (
        <Box pr={2.5} mb={2.5}>
          <Typography variant={isMobile ? 'h4' : 'h3'}>{title}</Typography>
        </Box>
      ) : (
        <Box
          borderRadius="0.5rem 0.5rem 0 0"
          borderBottom="1px solid #fff"
          bgcolor="#E7E7E7"
          p={isMobile ? '1.25rem' : '2rem 2.5rem 2.375rem'}
        >
          <Typography variant="h4" component="h2" align={isMobile ? 'center' : 'left'}>
            Оформление заявки на кредит
          </Typography>
        </Box>
      )}
      <Box>
        <CreditContainer
          lastCondition={lastCondition}
          disableCalculator={disableCalculator}
          formStartPosition={formStartPosition}
          closeModalUrl={closeModalUrl}
          creditPurpose={creditPurpose}
          setCreditPurpose={setCreditPurpose}
        />
      </Box>
    </>
  );
};

export { CreditContainerFull as CreditContainer };
