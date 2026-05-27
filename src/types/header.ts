export interface Menu {
  label: string;
  onClick: () => void | Promise<void>;
}
