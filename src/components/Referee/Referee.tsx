import { useEffect, useRef, useState } from "react";
import { initialBoardState } from "../../Constants";
import Chessboard from "../Chessboard/Chessboard";
import {
  bishopMove,
  getPossibleforBishopMoves,
  getPossibleforKingMoves,
  getPossibleforKnightMoves,
  getPossibleforPawnMoves,
  getPossibleforQueenMoves,
  getPossibleforRookMoves,
  kingMove,
  knightMove,
  pawnMove,
  queenMove,
  rookMove,
} from "../../referee/rules";
import { Piece } from "../../models/Piece";
import { Position } from "../../models/Position";
import { ChessPieceType, TeamType } from "../../Types";
import { Pawn } from "../../models/Pawn";

export default function Referee() {
  const [pieces, setPieces] = useState<Piece[]>(initialBoardState);
  const [promotionPawn, setPromoted] = useState<Piece>();
  const modalReferee = useRef<HTMLDivElement>(null);

  useEffect(() => {
    updatePossibleMoves();
  }, []);

  let updatePossibleMoves = () => {
    setPieces((thisPiece) => {
      return thisPiece.map((p) => {
        p.possibleMoves = getValidMoves(p, thisPiece);
        return p;
      });
    });
  };

  let playMove = (playedPiece: Piece, destination: Position): boolean => {
    let ok = true;
    const validMove = isValidMove(playedPiece.position, destination, playedPiece.type, playedPiece.team);

    // Reduce funtion
    // Results => Array of results
    // Piece => a current piece we are handling

    const enPassantMove = isPassantMove(playedPiece.position, destination, playedPiece.type, playedPiece.team);

    const pawnDirection = playedPiece.team === TeamType.OUR ? 1 : 1;

    if (enPassantMove) {
      const updatedPieces = pieces.reduce((results, piece) => {
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

      updatePossibleMoves();
      setPieces(updatedPieces);
    } else if (validMove) {
      // Updates the piece posn, If a piece is attacked, remove it
      const updatedPieces = pieces.reduce((results, piece) => {
        if (piece.samePiecePosition(playedPiece)) {
          //Special Move
          if (piece.isPawn) {
            (piece as Pawn).enPassant =
              Math.abs(playedPiece.position.y - destination.y) === 2 && piece.type === ChessPieceType.PAWN;
          }
          piece.position.x = destination.x;
          piece.position.y = destination.y;

          let promoted = piece.team === TeamType.OUR ? 7 : 0;

          if (destination.y === promoted && piece.type === ChessPieceType.PAWN) {
            modalReferee.current?.classList.remove("hidden");
            setPromoted(piece);
          }

          results.push(piece);
        } else if (!piece.samePosition(new Position(destination.x, destination.y))) {
          if (piece.isPawn) {
            (piece as Pawn).enPassant = false;
          }
          results.push(piece);
        }

        return results;
      }, [] as Piece[]);

      updatePossibleMoves();
      setPieces(updatedPieces);

      /*                    setPieces((value) => 
              {
                  const pieces = value.reduce((results, piece) =>
                  {
                      if (piece.x === thisPiece.x && piece.y === thisPiece.y)
                      {
                          piece.x = x
                          piece.y = y
                          results.push(piece);
                      }
                      else if (!(piece.x === x && piece.y === y))
                      {
                          results.push(piece)
                      }

                      return results
                  }, [] as Piece[])  

                  return pieces 
              }) 
*/
    } else {
      // resets the pieces posn
      ok = false;
    }
    return ok;
  };
  let isPassantMove = (initialPosn: Position, desiredPosn: Position, type: ChessPieceType, team: TeamType) => {
    const pawnDirection = team === TeamType.OUR ? 1 : 1;

    if (type === ChessPieceType.PAWN) {
      if (
        (desiredPosn.x - initialPosn.x === -1 || desiredPosn.x - initialPosn.x === 1) &&
        desiredPosn.y - initialPosn.y === pawnDirection
      ) {
        const piece = pieces.find(
          (p) =>
            p.position.x === desiredPosn.x &&
            p.position.y === desiredPosn.y - pawnDirection &&
            p.isPawn &&
            (p as Pawn).enPassant
        );

        if (piece) {
          return true;
        }
      }
    }

    // If a piece is under or above the attacked title.
    // Upper left / upper right || bottom left / bottom right DONE
    // If the attacked piece has made an en passant move in the previous turn
    // IF the attacking piece is pawn

    //Put piece in correct position
    //Remove en passen

    return false;
  };

  let isValidMove = (initialPosn: Position, desiredPosn: Position, type: ChessPieceType, team: TeamType) => {
    // console.log("Referee is checking the move...")
    // console.log(`Previous location: (${px}.${py})`)
    // console.log(`Current location: (${x}.${y})`)
    // console.log(`Piece location: (${type})`)
    // console.log(`Team Type: ${team}`)

    let ok = false;
    switch (type) {
      case ChessPieceType.PAWN:
        ok = pawnMove(initialPosn, desiredPosn, team, pieces);
        break;
      case ChessPieceType.KNIGHT:
        ok = knightMove(initialPosn, desiredPosn, team, pieces);
        break;
      case ChessPieceType.BISHOP:
        ok = bishopMove(initialPosn, desiredPosn, team, pieces);
        break;
      case ChessPieceType.ROOK:
        ok = rookMove(initialPosn, desiredPosn, team, pieces);
        break;
      case ChessPieceType.QUEEN:
        ok = queenMove(initialPosn, desiredPosn, team, pieces);
        break;
      case ChessPieceType.KING:
        ok = kingMove(initialPosn, desiredPosn, team, pieces);
        break;
    }
    return ok;
  };

  let getValidMoves = (piece: Piece, boardState: Piece[]): Position[] => {
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
  };

  let promotePawn = (pieceType: ChessPieceType) => {
    if (promotionPawn === undefined) {
      return;
    }

    const updatedPieces = pieces.reduce((results, piece) => {
      if (piece.samePiecePosition(promotionPawn)) {
        piece.type = pieceType;
        const teamType = piece.team === TeamType.OUR ? "w" : "b";
        let pieceisChosen = "";

        switch (pieceType) {
          case ChessPieceType.ROOK: {
            pieceisChosen = "rook";
            break;
          }
          case ChessPieceType.BISHOP: {
            pieceisChosen = "bishop";
            break;
          }
          case ChessPieceType.KNIGHT: {
            pieceisChosen = "knight";
            break;
          }
          case ChessPieceType.QUEEN: {
            pieceisChosen = "queen";
            break;
          }
        }

        piece.image = `assets/images/${pieceisChosen}_${teamType}.png`;
      }
      results.push(piece);
      return results;
    }, [] as Piece[]);

    updatePossibleMoves();
    setPieces(updatedPieces);

    modalReferee.current?.classList.add("hidden");
  };

  let promotionTeamType = () => {
    return promotionPawn?.team === TeamType.OUR ? "w" : "b";
  };

  return (
    <>
      <div id="pawn-promotion" className="hidden" ref={modalReferee}>
        <div className="modal">
          <h1>Select one</h1>
          <img
            onClick={() => promotePawn(ChessPieceType.ROOK)}
            src={`/assets/images/rook_${promotionTeamType()}.png`}
            alt=""
          />
          <img
            onClick={() => promotePawn(ChessPieceType.BISHOP)}
            src={`/assets/images/bishop_${promotionTeamType()}.png`}
            alt=""
          />
          <img
            onClick={() => promotePawn(ChessPieceType.KNIGHT)}
            src={`/assets/images/knight_${promotionTeamType()}.png`}
            alt=""
          />
          <img
            onClick={() => promotePawn(ChessPieceType.QUEEN)}
            src={`/assets/images/queen_${promotionTeamType()}.png`}
            alt=""
          />
        </div>
      </div>
      <Chessboard playMove={playMove} pieces={pieces} />
    </>
  );
}
