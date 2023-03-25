import React, { useCallback, useState } from 'react';
import { Button, Typography } from '@marketplace/ui-kit';
import Select, { SelectChangeEvent } from 'components/Select/Select';
import { cancelReasons } from 'constants/cancelReasons';
import { ModalLight } from 'components/ModalLight';
import { useStyles } from './CancelReasonModal.styles';

type SetBuyoutItemPriceModalProps = {
  handleDeactivate: (reason: number, callback?: () => void) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export const CancelReasonModal = ({ isOpen, setIsOpen, handleDeactivate }: SetBuyoutItemPriceModalProps) => {
  const [value, setValue] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const s = useStyles();
  const handleCloseModal = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);
  const handleChange = (e: SelectChangeEvent) => {
    const selectValue = Number(e.target.value);
    setValue(selectValue);
  };
  const handleClick = useCallback(() => {
    setLoading(true);
    handleDeactivate(value!, () => setLoading(false));
    setIsOpen(false);
  }, [value, handleDeactivate]);
  return (
    <ModalLight
      classes={{ root: s.modalRoot, content: s.modalContent }}
      handleOpened={setIsOpen}
      onClose={handleCloseModal}
      isOpen={isOpen}
    >
      <div className={s.wrapper}>
        <Typography variant="h3" className={s.title}>
          Снять с публикации
        </Typography>
        <Typography variant="h5">Укажите причину снятия с публикации</Typography>
        <div className={s.container}>
          <Select
            name="reason"
            placeholder="Причина снятия"
            value={value}
            variant="standard"
            options={cancelReasons}
            onChange={handleChange}
            className={s.select}
          />
          <Button
            className={s.btn}
            type="button"
            onClick={handleClick}
            variant="contained"
            size="large"
            color="primary"
            disabled={value === null || loading}
          >
            <Typography variant="h5" component="span">
              Подтвердить
            </Typography>
          </Button>
        </div>
      </div>
    </ModalLight>
  );
};
