import { createForm } from 'typeless-form';
import { PhasesFormSymbol } from '../symbol';
import { SelectOption } from 'src/types';

export interface ProjectCommunication {
  id: number;
  message: string;
  audience: string;
  channel: SelectOption | undefined;
  frequency: SelectOption | undefined;
  efficiency: string;
}

export interface ProjectMainPhase {
  id: number;
  name: string;
  startDate: Date;
  endDate: Date;
  outcome: string;
  comment: string;
}

export interface ProjectPhasesFromValues {
  mainPhases: ProjectMainPhase[];
  communication: {
    setup: ProjectCommunication[];
    during: ProjectCommunication[];
    post: ProjectCommunication[];
  };
}

export const [
  usePhasesForm,
  PhasesFormActions,
  getPhasesFormState,
  PhasesFormProvider,
] = createForm<ProjectPhasesFromValues>({
  symbol: PhasesFormSymbol,
  validator: (errors, values) => {
    values.mainPhases.forEach(value => {
      if (!value.name) {
        (errors as any)['name_' + value.id] = 'Please input phase name.';
      }

      if (!value.outcome) {
        (errors as any)['outcome_' + value.id] = 'Please input phase outcome.';
      }
    });
  },
});
