export const SFeedbackServiceTid = Symbol.for('SFeedbackServiceTid');
export const SFeedbackConfigTid = Symbol.for('SFeedbackConfigTid');

export interface ISFeedbackService {
  review(rate: number, message?: string): Promise<void>;
  bugReport(message: string): Promise<void>;
}

export interface ISFeedbackConfig {
}
