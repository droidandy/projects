const CompareNetworks = {
  networks: [
    {
      name: 'Aetna',
      types: [
        {
          name: 'Aetna HMO',
          network: 'full',
        }, {
          name: 'Aetna Value HMO',
          network: 'narrow',
        }, {
          name: 'Aetna Basic HMO',
          network: 'superNarrow',
        }, {
          name: 'Aetna HMO Deductible Plan CA Only',
          network: 'other',
        },
      ],
    }, {
      name: 'Anthem Blue Cross',
      types: [
        {
          name: 'Blue Cross CA CaliforniaCare HMO',
          network: 'full',
        }, {
          name: 'Blue Cross CA Select HMO',
          network: 'narrow',
        }, {
          name: 'Blue Cross CA Priority Select HMO',
          network: 'superNarrow',
        }, {
          name: 'Anthem Blue Cross Vivity',
          network: 'other',
        },
      ],
    }, {
      name: 'Blue Shield',
      types: [
        {
          name: 'Blue Shield CA Access Plus HMO',
          network: 'full',
        }, {
          name: 'Blue Shield CA Local Access Plus HMO',
          network: 'narrow',
        }, {
          name: 'Blue Shield CA Trio ACO HMO',
          network: 'superNarrow',
        },
      ],
    }, {
      name: 'Cigna',
      types: [
        {
          name: 'CIGNA HMO',
          network: 'full',
        }, {
          name: 'Cigna Southern CA Select HMO',
          network: 'other',
        }, {
          name: 'Cigna Southern CA Value HMO',
          network: 'other',
        },
      ],
    }, {
      name: 'Health Net',
      types: [
        {
          name: 'Health Net CA HMO',
          network: 'full',
        }, {
          name: 'Health Net CA HMO Wholecare',
          network: 'narrow',
        }, {
          name: 'Health Net CA HMO Excelcare',
          network: 'narrow',
        }, {
          name: 'Health Net CA HMO SmartCare',
          network: 'superNarrow',
        }, {
          name: 'Health Net CA Salud HMO Plus y mas',
          network: 'superNarrow',
        }, {
          name: 'Health Net CA HMO Community Care',
          network: 'superNarrow',
        },
      ],
    }, {
      name: 'UnitedHealthcare',
      types: [
        {
          name: 'UHC Signature Value',
          network: 'full',
        }, {
          name: 'UHC Signature Value Advantage',
          network: 'narrow',
        }, {
          name: 'UHC Signature Value Alliance',
          network: 'superNarrow',
        }, {
          name: 'UHC SignatureValue Focus HMO',
          network: 'superNarrow',
        },
      ],
    },
  ],
};

export default CompareNetworks;
