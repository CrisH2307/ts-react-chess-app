import { TeamType } from "../../Types";
import { Piece, Position } from "../../models";

import { tileIsEmptyorOccupiedByOpponent, tileIsOccupied, tileIsOccupiedbyOpponent } from "./GeneralRules";

export const bishopMove = (
  initialPosn: Position,
  desiredPosn: Position,
  team: TeamType,
  boardState: Piece[]
): boolean => {
  //? BISHOP
  //* Bishop's movements and logics

  for (let i = 1; i < 8; ++i) {
    //* Top right + Illegal
    if (desiredPosn.x > initialPosn.x && desiredPosn.y > initialPosn.y) {
      let passedPosn: Position = new Position(initialPosn.x + i, initialPosn.y + i);

      //* Check if the tile is the destination tile, if yes -> Deal with destination tile; else -> Deal with passing tile
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

    //* Bottom right + Illegal
    if (desiredPosn.x > initialPosn.x && desiredPosn.y < initialPosn.y) {
      let passedPosn: Position = new Position(initialPosn.x + i, initialPosn.y - i);
      //* Check if the tile is the destination tile, if yes -> Deal with destination tile; else -> Deal with passing tile
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
    //* Bottom left + illegal
    if (desiredPosn.x < initialPosn.x && desiredPosn.y < initialPosn.y) {
      let passedPosn: Position = new Position(initialPosn.x - i, initialPosn.y - i);
      //* Check if the tile is the destination tile, if yes -> Deal with destination tile; else -> Deal with passing tile
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

    //* Top left + illegal
    if (desiredPosn.x < initialPosn.x && desiredPosn.y > initialPosn.y) {
      let passedPosn: Position = new Position(initialPosn.x - i, initialPosn.y + i);

      //* Check if the tile is the destination tile, if yes -> Deal with destination tile; else -> Deal with passing tile
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

export const getPossibleforBishopMoves = (bishop: Piece, boardState: Piece[]): Position[] => {
  const possibleMoves: Position[] = [];

  //Upper right
  for (let i = 1; i < 8; ++i) {
    const destination: Position = new Position(bishop.position.x + i, bishop.position.y + i);

    if (!tileIsOccupied(destination, boardState)) {
      possibleMoves.push(destination);
    } else if (tileIsOccupiedbyOpponent(destination, boardState, bishop.team)) {
      possibleMoves.push(destination);
      break;
    } else {
      break;
    }
  }

  //Bottom right
  for (let i = 1; i < 8; ++i) {
    const destination: Position = new Position(bishop.position.x + i, bishop.position.y - i);

    if (!tileIsOccupied(destination, boardState)) {
      possibleMoves.push(destination);
    } else if (tileIsOccupiedbyOpponent(destination, boardState, bishop.team)) {
      possibleMoves.push(destination);
      break;
    } else {
      break;
    }
  }

  //Upper left
  for (let i = 1; i < 8; ++i) {
    const destination: Position = new Position(bishop.position.x - i, bishop.position.y + i);

    if (!tileIsOccupied(destination, boardState)) {
      possibleMoves.push(destination);
    } else if (tileIsOccupiedbyOpponent(destination, boardState, bishop.team)) {
      possibleMoves.push(destination);
      break;
    } else {
      break;
    }
  }

  //Bottom left
  for (let i = 1; i < 8; ++i) {
    const destination: Position = new Position(bishop.position.x - i, bishop.position.y - i);

    if (!tileIsOccupied(destination, boardState)) {
      possibleMoves.push(destination);
    } else if (tileIsOccupiedbyOpponent(destination, boardState, bishop.team)) {
      possibleMoves.push(destination);
      break;
    } else {
      break;
    }
  }

  return possibleMoves;
};
