import React from 'react';
import * as Rx from 'src/rx';
import { ReportingCyclesView } from './components/ReportingCyclesView';
import {
  ReportingCyclesActions,
  ReportingCyclesState,
  handle,
  getReportingCyclesState,
} from './interface';
import { defaultListInitialState, mixinList } from 'src/mixins/listMixin-next';
import {
  searchReportingCycle,
  initiativeNewCycle,
} from 'src/services/API-next';
import { catchErrorAndShowModal } from 'src/common/utils';
import { getGlobalState } from '../global/interface';

// --- Reducer ---
const initialState: ReportingCyclesState = {
  ...defaultListInitialState,
  sortBy: 'id',
  filter: {},
  appliedFilter: {},
  isInitiativeNewCycleLoading: false,
};

const { epic, reducer } = mixinList({
  handle,
  initialState,
  Actions: ReportingCyclesActions,
  searchCriteria: {},
  getState: getReportingCyclesState,
  search: criteria => searchReportingCycle({ ...criteria }),
  exportItems: () => {
    //
  },
});

epic.on(ReportingCyclesActions.initiativeNewCycle, () => {
  return Rx.concatObs(
    Rx.of(ReportingCyclesActions.setInitiativeNewCycleLoading(true)),
    initiativeNewCycle({
      OrganizationId: getGlobalState().user?.orgUsers[0].orgId.toString(),
    }).pipe(
      Rx.map(() => ReportingCyclesActions.load()),
      catchErrorAndShowModal()
    ),
    Rx.of(ReportingCyclesActions.setInitiativeNewCycleLoading(false))
  );
});

reducer.on(
  ReportingCyclesActions.setInitiativeNewCycleLoading,
  (state, { isInitiativeNewCycleLoading }) => {
    state.isInitiativeNewCycleLoading = isInitiativeNewCycleLoading;
  }
);

// --- Module ---
export default () => {
  handle();
  return <ReportingCyclesView />;
};
