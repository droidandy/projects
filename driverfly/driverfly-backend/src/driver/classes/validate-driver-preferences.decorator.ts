import {
  isNumber,
  IsNumberString,
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';
import { JobTeamDriver } from '../../jobs/classes/job-team-driver.enum';
import { JobBenefits } from '../../jobs/classes/job-benefits.enum';
import { JobGeography } from '../../jobs/classes/job-geography.enum';
import { JobPayMethod } from '../../jobs/classes/job-pay-method.enum';
import { JobType } from '../../jobs/classes/job-type.enum';
import { enumerateEnum } from '../../shared/utils';
import { DriverPreferenceCategory } from '../entities/driverPreference.entity';
import { CommunicationMethod } from './communication-method.enum';
import { SharePreferences } from './share-preferences.enum';

const CategoryLabelMap = {
  [DriverPreferenceCategory.COMMUNICATION]: {
    PREFERRED_METHOD: {
      type: 'enum',
      enum: CommunicationMethod,
      multiple: true,
    },
    PREFERRED_HOURS: {
      type: 'text',
    },
    RECEIVE_SUGGESTED_JOBS: {
      type: 'boolean',
    },
    RECEIVE_NEWSLETTER: {
      type: 'boolean',
    },
    RECEIVE_DRIVERFLY: {
      type: 'boolean',
    },
  },
  [DriverPreferenceCategory.SHARING]: {
    MVR: {
      type: 'enum',
      enum: SharePreferences,
    },
    DRIVERS_LICENSE: {
      type: 'enum',
      enum: SharePreferences,
    },
    MEDICAL_CARD: {
      type: 'enum',
      enum: SharePreferences,
    },
    CONTACT_PAST_EMPLOYERS: {
      type: 'enum',
      enum: SharePreferences,
    },
  },
  [DriverPreferenceCategory.MATCHING]: {
    GEOGRAPHY: {
      type: 'enum',
      enum: JobGeography,
      multiple: true,
    },
    PREFERRED_SCHEDULE: {
      type: 'text',
    },
    JOB_TYPE: {
      type: 'enum',
      enum: JobType,
      multiple: true,
    },
    TEAM_DRIVER: {
      type: 'enum',
      enum: JobTeamDriver,
    },
    MIN_PAY: {
      type: 'number',
    },
    PAY_METHOD: {
      type: 'enum',
      enum: JobPayMethod,
      multiple: true,
    },
    BENEFITS: {
      type: 'enum',
      enum: JobBenefits,
      multiple: true,
    },
  },
};

function ValidateLabelByCategory(
  categoryProperty: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'ValidateLabelByCategory',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [categoryProperty],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [categoryPropertyName] = args.constraints;
          const categoryPropertyValue = (args.object as any)[
            categoryPropertyName
          ];

          return (
            categoryPropertyValue &&
            categoryPropertyValue in CategoryLabelMap &&
            value in CategoryLabelMap[categoryPropertyValue]
          );
        },
        defaultMessage(args: ValidationArguments) {
          const [categoryPropertyName] = args.constraints;
          const categoryPropertyValue = (args.object as any)[
            categoryPropertyName
          ];

          if (!categoryPropertyValue) return 'No category specified';

          return `Only the values ${Object.keys(
            CategoryLabelMap[categoryPropertyValue],
          ).join(', ')} are allowed`;
        },
      },
    });
  };
}

function ValidateValueByCategoryAndLabel(
  categoryProperty: string,
  labelProperty: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'ValidateValueByCategoryAndLabel',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [categoryProperty, labelProperty],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [categoryPropertyName, labelPropertyName] = args.constraints;
          const categoryValue = (args.object as any)[categoryPropertyName];
          const labelValue = (args.object as any)[labelPropertyName];

          if (
            categoryValue in CategoryLabelMap &&
            labelValue in CategoryLabelMap[categoryValue]
          ) {
            const validationOptions =
              CategoryLabelMap[categoryValue][labelValue];

            switch (validationOptions.type) {
              case 'enum':
                const values =
                  validationOptions.values ||
                  enumerateEnum(validationOptions.enum);

                if (validationOptions.multiple) {
                  const currentValues: string[] = value.split(',');

                  return currentValues.every(
                    (val) => !!values.find((v) => v == val),
                  );
                } else {
                  return !!values.find((v) => v === value);
                }
              case 'boolean':
                return value === 'true' || value === 'false';
              case 'number':
                return (
                  !!value &&
                  isNumber(parseFloat(value), { maxDecimalPlaces: 2 })
                );
              default:
                return !!value;
            }
          }

          return false;
        },
        defaultMessage(args: ValidationArguments) {
          const [categoryPropertyName, labelPropertyName] = args.constraints;
          const categoryPropertyValue = (args.object as any)[
            categoryPropertyName
          ];
          const labelPropertyValue = (args.object as any)[labelPropertyName];

          if (!categoryPropertyValue) return 'No category specified';
          if (!labelPropertyValue) return 'No label specified';

          if (!(categoryPropertyValue in CategoryLabelMap))
            return 'Invalid category specified';

          if (!(labelPropertyValue in CategoryLabelMap[categoryPropertyValue]))
            return `Only the values ${Object.keys(
              CategoryLabelMap[categoryPropertyValue][labelPropertyValue],
            ).join(', ')} are allowed`;

          const validationOptions =
            CategoryLabelMap[categoryPropertyValue][labelPropertyValue];

          switch (validationOptions.type) {
            case 'enum':
              const values =
                validationOptions.values ||
                enumerateEnum(validationOptions.enum);

              return `Only the values ${values.join(',')} are allowed`;
            case 'boolean':
              return 'Value is not a boolean';
          }

          return 'Field is invalid';
        },
      },
    });
  };
}

export { ValidateLabelByCategory, ValidateValueByCategoryAndLabel };
