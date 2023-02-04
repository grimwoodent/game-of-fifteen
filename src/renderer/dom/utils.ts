export function assertTargetElement(target: HTMLElement): void {
  if (!target || !(target instanceof HTMLElement) || !target.isConnected) {
    throw new Error('Renderer target element not found');
  }
}
