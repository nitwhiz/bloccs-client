import Room from './Room';
import { EventData, parseMessageEvent } from '../event/EventData';
import ServerEvent from '../event/ServerEvent';
import Player from '../player/Player';

interface RoomCreatedResponse {
  roomId: string;
}

export default class RoomService {
  private websocket: WebSocket | null;

  constructor(private playerName: string, private serverHost: string, private tls: boolean = false) {
    this.websocket = null;
  }

  private sendMessage(msg: unknown): void {
    if (this.websocket === null) {
      return;
    }

    this.websocket.send(JSON.stringify(msg));
  }

  private resetWebSocket() {
    if (this.websocket !== null) {
      this.websocket.close();
    }
  }

  private createWebSocket(roomId: string) {
    this.websocket = new WebSocket(`${this.tls ? 'wss' : 'ws'}://${this.serverHost}/rooms/${roomId}/socket`);
  }

  private executeHandshake() {
    return new Promise<Room>((resolve, reject) => {
      if (this.websocket === null) {
        reject('websocket gone');
        return;
      }

      this.websocket.onmessage = (msgEvent) => {
        const data = parseMessageEvent(msgEvent);

        if (data === null) {
          console.warn('unable to parse message event', msgEvent);
          return;
        }

        switch (data.type) {
          case ServerEvent.HELLO:
            this.sendMessage({
              name: this.playerName,
            });
            break;
          case ServerEvent.HELLO_ACK:
            if (this.websocket === null) {
              throw new Error('websocket gone');
            }

            this.websocket.onmessage = null;

            const { source, payload } = data as EventData<ServerEvent.HELLO_ACK>;

            resolve(
              new Room(
                source,
                new Player(payload.player.gameId, payload.player.name, payload.player.createAt),
                this.websocket,
              ),
            );
            break;
          default:
            console.warn('unknown event type', data.type, data);
            break;
        }
      };
    });
  }

  private prepareHandshake() {
    return new Promise<Room>((resolve, reject) => {
      if (this.websocket === null) {
        reject('websocket gone');
        return;
      }

      this.websocket.addEventListener('open', () => {
        if (this.websocket === null) {
          reject('websocket gone');
          return;
        }

        this.executeHandshake()
          .then((room) => resolve(room))
          .catch((reason) => reject(reason));
      });
    });
  }

  public joinRoom(roomId: string): Promise<Room> {
    this.resetWebSocket();
    this.createWebSocket(roomId);

    return this.prepareHandshake();
  }

  public createRoom(): Promise<Room> {
    return fetch(`${this.tls ? 'https' : 'http'}://${this.serverHost}/rooms`, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
    })
      .then((response) => {
        if (response.ok) {
          return response.json() as Promise<RoomCreatedResponse>;
        }

        throw new Error('cannot create room');
      })
      .then((response) => {
        return this.joinRoom(response.roomId);
      });
  }
}
