import { FieldData } from '../event/EventData';
import FieldArray from './FieldArray';
import EventEmitter from 'eventemitter3';

export const enum FieldEvent {
  UPDATE = 'field_update',
  RESIZE = 'field_resize',
}

interface FieldEventTypes {
  [FieldEvent.UPDATE]: () => void;
  [FieldEvent.RESIZE]: () => void;
}

export default class Field extends EventEmitter<FieldEventTypes> {
  private fieldArray: FieldArray;

  constructor(width: number, height: number) {
    super();

    this.fieldArray = new FieldArray(width, height);
  }

  public setDimensions(width: number, height: number) {
    if (this.fieldArray.width !== width || this.fieldArray.height !== height) {
      this.fieldArray = new FieldArray(width, height);

      this.emit(FieldEvent.RESIZE);
    }
  }

  public getFieldArray() {
    return this.fieldArray;
  }

  public update(fieldData: FieldData): void {
    this.fieldArray.setData(fieldData.data);

    this.emit(FieldEvent.UPDATE);
  }
}
