export type AppPage = 'landing' | 'dashboard' | 'viewer';

export type ViewMode = 'table' | 'card';

export type GridStyle = 'db' | 'excel';

export type MockDataRow = {
  id: number;
  category: string;
  subcategory: string;
  name: string;
  price: number;
  stock: number;
  status: string;
  date: string;
};

export type SheetFileRecord = {
  id: number;
  name: string;
  date: string;
  rows: number;
  viewStyle: GridStyle;
};
