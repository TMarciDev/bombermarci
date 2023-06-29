export interface CreateRoomBody {
  name: string;
  test?: boolean;
}

export interface JoinRoomBody extends CreateRoomBody {
  roomName: string;
}
