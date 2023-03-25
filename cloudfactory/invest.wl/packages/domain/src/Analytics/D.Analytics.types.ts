export const DAnalyticsServiceTid = Symbol.for('DAnalyticsServiceTid');
export const DAnalyticsServiceAdapterTid = Symbol.for('DAnalyticsServiceAdapterTid');

export interface IDAnalyticsServiceAdapter {
  eventSend(event: string, payload: Record<string, any>): Promise<void>;
}
