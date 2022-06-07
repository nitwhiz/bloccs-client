import { createRoom, joinRoom } from '../helpers/room-helpers';

describe('RoomService', () => {
  test('handshakes via socket and joins rooms', async () => {
    const { room } = await joinRoom('cafe', 'beef', 'test', 42);

    expect(room.id).toBe('cafe');

    expect(room.mainPlayer.gameId).toBe('beef');
    expect(room.mainPlayer.name).toBe('test');
    expect(room.mainPlayer.createAt).toBe(42);

    // own game data is received via the PlayerJoin event
    // only games of other players are known here
    expect(Object.values(room.games).length).toBe(0);
  });

  test('handshakes via socket and creates rooms', async () => {
    const { room } = await createRoom('cafe', 'beef', 'test', 42);

    expect(room.id).toBe('cafe');

    expect(room.mainPlayer.gameId).toBe('beef');
    expect(room.mainPlayer.name).toBe('test');
    expect(room.mainPlayer.createAt).toBe(42);

    // own game data is received via the PlayerJoin event
    // only games of other players are known here
    expect(Object.values(room.games).length).toBe(0);
  });
});
