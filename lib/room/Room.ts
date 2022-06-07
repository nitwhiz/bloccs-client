import Game from '../game/Game';
import { castEventData, EventData, GameData, parseMessageEvent, RoomData } from '../event/EventData';
import Player from '../player/Player';
import Score from '../score/Score';
import Field from '../field/Field';
import ServerEvent from '../event/ServerEvent';
import GameCommand from '../game/GameCommand';
import EventEmitter from 'eventemitter3';

export const enum RoomEvent {
  START = 'room_start',
  STOP = 'room_stop',
  UPDATE_GAMES = 'update_games',
  UPDATE_BEDROCK_TARGET_MAP = 'update_bedrock_target_map',
  DISTRIBUTE_BEDROCK = 'distribute_bedrock',
}

interface BedrockDistribution {
  from: Game;
  to: Game;
  amount: number;
}

interface RoomEventType {
  [RoomEvent.START]: () => void;
  [RoomEvent.STOP]: () => void;
  [RoomEvent.UPDATE_GAMES]: () => void;
  [RoomEvent.UPDATE_BEDROCK_TARGET_MAP]: () => void;
  [RoomEvent.DISTRIBUTE_BEDROCK]: (distributeBedrockData: BedrockDistribution) => void;
}

export default class Room extends EventEmitter<RoomEventType> {
  public readonly id: string;

  public readonly games: Record<string, Game>;

  private internalHostPlayer: Player | null;

  private internalBedrockTargetMap: Record<string, string>;

  constructor(roomData: RoomData, public readonly mainPlayer: Player, private websocket: WebSocket) {
    super();

    this.id = roomData.id;
    this.games = {};
    this.internalHostPlayer = null;
    this.internalBedrockTargetMap = {};

    this.updateGames(roomData);
    this.addSocketListeners();
  }

  public get hostPlayer() {
    return this.internalHostPlayer;
  }

  public get bedrockTargetMap() {
    return this.internalBedrockTargetMap;
  }

  public sendCommand(cmd: GameCommand): void {
    this.websocket.send(cmd);
  }

  public getGame(id: string): Game | null {
    return this.games[id] || null;
  }

  private handleEventData(data: EventData<ServerEvent>) {
    switch (data.type) {
      case ServerEvent.PLAYER_LEAVE:
      case ServerEvent.PLAYER_JOIN:
        {
          const { source } = castEventData<typeof data.type>(data);

          this.updateGames(source);
        }
        break;
      case ServerEvent.FIELD_UPDATE:
        {
          const { source } = castEventData<typeof data.type>(data);
          const game = this.getGame(source.gameId);

          if (game) {
            game.field.update(source);
          }
        }
        break;
      case ServerEvent.GAME_START:
        {
          const { source } = castEventData<typeof data.type>(data);
          const game = this.getGame(source.id);

          if (game) {
            game.start();
          }
        }
        break;
      case ServerEvent.GAME_OVER:
        {
          const { source } = castEventData<typeof data.type>(data);
          const game = this.getGame(source.id);

          if (game) {
            game.stop(true);
          }
        }
        break;
      case ServerEvent.GAME_FALLING_PIECE_UPDATE:
        {
          const { source, payload } = castEventData<typeof data.type>(data);
          const game = this.getGame(source.id);

          if (game) {
            game.updateFallingPiece(payload);
          }
        }
        break;
      case ServerEvent.GAME_NEXT_PIECE_UPDATE:
        {
          const { source, payload } = castEventData<typeof data.type>(data);
          const game = this.getGame(source.id);

          if (game) {
            game.updateNextPiece(payload);
          }
        }
        break;
      case ServerEvent.GAME_HOLD_PIECE_UPDATE:
        {
          const { source, payload } = castEventData<typeof data.type>(data);
          const game = this.getGame(source.id);

          if (game) {
            game.updateHoldPiece(payload);
          }
        }
        break;
      case ServerEvent.SCORE_UPDATE:
        {
          const { source } = castEventData<typeof data.type>(data);
          const game = this.getGame(source.gameId);

          if (game) {
            game.score.update(source);
          }
        }
        break;
      case ServerEvent.ROOM_START:
        {
          this.emit(RoomEvent.START);
        }
        break;
      case ServerEvent.ROOM_STOP:
        {
          this.emit(RoomEvent.STOP);
        }
        break;
      case ServerEvent.ROOM_UPDATE_BEDROCK_TARGET_MAP:
        {
          const { source } = castEventData<typeof data.type>(data);

          this.internalBedrockTargetMap = source.bedrockTargetMap;

          // todo: arg could be bedrocktargetmap, maybe?
          this.emit(RoomEvent.UPDATE_BEDROCK_TARGET_MAP);
        }
        break;
      case ServerEvent.ROOM_DISTRIBUTE_BEDROCK:
        {
          const { payload } = castEventData<typeof data.type>(data);

          this.emit(RoomEvent.DISTRIBUTE_BEDROCK, {
            from: this.games[payload.from.id],
            to: this.games[payload.to.id],
            amount: payload.amount,
          });
        }
        break;
      default:
        return false;
    }

    return true;
  }

  public addSocketListeners(): void {
    this.websocket.addEventListener('message', (msgEvent: MessageEvent<EventData<any>>) => {
      // todo: duplicate at RoomService
      const data = parseMessageEvent(msgEvent);

      if (data === null) {
        console.warn('unable to parse message event', msgEvent);
        return;
      }

      if (!this.handleEventData(data)) {
        console.warn('unhandled event', msgEvent);
        return;
      }
    });
  }

  public register(gameData: GameData, player: Player): void {
    const score = new Score();
    const field = new Field(gameData.settings.fieldWidth, gameData.settings.fieldHeight);
    const game = new Game(gameData.id, score, player, field);

    if (this.internalHostPlayer === null) {
      this.internalHostPlayer = player;
    }

    game.update(gameData);

    this.games[gameData.id] = game;
  }

  public start() {
    return fetch(`http://${new URL(this.websocket.url).host}/rooms/${this.id}/start`, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
    }).then((response) => {
      if (!response.ok) {
        throw new Error('could not request room start');
      }

      for (const gameId in this.games) {
        this.games[gameId].start();
      }

      return true;
    });
  }

  public updateGames(roomData: RoomData): void {
    if (this.id !== roomData.id) {
      return;
    }

    for (const id in this.games) {
      if (!roomData.games[id]) {
        // server side room doesn't contain this game - remove it client side

        this.games[id].destroy();
        delete this.games[id];

        this.emit(RoomEvent.UPDATE_GAMES);
      } else {
        // sync client side game with server side game

        this.games[id].update(roomData.games[id]);
      }
    }

    for (const id in roomData.games) {
      if (!this.games[id]) {
        // client side room doesn't know this game - create it client side

        if (id === this.mainPlayer.gameId) {
          this.register(roomData.games[id], this.mainPlayer);

          this.emit(RoomEvent.UPDATE_GAMES);
        } else {
          this.register(roomData.games[id], new Player(id, roomData.players[id].name, roomData.players[id].createAt));

          this.emit(RoomEvent.UPDATE_GAMES);
        }
      }
    }
  }
}
