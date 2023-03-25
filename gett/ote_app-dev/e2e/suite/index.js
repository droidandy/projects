const tests = [
  '01_LoginPage',
  '02_ForgotPasswordPage',
  '03_EnquirePage',
  '04_SettingsPage',
  '05_EditProfilePage',
  '06_AddressesSettings',
  '07_AddressPinPage',
  '08_SettingsPhonePage',
  '09_SettingsEmailPage',
  '10_SettingsPaymentCard',
  '11_Policy_Terms',
  '20_PreorderStatusPage',
  '21_PreorderWithDestination',
  '99_Tutorials'
];

const { TEST_NAME } = process.env;

function requireFile(file, throwText) {
  try {
    return require(file);
  } catch (error) {
    console.error(error); // eslint-disable-line no-console
    throw throwText;
  }
}

function requireTestFile(file) {
  return requireFile(
    `../${file}.spec`,
    `Can not find test file with name: ${file}.spec.js`
  );
}

export default function runTestSuite() {
  if (TEST_NAME) {
    const testNames = TEST_NAME.split(',');
    testNames.forEach(requireTestFile);
    return;
  }

  tests.forEach(requireTestFile);
}
