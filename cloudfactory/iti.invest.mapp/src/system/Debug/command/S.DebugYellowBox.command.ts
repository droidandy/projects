import { YellowBox } from 'react-native';
import { SDebugService } from '../S.Debug.service';
import { Inject, Injectable } from '@invest.wl/core/src/di/IoC';
import { SDebugServiceTid } from '../S.Debug.types';

export const SDebugYellowBoxCommandTid = Symbol.for('SDebugYellowBoxCommandTid');

@Injectable()
export class SDebugYellowBoxCommand {
  constructor(
    @Inject(SDebugServiceTid) private _debugService: SDebugService,
  ) {}

  public init() {
    this._debugService.add('YellowBox warn off', this._performYellowBoxDisableWarnings);
  }

  private _performYellowBoxDisableWarnings = async () => {
    YellowBox.ignoreWarnings([' ']);
  };
}
