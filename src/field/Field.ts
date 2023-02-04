export interface Field {
  readonly size: { width: number; height: number };
  toMatrix(): Array<number | null>;
}
