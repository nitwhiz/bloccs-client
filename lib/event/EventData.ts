import ServerEvent from './ServerEvent';
import { PieceName } from '../piece/PieceTable';

export interface PlayerData {
  gameId: string;
  name: string;
  createAt: number;
}

export interface GameSettingsData {
  fieldWidth: number;
  fieldHeight: number;
}

export interface GameData {
  id: string;
  settings: GameSettingsData;
}

export interface RoomData {
  id: string;
  players: Record<string, PlayerData>;
  games: Record<string, GameData>;
  hostPlayer: PlayerData | null;
  bedrockTargetMap: Record<string, string>;
}

export interface PieceData {
  name: PieceName;
}

export interface FallingPieceData {
  gameId: string;
  piece: PieceData | null;
  x: number;
  y: number;
  rotation: number;
  fallTimer: number;
}

export interface FieldData {
  gameId: string;
  data: PieceName[];
}

export interface HelloAckData {
  player: PlayerData;
}

export interface PlayerJoinData {
  player: PlayerData;
}

interface PlayerLeaveData {
  player: PlayerData;
}

export interface ScoreData {
  gameId: string;
  score: number;
  lines: number;
}

export interface DistributeBedrockData {
  from: GameData;
  to: GameData;
  amount: number;
}

interface EventSourceTypeMap {
  [ServerEvent.HELLO]: null;
  [ServerEvent.HELLO_ACK]: RoomData;
  [ServerEvent.PLAYER_JOIN]: RoomData;
  [ServerEvent.PLAYER_LEAVE]: RoomData;
  [ServerEvent.FIELD_UPDATE]: FieldData;
  [ServerEvent.GAME_START]: GameData;
  [ServerEvent.GAME_OVER]: GameData;
  [ServerEvent.GAME_FALLING_PIECE_UPDATE]: GameData;
  [ServerEvent.GAME_NEXT_PIECE_UPDATE]: GameData;
  [ServerEvent.GAME_HOLD_PIECE_UPDATE]: GameData;
  [ServerEvent.SCORE_UPDATE]: ScoreData;
  [ServerEvent.ROOM_START]: RoomData;
  [ServerEvent.ROOM_STOP]: RoomData;
  [ServerEvent.ROOM_UPDATE_BEDROCK_TARGET_MAP]: RoomData;
  [ServerEvent.ROOM_DISTRIBUTE_BEDROCK]: RoomData;
}

interface EventPayloadTypeMap {
  [ServerEvent.HELLO]: null;
  [ServerEvent.HELLO_ACK]: HelloAckData;
  [ServerEvent.PLAYER_JOIN]: PlayerJoinData;
  [ServerEvent.PLAYER_LEAVE]: PlayerLeaveData;
  [ServerEvent.FIELD_UPDATE]: null;
  [ServerEvent.GAME_START]: null;
  [ServerEvent.GAME_OVER]: null;
  [ServerEvent.GAME_FALLING_PIECE_UPDATE]: FallingPieceData;
  [ServerEvent.GAME_NEXT_PIECE_UPDATE]: PieceData | null;
  [ServerEvent.GAME_HOLD_PIECE_UPDATE]: PieceData | null;
  [ServerEvent.SCORE_UPDATE]: null;
  [ServerEvent.ROOM_START]: null;
  [ServerEvent.ROOM_STOP]: null;
  [ServerEvent.ROOM_UPDATE_BEDROCK_TARGET_MAP]: null;
  [ServerEvent.ROOM_DISTRIBUTE_BEDROCK]: DistributeBedrockData;
}

export interface EventData<EType extends ServerEvent> {
  type: EType;
  source: EventSourceTypeMap[EType];
  payload: EventPayloadTypeMap[EType];
}

export type EmitterTypes<EventEnumType extends string | number | symbol, ArgumentType> = {
  [K in EventEnumType]: (arg: ArgumentType) => void;
};

export const parseMessageEvent = (msgEvent: MessageEvent) => {
  const rawData = msgEvent.data;
  const data: EventData<ServerEvent> = JSON.parse(rawData);

  if (typeof data !== 'object') {
    return null;
  }

  return data;
};

// todo: this feels stupid
export const castEventData = <EType extends ServerEvent>(data: EventData<any>): EventData<EType> => {
  return data as EventData<EType>;
};
