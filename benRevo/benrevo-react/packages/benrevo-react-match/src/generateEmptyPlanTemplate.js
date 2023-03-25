const generateEmptyPlanTemplate = (planTypeTemplates, detailedPlanType, carrierName) => {
  const planType = detailedPlanType || 'HMO';
  let RXPlanType = '';
  if (planType === 'HMO') {
    RXPlanType = 'RX_HMO';
  }
  if (planType === 'PPO') {
    RXPlanType = 'RX_PPO';
  }
  if (planType === 'HSA') {
    RXPlanType = 'RX_HSA';
  }
  const emptyPlanTemplate = {
    cost: [
      {
        name: 'Monthly cost',
        sysName: '',
        type: 'DOLLAR',
      },
      {
        name: 'Employee Only',
        sysName: '',
        type: 'DOLLAR',
      },
      {
        name: 'Employee + Spouse',
        sysName: '',
        type: 'DOLLAR',
      },
      {
        name: 'Employee + Child(ren)',
        sysName: '',
        type: 'DOLLAR',
      },
      {
        name: 'Employee + Family',
        sysName: '',
        type: 'DOLLAR',
      },
    ],
  };

  const rxBenefitNames = [];
  if (planTypeTemplates[RXPlanType]) {
    const tamplateBenefits = Object.values(planTypeTemplates[RXPlanType]);
    emptyPlanTemplate.rx = [];
    tamplateBenefits.forEach((item) => {
      // add external RX benefits only for UHC carrier
      if (carrierName && carrierName.toLowerCase() === 'uhc') {
        emptyPlanTemplate.rx.push(item);
      }
      rxBenefitNames.push(item.sysName);
    });
  }

  if (planTypeTemplates[planType]) {
    const tamplateBenefits = Object.values(planTypeTemplates[planType]);
    emptyPlanTemplate.benefits = [];
    tamplateBenefits.forEach((item) => {
      // add RX benefits if carrier is not UHC carrier
      if (carrierName && carrierName.toLowerCase() === 'uhc' && rxBenefitNames.indexOf(item.sysName) !== -1) {
        return; // skip
      }
      emptyPlanTemplate.benefits.push(item);
    });
  }

  return emptyPlanTemplate;
};

export default generateEmptyPlanTemplate;
