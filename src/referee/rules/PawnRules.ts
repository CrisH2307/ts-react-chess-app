import { TeamType } from "../../Types";
import { Piece, Position } from "../../models";
import { Pawn } from "../../models/Pawn";

import { tileIsOccupied, tileIsOccupiedbyOpponent } from "./GeneralRules";

export const pawnMove = (
  initialPosn: Position,
  desiredPosn: Position,
  team: TeamType,
  boardState: Piece[]
): boolean => {
  //? PAWN MOVEMENT
  const specialRow = team === TeamType.OUR ? 1 : 6;
  const pawnDirection = team === TeamType.OUR ? 1 : -1;

  //* MOVEMENT LOGIC
  if (
    initialPosn.x === desiredPosn.x &&
    initialPosn.y === specialRow &&
    desiredPosn.y - initialPosn.y === 2 * pawnDirection
  ) {
    if (
      !tileIsOccupied(desiredPosn, boardState) &&
      !tileIsOccupied(new Position(desiredPosn.x, desiredPosn.y - pawnDirection), boardState)
    ) {
      return true;
    }
  } else if (initialPosn.x === desiredPosn.x && desiredPosn.y - initialPosn.y === pawnDirection) {
    if (!tileIsOccupied(desiredPosn, boardState)) {
      return true;
    }
  }

  //* ATTACK LOGIC
  else if (desiredPosn.x - initialPosn.x === -1 && desiredPosn.y - initialPosn.y === pawnDirection) {
    //Attack in upper or bottom left corner

    if (tileIsOccupiedbyOpponent(desiredPosn, boardState, team)) {
      return true;
    }
  } else if (desiredPosn.x - initialPosn.x === 1 && desiredPosn.y - initialPosn.y === pawnDirection) {
    if (tileIsOccupiedbyOpponent(desiredPosn, boardState, team)) {
      return true;
    }
  }
  return false;
};

export const getPossibleforPawnMoves = (pawn: Piece, boardState: Piece[]): Position[] => {
  const possibleMoves: Position[] = [];
  const specialRow = pawn.team === TeamType.OUR ? 1 : 6;
  const pawnDirection = pawn.team === TeamType.OUR ? 1 : -1;
  const normalMove: Position = new Position(pawn.position.x, pawn.position.y + pawnDirection);
  const specialMove: Position = new Position(normalMove.x, normalMove.y + pawnDirection);
  const upperLeftAttack: Position = new Position(pawn.position.x - 1, pawn.position.y + pawnDirection);
  const upperRightAttack: Position = new Position(pawn.position.x + 1, pawn.position.y + pawnDirection);
  const leftPosition: Position = new Position(pawn.position.x - 1, pawn.position.y);
  const rightPosition: Position = new Position(pawn.position.x + 1, pawn.position.y);

  if (!tileIsOccupied(normalMove, boardState)) {
    possibleMoves.push(normalMove);

    if (pawn.position.y === specialRow && !tileIsOccupied(specialMove, boardState)) {
      possibleMoves.push(specialMove);
    }
  }
  if (tileIsOccupiedbyOpponent(upperLeftAttack, boardState, pawn.team)) {
    possibleMoves.push(upperLeftAttack);
  } else if (!tileIsOccupied(upperLeftAttack, boardState)) {
    const leftPiece = boardState.find((p) => p.samePosition(leftPosition));
    if (leftPiece != null && (leftPiece as Pawn).enPassant) {
      possibleMoves.push(upperLeftAttack);
    }
  }

  if (tileIsOccupiedbyOpponent(upperRightAttack, boardState, pawn.team)) {
    possibleMoves.push(upperRightAttack);
  } else if (!tileIsOccupied(upperRightAttack, boardState)) {
    const rightPiece = boardState.find((p) => p.samePosition(rightPosition));
    if (rightPiece != null && (rightPiece as Pawn).enPassant) {
      possibleMoves.push(upperRightAttack);
    }
  }
  return possibleMoves;
};
