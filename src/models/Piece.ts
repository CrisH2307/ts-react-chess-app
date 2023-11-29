//* The Object Oriented Paradigm using TS
/*
This is what I have learned from C++ at Seneca
*/

import { ChessPieceType, TeamType } from "../Types";
import { Position } from "./Position";

export class Piece {
  // private:
  image: string;
  position: Position;
  type: ChessPieceType;
  team: TeamType;
  possibleMoves?: Position[];
  piecehasMoved: boolean;

  // public:
  constructor(posn: Position, type: ChessPieceType, team: TeamType, moved: boolean, possibleMoves: Position[] = []) {
    this.image = `assets/images/${type}_${team}.png`;
    this.position = posn;
    this.type = type;
    this.team = team;
    this.possibleMoves = possibleMoves;
    this.piecehasMoved = moved;
  }

  get isPawn(): boolean {
    return this.type === ChessPieceType.PAWN;
  }

  get isRook(): boolean {
    return this.type === ChessPieceType.ROOK;
  }

  get isBishop(): boolean {
    return this.type === ChessPieceType.BISHOP;
  }

  get isKnight(): boolean {
    return this.type === ChessPieceType.KNIGHT;
  }
  get isQueen(): boolean {
    return this.type === ChessPieceType.QUEEN;
  }
  get isKing(): boolean {
    return this.type === ChessPieceType.KING;
  }

  samePiecePosition(that: Piece): boolean {
    return this.position.samePosition(that.position);
  }

  samePosition(that: Position): boolean {
    return this.position.samePosition(that);
  }

  clone(): Piece {
    return new Piece(
      this.position.clone(),
      this.type,
      this.team,
      this.piecehasMoved,
      this.possibleMoves?.map((that) => that.clone())
    );
  }
}
