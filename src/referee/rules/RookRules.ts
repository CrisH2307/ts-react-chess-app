import { TeamType } from "../../Types";
import { Piece, Position } from "../../models";

import { tileIsEmptyorOccupiedByOpponent, tileIsOccupied, tileIsOccupiedbyOpponent } from "./GeneralRules";

export const rookMove = (
  initialPosn: Position,
  desiredPosn: Position,
  team: TeamType,
  boardState: Piece[]
): boolean => {
  //? ROOK
  if (initialPosn.x === desiredPosn.x) {
    for (let i = 1; i < 8; ++i) {
      let multiplier = desiredPosn.y < initialPosn.y ? -1 : 1;

      let passedPosn: Position = new Position(initialPosn.x, initialPosn.y + i * multiplier);
      if (passedPosn.samePosition(desiredPosn)) {
        if (tileIsEmptyorOccupiedByOpponent(passedPosn, boardState, team)) {
          return true;
        }
      } else {
        if (tileIsOccupied(passedPosn, boardState)) {
          break;
        }
      }
    }
  }

  if (initialPosn.y === desiredPosn.y) {
    for (let i = 1; i < 8; ++i) {
      let multiplier = desiredPosn.x < initialPosn.x ? -1 : 1;

      let passedPosn: Position = new Position(initialPosn.x + i * multiplier, initialPosn.y);
      if (passedPosn.samePosition(desiredPosn)) {
        if (tileIsEmptyorOccupiedByOpponent(passedPosn, boardState, team)) {
          return true;
        }
      } else {
        if (tileIsOccupied(passedPosn, boardState)) {
          break;
        }
      }
    }
  }
  return false;
};

export const getPossibleforRookMoves = (rook: Piece, boardState: Piece[]): Position[] => {
  const possibleMoves: Position[] = [];

  //Top
  for (let i = 1; i < 8; ++i) {
    const destination: Position = new Position(rook.position.x, rook.position.y + i);

    if (!tileIsOccupied(destination, boardState)) {
      possibleMoves.push(destination);
    } else if (tileIsOccupiedbyOpponent(destination, boardState, rook.team)) {
      possibleMoves.push(destination);
      break;
    } else {
      break;
    }
  }

  //Bottom
  for (let i = 1; i < 8; ++i) {
    const destination: Position = new Position(rook.position.x, rook.position.y - i);

    if (!tileIsOccupied(destination, boardState)) {
      possibleMoves.push(destination);
    } else if (tileIsOccupiedbyOpponent(destination, boardState, rook.team)) {
      possibleMoves.push(destination);
      break;
    } else {
      break;
    }
  }

  //Left
  for (let i = 1; i < 8; ++i) {
    const destination: Position = new Position(rook.position.x - i, rook.position.y);

    if (!tileIsOccupied(destination, boardState)) {
      possibleMoves.push(destination);
    } else if (tileIsOccupiedbyOpponent(destination, boardState, rook.team)) {
      possibleMoves.push(destination);
      break;
    } else {
      break;
    }
  }

  //right
  for (let i = 1; i < 8; ++i) {
    const destination: Position = new Position(rook.position.x + i, rook.position.y);

    if (!tileIsOccupied(destination, boardState)) {
      possibleMoves.push(destination);
    } else if (tileIsOccupiedbyOpponent(destination, boardState, rook.team)) {
      possibleMoves.push(destination);
      break;
    } else {
      break;
    }
  }
  return possibleMoves;
};
