/* eslint @typescript-eslint/naming-convention: "off" */

import React from 'react';
import ReactDOM from 'react-dom';
import { EmploymentType, proofDocumentTypeOptions } from 'constants/creditEmployment';
import { act } from 'react-dom/test-utils';
import { EmploymentFieldset } from './EmploymentFieldset';

jest.mock('@marketplace/ui-kit', () => ({
  Box: (props: any) => <div {...props} />,
  Grid: (props: any) => <div {...props} />,
  useBreakpoints: () => ({ isMobile: false }),
}));

jest.mock('components/Fields', () => ({
  SelectNew: ({ options, ...rest }: any) => (
    <div {...rest}>
      {options.map((option: any) => (
        <span key={option.value}>{option.value}</span>
      ))}
    </div>
  ),
  AsyncAutocompleteNew: (props: any) => <div {...props} />,
  Input: (props: any) => <div {...props} />,
  InputPrice: (props: any) => <div {...props} />,
}));

let container: Element | null;

const defaultProps = {
  creditAmount: 800000,
  loadEmployeesOptions: () => Promise.resolve([]),
  loadAddressOptions: () => Promise.resolve([]),
};

function hasAllFields(fields: string[]): boolean {
  return fields.map((field) => container?.querySelector(`div[name="${field}"]`)).every((field) => !!field);
}

function getAllFields() {
  return container?.querySelectorAll('div[name]');
}

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  if (!container) {
    return;
  }

  document.body.removeChild(container);
  container = null;
});

describe('EmploymentFieldset', () => {
  it('should have fields for wage type with credit amount less than 1kk', () => {
    const fields = [
      'employmentType',
      'employerName',
      'employerAddress',
      'employerActivity',
      'employerPhone',
      'currentJobExperience',
      'currentJobPosition',
      'currentJobCategory',
      'profession',
      'monthlyIncome',
      'monthlyOutcome',
      'additionalIncome',
    ];

    act(() => {
      ReactDOM.render(
        <EmploymentFieldset
          {...defaultProps}
          employmentType={EmploymentType.WAGE}
          proofDocumentTypeOptions={proofDocumentTypeOptions[EmploymentType.WAGE]}
        />,
        container,
      );
    });
    const renderedFields = getAllFields();

    expect(fields.length).toEqual(renderedFields?.length);
    expect(hasAllFields(fields)).toBeTruthy();
  });

  it('should have fields for wage type with credit amount equal to 1kk', () => {
    const fields = [
      'employmentType',
      'employerName',
      'employerAddress',
      'employerActivity',
      'employerPhone',
      'currentJobExperience',
      'currentJobPosition',
      'currentJobCategory',
      'profession',
      'monthlyIncome',
      'monthlyOutcome',
      'incomeProofDocumentType',
      'additionalIncome',
    ];
    const creditAmount = 1000000;

    act(() => {
      ReactDOM.render(
        <EmploymentFieldset
          {...defaultProps}
          employmentType={EmploymentType.WAGE}
          proofDocumentTypeOptions={proofDocumentTypeOptions[EmploymentType.WAGE]}
          creditAmount={creditAmount}
        />,
        container,
      );
    });
    const renderedFields = getAllFields();

    expect(fields.length).toEqual(renderedFields?.length);
    expect(hasAllFields(fields)).toBeTruthy();
  });

  it('should have fields for wage type with credit amount more than 1kk', () => {
    const fields = [
      'employmentType',
      'employerName',
      'employerAddress',
      'employerActivity',
      'employerPhone',
      'currentJobExperience',
      'currentJobPosition',
      'currentJobCategory',
      'profession',
      'monthlyIncome',
      'monthlyOutcome',
      'incomeProofDocumentType',
      'additionalIncome',
    ];
    const creditAmount = 2000000;

    act(() => {
      ReactDOM.render(
        <EmploymentFieldset
          {...defaultProps}
          employmentType={EmploymentType.WAGE}
          proofDocumentTypeOptions={proofDocumentTypeOptions[EmploymentType.WAGE]}
          creditAmount={creditAmount}
        />,
        container,
      );
    });
    const renderedFields = getAllFields();

    expect(fields.length).toEqual(renderedFields?.length);
    expect(hasAllFields(fields)).toBeTruthy();
  });

  it('should have fields for military type', () => {
    const fields = [
      'employmentType',
      'employerName',
      'employerAddress',
      'employerPhone',
      'currentJobExperience',
      'monthlyIncome',
      'monthlyOutcome',
      'additionalIncome',
    ];

    act(() => {
      ReactDOM.render(
        <EmploymentFieldset
          {...defaultProps}
          employmentType={EmploymentType.MILITARY}
          proofDocumentTypeOptions={proofDocumentTypeOptions[EmploymentType.MILITARY]}
        />,
        container,
      );
    });
    const renderedFields = getAllFields();

    expect(fields.length).toEqual(renderedFields?.length);
    expect(hasAllFields(fields)).toBeTruthy();
  });

  it('should have fields for enterpreneur type', () => {
    const fields = [
      'employmentType',
      'employerName',
      'employerAddress',
      'employerActivity',
      'employerPhone',
      'currentJobExperience',
      'monthlyIncome',
      'monthlyOutcome',
      'additionalIncome',
    ];

    act(() => {
      ReactDOM.render(
        <EmploymentFieldset
          {...defaultProps}
          employmentType={EmploymentType.ENTREPRENEUR}
          proofDocumentTypeOptions={proofDocumentTypeOptions[EmploymentType.ENTREPRENEUR]}
        />,
        container,
      );
    });
    const renderedFields = getAllFields();

    expect(fields.length).toEqual(renderedFields?.length);
    expect(hasAllFields(fields)).toBeTruthy();
  });

  it('should have fields for business type', () => {
    const fields = [
      'employmentType',
      'employerName',
      'employerAddress',
      'employerActivity',
      'employerPhone',
      'currentJobPosition',
      'currentJobExperience',
      'profession',
      'monthlyIncome',
      'monthlyOutcome',
      'additionalIncome',
    ];

    act(() => {
      ReactDOM.render(
        <EmploymentFieldset
          {...defaultProps}
          employmentType={EmploymentType.BUSINESS}
          proofDocumentTypeOptions={proofDocumentTypeOptions[EmploymentType.BUSINESS]}
        />,
        container,
      );
    });
    const renderedFields = getAllFields();

    expect(fields.length).toEqual(renderedFields?.length);
    expect(hasAllFields(fields)).toBeTruthy();
  });

  it('should have fields for pensioner type', () => {
    const fields = ['employmentType', 'monthlyIncome', 'monthlyOutcome', 'additionalIncome'];

    act(() => {
      ReactDOM.render(
        <EmploymentFieldset
          {...defaultProps}
          employmentType={EmploymentType.PENSIONER}
          proofDocumentTypeOptions={proofDocumentTypeOptions[EmploymentType.PENSIONER]}
        />,
        container,
      );
    });
    const renderedFields = getAllFields();

    expect(fields.length).toEqual(renderedFields?.length);
    expect(hasAllFields(fields)).toBeTruthy();
  });

  it('should have fields for lawyer type', () => {
    const fields = [
      'employmentType',
      'employerAddress',
      'lawyerId',
      'lawyerRegion',
      'employerPhone',
      'currentJobExperience',
      'monthlyIncome',
      'monthlyOutcome',
      'additionalIncome',
    ];

    act(() => {
      ReactDOM.render(
        <EmploymentFieldset
          {...defaultProps}
          employmentType={EmploymentType.LAWYER}
          proofDocumentTypeOptions={proofDocumentTypeOptions[EmploymentType.LAWYER]}
        />,
        container,
      );
    });
    const renderedFields = getAllFields();

    expect(fields.length).toEqual(renderedFields?.length);
    expect(hasAllFields(fields)).toBeTruthy();
  });

  it('should have fields for notary type', () => {
    const fields = [
      'employmentType',
      'employerAddress',
      'lawyerLicense',
      'employerPhone',
      'currentJobExperience',
      'monthlyIncome',
      'monthlyOutcome',
      'additionalIncome',
    ];

    act(() => {
      ReactDOM.render(
        <EmploymentFieldset
          {...defaultProps}
          employmentType={EmploymentType.NOTARY}
          proofDocumentTypeOptions={proofDocumentTypeOptions[EmploymentType.NOTARY]}
        />,
        container,
      );
    });
    const renderedFields = getAllFields();

    expect(fields.length).toEqual(renderedFields?.length);
    expect(hasAllFields(fields)).toBeTruthy();
  });

  it('should render correct proof document type options with wage type', () => {
    act(() => {
      ReactDOM.render(
        <EmploymentFieldset
          {...defaultProps}
          employmentType={EmploymentType.WAGE}
          proofDocumentTypeOptions={proofDocumentTypeOptions[EmploymentType.WAGE]}
          creditAmount={1000000}
        />,
        container,
      );
    });
    const renderedOptions = container?.querySelector('div[name="incomeProofDocumentType"]')?.textContent;

    expect(renderedOptions).toEqual('61324');
  });

  it('should render correct proof document type options with military type', () => {
    act(() => {
      ReactDOM.render(
        <EmploymentFieldset
          {...defaultProps}
          employmentType={EmploymentType.MILITARY}
          proofDocumentTypeOptions={proofDocumentTypeOptions[EmploymentType.MILITARY]}
          creditAmount={1000000}
        />,
        container,
      );
    });
    const renderedOptions = container?.querySelector('div[name="incomeProofDocumentType"]')?.textContent;

    expect(renderedOptions).toEqual('61324');
  });

  it('should render correct proof document type options with pensioner type', () => {
    act(() => {
      ReactDOM.render(
        <EmploymentFieldset
          {...defaultProps}
          employmentType={EmploymentType.PENSIONER}
          proofDocumentTypeOptions={proofDocumentTypeOptions[EmploymentType.PENSIONER]}
          creditAmount={1000000}
        />,
        container,
      );
    });
    const renderedOptions = container?.querySelector('div[name="incomeProofDocumentType"]')?.textContent;

    expect(renderedOptions).toEqual('634');
  });

  it('should render correct proof document type options with enterpreneur type', () => {
    act(() => {
      ReactDOM.render(
        <EmploymentFieldset
          {...defaultProps}
          employmentType={EmploymentType.ENTREPRENEUR}
          proofDocumentTypeOptions={proofDocumentTypeOptions[EmploymentType.ENTREPRENEUR]}
          creditAmount={1000000}
        />,
        container,
      );
    });
    const renderedOptions = container?.querySelector('div[name="incomeProofDocumentType"]')?.textContent;

    expect(renderedOptions).toEqual('4536798');
  });

  it('should render correct proof document type options with lawyer type', () => {
    act(() => {
      ReactDOM.render(
        <EmploymentFieldset
          {...defaultProps}
          employmentType={EmploymentType.LAWYER}
          proofDocumentTypeOptions={proofDocumentTypeOptions[EmploymentType.LAWYER]}
          creditAmount={1000000}
        />,
        container,
      );
    });
    const renderedOptions = container?.querySelector('div[name="incomeProofDocumentType"]')?.textContent;

    expect(renderedOptions).toEqual('638457');
  });

  it('should render correct proof document type options with notary type', () => {
    act(() => {
      ReactDOM.render(
        <EmploymentFieldset
          {...defaultProps}
          employmentType={EmploymentType.NOTARY}
          proofDocumentTypeOptions={proofDocumentTypeOptions[EmploymentType.NOTARY]}
          creditAmount={1000000}
        />,
        container,
      );
    });
    const renderedOptions = container?.querySelector('div[name="incomeProofDocumentType"]')?.textContent;

    expect(renderedOptions).toEqual('638457');
  });

  it('should render correct proof document type options with business type', () => {
    act(() => {
      ReactDOM.render(
        <EmploymentFieldset
          {...defaultProps}
          employmentType={EmploymentType.BUSINESS}
          proofDocumentTypeOptions={proofDocumentTypeOptions[EmploymentType.BUSINESS]}
          creditAmount={1000000}
        />,
        container,
      );
    });
    const renderedOptions = container?.querySelector('div[name="incomeProofDocumentType"]')?.textContent;

    expect(renderedOptions).toEqual('12346');
  });

  it('should have additional income fields for any type', () => {
    const fields = [
      'employmentType',
      'employerName',
      'employerAddress',
      'employerActivity',
      'employerPhone',
      'currentJobExperience',
      'currentJobPosition',
      'currentJobCategory',
      'profession',
      'monthlyIncome',
      'additionalIncome',
      'additionalIncomeType',
      'monthlyOutcome',
    ];

    act(() => {
      ReactDOM.render(
        <EmploymentFieldset
          {...defaultProps}
          showSourceOfAdditionalIncome
          employmentType={EmploymentType.WAGE}
          proofDocumentTypeOptions={proofDocumentTypeOptions[EmploymentType.WAGE]}
        />,
        container,
      );
    });
    const renderedFields = getAllFields();

    expect(fields.length).toEqual(renderedFields?.length);
    expect(hasAllFields(fields)).toBeTruthy();
  });
});
