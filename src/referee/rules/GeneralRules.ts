import { TeamType } from "../../Types";
import { Piece, Position } from "../../models";

export const tileIsOccupied = (position: Position, boardState: Piece[]): boolean => {
  const piece = boardState.find((p) => p.samePosition(position));

  if (piece) {
    return true;
  } else {
    return false;
  }
};

export const tileIsOccupiedbyOpponent = (position: Position, boardState: Piece[], team: TeamType): boolean => {
  const piece = boardState.find((p) => p.samePosition(position) && p.team !== team);
  if (piece) {
    return true;
  } else {
    return false;
  }
};

export const tileIsEmptyorOccupiedByOpponent = (position: Position, boardState: Piece[], team: TeamType) => {
  return !tileIsOccupied(position, boardState) || tileIsOccupiedbyOpponent(position, boardState, team);
};
