import React, { FC, useCallback, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import BackdropModal, { BackdropModalActions } from '@marketplace/ui-kit/components/BackdropModal';
import { messageModalActions, selectMessageModal } from 'store/message-modal';
import { MessageModalName } from 'types/MessageModal';
import { SimpleModal, SimpleModalControl, SimpleModalText } from 'components/SimpleModal';
import { stringifyUrl } from 'query-string';

const MessageModalVariants: Record<MessageModalName, SimpleModalText> = {
  [MessageModalName.REGISTERED]: {
    title: 'Поздравляю!',
    children: 'Вы зарегистрировались на #bankauto.',
  },
  [MessageModalName.APPLICATION_CREATED]: {
    title: 'Ваша заявка создана',
    children: 'Проверьте условия проведения сделки перед отправкой заявки дилеру.',
  },
  [MessageModalName.APPLICATION_INSTALMENT_CREATED]: {
    title: 'Ваша заявка создана',
    children: 'Заполните данные для одобрения вашей рассрочки.',
  },
  [MessageModalName.APPLICATION_CANCELED]: {
    title: 'Ваша заявка отменена',
    children: 'Вы можете подобрать другой автомобиль в каталоге.',
  },
  [MessageModalName.APPLICATION_SENT]: {
    title: 'Ваша заявка отправлена в дилерский центр',
    children: 'Ожидайте звонка от менеджера для согласования даты и времени визита в дилерский центр.',
  },
  [MessageModalName.INSURANCE_CALCULATING]: {
    title: 'Получаем расчет стоимости от страховой компании',
    children:
      'Пожалуйста, подождите. С подробными условиями страхования Вы сможете ознакомиться после получения расчета.',
  },
  [MessageModalName.MODEL_SUBSCRIBED]: {
    title: 'Спасибо!',
    children: 'Мы сообщим на указанный адрес, когда нужная вам модель появится в продаже.',
  },
  [MessageModalName.CREDIT_APPLICATION_CREATED]: {
    title: 'Заявка принята!',
    children:
      'В течение 15 минут мы сообщим о решении Банка на указанный вами номер телефона, и оставим сообщение в Личном кабинете Банкавто.',
  },
  [MessageModalName.INSTALMENT_APPLICATION_SENT]: {
    title: 'Заявка отправлена. Рассмотрение заявки займет не более 15 минут',
    children:
      'Вы получите sms-сообщение с результатами рассмотрения. После одобрения заявки с вами свяжется персональный менеджер дилерского центра для обсуждения деталей сделки.',
  },
  [MessageModalName.C2C_CREDIT_APPLICATION_SENT]: {
    title: 'Заявка отправлена. Рассмотрение заявки займет не более 15 минут',
    children: 'Вы получите sms-сообщение с результатами рассмотрения.',
  },
  [MessageModalName.INSTALMENT_APPLICATION_CANCEL_REQUESTED]: {
    title: 'Отмена заявки',
    children: 'Вы уверены, что хотите отменить заявку?',
  },
  [MessageModalName.SELL_CREATED]: {
    title: 'Ваше объявление направлено на проверку',
    children:
      'После проверки Вашего объявления мы направим его в дилерские центры. Ожидайте звонок от менеджера для назначения встречи',
  },
  [MessageModalName.SELL_CREATED_DEALERS_CLIENTS]: {
    title: 'Ваше объявление направлено на проверку',
    children:
      'По итогам ее прохождения Ваше объявление будет доступно для физических лиц в разделе Автомобили с пробегом и будет направлено официальным дилерам',
  },
  [MessageModalName.SELL_CREATED_FOR_CLIENTS]: {
    title: 'Ваше объявление направлено на проверку',
    children:
      'По итогам ее прохождения Ваше объявление будет доступно для физических лиц в разделе Автомобили с пробегом',
  },
  [MessageModalName.SELL_EDITED]: {
    title: 'Ваше объявление обновлено',
    children: '',
  },
  [MessageModalName.SELL_DEACTIVATED]: {
    title: 'Ваше объявление снято с публикации',
    children: '',
  },
  [MessageModalName.SELL_DELETED]: {
    title: 'Ваше объявление удалено',
    children: '',
  },
  [MessageModalName.DEPOSIT_CREATED]: {
    title: 'Спасибо за вашу заявку!',
    children: 'Наши сотрудники свяжутся с вами в ближайшее время, чтобы помочь оформить вклад',
  },
  [MessageModalName.SAVINGS_ACCOUNT_CREATED]: {
    title: 'Спасибо за вашу заявку!',
    children: 'Наши сотрудники свяжутся с вами в ближайшее время, чтобы помочь оформить счет',
  },
  [MessageModalName.SIMPLE_CREDIT_CANCEL_REQUESTED]: {
    title: 'Отмена заявки',
    children: 'Вы уверены, что хотите отменить заявку?',
  },
  [MessageModalName.DEBIT_CARD_REQUEST_CREATED]: {
    title: 'Спасибо за вашу заявку!',
    children: 'Наши сотрудники свяжутся с вами в ближайшее время, чтобы помочь оформить дебетовую карту',
  },
  [MessageModalName.SPECIAL_PROGRAM_REQUEST_CREATED]: {
    title: 'Спасибо за вашу заявку!',
    children: 'Наши сотрудники свяжутся с вами в ближайшее время, чтобы помочь оформить заявку',
  },
};

interface UseMessageModal {
  open: (variant: MessageModalName) => void;
  openWithControls: (name: MessageModalName, controls: SimpleModalControl[]) => void;
  close: () => void;
}

export const useMessageModal = (): UseMessageModal => {
  const dispatch = useDispatch();
  const handlers = useMemo<UseMessageModal>(
    () => ({
      open: (variant) => {
        dispatch(messageModalActions.open(variant));
      },
      openWithControls: (name, controls) => {
        dispatch(messageModalActions.openWithControls({ name, controls }));
      },
      close: () => {
        dispatch(messageModalActions.close());
      },
    }),
    [dispatch],
  );
  return handlers;
};

export const MessageModal: FC<BackdropModalActions> = ({ handleClose: handleCloseProp }) => {
  const { close } = useMessageModal();
  const closeHandler = useCallback(() => {
    if (handleCloseProp) {
      handleCloseProp();
    }
    close();
  }, [handleCloseProp, close]);
  const { open, variant, controls } = useSelector(selectMessageModal);
  return (
    variant && (
      <BackdropModal opened={open} onClose={closeHandler} handleOpened={() => {}}>
        {({ handleClose }) => (
          <SimpleModal {...MessageModalVariants[variant]} controls={controls} handleClose={handleClose} />
        )}
      </BackdropModal>
    )
  );
};

export const MessageModalContainer: FC = () => {
  const { query, replace, asPath } = useRouter();
  const { open, openWithControls } = useMessageModal();
  useEffect(() => {
    if (query.modal && !!MessageModalVariants[query.modal as MessageModalName]) {
      if (query.buttonTitle) {
        openWithControls(query.modal as MessageModalName, [{ title: query.buttonTitle as string }]);
      } else {
        open(query.modal as MessageModalName);
      }
    }
  }, [open, openWithControls, query]);

  const handleClose = useCallback(() => {
    const { modal, ...rest } = query;
    const newPath = stringifyUrl({ url: asPath, query: {} }).split('?')[0];
    const newQuery = stringifyUrl({ url: '', query: { ...rest } });
    replace(`${newPath}${newQuery || ''}`);
  }, [query, asPath, replace]);

  return <MessageModal handleClose={handleClose} />;
};
