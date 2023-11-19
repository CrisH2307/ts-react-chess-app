import { TeamType } from "../../Types";
import { Piece, Position } from "../../models";

import { tileIsEmptyorOccupiedByOpponent, tileIsOccupied, tileIsOccupiedbyOpponent } from "./GeneralRules";

export const queenMove = (
  initialPosn: Position,
  desiredPosn: Position,
  team: TeamType,
  boardState: Piece[]
): boolean => {
  for (let i = 1; i < 8; ++i) {
    //Diagonal
    let XAxis;
    if (desiredPosn.x < initialPosn.x) {
      XAxis = -1;
    } else if (desiredPosn.x > initialPosn.x) {
      XAxis = 1;
    } else {
      XAxis = 0;
    }

    let YAxis;
    if (desiredPosn.y < initialPosn.y) {
      YAxis = -1;
    } else if (desiredPosn.y > initialPosn.y) {
      YAxis = 1;
    } else {
      YAxis = 0;
    }

    let passedPosn: Position = new Position(initialPosn.x + i * XAxis, initialPosn.y + i * YAxis);
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
  return false;
};

export const getPossibleforQueenMoves = (queen: Piece, boardState: Piece[]): Position[] => {
  const possibleMoves: Position[] = [];
  //Top
  for (let i = 1; i < 8; ++i) {
    const destination: Position = new Position(queen.position.x, queen.position.y + i);

    if (!tileIsOccupied(destination, boardState)) {
      possibleMoves.push(destination);
    } else if (tileIsOccupiedbyOpponent(destination, boardState, queen.team)) {
      possibleMoves.push(destination);
      break;
    } else {
      break;
    }
  }

  //Bottom
  for (let i = 1; i < 8; ++i) {
    const destination: Position = new Position(queen.position.x, queen.position.y - i);

    if (!tileIsOccupied(destination, boardState)) {
      possibleMoves.push(destination);
    } else if (tileIsOccupiedbyOpponent(destination, boardState, queen.team)) {
      possibleMoves.push(destination);
      break;
    } else {
      break;
    }
  }

  //Left
  for (let i = 1; i < 8; ++i) {
    const destination: Position = new Position(queen.position.x - i, queen.position.y);

    if (!tileIsOccupied(destination, boardState)) {
      possibleMoves.push(destination);
    } else if (tileIsOccupiedbyOpponent(destination, boardState, queen.team)) {
      possibleMoves.push(destination);
      break;
    } else {
      break;
    }
  }

  //right
  for (let i = 1; i < 8; ++i) {
    const destination: Position = new Position(queen.position.x + i, queen.position.y);

    if (!tileIsOccupied(destination, boardState)) {
      possibleMoves.push(destination);
    } else if (tileIsOccupiedbyOpponent(destination, boardState, queen.team)) {
      possibleMoves.push(destination);
      break;
    } else {
      break;
    }
  }

  //Upper right
  for (let i = 1; i < 8; ++i) {
    const destination: Position = new Position(queen.position.x + i, queen.position.y + i);

    if (!tileIsOccupied(destination, boardState)) {
      possibleMoves.push(destination);
    } else if (tileIsOccupiedbyOpponent(destination, boardState, queen.team)) {
      possibleMoves.push(destination);
      break;
    } else {
      break;
    }
  }

  //Bottom right
  for (let i = 1; i < 8; ++i) {
    const destination: Position = new Position(queen.position.x + i, queen.position.y - i);

    if (!tileIsOccupied(destination, boardState)) {
      possibleMoves.push(destination);
    } else if (tileIsOccupiedbyOpponent(destination, boardState, queen.team)) {
      possibleMoves.push(destination);
      break;
    } else {
      break;
    }
  }

  //Upper left
  for (let i = 1; i < 8; ++i) {
    const destination: Position = new Position(queen.position.x - i, queen.position.y + i);

    if (!tileIsOccupied(destination, boardState)) {
      possibleMoves.push(destination);
    } else if (tileIsOccupiedbyOpponent(destination, boardState, queen.team)) {
      possibleMoves.push(destination);
      break;
    } else {
      break;
    }
  }

  //Bottom left
  for (let i = 1; i < 8; ++i) {
    const destination: Position = new Position(queen.position.x - i, queen.position.y - i);

    if (!tileIsOccupied(destination, boardState)) {
      possibleMoves.push(destination);
    } else if (tileIsOccupiedbyOpponent(destination, boardState, queen.team)) {
      possibleMoves.push(destination);
      break;
    } else {
      break;
    }
  }

  return possibleMoves;
};
