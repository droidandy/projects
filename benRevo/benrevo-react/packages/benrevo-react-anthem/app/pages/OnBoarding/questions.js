import ANTHEMadministrative from './questions/administrative';
import ANTHEMbilling from './questions/billing';
import ANTHEMclient from './questions/client';
import ANTHEMeligibility from './questions/eligibility';
import ANTHEMmisc from './questions/misc';

const questions = {};

questions.administrative = ANTHEMadministrative;
questions.billing = ANTHEMbilling;
questions.client = ANTHEMclient;
questions.eligibility = ANTHEMeligibility;
questions.misc = ANTHEMmisc;

export default questions;
