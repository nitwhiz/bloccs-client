import RoomService from '../../lib/room/RoomService';
import ServerEvent from '../../lib/event/ServerEvent';
import { EventData } from '../../lib/event/EventData';
import fetchMock from 'jest-fetch-mock';
import WS from 'jest-websocket-mock';
import Room, { RoomEvent } from '../../lib/room/Room';

const handshake = async (
  server: WS,
  roomPromise: Promise<Room>,
  roomId: string,
  gameId: string,
  playerName: string,
  playerCreateAt: number,
) => {
  server.nextMessage.then(() => {
    server.send({
      type: ServerEvent.HELLO_ACK,
      source: {
        games: {},
        players: {},
        id: roomId,
      },
      payload: {
        player: {
          name: playerName,
          createAt: playerCreateAt,
          gameId: gameId,
        },
      },
    } as EventData<ServerEvent.HELLO_ACK>);
  });

  await server.connected;

  server.send({
    type: ServerEvent.HELLO,
    source: null,
    payload: null,
  } as EventData<ServerEvent.HELLO>);

  return {
    room: await roomPromise,
    server,
  };
};

export const createRoom = async (roomId: string, gameId: string, playerName: string, playerCreateAt: number) => {
  WS.clean();

  fetchMock.mockOnce(() =>
    Promise.resolve({
      headers: {
        'Content-Type': 'application/json',
      },
      body: `{"roomId": "${roomId}"}`,
    }),
  );

  const serverHost = 'localhost:7070';

  const server = new WS(`ws://${serverHost}/rooms/${roomId}/socket`, {
    jsonProtocol: true,
  });

  const roomService = new RoomService(playerName, serverHost, false);
  const roomPromise = roomService.createRoom();

  return handshake(server, roomPromise, roomId, gameId, playerName, playerCreateAt);
};

export const joinRoom = async (roomId: string, gameId: string, playerName: string, playerCreateAt: number) => {
  WS.clean();

  const serverHost = 'localhost:7070';

  const server = new WS(`ws://${serverHost}/rooms/${roomId}/socket`, {
    jsonProtocol: true,
  });

  const roomService = new RoomService(playerName, serverHost, false);
  const roomPromise = roomService.joinRoom(roomId);

  return handshake(server, roomPromise, roomId, gameId, playerName, playerCreateAt);
};

export const sendPlayerJoinEventByServer = async (
  room: Room,
  server: WS,
  gameId: string,
  playerName: string,
  playerCreateAt: number,
) => {
  const roomUpdatePromise = new Promise<void>((resolve) => {
    room.addListener(RoomEvent.UPDATE_GAMES, () => resolve());
  });

  server.send({
    type: ServerEvent.PLAYER_JOIN,
    source: {
      games: {
        [gameId]: {
          id: gameId,
          settings: {
            fieldHeight: 5,
            fieldWidth: 5,
          },
        },
      },
      players: {
        [gameId]: {
          name: playerName,
          createAt: playerCreateAt,
          gameId: gameId,
        },
      },
      id: room.id,
    },
    payload: {
      player: {
        name: playerName,
        createAt: playerCreateAt,
        gameId: gameId,
      },
    },
  } as EventData<ServerEvent.PLAYER_JOIN>);

  await roomUpdatePromise;
};

export const sendPlayerLeaveEventByServer = async (
  room: Room,
  server: WS,
  gameId: string,
  playerName: string,
  playerCreateAt: number,
) => {
  const roomUpdatePromise = new Promise<void>((resolve) => {
    room.addListener(RoomEvent.UPDATE_GAMES, () => resolve());
  });

  server.send({
    type: ServerEvent.PLAYER_LEAVE,
    source: {
      games: {},
      players: {},
      id: room.id,
    },
    payload: {
      player: {
        name: playerName,
        createAt: playerCreateAt,
        gameId: gameId,
      },
    },
  } as EventData<ServerEvent.PLAYER_LEAVE>);

  await roomUpdatePromise;
};
