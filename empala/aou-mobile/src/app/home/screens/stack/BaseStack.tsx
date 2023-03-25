import React, { useCallback } from 'react';
import { FlatList } from 'react-native';

import * as s from '~/app/home/module.styles';
import { Routes } from '~/app/home/navigation/routes';
import { HomeNavProps } from '~/app/home/navigation/types';
import { ButtonWithIcon } from '~/components/atoms/buttonWithIcon';
import { CompanyTicker } from '~/components/atoms/companyTicker';
import { Icon } from '~/components/atoms/icon';
import { useAlert } from '~/components/hoc/withAlert';
import { useDeleteUserStacksMutation } from '~/graphQL/core/generated-types';
import Theme from '~/theme';

export enum Type {
  self = 'self',
  other = 'other',
}

export type StackType = Type.self | Type.other;

type Props = {
  navigation: HomeNavProps;
  route: any;
  type?: StackType;
};

const header = {
  self: 'My Stack',
  other: 'Other Stack',
};

export const BaseStack = ({ navigation, route, type = Type.self }: Props): JSX.Element => {
  const data = route?.params?.data;
  const navigate = useCallback((path) => navigation.navigate(path), [navigation]);
  const alert = useAlert();
  const [deleteUserStacksMutation] = useDeleteUserStacksMutation();

  const toHome = () => navigate(Routes.Home);

  const deletePress = useCallback(() => {
    if (data?.id) {
      deleteUserStacksMutation({ variables: { deleteUserStacksStackIds: [data.id] } }).then((res) => {
        if (res.data?.deleteUserStacks.__typename === 'DeleteSuccess') {
          if (res.data?.deleteUserStacks.deleteIds.includes(data?.id)) {
            alert?.({
              title: 'Investack deleted', message: `${data.name} investack successfully deleted`,
            });

            toHome();
            return;
          }
        }

        alert?.({
          title: 'Error', message: 'Something went wrong.',
        });
      }).catch((err) => {
        alert?.({
          title: 'Error', message: 'Something went wrong.',
        });
      });
    }
  }, [
    deleteUserStacksMutation,
    alert,
    toHome,
    data,
  ]);

  const renderItem = React.useCallback(({ item }) => (
    <CompanyTicker
      key={item.symbol}
      item={item}
    />
  ), []);

  return (
    <Theme>
      <s.GradientLayerInner>
        <s.Content>
          <s.HeaderContent>
            <s.HeaderIconsContent>
              <ButtonWithIcon icon="backArrow" onPress={toHome} />
            </s.HeaderIconsContent>

            <s.Label>{header[type]}</s.Label>

            <s.HeaderIconsContent>
              {type === Type.self && (
                <>
                  <ButtonWithIcon icon="pen" onPress={toHome} />
                  <ButtonWithIcon icon="trash" onPress={deletePress} />
                </>
              )}
              {type === Type.other && (
                <>
                  <ButtonWithIcon icon="star" onPress={toHome} />
                </>
              )}
            </s.HeaderIconsContent>
          </s.HeaderContent>
          <s.FooterContent>
            <s.CounterContainer>
              <s.CounterTopSticker>
                <s.CounterStickerText>
                  {`${data?.count} COMPANIES`}
                </s.CounterStickerText>
              </s.CounterTopSticker>
              <s.CounterTitleContainer>
                <s.Percent>{`${String(data?.percentageChange || 0)}%`}</s.Percent>
                <s.Trend>
                  <Icon name="upLine" size={15} />
                </s.Trend>
              </s.CounterTitleContainer>
            </s.CounterContainer>
            <s.Chart />
            <s.CounterContainer>
              <s.CounterTitleContainer>
                <s.CounterTitle>
                  Companies
                </s.CounterTitle>
              </s.CounterTitleContainer>

              <s.CounterSticker>
                <s.CounterStickerText>
                  {data?.count}
                </s.CounterStickerText>
              </s.CounterSticker>
            </s.CounterContainer>
            <s.FlatListContainer>
              <FlatList
                data={data?.instruments}
                renderItem={renderItem}
                keyExtractor={(item) => item.symbol}
              />
            </s.FlatListContainer>
          </s.FooterContent>
        </s.Content>
      </s.GradientLayerInner>
    </Theme>
  );
};
