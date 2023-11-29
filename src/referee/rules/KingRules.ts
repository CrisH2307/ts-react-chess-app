import { ChessPieceType, TeamType } from "../../Types";
import { Piece, Position } from "../../models";

import { tileIsEmptyorOccupiedByOpponent, tileIsOccupied, tileIsOccupiedbyOpponent } from "./GeneralRules";

export const kingMove = (
  initialPosn: Position,
  desiredPosn: Position,
  team: TeamType,
  boardState: Piece[]
): boolean => {
  for (let i = 1; i < 2; ++i) {
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
export const getPossibleforKingMoves = (king: Piece, boardState: Piece[]): Position[] => {
  const possibleMoves: Position[] = [];
  //Top
  for (let i = 1; i < 2; ++i) {
    const destination: Position = new Position(king.position.x, king.position.y + i);

    //Move outside the board, fixure
    if (destination.x < 0 || destination.x > 7 || destination.y < 0 || destination.y > 7) {
      break;
    }
    if (!tileIsOccupied(destination, boardState)) {
      possibleMoves.push(destination);
    } else if (tileIsOccupiedbyOpponent(destination, boardState, king.team)) {
      possibleMoves.push(destination);
      break;
    } else {
      break;
    }
  }

  //Bottom
  for (let i = 1; i < 2; ++i) {
    const destination: Position = new Position(king.position.x, king.position.y - i);
    //Move outside the board, fixure
    if (destination.x < 0 || destination.x > 7 || destination.y < 0 || destination.y > 7) {
      break;
    }
    if (!tileIsOccupied(destination, boardState)) {
      possibleMoves.push(destination);
    } else if (tileIsOccupiedbyOpponent(destination, boardState, king.team)) {
      possibleMoves.push(destination);
      break;
    } else {
      break;
    }
  }

  //Left
  for (let i = 1; i < 2; ++i) {
    const destination: Position = new Position(king.position.x - i, king.position.y);
    //Move outside the board, fixure
    if (destination.x < 0 || destination.x > 7 || destination.y < 0 || destination.y > 7) {
      break;
    }
    if (!tileIsOccupied(destination, boardState)) {
      possibleMoves.push(destination);
    } else if (tileIsOccupiedbyOpponent(destination, boardState, king.team)) {
      possibleMoves.push(destination);
      break;
    } else {
      break;
    }
  }

  //right
  for (let i = 1; i < 2; ++i) {
    const destination: Position = new Position(king.position.x + i, king.position.y);
    //Move outside the board, fixure
    if (destination.x < 0 || destination.x > 7 || destination.y < 0 || destination.y > 7) {
      break;
    }
    if (!tileIsOccupied(destination, boardState)) {
      possibleMoves.push(destination);
    } else if (tileIsOccupiedbyOpponent(destination, boardState, king.team)) {
      possibleMoves.push(destination);
      break;
    } else {
      break;
    }
  }

  //Upper right
  for (let i = 1; i < 2; ++i) {
    const destination: Position = new Position(king.position.x + i, king.position.y + i);
    //Move outside the board, fixure
    if (destination.x < 0 || destination.x > 7 || destination.y < 0 || destination.y > 7) {
      break;
    }
    if (!tileIsOccupied(destination, boardState)) {
      possibleMoves.push(destination);
    } else if (tileIsOccupiedbyOpponent(destination, boardState, king.team)) {
      possibleMoves.push(destination);
      break;
    } else {
      break;
    }
  }

  //Bottom right
  for (let i = 1; i < 2; ++i) {
    const destination: Position = new Position(king.position.x + i, king.position.y - i);
    //Move outside the board, fixure
    if (destination.x < 0 || destination.x > 7 || destination.y < 0 || destination.y > 7) {
      break;
    }
    if (!tileIsOccupied(destination, boardState)) {
      possibleMoves.push(destination);
    } else if (tileIsOccupiedbyOpponent(destination, boardState, king.team)) {
      possibleMoves.push(destination);
      break;
    } else {
      break;
    }
  }

  //Upper left
  for (let i = 1; i < 2; ++i) {
    const destination: Position = new Position(king.position.x - i, king.position.y + i);
    //Move outside the board, fixure
    if (destination.x < 0 || destination.x > 7 || destination.y < 0 || destination.y > 7) {
      break;
    }
    if (!tileIsOccupied(destination, boardState)) {
      possibleMoves.push(destination);
    } else if (tileIsOccupiedbyOpponent(destination, boardState, king.team)) {
      possibleMoves.push(destination);
      break;
    } else {
      break;
    }
  }

  //Bottom left
  for (let i = 1; i < 2; ++i) {
    const destination: Position = new Position(king.position.x - i, king.position.y - i);
    //Move outside the board, fixure
    if (destination.x < 0 || destination.x > 7 || destination.y < 0 || destination.y > 7) {
      break;
    }
    if (!tileIsOccupied(destination, boardState)) {
      possibleMoves.push(destination);
    } else if (tileIsOccupiedbyOpponent(destination, boardState, king.team)) {
      possibleMoves.push(destination);
      break;
    } else {
      break;
    }
  }

  return possibleMoves;
};

// Castling/Castle
export const getCastlingMoves = (king: Piece, boardState: Piece[]): Position[] => {
  const possibleMoves: Position[] = [];

  if (king.piecehasMoved) {
    return possibleMoves;
  }

  //Rook:
  const rooks = boardState.filter((p) => p.isRook && p.team === king.team && !p.piecehasMoved);
  for (const rook of rooks) {
    //Determine if we need to go to the right or left side because casting can be both
    const direction = rook.position.x - king.position.x > 0 ? 1 : -1;

    //King posn 4,0 -> added the direction to the x position (direction is -1)
    const adjacentPosn = king.position.clone();
    adjacentPosn.x += direction;

    if (!rook.possibleMoves?.some((m) => m.samePosition(adjacentPosn))) {
      continue;
    }

    // Know that the rook can move the adjacent side of the king
    const conceringTiles = rook.possibleMoves.filter((m) => m.y === king.position.y);

    // Checking if any of the enemy pieces can attack the spaces between the rook and the king
    const enemyPieces = boardState.filter((p) => p.team !== king.team);
    let ok = true;
    for (const enemy of enemyPieces) {
      if (enemy.possibleMoves === undefined) {
        continue;
      }
      for (const move of enemy.possibleMoves) {
        if (conceringTiles.some((t) => t.samePosition(move))) {
          ok = false;
        }

        if (!ok) {
          break;
        }
      }
      if (!ok) {
        break;
      }
    }

    if (!ok) {
      continue;
    }

    // Add it as possible move
    possibleMoves.push(rook.position.clone());
  }

  return possibleMoves;
};
