import { PieceName } from './PieceTable';

export default class Piece {
  constructor(private readonly internalName: PieceName) {}

  public get name(): PieceName {
    return this.internalName;
  }
}
