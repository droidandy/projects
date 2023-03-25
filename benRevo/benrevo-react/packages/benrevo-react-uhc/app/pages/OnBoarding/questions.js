import UHCadministrative from './questions/administrative';
import UHCbilling from './questions/billing';
import UHCclient from './questions/client';
import UHCbroker from './questions/broker';
import UHCcoverage from './questions/coverage';
import UHCeligibility from './questions/eligibility';
import UHCdisclosure from './questions/disclosure';

const questions = {};

questions.administrative = UHCadministrative;
questions.billing = UHCbilling;
questions.client = UHCclient;
questions.broker = UHCbroker;
questions.coverage = UHCcoverage;
questions.eligibility = UHCeligibility;
questions.disclosure = UHCdisclosure;

export default questions;
