import { PieceName } from '../piece/PieceTable';

export default class FieldArray {
  private readonly dataArray: Uint8Array;

  public readonly data: DataView;

  constructor(public readonly width: number, public readonly height: number) {
    this.dataArray = new Uint8Array(width * height);
    this.data = new DataView(this.dataArray.buffer);
  }

  public setData(data: ArrayLike<PieceName>) {
    this.dataArray.set(data);
  }
}
