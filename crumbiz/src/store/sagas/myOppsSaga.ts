import { put, takeLatest, all } from 'redux-saga/effects';
import { setMyOpps } from '../actions/myOppsActions';
import { MyOppsTypes } from '../constants';
import {
	IPayload,
	IGetMyOppsPayload,
	IOpp,
	IOppItem
} from '../../types/interfaces';
import { opportunitiesEP } from '../../services/api/routes';
import { EntityEnum } from '../../types/enums';
import filterRejectedOpps from './utils/opps/filterRejectedOpps';

export function* getMyOppsSaga({ payload }: IPayload<IGetMyOppsPayload>) {
	const { authId } = payload;
	try {
		const opps: IOpp[] = yield opportunitiesEP.getMyOpps(authId);
		//@ts-ignore
		let response: Array<IOppItem> = opps
			.map(opp => {
				const {
					opportunityConnectors: connectors,
					opportunityStatusId,
					...rest
				} = opp;
				if (connectors && connectors.length) {
					const {
						ownerUserId,
						connectorUserId,
						opportunityStatusId: connectorStatusId,
						opportunityTargets: targets
					} = connectors[0];

					const role =
						ownerUserId === authId
							? EntityEnum.OWNER
							: connectorUserId === authId
							? EntityEnum.CONNECTOR
							: EntityEnum.TARGET;

					const targetStatusId =
						targets && targets.length
							? targets[0].opportunityTargetStatusId
							: undefined;

					const res: IOppItem = {
						...rest,
						role,
						connectorStatusId,
						targetStatusId,
						opportunityStatusId
					};
					return res;
				}
				return;
			})
			.filter(obj => obj);
		const filteredOpps = filterRejectedOpps(response);

		yield put(setMyOpps(filteredOpps));
	} catch (err) {}
}

export function* watchMyOppsSaga() {
	yield all([takeLatest(MyOppsTypes.GET_MY_OPPS as any, getMyOppsSaga)]);
}
