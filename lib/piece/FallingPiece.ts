import { FallingPieceData } from '../event/EventData';
import Piece from './Piece';

export default class FallingPiece {
  public piece: Piece | null;

  public x: number;
  public y: number;
  public rotation: number;

  public fallTimer: number;

  constructor() {
    this.piece = null;

    this.x = 0;
    this.y = 0;
    this.rotation = 0;

    this.fallTimer = 0;
  }

  public setData(fallingPieceData: FallingPieceData): void {
    if (fallingPieceData.piece === null) {
      this.piece = null;
    } else if (this.piece === null || this.piece.name !== fallingPieceData.piece.name) {
      this.piece = new Piece(fallingPieceData.piece.name);
    }

    this.x = fallingPieceData.x;
    this.y = fallingPieceData.y;
    this.rotation = fallingPieceData.rotation;
    this.fallTimer = fallingPieceData.fallTimer;
  }
}
