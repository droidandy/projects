import { Button } from '@marketplace/ui-kit';
import React, { useCallback, useState } from 'react';
import { useStyles } from './SubscriptionBlock.styles';
import { LearnMoreModal } from './components/LearnMoreModal/LearnMoreModal';
import { SubscriptionWizardModal } from './components/SubscriptionWizardModal/SubscriptionWizardModal';
import { useVehicleItem } from '../../../../../store/catalog/vehicle/item';

export const SubscriptionBlock = () => {
  const styles = useStyles();

  const { vehicle } = useVehicleItem();
  const { id } = vehicle!;

  const [isLearnMoreModalOpen, setLearnMoreModalOpen] = useState<boolean>(false);
  const [isSubscriptionWizardModalOpen, setSubscriptionWizardModalOpen] = useState<boolean>(false);

  const handleOpenLearnMore = useCallback(() => {
    setLearnMoreModalOpen(true);
  }, [setLearnMoreModalOpen]);
  const handleOpenWizard = useCallback(() => {
    setSubscriptionWizardModalOpen(true);
  }, [setSubscriptionWizardModalOpen]);

  return (
    <div>
      <Button
        className={styles.buyButton}
        fullWidth
        variant="contained"
        color="primary"
        size="large"
        onClick={handleOpenWizard}
      >
        <b>Купить по подписке</b>
      </Button>
      <Button
        className={styles.learnMoreButton}
        fullWidth
        variant="text"
        color="primary"
        size="large"
        onClick={handleOpenLearnMore}
      >
        <b>Подробнее о подписке</b>
      </Button>
      <LearnMoreModal isOpen={isLearnMoreModalOpen} setIsOpen={setLearnMoreModalOpen} />
      <SubscriptionWizardModal
        isOpen={isSubscriptionWizardModalOpen}
        setIsOpen={setSubscriptionWizardModalOpen}
        vehicleId={id}
      />
    </div>
  );
};
