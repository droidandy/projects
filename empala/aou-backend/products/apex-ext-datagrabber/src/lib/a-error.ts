/* istanbul ignore file */

/**
 * Provides the ability to indicate the severity of the error
 * 1 - the error requires immediate attention and at the end of the work the service will exit with errorCode = 1
 * 0 - This error is not considered as requiring immediate attention.
 *     For example, the absence of a SOD file for an ancient date.
 */
export default class AError extends Error {
  public severity: number;

  public constructor(err: any, severity = 0) {
    super(String(err.message || err));
    this.severity = severity;
    if (typeof err === 'object' || err instanceof Error) {
      Object.entries(err).forEach(([k, v]: [string, any]) => {
        if (k === 'stack') {
          this.stack += `\n${String(v)}`;
        } else {
          // @ts-ignore
          this[k] = v;
        }
      });
    }
  }
}
