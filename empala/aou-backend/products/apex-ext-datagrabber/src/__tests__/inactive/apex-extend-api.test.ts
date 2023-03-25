/* eslint-disable camelcase */
import { randomFillSync } from 'crypto';
import axios, { AxiosError } from 'axios';

const pwdSymbols = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const pwdLength = 10;

const firstName = '0John0';
const lastName = '0Bull0';
const password = '1aA!' + Array.from(randomFillSync(new Uint32Array(pwdLength)))
  .map(x => pwdSymbols[x % pwdSymbols.length])
  .join('');

const USER_PAYLOAD = {
  role: 'applicant',
  first_name: firstName,
  last_name: lastName,
  password,
};
const LOGIN_CREDENTIALS = {
  email: process.env.APEX_EXTEND_ADMIN_EMAIL || '',
  password: process.env.APEX_EXTEND_ADMIN_PASSWORD || ''
};
const FORM_ANSWERS = [
  {
    question_id: 10647, // Customer type
    data: 10930
  },
  {
    data: 10938,
    question_id: 10656
  },
  {
    data: 10934,
    question_id: 10649
  },
  {
    data: 10966,
    question_id: 10692
  },
  {
    data: 10953,
    question_id: 10666
  },
  {
    data: 10973,
    question_id: 10698
  },
  {
    data: 11021,
    question_id: 10721
  },
  {
    data: lastName,
    question_id: 10653 // last name
  },
  {
    data: 11028,
    question_id: 10723
  },
  {
    data: 10931,
    question_id: 10648 // Account Type
  },
  {
    data: 10962,
    question_id: 10688
  },
  {
    data: 11033,
    question_id: 10726
  },
  {
    data: '10',
    question_id: 10725
  },
  {
    data: 10955,
    question_id: 10676
  },
  {
    data: firstName,
    question_id: 10651 // first name
  },
  {
    data: 10968,
    question_id: 10694
  },
  {
    data: 11037,
    question_id: 10728
  },
  {
    data: '95113',
    question_id: 10673 // postal code
  },
  {
    data: 10982,
    question_id: 10716
  },
  {
    data: 'CA',
    question_id: 10672 // state
  },
  {
    data: 11006,
    question_id: 10719
  },
  {
    data: '05/16/2002',
    question_id: 10655 // date of birth
  },
  {
    data: 11030,
    question_id: 10724
  },
  {
    data: 10964,
    question_id: 10690
  },
  {
    data: 'San Jose',
    question_id: 10670 // city
  },
  {
    data: 11013,
    question_id: 10720
  },
  {
    data: 10970,
    question_id: 10695
  },
  {
    data: 10999,
    question_id: 10718
  },
  {
    data: '201 S MARKET ST',
    question_id: 10668 // address line 1
  },
  {
    data: 11024,
    question_id: 10722
  },
  {
    data: 10981,
    question_id: 10712
  },
  {
    data: 10960,
    question_id: 10685
  },
  {
    data: 10991,
    question_id: 10717
  },
  // SSN
  {
    // "data": "671001234", // custodian_fail
    data: '670001234',
    question_id: 10658
  },
  {
    data: 11077,
    question_id: 10805
  },
  {
    data: 11081,
    question_id: 10808
  },
  {
    data: 11087,
    question_id: 10812
  },
  {
    data: 'Signature',
    question_id: 10814
  },
  {
    data: 11091,
    question_id: 10821
  },
  {
    data: 11045,
    question_id: 10731
  }
];

// 10819, 10820 - file, optional

// +1 - US phone code, 212 - NY state code
const getPhoneNumber = (timestamp: string): string => `+1212${timestamp.substring(0, 7)}`;

const login = async () => {
  const response = await axios.post(
    '/api/auth/login',
    {
      with: ['user'],
      ...LOGIN_CREDENTIALS
    });
  return {
    token: response.data.login.token.access_token,
    initiatorId: response.data.login.user.id
  };
};

const createUser = async (initiatorId: string, timestamp: string) => {
  const response = await axios.post(
    '/api/users/create',
    {
      ...USER_PAYLOAD,
      initiator_id: initiatorId,
      email: `u${timestamp}@aou.com`,
      phone: getPhoneNumber(timestamp)
    }
  );
  return response.data.user.id;
};

const createApplication = async (userId: string) => {
  const response = await axios.post(
    '/api/applications/create',
    {
      user_id: userId
    }
  );
  return response.data.application.id;
};

const fillForm = async (applicationId: string, timestamp: string) => {
  const response = await axios.post(
    '/api/applications/answer-multiple',
    {
      application_id: applicationId,
      answers: [
        {
          data: `u${timestamp}@aou.com`,
          question_id: 10675
        },
        {
          data: '+12025550144',
          question_id: 10674,
        },
        ...FORM_ANSWERS],
    }
  );
  return response.data;
};

const submitForm = async (applicationId: string) => {
  const response = await axios.post(
    '/api/applications/submit',
    {
      application_id: applicationId
    }
  );
  return response.data;
};

const approveCompliance = async (applicationId: string) => {
  await axios.post(
    '/api/applications/compliance-status-update',
    {
      application_id: applicationId,
      status: 'compliance_approved'
    }
  );
};

const getApplicationDetails = async (applicationId: string) => {
  const response = await axios.post(
    '/api/applications/get',
    {
      with: [
        'current_status',
        'current_apex_status',
        'current_background_check_status',
        'current_apex_request',
        'current_apex_status',
        'current_custodian_status',
        'current_custodian_request.statuses',
        'current_custodian_request.investigations',
        'current_custodian_request.investigations.cip_categories.requested_documents'
      ],
      application_id: applicationId
    }
  );
  console.debug(`getApplicationDetails response: ${JSON.stringify(response.data, null, 2)}`);
};

const sendToCustodian = async (applicationId: string) => {
  await axios.post(
    '/api/applications/custodian/send',
    {
      application_id: applicationId
    }
  );
};

describe('Apex Extend integration tests:', () => {
  axios.defaults.baseURL = process.env.APEX_EXTEND_APPLICATIONS_URL;
  test.skip('Happy path without file upload', async () => {
    try {
      const { token, initiatorId } = await login();
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
      const timestamp = new Date().getTime().toString().substring(3); // using seconds since Unix epoch to guarantee uniq email and phone number
      const userId = await createUser(initiatorId, timestamp);
      const applicationId = await createApplication(userId);
      await fillForm(applicationId, timestamp);
      const submitFormResponse = await submitForm(applicationId);
      await approveCompliance(applicationId);
      await sendToCustodian(applicationId);
      await new Promise(r => setTimeout(r, 2000));
      expect(submitFormResponse.status).toBe(true);
      await getApplicationDetails(applicationId);
      return 1;
    } catch (error) {
      console.error(error);
      if ((error as AxiosError)?.response && (error as AxiosError)?.response?.data) {
        console.error(JSON.stringify((error as AxiosError).response.data, null, 2));
      }
      throw error;
    }
  }, 30000);
});
