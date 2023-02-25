import ConsoleRenderer from './renderer/console/ConsoleRenderer';
import DomRenderer from './renderer/dom/DomRenderer';
import Game from './Game';
import './index.scss';

declare global {
  interface Window {
    game: {
      restartGame(size: number): void;
      moveNumber(value: number): void;
    };
  }
}

(() => {
  const game = (new Game([
    new ConsoleRenderer(),
    new DomRenderer(document.getElementById('content')),
  ]));

  window.game = {
    restartGame(size = 4): void {
      game.init(size).start();
    },
    moveNumber(value: number): void {
      game.requestMoveBlock(value);
    },
  }
})();
