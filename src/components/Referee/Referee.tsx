import { useRef, useState } from "react";
import { initialBoard } from "../../Constants";
import Chessboard from "../Chessboard/Chessboard";
import { bishopMove, kingMove, knightMove, pawnMove, queenMove, rookMove } from "../../referee/rules";
import { Piece } from "../../models/Piece";
import { Position } from "../../models/Position";
import { ChessPieceType, TeamType } from "../../Types";
import { Pawn } from "../../models/Pawn";
import { Board } from "../../models/Board";

export default function Referee() {
  const [board, setBoard] = useState<Board>(initialBoard.clone());
  const [promotionPawn, setPromoted] = useState<Piece>();
  const modalReferee = useRef<HTMLDivElement>(null);
  const checkmateModalReferee = useRef<HTMLDivElement>(null);

  let playMove = (playedPiece: Piece, destination: Position): boolean => {
    // If thje playing piece doesnt have any moves return
    if (playedPiece.possibleMoves === undefined) return false;

    //Preventing the inactive move
    if (playedPiece.team === TeamType.OUR && board.totalTurns % 2 !== 1) {
      return false;
    }
    if (playedPiece.team === TeamType.OPPONENT && board.totalTurns % 2 !== 0) {
      return false;
    }
    let playedMoveIsValid = false;

    const validMove = playedPiece.possibleMoves?.some((m) => m.samePosition(destination));

    if (!validMove) return false;

    // Reduce funtion
    // Results => Array of results
    // Piece => a current piece we are handling

    const enPassantMove = isPassantMove(playedPiece.position, destination, playedPiece.type, playedPiece.team);

    // playMove modifies the board thus we need to call setBoard
    setBoard(() => {
      const clonedBoard = board.clone();
      clonedBoard.totalTurns += 1;
      //Playing the moves
      playedMoveIsValid = clonedBoard.playMove(enPassantMove, validMove, playedPiece, destination);

      if (clonedBoard.winningTeam !== undefined) {
        checkmateModalReferee.current?.classList.remove("hidden");
      }

      return clonedBoard;
    });

    //Promoting a pawn
    let promoted = playedPiece.team === TeamType.OUR ? 7 : 0;

    if (destination.y === promoted && playedPiece.isPawn) {
      modalReferee.current?.classList.remove("hidden");
      setPromoted((previousPromotedPawn) => {
        const clonedPlayedPiece = playedPiece.clone();
        clonedPlayedPiece.position = destination.clone();
        return clonedPlayedPiece;
      });
    }

    return playedMoveIsValid;
  };
  let isPassantMove = (initialPosn: Position, desiredPosn: Position, type: ChessPieceType, team: TeamType) => {
    const pawnDirection = team === TeamType.OUR ? 1 : 1;

    if (type === ChessPieceType.PAWN) {
      if (
        (desiredPosn.x - initialPosn.x === -1 || desiredPosn.x - initialPosn.x === 1) &&
        desiredPosn.y - initialPosn.y === pawnDirection
      ) {
        const piece = board.pieces.find(
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
        ok = pawnMove(initialPosn, desiredPosn, team, board.pieces);
        break;
      case ChessPieceType.KNIGHT:
        ok = knightMove(initialPosn, desiredPosn, team, board.pieces);
        break;
      case ChessPieceType.BISHOP:
        ok = bishopMove(initialPosn, desiredPosn, team, board.pieces);
        break;
      case ChessPieceType.ROOK:
        ok = rookMove(initialPosn, desiredPosn, team, board.pieces);
        break;
      case ChessPieceType.QUEEN:
        ok = queenMove(initialPosn, desiredPosn, team, board.pieces);
        break;
      case ChessPieceType.KING:
        ok = kingMove(initialPosn, desiredPosn, team, board.pieces);
        break;
    }
    return ok;
  };

  let promotePawn = (pieceType: ChessPieceType) => {
    if (promotionPawn === undefined) {
      return;
    }

    setBoard((previousBoard) => {
      const clonedBoard = board.clone();
      clonedBoard.pieces = clonedBoard.pieces.reduce((results, piece) => {
        if (piece.samePiecePosition(promotionPawn)) {
          results.push(new Piece(piece.position.clone(), pieceType, piece.team, true));
        } else {
          results.push(piece);
        }
        return results;
      }, [] as Piece[]);

      clonedBoard.calculateAllMoves();

      return clonedBoard;
    });
    modalReferee.current?.classList.add("hidden");
  };

  let promotionTeamType = () => {
    return promotionPawn?.team === TeamType.OUR ? "w" : "b";
  };

  let restartTheGame = () => {
    checkmateModalReferee.current?.classList.add("hidden");
    setBoard(initialBoard.clone());
  };

  return (
    <>
      <p style={{ color: "white", fontSize: "22px", textAlign: "center", fontWeight: "bold" }}>
        Now is {board.totalTurns % 2 !== 0 ? "White" : "Black"} turn
      </p>
      <div className="modal hidden" ref={modalReferee}>
        <div className="modal-body">
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
      <div className="modal hidden" ref={checkmateModalReferee}>
        <div className="modal-body">
          <div className="checkmate-body">
            <span>The winning team is {board.winningTeam === TeamType.OUR ? "white" : "black"} !! </span>
            <button onClick={restartTheGame}>Play again</button>
          </div>
        </div>
      </div>
      <Chessboard playMove={playMove} pieces={board.pieces} />
    </>
  );
}
