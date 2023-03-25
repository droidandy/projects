import React, { useCallback } from 'react';

import { Reactions } from './Reactions';
import * as hs from './styles';

import * as s from '~/app/home/module.styles';
import { Routes } from '~/app/home/navigation/routes';
import { HomeNavProps } from '~/app/home/navigation/types';
import { ChartHeader } from '~/app/home/screens/hunch/ChartHeader';
import { ButtonWithIcon } from '~/components/atoms/buttonWithIcon';
import { useAlert } from '~/components/hoc/withAlert';
import { Chart } from '~/components/molecules/chart';
import { useDeleteUserHunchesMutation } from '~/graphQL/core/generated-types';
import Theme from '~/theme';

export enum Type {
  self = 'self',
  other = 'other',
}

type Props = {
  navigation: HomeNavProps;
  route: any;
};

export const HunchScreen = ({ navigation, route }: Props): JSX.Element => {
  const data = route?.params?.data;
  const type = Type.self;
  const navigate = useCallback((path) => navigation.navigate(path), [navigation]);
  const alert = useAlert();
  const [deleteUserHunchesMutation] = useDeleteUserHunchesMutation();

  const toHome = () => navigate(Routes.Home);

  const deletePress = useCallback(() => {
    if (data?.id) {
      deleteUserHunchesMutation({ variables: { deleteUserHunchesHunchIds: [data.id] } }).then((res) => {
        if (res.data?.deleteUserHunches.__typename === 'DeleteSuccess') {
          if (res.data?.deleteUserHunches.deleteIds.includes(data?.id)) {
            alert?.({
              title: 'Hunch deleted', message: `${data.instrument.name} hunch successfully deleted`,
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
    deleteUserHunchesMutation,
    alert,
    toHome,
    data,
  ]);

  return (
    <Theme>
      <s.GradientLayerInner>
        <s.Content>
          <s.HeaderContent>
            <s.HeaderIconsContent>
              <ButtonWithIcon icon="backArrow" onPress={toHome} />
            </s.HeaderIconsContent>

            <s.Label>Hunch™</s.Label>

            <s.HeaderIconsContent>
              {type === Type.self && (
                <>
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
          <s.FooterContent justify="flex-start">
            <hs.FooterHeader>
              <hs.CompanyName>{data.instrument.name}</hs.CompanyName>
            </hs.FooterHeader>
            <ChartHeader
              percentageChange={data.instrument.percentageChange ?? 0}
              authorAvatar={data.author.avatar}
              authorName={data.author.userName}
              byDate={data.byDate}
            />
            <s.ChartWrapper>
              <Chart companyId={2662} />
            </s.ChartWrapper>
            <Reactions />
          </s.FooterContent>
        </s.Content>
      </s.GradientLayerInner>
    </Theme>
  );
};
