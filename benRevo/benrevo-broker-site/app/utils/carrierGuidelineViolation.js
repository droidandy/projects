export const checkViolation = (carrierName, openedOption) => {
  // 1. Selects networks from modal to be within compliance. Selects Save Changes and the page refreshes based on the networks selected.
  // 2. Clicks Cancel in modal. This will revert the initial network change that caused the issue.
  // Note:  If user corrects violations and updates (2 Networks), below Plan Violations can still apply
  // Modal is only for Anthem
  //
  // console.log('carrierName', carrierName, 'openedOption', openedOption);
  const detailedPlans = openedOption ? openedOption.detailedPlans : [];
  const violationMessage = {
    status: false,
    HMONetworks: 0,
    HMO: 0,
    PPO: 0,
    Solution: 0,
    HSA: 0,
    UHC: 0,
  };
  let HMONetworksCount = 0;
  let HMOPlansCount = 0;
  let PPOPlansCount = 0;
  let SolutionPPOPlansCount = 0;
  let HSAPlansCount = 0;
  const UHCPlanNames = {};
  let diffCount = 0;
  // ANTHEM BLUE CROSS
  // 1. More than 2 HMO networks are selected.
  // 2. More than 2 HMO plans are selected OR more than 2 PPO plans are selected OR more than 1 Solution PPO is selected OR more than 1 HSA plan is selected.
  if (carrierName === 'ANTHEM_BLUE_CROSS') {
    detailedPlans.forEach((plan) => {
      if (plan.type === 'HMO') {
        HMONetworksCount += 1;
      }
      const selectedPlanName = (plan.newPlan && plan.newPlan.name) ? plan.newPlan.name : '';
      if (selectedPlanName.indexOf('HMO') !== -1) {
        HMOPlansCount += 1;
      }
      if (selectedPlanName.indexOf('PPO') !== -1 && selectedPlanName.indexOf('Solution') === -1) {
        PPOPlansCount += 1;
      }
      if (selectedPlanName.indexOf('Solution') !== -1) {
        SolutionPPOPlansCount += 1;
      }
      if (selectedPlanName.indexOf('HSA') !== -1) {
        HSAPlansCount += 1;
      }
    });
    if (HMONetworksCount > 2) {
      violationMessage.status = true;
      violationMessage.HMONetworks = HMONetworksCount;
    }
    if (HMOPlansCount > 2) {
      violationMessage.status = true;
      violationMessage.HMO = HMOPlansCount;
    }
    if (PPOPlansCount > 2) {
      violationMessage.status = true;
      violationMessage.PPO = PPOPlansCount;
    }
    if (SolutionPPOPlansCount > 1) {
      violationMessage.status = true;
      violationMessage.Solution = SolutionPPOPlansCount;
    }
    if (HSAPlansCount > 1) {
      violationMessage.status = true;
      violationMessage.HSA = HSAPlansCount;
    }
  }
  // UNITED HEALTHCARE
  // 1. More than 6 different plans are selected.
  // *Different plans means they can have 3 plan tabs, but all 3 of them are the same UHC network/plan, this should count as 1 plan.
  if (carrierName === 'UHC') {
    detailedPlans.forEach((plan) => {
      const selectedPlanName = (plan.newPlan && plan.newPlan.name) ? plan.newPlan.name : '';
      if (UHCPlanNames[selectedPlanName]) {
        UHCPlanNames[selectedPlanName] += 1;
      } else {
        diffCount += 1;
      }
    });
    if (diffCount > 6) {
      violationMessage.status = true;
      violationMessage.UHC = diffCount;
    }
  }
  return violationMessage;
};

export default checkViolation;
