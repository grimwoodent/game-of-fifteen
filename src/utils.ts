import type { Point } from './types';

export function isPointsEqual(a: Point, b: Point): boolean {
  return a.x === b.x && a.y === b.y;
}

export function assertTargetElement(target: HTMLElement): void {
  if (!target || !(target instanceof HTMLElement) || !target.isConnected) {
    throw new Error('Renderer target element not found');
  }
}

export function nextAnimationFrame(): Promise<void> {
  return new Promise((resolve) => {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => resolve());
    });
  });
}
