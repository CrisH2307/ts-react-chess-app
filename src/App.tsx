/*-----------------------------------------------------------------------------------------//
Project Name: Chess App
Name of Worker: Cris Huynh
Date of Started: April 5th, 2023
Language: ReactJS, JavaScript, HTML, CSS, TypeScript, Java

Objective: Creating a complete chess game in TypeScipt involves multiple components and classes,
including a board representation, pieces, rules and user interaction. This TypeScript code outlines
the basic structure of a chess game. However, a full-fledged chess game would require additional 
functionality for moves, capturing, castling, en passant, check, checkmate, and more. You may also 
want to implement user input for playing the game, such as selecting and moving pieces.
Keep in mind that this is a simplified example, and building a complete chess game is a complex task. 
It might consider using a chess library or framework to handle many of the intricate details and rules
associated with chess.

Journey:
04/05: Built chess from scratch
04/12: Created src, components, tile, referees
04/14: Built apps, index ReactJS
04/27: Create apps, index CSS
05/02: Monthly breakdown: Fixing board alignment, chess colors, pieces colors
05/20: Dragged chess pieces, assets
05/30: Built setup sources, fixing components, alignments
06/10: Export chess apprearance, pawn movements 
06/22: Monthly breakdown, creating and fixing chess interface
07/01: Fixing display, pawn rules movement
07/02: Created referee sources, making rules
07/23: Made pawn attacked logics
08/12: Made attack movement, illegal moves
08/20: Finish En Passant Logic
09/15: Making design
09/20: Demo
09/25: Create Knight movements, logics
09/30: Create Bishop movements, logics
10/03: Create Queen movements, logics
10/07: Create King movements, logics
10/13: Demo 2
10/15: Recreate the file by using Inheriance, Polymorphism, Encapsulation
10/29: Clone the Board, Tile and Component
11/04: Creating Server
11/09: Creatng the game Interface
11/15: Making PawnPromotion logic
11/20: Demo 3
11/25: Checkmate, Winning Team
11/28: Making castling logic
11/29: Final Demo, Push
------------------------------------------------------------------------------------------*/

import "./App.css";
import Chessboard from "./components/Chessboard/Chessboard";
import Referee from "./components/Referee/Referee";

function App() {
  return (
    <div className="app">
      <Referee />
    </div>
  );
}

export default App;
