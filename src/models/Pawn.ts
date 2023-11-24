import { ChessPieceType, TeamType } from "../Types";
import { Piece } from "./Piece";
import { Position } from "./Position";

//* Inheritance
// (Piece --> Base Class; Pawn --> Derived Class)
export class Pawn extends Piece {
  enPassant?: boolean;

  constructor(posn: Position, team: TeamType, enPassant?: boolean, possibleMoves: Position[] = []) {
    super(posn, ChessPieceType.PAWN, team, possibleMoves);
    this.enPassant = enPassant;
  }

  clone(): Pawn {
    return new Pawn(
      this.position.clone(),
      this.team,
      this.enPassant,
      this.possibleMoves?.map((that) => that.clone())
    );
  }
}
