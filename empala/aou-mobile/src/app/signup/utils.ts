import { BubbleNode } from '@dehimer/react-native-bubble-select';
import { flatMap, uniqWith, shuffle } from 'lodash';
import { useContext, useEffect, useMemo } from 'react';

import {
  BubbleableConstructor,
  BubbleItemFactory,
  BubbleScreenData,
  DataFields,
  DataFieldsType,
  SubmitFields,
  SubmitFieldsType,
} from './types';

import { StepContainerContext } from '~/components/StepContainer/types';
import { CreateUserInput, GetThemesDocument, GetThemesQuery, Instrument, Theme, useGetThemesQuery } from '~/graphQL/core/generated-types';
import { BaseResponse } from '~/network/useFetch';
import store from '~/store/createStore';
import { apolloClient } from '~/amplify/apolloClient';
import { useState } from 'hoist-non-react-statics/node_modules/@types/react';

export const onboardingResponseArrayToBubbleable = (
  response: BaseResponse[],
  itemType: BubbleableConstructor,
): BubbleScreenData => {
  const data = response.map((item) => BubbleItemFactory(item, itemType).toBubbleItem());
  return { data };
};

export const onboardingGqlArrayToBubbleable = (
  response: any,
  itemType: GqlTypes,
): BubbleScreenData => {
  const data = (response as typeof itemType[] | undefined)?.
    map((item) => GqlToBubbleable[itemType](item)) || [];
  return { data };
};

export const onboardingTagResponseToBubbleable = (
  response: Pick<Instrument, 'id' | 'symbol' | 'description'> & { themes: Pick<Theme, 'id' | 'name'>[] },
  itemType: BubbleableConstructor,
): BubbleScreenData => {
  const { themes, ...otherData } = response;

  const { id } = response;

  const { scState, setSCState } = useContext(StepContainerContext);

  useEffect(() => {
    if (id && !(scState as DataFieldsType)[DataFields.tagInstrumentId]) {
      setSCState((oldState) => ({ ...oldState, [DataFields.tagInstrumentId]: id }));
    }
  }, [id, scState]);

  const data = themes?.map((item) => BubbleItemFactory(item, itemType).toBubbleItem());

  return { data, otherData };
};

export const prepareUserInput = (context: SubmitFieldsType & DataFieldsType): CreateUserInput => ({
  [SubmitFields.fullName]: context.fullName || '',
  [SubmitFields.tags]: [{
    instId: context[DataFields.tagInstrumentId] || '',
    themeIds: context[DataFields.tagThemeIds]?.map((item) => item.id) || [],
  }],
  [SubmitFields.stacks]: [{
    name: context[DataFields.stackName] || '',
    instIds: context[DataFields.selectedCompanies]?.map((item) => item.id) || [],
  }],
});

export enum GqlTypes {
  Theme,
  Instrument,
}

export const GqlToBubbleable = {
  [GqlTypes.Theme]: (t: Theme): BubbleNode => ({
    id: t.id,
    text: t.name,
  }),
  [GqlTypes.Instrument]: (t: Instrument): BubbleNode => ({
    id: t.id,
    text: t.description,
  }),
};

export const selectCompanies = (selectedInterests: { id: number | string }[] | undefined): BubbleScreenData => {
  const { loading, error, data } = useGetThemesQuery();

  const companies = useMemo(() => {
    const themeIds = selectedInterests?.map((i) => i.id) || [];
    const interests = data?.themes.themes
      .filter(
        (theme) => (selectedInterests?.length === 0 ? true : themeIds.includes(theme.id)),
      );
    const allInstruments = flatMap(interests, (i) => i.instruments);
    const uniqueInstruments = uniqWith(allInstruments, (first, second) => first.id === second.id);
    const preparedInstruments = shuffle(uniqueInstruments.slice(0, 21));

    return onboardingGqlArrayToBubbleable(
      preparedInstruments, GqlTypes.Instrument,
    );
  }, [data, selectedInterests]);

  return companies;
};

export const equalById = (
  first: { id: string | number },
  second: { id: string | number },
): boolean => first.id === second.id;
