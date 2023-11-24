import { ChessPieceType, TeamType } from "../Types";
import {
  getPossibleforBishopMoves,
  getPossibleforKingMoves,
  getPossibleforKnightMoves,
  getPossibleforPawnMoves,
  getPossibleforQueenMoves,
  getPossibleforRookMoves,
} from "../referee/rules";
import { Pawn } from "./Pawn";
import { Piece } from "./Piece";
import { Position } from "./Position";

export class Board {
  pieces: Piece[];

  constructor(that: Piece[]) {
    this.pieces = that;
  }

  calculateAllMoves() {
    for (const eachPiece of this.pieces) {
      //eachPiece.possibleMoves = getValidMoves(p, thisPiece);
      eachPiece.possibleMoves = this.getValidMoves(eachPiece, this.pieces);
    }
  }

  getValidMoves(piece: Piece, boardState: Piece[]): Position[] {
    switch (piece.type) {
      case ChessPieceType.PAWN:
        return getPossibleforPawnMoves(piece, boardState);
      case ChessPieceType.KNIGHT:
        return getPossibleforKnightMoves(piece, boardState);
      case ChessPieceType.BISHOP:
        return getPossibleforBishopMoves(piece, boardState);
      case ChessPieceType.ROOK:
        return getPossibleforRookMoves(piece, boardState);
      case ChessPieceType.QUEEN:
        return getPossibleforQueenMoves(piece, boardState);
      case ChessPieceType.KING:
        return getPossibleforKingMoves(piece, boardState);
      default:
        return [];
    }
  }

  playMove(enPassantMove: boolean, validMove: boolean, playedPiece: Piece, destination: Position): boolean {
    const pawnDirection = playedPiece.team === TeamType.OUR ? 1 : 1;
    if (enPassantMove) {
      this.pieces = this.pieces.reduce((results, piece) => {
        if (piece.samePiecePosition(playedPiece)) {
          if (piece.isPawn) (piece as Pawn).enPassant = false;
          piece.position.x = destination.x;
          piece.position.y = destination.y;
          results.push(piece);
        } else if (!piece.samePosition(new Position(destination.x, destination.y - pawnDirection))) {
          if (piece.isPawn) {
            (piece as Pawn).enPassant = false;
          }
          results.push(piece);
        }
        return results;
      }, [] as Piece[]);

      this.calculateAllMoves();
    } else if (validMove) {
      // Updates the piece posn, If a piece is attacked, remove it
      this.pieces = this.pieces.reduce((results, piece) => {
        // The piece that we are moving
        if (piece.samePiecePosition(playedPiece)) {
          //Special Move
          if (piece.isPawn) {
            (piece as Pawn).enPassant =
              Math.abs(playedPiece.position.y - destination.y) === 2 && piece.type === ChessPieceType.PAWN;
          }
          piece.position.x = destination.x;
          piece.position.y = destination.y;

          results.push(piece);
        } else if (!piece.samePosition(destination)) {
          if (piece.isPawn) {
            (piece as Pawn).enPassant = false;
          }
          results.push(piece);
        }
        // Piece at the destination will not be pushed into the result

        return results;
      }, [] as Piece[]);
      this.calculateAllMoves();
    } else {
      // resets the pieces posn
      return false;
    }
    return true;
  }

  clone(): Board {
    return new Board(
      this.pieces.map((that) => {
        return that.clone();
      })
    );
  }
}
