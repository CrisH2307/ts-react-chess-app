import { ChessPieceType, TeamType } from "./Types";
import { Piece, Position } from "./models";
import { Board } from "./models/Board";
import { Pawn } from "./models/Pawn";

export const VERTICAL_AXIS = ["1", "2", "3", "4", "5", "6", "7", "8"];
export const HORIZONTAL_AXIS = ["a", "b", "c", "d", "e", "f", "g", "h"];

export const GRID_SIZE = 100;

// export function samePosition(p1: Position, p2: Position) {
//   return p1.x === p2.x && p1.y === p2.y;
// }

export const initialBoard: Board = new Board(
  [
    //* Black Pieces
    new Piece(new Position(0, 7), ChessPieceType.ROOK, TeamType.OPPONENT),
    new Piece(new Position(1, 7), ChessPieceType.KNIGHT, TeamType.OPPONENT),
    new Piece(new Position(2, 7), ChessPieceType.BISHOP, TeamType.OPPONENT),
    new Piece(new Position(3, 7), ChessPieceType.QUEEN, TeamType.OPPONENT),
    new Piece(new Position(4, 7), ChessPieceType.KING, TeamType.OPPONENT),
    new Piece(new Position(5, 7), ChessPieceType.BISHOP, TeamType.OPPONENT),
    new Piece(new Position(6, 7), ChessPieceType.KNIGHT, TeamType.OPPONENT),
    new Piece(new Position(7, 7), ChessPieceType.ROOK, TeamType.OPPONENT),
    new Pawn(new Position(0, 6), TeamType.OPPONENT),
    new Pawn(new Position(1, 6), TeamType.OPPONENT),
    new Pawn(new Position(2, 6), TeamType.OPPONENT),
    new Pawn(new Position(3, 6), TeamType.OPPONENT),
    new Pawn(new Position(4, 6), TeamType.OPPONENT),
    new Pawn(new Position(5, 6), TeamType.OPPONENT),
    new Pawn(new Position(6, 6), TeamType.OPPONENT),
    new Pawn(new Position(7, 6), TeamType.OPPONENT),

    //* White Pieces
    new Piece(new Position(0, 0), ChessPieceType.ROOK, TeamType.OUR),
    new Piece(new Position(1, 0), ChessPieceType.KNIGHT, TeamType.OUR),
    new Piece(new Position(2, 0), ChessPieceType.BISHOP, TeamType.OUR),
    new Piece(new Position(3, 0), ChessPieceType.QUEEN, TeamType.OUR),
    new Piece(new Position(4, 0), ChessPieceType.KING, TeamType.OUR),
    new Piece(new Position(5, 0), ChessPieceType.BISHOP, TeamType.OUR),
    new Piece(new Position(6, 0), ChessPieceType.KNIGHT, TeamType.OUR),
    new Piece(new Position(7, 0), ChessPieceType.ROOK, TeamType.OUR),
    new Pawn(new Position(0, 1), TeamType.OUR),
    new Pawn(new Position(1, 1), TeamType.OUR),
    new Pawn(new Position(2, 1), TeamType.OUR),
    new Pawn(new Position(3, 1), TeamType.OUR),
    new Pawn(new Position(4, 1), TeamType.OUR),
    new Pawn(new Position(5, 1), TeamType.OUR),
    new Pawn(new Position(6, 1), TeamType.OUR),
    new Pawn(new Position(7, 1), TeamType.OUR),
  ],
  1
);
