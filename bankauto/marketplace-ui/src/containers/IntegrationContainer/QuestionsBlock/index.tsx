import React, { FC, memo, useState } from 'react';
import { Box, Typography } from '@marketplace/ui-kit';
import { AccordionTab } from './components/AccordionTab';
import { Accordion } from './components/Accordion';
import { questions } from './questions';
import { useStyles } from './QuestionsBlock.styles';

type TabsState = {
  general: boolean;
  cards: boolean;
  credit: boolean;
  deposit: boolean;
  branches: boolean;
  rbs: boolean;
  transactions: boolean;
  legalEntity: boolean;
};

const clearActiveTabs: TabsState = {
  general: false,
  cards: false,
  credit: false,
  deposit: false,
  branches: false,
  rbs: false,
  transactions: false,
  legalEntity: false,
};

export type ActionType =
  | 'general'
  | 'cards'
  | 'credit'
  | 'deposit'
  | 'branches'
  | 'rbs'
  | 'transactions'
  | 'legalEntity';

type Question = {
  question: string;
  answer: string | React.ReactNode;
};

type IntegrationItem = {
  title: string;
  tabName: ActionType;
  isActive: boolean;
};
type IntegrationContentItem = {
  isActive: boolean;
  title: string;
  question: Question[];
};
export const QuestionsBlock: FC = memo(() => {
  const { tabsContainer, tabContentTitle, tabsWrapper } = useStyles();
  const [tabsStatus, setTabsStatus] = useState<TabsState>({
    general: true,
    cards: false,
    credit: false,
    deposit: false,
    branches: false,
    rbs: false,
    transactions: false,
    legalEntity: false,
  });

  const integrationTabs = React.useMemo((): IntegrationItem[] => {
    return [
      {
        title: 'Общие вопросы',
        tabName: 'general',
        isActive: tabsStatus.general,
      },
      { title: 'Карты', tabName: 'cards', isActive: tabsStatus.cards },
      { title: 'Кредиты', tabName: 'credit', isActive: tabsStatus.credit },
      {
        title: 'Вклады и счета',
        tabName: 'deposit',
        isActive: tabsStatus.deposit,
      },
      {
        title: 'Отделения',
        tabName: 'branches',
        isActive: tabsStatus.branches,
      },
      { title: 'ДБО', tabName: 'rbs', isActive: tabsStatus.rbs },
      {
        title: 'Переводы',
        tabName: 'transactions',
        isActive: tabsStatus.transactions,
      },
      { title: 'ЮЛ', tabName: 'legalEntity', isActive: tabsStatus.legalEntity },
    ];
  }, [tabsStatus]);

  const integrationTabsContent = React.useMemo((): IntegrationContentItem[] => {
    return [
      {
        title: 'Общие вопросы по объединению',
        question: questions.general,
        isActive: tabsStatus.general,
      },
      {
        title: 'Вопросы по дебетовым банковским картам',
        question: questions.cards,
        isActive: tabsStatus.cards,
      },
      {
        title: 'Вопросы по кредитам и кредитным картам',
        question: questions.credit,
        isActive: tabsStatus.credit,
      },
      {
        title: 'Вопросы по сберегательным продуктам',
        question: questions.deposit,
        isActive: tabsStatus.deposit,
      },
      {
        title: 'Вопросы по трансформации сети',
        question: questions.branches,
        isActive: tabsStatus.branches,
      },
      {
        title: 'Вопросы по дистанционному банковскому обслуживанию',
        question: questions.rbs,
        isActive: tabsStatus.rbs,
      },
      {
        title: 'Вопросы по платежам и переводам',
        question: questions.transactions,
        isActive: tabsStatus.transactions,
      },
      {
        title: 'Вопросы по работе с юридическими лицами',
        question: questions.legalEntity,
        isActive: tabsStatus.legalEntity,
      },
    ];
  }, [tabsStatus, questions]);
  const chooseTab = (tabName: ActionType) => () => {
    if (!tabsStatus[tabName]) {
      setTabsStatus({ ...clearActiveTabs, [tabName]: true });
    }
  };

  return (
    <Box>
      <Box className={tabsContainer}>
        <div className={tabsWrapper}>
          {integrationTabs.map((item) => (
            <AccordionTab title={item.title} handleClick={chooseTab(item.tabName)} isActive={item.isActive} />
          ))}
        </div>
      </Box>

      <Box>
        {integrationTabsContent.map(
          (item) =>
            item.isActive && (
              <>
                <Typography className={tabContentTitle}>{item.title}</Typography>
                <Accordion questions={item.question} />
              </>
            ),
        )}
      </Box>
    </Box>
  );
});
