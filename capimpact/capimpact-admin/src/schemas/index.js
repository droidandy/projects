import { object, string, number, array } from 'yup';

export const loginSchema = object({
  email: string()
    .required()
    .email(),
  password: string().required(),
});

/* Industries */
export const addIndustrySchema = object({
  name: string().required(),
});

export const updateIndustrySchema = object({
  name: string().required(),
});

/* Processes */
export const addProcessSchema = object({
  name: string().required(),
  parentId: number(),
  industry_id: number().required(),
});

export const updateProcessSchema = object({
  name: string().required(),
  parentId: number(),
});

/* Capabilities */
export const addCapabilitySchema = object({
  name: string().required(),
  parentId: number(),
  industry_id: number(),
  company_id: number(),
});

export const updateCapabilitySchema = object({
  name: string().required(),
  parentId: number(),
});

/* ValueDrivers */
export const addValueDriverSchema = object({
  name: string().required(),
  parentId: number(),
  industryId: number(),
  companyId: number(),
});

export const updateValueDriverSchema = object({
  name: string().required(),
  parentId: number(),
});

/* Companies */
export const addCompanySchema = object({
  name: string().required(),
  industry_id: number()
    .required()
    .positive()
    .integer(),
});

export const updateCompanySchema = object({
  name: string().required(),
});

/* Kpilib */
export const addKpilibSchema = object({
  label: string().required(),
});

export const updateKpilibSchema = object({
  label: string().required(),
});

/* Grouptag */
export const addGrouptagSchema = object({
  name: string().required(),
  tags: array()
    .required()
    .min(1),
  companyId: number()
    .required()
    .positive()
    .integer(),
});

export const updateGrouptagSchema = object({
  name: string().required(),
  tags: array()
    .required()
    .min(1),
});

/* Groupfilter */
export const addGroupfilterSchema = object({
  name: string().required(),
  companyId: number()
    .required()
    .positive()
    .integer(),
});

export const addSubGroupfilterSchema = object({
  name: string().required(),
  filters: array()
    .required()
    .min(1),
  companyId: number()
    .required()
    .positive()
    .integer(),
  parentId: number()
    .required()
    .positive()
    .integer(),
});

export const updateGroupfilterSchema = object({
  name: string().required(),
  filters: array()
    .required()
    .min(1),
});
