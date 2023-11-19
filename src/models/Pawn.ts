import { ChessPieceType, TeamType } from "../Types";
import { Piece } from "./Piece";
import { Position } from "./Position";

//* Inheritance
// (Piece --> Base Class; Pawn --> Derived Class)
export class Pawn extends Piece {
  enPassant?: boolean;

  constructor(posn: Position, team: TeamType) {
    super(posn, ChessPieceType.PAWN, team);
  }
}
