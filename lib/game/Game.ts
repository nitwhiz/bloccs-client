import Score from '../score/Score';
import Player from '../player/Player';
import { FallingPieceData, GameData, PieceData } from '../event/EventData';
import Field from '../field/Field';
import FallingPiece from '../piece/FallingPiece';
import Piece from '../piece/Piece';
import EventEmitter from 'eventemitter3';

export const enum GameEvent {
  UPDATE_FALLING_PIECE = 'falling_piece_update',
  UPDATE_NEXT_PIECE = 'next_piece_update',
  UPDATE_HOLD_PIECE = 'hold_piece_update',
  START = 'start',
  STOP = 'stop',
  OVER = 'over',
}

interface GameEventTypes {
  [GameEvent.UPDATE_FALLING_PIECE]: () => void;
  [GameEvent.UPDATE_NEXT_PIECE]: () => void;
  [GameEvent.UPDATE_HOLD_PIECE]: () => void;
  [GameEvent.START]: () => void;
  [GameEvent.STOP]: () => void;
  [GameEvent.OVER]: () => void;
}

export default class Game extends EventEmitter<GameEventTypes> {
  private internalFallingPiece: FallingPiece | null;
  private internalNextPiece: Piece | null;
  private internalHoldPiece: Piece | null;

  // todo: server has this as a state, too; maybe sync up to that?
  private internalIsRunning: boolean;

  constructor(
    public readonly id: string,
    public readonly score: Score,
    public readonly player: Player,
    public readonly field: Field,
  ) {
    super();

    this.internalFallingPiece = null;
    this.internalNextPiece = null;
    this.internalHoldPiece = null;

    this.internalIsRunning = false;
  }

  public get fallingPiece(): FallingPiece | null {
    return this.internalFallingPiece;
  }

  public get nextPiece(): Piece | null {
    return this.internalNextPiece;
  }

  public get holdPiece(): Piece | null {
    return this.internalHoldPiece;
  }

  public update(data: GameData): void {
    if (this.id !== data.id) {
      console.log('data mismatch!');
      return;
    }

    this.field.setDimensions(data.settings.fieldWidth, data.settings.fieldHeight);
  }

  public updateFallingPiece(fallingPieceData: FallingPieceData): void {
    if (this.internalFallingPiece === null) {
      this.internalFallingPiece = new FallingPiece();
    }

    this.internalFallingPiece.setData(fallingPieceData);

    this.emit(GameEvent.UPDATE_FALLING_PIECE);
  }

  public updateNextPiece(pieceData: PieceData | null): void {
    if (pieceData === null) {
      this.internalNextPiece = null;
    } else {
      this.internalNextPiece = new Piece(pieceData.name);
    }

    this.emit(GameEvent.UPDATE_NEXT_PIECE);
  }

  public updateHoldPiece(pieceData: PieceData | null): void {
    if (pieceData === null) {
      this.internalHoldPiece = null;
    } else {
      this.internalHoldPiece = new Piece(pieceData.name);
    }

    this.emit(GameEvent.UPDATE_HOLD_PIECE);
  }

  public get isRunning() {
    return this.internalIsRunning;
  }

  public start(): void {
    this.internalIsRunning = true;

    this.emit(GameEvent.START);
  }

  public stop(gameOver: boolean = false): void {
    this.internalIsRunning = false;

    this.emit(GameEvent.STOP);

    if (gameOver) {
      this.emit(GameEvent.OVER);
    }
  }

  public destroy(): void {
    // todo: sub-destroy methods

    this.removeAllListeners();

    this.field.removeAllListeners();
    this.score.removeAllListeners();

    this.internalFallingPiece = null;
  }
}
