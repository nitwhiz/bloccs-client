import Game from '../../lib/game/Game';
import Score from '../../lib/score/Score';
import Player from '../../lib/player/Player';
import Field from '../../lib/field/Field';
import Room from '../../lib/room/Room';
import { RoomData } from '../../lib/event/EventData';
import WS from 'jest-websocket-mock';
import GameCommand from '../../lib/game/GameCommand';

describe('Game', () => {
  test('sends game commands via websocket', async () => {
    WS.clean();

    const wsUrl = 'ws://localhost:7070/';

    const server = new WS(wsUrl);
    const websocket = new WebSocket(wsUrl);

    await server.connected;

    const game = new Game('beef', new Score(), new Player('beef', 'test', 42), new Field(5, 5));
    const room = new Room(
      {
        id: 'cafe',
        games: {},
        players: {},
      } as RoomData,
      game.player,
      websocket,
    );

    const messagePromise = server.nextMessage;

    room.sendCommand(GameCommand.LEFT);

    const msg = await messagePromise;

    expect(msg).toBe(GameCommand.LEFT);
  });
});
