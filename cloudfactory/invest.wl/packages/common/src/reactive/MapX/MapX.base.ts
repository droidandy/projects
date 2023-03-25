import isEqual from 'lodash/isEqual';
import uniq from 'lodash/uniq';
import { action, computed, makeObservable } from 'mobx';
import { ILambda, LambdaX } from '../LambdaX';
import { IModelBase, IModelXBase, IModelXValueBase } from '../ModelX/ModelX.types';
import { IMapX, IMapXList } from './MapX.types';

export class MapXBase<Input, Output extends IModelXValueBase<Input>>
implements IMapX<Output> {
  constructor(
    protected _v: ILambda<Input | undefined>,
    protected _fabric: (v: ILambda<Input>) => Output,
  ) {
    makeObservable(this);
  }

  protected _model?: Output;

  @computed
  public get model(): Output | undefined {
    if (this._item) {
      // тут уже знаем что в LV уже что-то лежит, оно не пусто
      if (!this._model) this._model = this._fabric(this._v as ILambda<Input>);
      else Promise.resolve().then(() => this._model?.lvSet(this._v as ILambda<Input>));
    } else {
      this._model = undefined;
    }
    return this._model;
  }

  @computed
  protected get _item() {
    return LambdaX.resolve(this._v);
  }
}

export class MapXListBase<Input extends IModelBase, Output extends IModelXBase<Input>>
implements IMapXList<Output> {
  constructor(
    protected _v: ILambda<Input[] | undefined>,
    protected _fabric: (v: ILambda<Input>, index: number) => Output,
  ) {
    makeObservable(this);
  }

  protected _list: Output[] = [];

  @computed
  public get list(): Output[] {
    const listNext = this._data;
    const idListNext = uniq(listNext?.map(a => a.id.toString()));
    const idSetPrev = this._idSetCurrent;
    const idListPrev = [...idSetPrev];
    const idSetHandled = new Set();
    const listUpdate: Input[] = [];

    const listNew = listNext?.filter(item => {
      const itemId = item.id.toString();
      const isNew = !idSetPrev.has(itemId);
      const isNeedUpdate = idSetHandled.has(itemId);
      if (isNew && isNeedUpdate) {
        if (__DEV__) console.warn(`[MapX.list] Id duplicate: ${itemId}`);
        return false;
      } else if (!isNew) {
        idSetPrev.delete(itemId);
        listUpdate.push(item);
      }
      idSetHandled.add(itemId);
      return isNew;
    });
    // обновляем модели
    Promise.resolve().then(() => this._update(listUpdate));
    // удаляем модели отсутствующие в свежем наборе
    if (idSetPrev.size) {
      this._list = this._list.filter(item => !idSetPrev.has(item.id.toString()));
    }
    if (listNew?.length) {
      const len = this._list.length;
      this._list.push(...listNew.map((item, index) => this._fabric(item, index + len)));
    }
    // если добавились новые элементы или изменилась очередность выполняем сортировку
    if (idListNext && (listNew?.length || !isEqual(idListNext, idListPrev))) {
      this._list = idListNext.map(id => this._list.find(m => m.id.toString() === id)!);
    }
    return this._list;
  };

  @computed
  protected get _data() {
    return LambdaX.resolve(this._v);
  }

  protected get _idSetCurrent() {
    return new Set(this._list.map(item => item.id));
  }

  @action
  protected _update(list: Input[]) {
    list.forEach(item => this._list.find(model => model.id === item.id)?.lvSet(() => item));
  }
}
