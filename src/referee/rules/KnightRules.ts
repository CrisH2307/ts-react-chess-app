import { TeamType } from "../../Types";
import { Piece, Position } from "../../models";

import { tileIsEmptyorOccupiedByOpponent } from "./GeneralRules";

export const knightMove = (
  initialPosn: Position,
  desiredPosn: Position,
  team: TeamType,
  boardState: Piece[]
): boolean => {
  //? KNIGHT
  //* MOVING LOGIC FOR THE KNIGHT (8 different moving patterns)
  for (let i = -1; i < 2; i += 2) {
    for (let j = -1; j < 2; j += 2) {
      //* Moving at the top/bottom
      if (desiredPosn.y - initialPosn.y === 2 * i) {
        if (desiredPosn.x - initialPosn.x === j) {
          if (tileIsEmptyorOccupiedByOpponent(desiredPosn, boardState, team)) {
            return true;
          }
        }
      }

      //* Moving at the right/left
      if (desiredPosn.x - initialPosn.x === 2 * i) {
        if (desiredPosn.y - initialPosn.y === j) {
          if (tileIsEmptyorOccupiedByOpponent(desiredPosn, boardState, team)) {
            return true;
          }
        }
      }
    }
  }
  return false;
};

export const getPossibleforKnightMoves = (knight: Piece, boardState: Piece[]): Position[] => {
  const possibleMoves: Position[] = [];
  for (let i = -1; i < 2; i += 2) {
    for (let j = -1; j < 2; j += 2) {
      const verticalMove: Position = new Position(knight.position.x + j, knight.position.y + i * 2);
      const horizontalMove: Position = new Position(knight.position.x + i * 2, knight.position.y + j);

      if (tileIsEmptyorOccupiedByOpponent(verticalMove, boardState, knight.team)) {
        possibleMoves.push(verticalMove);
      }
      if (tileIsEmptyorOccupiedByOpponent(horizontalMove, boardState, knight.team)) {
        possibleMoves.push(horizontalMove);
      }
    }
  }

  return possibleMoves;
};
