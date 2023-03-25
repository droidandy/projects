import React from 'react';
import * as Rx from 'src/rx';
import { ChallengeTaskView } from './components/ChallengeTaskView';
import {
  ChallengeTaskActions,
  ChallengeTaskState,
  handle,
  getChallengeTaskState,
} from './interface';
import { getRouterState, RouterActions } from 'typeless-router';
import { catchErrorAndShowModal } from 'src/common/utils';
import {
  getChallenge,
  searchChallengeAction,
  createChallengeAction,
  addChallengeActionComment,
  createChallengeResponse,
  createChallengeReviewResponse,
} from 'src/services/API-next';
import {
  useChallengeTaskForm,
  ChallengeTaskFormActions,
  getChallengeTaskFormState,
} from './challengeTask-form';
import { ActionDetailsActions } from '../actionDetails/interface';
import { getGlobalState, GlobalActions } from '../global/interface';
import { TaskType } from 'src/types-next';

// --- Epic ---
handle
  .epic()
  .on(ChallengeTaskActions.$mounted, () => {
    const [, , id, taskType] = getRouterState().location!.pathname.split('/');

    return getChallenge(Number(id)).pipe(
      Rx.mergeMap(challenge =>
        searchChallengeAction({
          challengeId: challenge.id,
          pageSize: 1e6,
        }).pipe(
          Rx.mergeMap(ret => [
            ChallengeTaskFormActions.reset(),
            ChallengeTaskActions.loaded(
              challenge,
              ret.items,
              taskType as TaskType
            ),
          ])
        )
      ),
      catchErrorAndShowModal()
    );
  })
  .on(ActionDetailsActions.actionCreated, ({ actionData }) => {
    const { challenge } = getChallengeTaskState();
    return Rx.concatObs(
      Rx.of(ActionDetailsActions.setSaving(true)),
      createChallengeAction({
        challengeId: challenge.id,
        ...actionData,
      }).pipe(
        Rx.mergeMap(challengeAction => [
          ChallengeTaskActions.addChallengeAction(challengeAction),
          ActionDetailsActions.close(),
        ]),
        catchErrorAndShowModal()
      ),
      Rx.of(ActionDetailsActions.setSaving(false))
    );
  })
  .on(
    ChallengeTaskActions.addComment,
    ({ challengeActionId, comment, callback }) => {
      callback('startLoading');
      return addChallengeActionComment(challengeActionId, {
        text: comment,
        addedByUserId: getGlobalState().user!.id,
      }).pipe(
        Rx.mergeMap(() => {
          callback('clear');
          return [ChallengeTaskActions.commentCreated({})];
        }),
        catchErrorAndShowModal(),
        Rx.tap(() => {
          callback('stopLoading');
        })
      );
    }
  )
  .on(ChallengeTaskActions.save, () => {
    const { taskType, challenge } = getChallengeTaskState();
    const { values: formValues } = getChallengeTaskFormState();
    return Rx.concatObs(
      Rx.of(ChallengeTaskActions.setSaving(true)),
      Rx.defer(() => {
        if (taskType === 'ChallengeResponse') {
          return createChallengeResponse(challenge.id);
        } else if (taskType === 'ChallengeResponseReview') {
          return createChallengeReviewResponse(challenge.id, {
            isAccepted: formValues.isAccepted.value,
            comments: formValues.acceptedComment,
          });
        } else {
          return Rx.empty();
        }
      }).pipe(
        Rx.mergeMap(() => [
          GlobalActions.showNotification('success', 'Submitted successfully'),
          RouterActions.push('/my-tasks'),
        ]),
        catchErrorAndShowModal()
      ),
      Rx.of(ChallengeTaskActions.setSaving(false))
    );
  })
  .on(ChallengeTaskFormActions.setSubmitSucceeded, () =>
    ChallengeTaskActions.save()
  );

// --- Reducer ---
const initialState: ChallengeTaskState = {
  isLoaded: true,
  isSaving: false,
  actions: [],
  challenge: null!,
  taskType: null!,
};

handle
  .reducer(initialState)
  .replace(ChallengeTaskActions.$init, () => initialState)
  .on(
    ChallengeTaskActions.loaded,
    (state, { actions, challenge, taskType }) => {
      state.challenge = challenge;
      state.actions = actions;
      state.isLoaded = false;
      state.taskType = taskType;
    }
  )
  .on(ChallengeTaskActions.setSaving, (state, { isSaving }) => {
    state.isSaving = isSaving;
  })
  .on(ChallengeTaskActions.addChallengeAction, (state, { action }) => {
    state.actions.push(action);
  });

// --- Module ---
export default () => {
  useChallengeTaskForm();
  handle();
  return <ChallengeTaskView />;
};
