import { ScoreData } from '../event/EventData';
import EventEmitter from 'eventemitter3';

export const enum ScoreEvent {
  UPDATE = 'update',
}

interface ScoreEventTypes {
  [ScoreEvent.UPDATE]: () => void;
}

export default class Score extends EventEmitter<ScoreEventTypes> {
  private internalScore: number;

  private internalLines: number;

  constructor() {
    super();

    this.internalScore = 0;
    this.internalLines = 0;
  }

  public get score(): number {
    return this.internalScore;
  }

  public get lines(): number {
    return this.internalLines;
  }

  public update(scoreData: ScoreData): void {
    this.internalScore = scoreData.score;
    this.internalLines = scoreData.lines;

    this.emit(ScoreEvent.UPDATE);
  }
}
