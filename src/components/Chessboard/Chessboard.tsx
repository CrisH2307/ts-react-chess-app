import { useRef, useState } from "react";
import "./Chessboard.css";
import Tile from "../Tile/Tile";
import { VERTICAL_AXIS, HORIZONTAL_AXIS, GRID_SIZE } from "../../Constants";
import { Piece, Position } from "../../models";

interface Props {
  playMove: (piece: Piece, position: Position) => boolean;
  pieces: Piece[];
}

export default function Chessboard({ playMove, pieces }: Props) {
  const [activePiece, setActivePiece] = useState<HTMLElement | null>(null);

  const [grabPosn, setGrabPosn] = useState<Position>(new Position(-1, -1));
  const chessboardRef = useRef<HTMLDivElement>(null);

  //-------------------- Grab a chess piece ---------------------------//
  let grabPiece = (e: React.MouseEvent) => {
    const element = e.target as HTMLElement;
    const chessboard = chessboardRef.current;
    if (element.classList.contains("chess-piece") && chessboard) {
      const grabX = Math.floor((e.clientX - chessboard.offsetLeft) / 100);
      const grabY = Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - 800) / 100));

      setGrabPosn(new Position(grabX, grabY));

      const x = e.clientX - GRID_SIZE / 2;
      const y = e.clientY - GRID_SIZE / 2;
      element.style.position = "absolute";
      element.style.left = `${x}px`;
      element.style.top = `${y}px`;

      setActivePiece(element);
    }
  };

  //---------------------- Move a chess piece ----------------------//
  let movePiece = (e: React.MouseEvent) => {
    const chessboard = chessboardRef.current;
    if (activePiece && chessboard) {
      const maxX = chessboard.offsetLeft + chessboard.clientWidth - 75;
      const maxY = chessboard.offsetTop + chessboard.clientHeight - 75;
      const minX = chessboard.offsetLeft - 25;
      const minY = chessboard.offsetTop - 25;
      const x = e.clientX - 50;
      const y = e.clientY - 50;

      activePiece.style.position = "absolute";

      if (x < minX) activePiece.style.left = `${minX}px`;
      else if (x > maxX) activePiece.style.left = `${maxX}px`;
      else activePiece.style.left = `${x}px`;

      if (y < minY) activePiece.style.top = `${minY}px`;
      else if (y > maxY) activePiece.style.top = `${maxY}px`;
      else activePiece.style.top = `${y}px`;
    }
  };

  //---------------------- Drop a chess piece ----------------------//
  let dropPiece = (e: React.MouseEvent) => {
    const chessboard = chessboardRef.current;
    if (activePiece && chessboard) {
      const x = Math.floor((e.clientX - chessboard.offsetLeft) / GRID_SIZE);
      const y = Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - 800) / GRID_SIZE));

      const thisPiece = pieces.find((p) => p.samePosition(grabPosn));
      //const eatPiece = pieces.find(p => p.position.x === grabPosn.x && p.position.y === grabPosn.y)

      // Current piece (3, 4)
      // Current piece (4, 3)
      if (thisPiece) {
        var success = playMove(thisPiece, new Position(x, y));

        if (!success) {
          activePiece.style.position = "relative";
          activePiece.style.removeProperty("top");
          activePiece.style.removeProperty("left");
        }
      }

      setActivePiece(null);
    }
  };

  let board = [];

  for (let j = VERTICAL_AXIS.length - 1; j >= 0; j--) {
    for (let i = 0; i < HORIZONTAL_AXIS.length; i++) {
      const boardNum = j + i + 2;
      const piece = pieces.find((p) => p.samePosition(new Position(i, j)));
      let image = piece ? piece.image : undefined;

      let thisPiece = pieces.find((p) => p.samePosition(grabPosn));

      let highlight = thisPiece?.possibleMoves
        ? thisPiece.possibleMoves.some((p) => p.samePosition(new Position(i, j)))
        : false;

      board.push(<Tile key={`${j},${i}`} image={image} number={boardNum} highlight={highlight} />);
    }
  }

  return (
    <>
      <div
        onMouseMove={(e) => movePiece(e)}
        onMouseDown={(e) => grabPiece(e)}
        onMouseUp={(e) => dropPiece(e)}
        className="chessboard"
        ref={chessboardRef}>
        {board}
      </div>
    </>
  );
}
