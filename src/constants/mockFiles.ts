import type {GridStyle, SheetFileRecord} from '@/types/app';

export const MOCK_FILES: SheetFileRecord[] = [
  {id: 1, name: '2024_Q1_Sales_Data.xlsx', date: '2024-04-01', rows: 15230, viewStyle: 'db'},
  {id: 2, name: 'Customer_Feedback_Survey.xlsx', date: '2024-03-28', rows: 3420, viewStyle: 'excel'},
  {id: 3, name: 'Inventory_Log_March.xlsx', date: '2024-03-15', rows: 8900, viewStyle: 'db'},
];
