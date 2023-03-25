import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { Box, Grid, Typography, useBreakpoints, useDebounce } from '@marketplace/ui-kit';
import { selectUserPhone } from 'store/user';
import { Tabs } from 'components/Credit';
import { useFinanceCreditVehicle } from 'store/finance/credit/vehicle';
import { AdditionalData, AddressData, EmploymentData, PassportData, PersonalData } from 'types/CreditFormDataTypes';
import { proofDocumentTypeOptions } from 'constants/creditEmployment';

import {
  AdditionalDataForm,
  AddressDataForm,
  EmploymentDataForm,
  PersonalDataForm,
  PassportDataForm,
} from '../../components/Form';
import { CreditStep, StepsData, CreditMainInfoData, FormData } from '../../types/CreditFormTypes';
import { CONDITION_ANALYTICS_MAP } from '../../constants/conditions';
import { Condition } from '../../types/Condition';
import { getCreditProgram } from '../../../../../helpers/credit';
import { CREDIT_PROGRAM_NAME } from '../../../../../constants/credit';

const tabs = [
  'Персональные\u00A0данные',
  'Паспортные\u00A0данные',
  'Адрес\u00A0проживания',
  'Дополнительно',
  'Работодатель\u00A0и\u00A0доход',
];

enum SendState {
  INITIAL,
  CREATE,
  BASIC,
  ADD_ADDITIONAL,
  ADD_JOB,
  SEND,
}

interface Props {
  lastCondition: Condition;
  disableCalculator: (isDisabled?: boolean) => void;
  formStartPosition: React.MutableRefObject<HTMLDivElement | null>;
}

const VehicleCredit: FC<Props> = ({ lastCondition, disableCalculator, formStartPosition }) => {
  const router = useRouter();
  const { isMobile } = useBreakpoints();
  const {
    amount,
    loading,
    creditStep,
    setCreditStep,
    vehiclePrice,
    sendBasicCreditApplication,
    sendAdditionalInfo,
    sendCreditStepsData,
    sumbitCreditFirstStep,
    sendLastStep,
    fireStepAnalytics,
  } = useFinanceCreditVehicle();

  const creditProgram = useMemo(
    () =>
      getCreditProgram({
        vehiclePrice,
        creditAmount: amount,
        programName: CREDIT_PROGRAM_NAME.C2C,
      }),
    [amount, vehiclePrice],
  );

  const mounted = useRef<boolean>(false);
  const [activeTab, setActiveTab] = useState(CreditStep.Personal);
  const [creditStepsData, setCreditStepsData] = useState<StepsData>({});
  const [sendState, setSendState] = useState(SendState.INITIAL);
  const [pendingBuffer, setPendingBuffer] = useState(Promise.resolve());
  const userPhone = useSelector(selectUserPhone);

  const handlePrevStep = useCallback(() => setActiveTab((state) => state - 1), []);

  const handleSubmit = useCallback(
    <Data extends unknown>(key: CreditStep) =>
      (values: Data) => {
        if (!creditProgram) return;
        setCreditStepsData((state) => ({ ...state, [key]: values }));
        if (activeTab === CreditStep.Personal) {
          sumbitCreditFirstStep(values as PersonalData, creditProgram.credit.max);
        }
        if (activeTab === CreditStep.Passport) {
          setActiveTab((state) => state + 1);
        }
        if (activeTab === CreditStep.Address) {
          setSendState(SendState.BASIC);
        }
        if (activeTab === CreditStep.Additional) {
          setSendState(SendState.ADD_ADDITIONAL);
        }
        if (activeTab === CreditStep.Employment) {
          setSendState(SendState.ADD_JOB);
        }
      },
    [activeTab, sumbitCreditFirstStep, creditProgram],
  );

  const resetAllForms = useCallback(() => {
    setActiveTab(CreditStep.Personal);
    setCreditStepsData({});
    setSendState(SendState.INITIAL);
    disableCalculator(false);
  }, [setActiveTab, setCreditStepsData, setSendState, disableCalculator]);

  const callbackOnClose = useCallback(() => {
    resetAllForms();
    router.push('/finance');
  }, [router, resetAllForms]);

  const handleBlur = useDebounce((values?: FormData, ban: boolean = false) => {
    if (ban || !values) return;
    const newCreditStepsData: StepsData = { ...creditStepsData, [activeTab]: values };
    setPendingBuffer(sendCreditStepsData(activeTab, newCreditStepsData) as unknown as Promise<void>);
  }, 300);

  useEffect(() => {
    // Это нужно, чтобы не прокручивалось при создании компонента
    if (!mounted.current) {
      mounted.current = true;
    } else {
      formStartPosition.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [activeTab, formStartPosition]);

  useEffect(() => {
    if (sendState === SendState.BASIC) {
      pendingBuffer.finally(() =>
        sendBasicCreditApplication({
          ...creditStepsData[CreditStep.Personal],
          ...creditStepsData[CreditStep.Passport],
          ...creditStepsData[CreditStep.Address],
        } as CreditMainInfoData),
      );
    }
    if (sendState === SendState.ADD_ADDITIONAL) {
      pendingBuffer.finally(() => sendAdditionalInfo(creditStepsData[CreditStep.Additional] as AdditionalData));
    }
    if (sendState === SendState.ADD_JOB) {
      pendingBuffer.finally(() =>
        sendLastStep(
          creditStepsData[CreditStep.Employment] as EmploymentData,
          callbackOnClose,
          (creditStepsData[CreditStep.Personal] as PersonalData).phone,
          lastCondition,
        ),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sendState]);

  useEffect(() => {
    if (creditStep) setActiveTab(creditStep);
    if (creditStep === CreditStep.Passport) {
      disableCalculator();
    }
  }, [creditStep, disableCalculator]);

  useEffect(() => {
    setCreditStep(CreditStep.Personal);
    resetAllForms();
  }, [lastCondition, resetAllForms, setCreditStep]);

  useEffect(() => {
    if (activeTab !== CreditStep.Personal) {
      setPendingBuffer(sendCreditStepsData(activeTab, creditStepsData) as unknown as Promise<void>);
      fireStepAnalytics(activeTab, CONDITION_ANALYTICS_MAP[lastCondition]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  return (
    <>
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
      <Box>
        <Box bgcolor="grey.200" p={isMobile ? '2.5rem 1.25rem' : '2.5rem'} borderRadius="0 0 0.5rem 0.5rem">
          <Grid container direction="column" wrap="nowrap">
            <Box maxWidth="100%" mb={isMobile ? '1.875rem' : '2.5rem'}>
              <Tabs tabs={tabs} activeTab={activeTab} isOnlyActiveStepHaveTitle />
            </Box>
            <div ref={formStartPosition} />
            {activeTab === CreditStep.Personal && (
              <PersonalDataForm
                initialValues={creditStepsData[CreditStep.Personal] as PersonalData}
                onBack={handlePrevStep}
                onSubmit={handleSubmit<PersonalData>(CreditStep.Personal)}
                isLoading={loading}
                phone={userPhone}
                onBlur={(values) => handleBlur(values, true)}
              />
            )}
            {activeTab === CreditStep.Passport && (
              <PassportDataForm
                initialValues={creditStepsData[CreditStep.Passport] as PassportData}
                onSubmit={handleSubmit<PassportData>(CreditStep.Passport)}
                onBlur={handleBlur}
              />
            )}
            {activeTab === CreditStep.Address && (
              <AddressDataForm
                initialValues={creditStepsData[CreditStep.Address] as AddressData}
                isLoading={loading}
                onBack={handlePrevStep}
                onSubmit={handleSubmit<AddressData>(CreditStep.Address)}
                onBlur={handleBlur}
              />
            )}
            {activeTab === CreditStep.Additional && (
              <AdditionalDataForm
                initialValues={creditStepsData[CreditStep.Additional] as AdditionalData}
                isLoading={loading}
                onBack={handlePrevStep}
                onSubmit={handleSubmit<AdditionalData>(CreditStep.Additional)}
                onBlur={handleBlur}
                userPhone={userPhone || (creditStepsData[CreditStep.Personal] as PersonalData).phone}
              />
            )}
            {activeTab === CreditStep.Employment && (
              <EmploymentDataForm
                initialValues={creditStepsData[CreditStep.Employment] as EmploymentData}
                creditAmount={amount}
                isLoading={loading}
                isAutoCredit
                proofDocumentTypeOptionsMap={proofDocumentTypeOptions}
                onBack={handlePrevStep}
                onSubmit={handleSubmit<EmploymentData>(CreditStep.Employment)}
                onBlur={handleBlur}
              />
            )}
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export { VehicleCredit };
