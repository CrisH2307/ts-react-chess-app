import { ChessPieceType, TeamType } from "../Types";
import {
  getPossibleforBishopMoves,
  getPossibleforKingMoves,
  getPossibleforKnightMoves,
  getPossibleforPawnMoves,
  getPossibleforQueenMoves,
  getPossibleforRookMoves,
  getCastlingMoves,
} from "../referee/rules";
import { Pawn } from "./Pawn";
import { Piece } from "./Piece";
import { Position } from "./Position";

export class Board {
  pieces: Piece[];
  totalTurns: number;
  winningTeam?: TeamType;

  constructor(that: Piece[], theTurns: number) {
    this.pieces = that;
    this.totalTurns = theTurns;
  }

  get currentTeamType(): TeamType {
    if (this.totalTurns % 2 === 0) {
      return TeamType.OPPONENT;
    } else {
      return TeamType.OUR;
    }
  }

  calculateAllMoves() {
    for (const eachPiece of this.pieces) {
      //eachPiece.possibleMoves = getValidMoves(p, thisPiece);
      // This will calculate the moves all the pieces
      eachPiece.possibleMoves = this.getValidMoves(eachPiece, this.pieces);
    }

    // Castling / Castle
    for (const king of this.pieces.filter((p) => p.isKing)) {
      if (king.possibleMoves === undefined) {
        continue;
      }
      king.possibleMoves = [...king.possibleMoves, ...getCastlingMoves(king, this.pieces)];
    }

    // Check if the current moves are valid
    this.checkCurrentTeamMoves();

    // Remove the possible moves for the team that is not played
    for (const piece of this.pieces.filter((p) => p.team !== this.currentTeamType)) {
      piece.possibleMoves = [];
    }

    //const possibleMoves = this.pieces.filter((p) => p.team === this.currentTeamType).map((p) => p.possibleMoves);

    // Check if the playing team still have some moves left, else Checkmate
    if (
      this.pieces
        .filter((p) => p.team === this.currentTeamType)
        .some((p) => p.possibleMoves !== undefined && p.possibleMoves.length > 0)
    ) {
      return;
    }
    this.winningTeam = this.currentTeamType === TeamType.OUR ? TeamType.OPPONENT : TeamType.OUR;
  }
  /*
  checkKingMoves() {
    // King of the currently playing team
    const king = this.pieces.find((p) => p.isKing && p.team === this.currentTeamType);

    if (king?.possibleMoves === undefined) return;

    for (const move of king.possibleMoves) {
      const simulatedBoard = this.clone();

      // If there is a piece at the destination -> remove it
      const pieceAtDestination = simulatedBoard.pieces.find((p) => p.samePosition(move));
      if (pieceAtDestination !== undefined) {
        simulatedBoard.pieces = simulatedBoard.pieces.filter((p) => !p.samePosition(move));
      }

      // King has to be presented
      const simulatedKing = simulatedBoard.pieces.find((p) => p.isKing && p.team === simulatedBoard.currentTeamType);
      simulatedKing!.position = move;

      for (const enemy of simulatedBoard.pieces.filter((p) => p.team === simulatedBoard.currentTeamType)) {
        enemy.possibleMoves = simulatedBoard.getValidMoves(enemy, simulatedBoard.pieces);
      }

      //Now we will solve with checkmate
      let checkmate = false;

      // If no checkmate, safe
      for (const check of simulatedBoard.pieces) {
        if (check.team === simulatedBoard.currentTeamType) {
          continue;
        }
        if (check.isPawn) {
          const possiblePawnMoves = simulatedBoard.getValidMoves(check, simulatedBoard.pieces);
          if (possiblePawnMoves?.some((p) => p.x !== check.position.x && p.samePosition(move))) {
            checkmate = true;
            break;
          }
        } else if (check.possibleMoves?.some((p) => p.samePosition(move))) {
          checkmate = true;
          break;
        }
      }

      // IF checkmate, danger  -> Remove the move from possibleMoves
      if (checkmate) {
        king.possibleMoves = king.possibleMoves?.filter((m) => !m.samePosition(move));
      }
    }
  } */

  checkCurrentTeamMoves() {
    // Loop through all the current team's pieces
    for (const piece of this.pieces.filter((p) => p.team === this.currentTeamType)) {
      if (piece.possibleMoves === undefined) {
        continue;
      }
      // Simulate all the moves
      for (const move of piece.possibleMoves) {
        const simulatedBoard = this.clone();

        // Remove the piece at the destination posn
        simulatedBoard.pieces = simulatedBoard.pieces.filter((p) => !p.samePosition(move));

        // Get the piece of the cloned board
        const clonedPiece = simulatedBoard.pieces.find((p) => p.samePiecePosition(piece))!;
        clonedPiece.position = move.clone();

        // Get the king of the cloned board
        const clonedKing = simulatedBoard.pieces.find((p) => p.isKing && p.team === this.currentTeamType)!;

        // Now We are gonna loop all enemy piece, update possible moves. Check if there will be checkmate
        for (const enemy of simulatedBoard.pieces.filter((p) => p.team !== simulatedBoard.currentTeamType)) {
          enemy.possibleMoves = simulatedBoard.getValidMoves(enemy, simulatedBoard.pieces);

          if (enemy.isPawn) {
            if (enemy.possibleMoves.some((m) => m.x !== enemy.position.x && m.samePosition(clonedKing.position))) {
              piece.possibleMoves = piece.possibleMoves?.filter((m) => !m.samePosition(move));
            }
          } else {
            if (enemy.possibleMoves.some((m) => m.samePosition(clonedKing.position))) {
              piece.possibleMoves = piece.possibleMoves?.filter((m) => !m.samePosition(move));
            }
          }
        }
      }
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
    const destinationPiece = this.pieces.find((p) => p.samePosition(destination));

    // If the move is castling move do this
    if (playedPiece.isKing && destinationPiece?.isRook && destinationPiece.team === playedPiece.team) {
      const direction = destinationPiece.position.x - playedPiece.position.x > 0 ? 1 : -1;
      const newKingPosn = playedPiece.position.x + direction * 2;

      this.pieces = this.pieces.map((p) => {
        if (p.samePiecePosition(playedPiece)) {
          p.position.x = newKingPosn;
        } else if (p.samePiecePosition(destinationPiece)) {
          p.position.x = newKingPosn - direction;
        }
        return p;
      });
      this.calculateAllMoves();
      return true;
    }
    if (enPassantMove) {
      this.pieces = this.pieces.reduce((results, piece) => {
        if (piece.samePiecePosition(playedPiece)) {
          if (piece.isPawn) (piece as Pawn).enPassant = false;
          piece.position.x = destination.x;
          piece.position.y = destination.y;
          piece.piecehasMoved = true;
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
          piece.piecehasMoved = true;

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
      this.pieces.map((that) => that.clone()),
      this.totalTurns
    );
  }
}
