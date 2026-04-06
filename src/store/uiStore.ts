import {create} from 'zustand';
import type {AppPage, SheetFileRecord} from '@/types/app';

type UiUser = {name: string};

type UiState = {
  page: AppPage;
  user: UiUser | null;
  selectedFile: SheetFileRecord | null;
  login: () => void;
  logout: () => void;
  viewFile: (file: SheetFileRecord) => void;
  backFromViewer: () => void;
};

export const useUiStore = create<UiState>((set) => ({
  page: 'landing',
  user: null,
  selectedFile: null,
  login: () => set({user: {name: 'User'}, page: 'dashboard'}),
  logout: () => set({user: null, page: 'landing', selectedFile: null}),
  viewFile: (file) => set({selectedFile: file, page: 'viewer'}),
  backFromViewer: () => set({page: 'dashboard'}),
}));
