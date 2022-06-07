import { createRoom, sendPlayerJoinEventByServer, sendPlayerLeaveEventByServer } from '../helpers/room-helpers';

describe('Room', () => {
  const roomId = 'cafe';
  const gameId = 'beef';
  const playerName = 'test';
  const playerCreateAt = 42;

  test('updates on player_join event', async () => {
    const { room, server } = await createRoom(roomId, gameId, playerName, playerCreateAt);

    await sendPlayerJoinEventByServer(room, server, gameId, playerName, playerCreateAt);

    expect(Object.values(room.games).length).toBe(1);

    expect(room.games[gameId].player).toBe(room.mainPlayer);

    expect(room.games[gameId].score.score).toBe(0);
    expect(room.games[gameId].score.lines).toBe(0);

    expect(room.games[gameId].field.getFieldArray().height).toBe(5);
    expect(room.games[gameId].field.getFieldArray().width).toBe(5);
  });

  test('updates on player_leave event', async () => {
    const { room, server } = await createRoom(roomId, gameId, playerName, playerCreateAt);

    await sendPlayerJoinEventByServer(room, server, gameId, playerName, playerCreateAt);
    await sendPlayerLeaveEventByServer(room, server, gameId, playerName, playerCreateAt);

    expect(Object.values(room.games).length).toBe(0);
  });
});
