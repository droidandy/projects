import { Action, ActionCreator, createAction } from '@reduxjs/toolkit';

export enum PendingTypes {
	ADD_PENDING = '@pending/ADD_PENDING',
	REMOVE_PENDING = '@pending/REMOVE_PENDING',
	REMOVE_PENDINGS = '@pending/REMOVE_PENDINGS',
	ADD_LINKER = '@pending/ADD_LINKER'
}

export const addPending: ActionCreator<Action> = createAction(PendingTypes.ADD_PENDING);
export const removePending: ActionCreator<Action> = createAction(PendingTypes.REMOVE_PENDING);
export const removePendings: ActionCreator<Action> = createAction(PendingTypes.REMOVE_PENDINGS);
export const addLinker: ActionCreator<Action> = createAction(PendingTypes.ADD_LINKER);
