const enum ServerEvent {
  HELLO = 'hello',
  HELLO_ACK = 'hello_ack',
  PLAYER_JOIN = 'player_join',
  PLAYER_LEAVE = 'player_leave',
  FIELD_UPDATE = 'field_update',
  GAME_START = 'game_start',
  GAME_OVER = 'game_over',
  GAME_FALLING_PIECE_UPDATE = 'game_falling_piece_update',
  GAME_NEXT_PIECE_UPDATE = 'game_next_piece_update',
  GAME_HOLD_PIECE_UPDATE = 'game_hold_piece_update',
  SCORE_UPDATE = 'score_update',
  ROOM_START = 'room_start',
  ROOM_STOP = 'room_stop',
  ROOM_UPDATE_BEDROCK_TARGET_MAP = 'room_update_bedrock_target_map',
  ROOM_DISTRIBUTE_BEDROCK = 'room_distribute_bedrock',
}

export default ServerEvent;
