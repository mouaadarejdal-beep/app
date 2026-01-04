
export interface DataRow {
  [key: string]: string | number;
}

export interface TableData {
  headers: string[];
  rows: DataRow[];
}

export type AppStep = 'dashboard' | 'scanner' | 'workbench' | 'plot' | 'export';

export interface ScanEntry {
  id: string;
  timestamp: number;
  data: TableData;
  image: string;
  tag?: string;
}

export interface DigitizationResult {
  table: TableData;
  rawText: string;
}
