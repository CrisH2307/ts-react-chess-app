export class Position {
  x: number;
  y: number;

  constructor(horizontal: number, vertical: number) {
    this.x = horizontal;
    this.y = vertical;
  }

  samePosition(that: Position): boolean {
    return this.x === that.x && this.y === that.y;
  }
}
