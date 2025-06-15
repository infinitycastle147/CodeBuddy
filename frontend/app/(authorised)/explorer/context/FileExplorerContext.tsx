'use client';

import React, { createContext, useContext, useReducer, useCallback } from 'react';

interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  isOpen?: boolean;
  size?: string;
  lastModified?: string;
  language?: string;
}

interface FileExplorerState {
  fileTree: FileNode[];
  selectedFile: FileNode | null;
  currentPath: string[];
  searchQuery: string;
  filterType: string;
  sortCriteria: string;
  isLoading: boolean;
  error: string | null;
}

type FileExplorerAction =
  | { type: 'SET_FILE_TREE'; payload: FileNode[] }
  | { type: 'SELECT_FILE'; payload: FileNode | null }
  | { type: 'SET_PATH'; payload: string[] }
  | { type: 'SET_SEARCH'; payload: string }
  | { type: 'SET_FILTER'; payload: string }
  | { type: 'SET_SORT'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

const initialState: FileExplorerState = {
  fileTree: [],
  selectedFile: null,
  currentPath: ['src'],
  searchQuery: '',
  filterType: 'all',
  sortCriteria: 'name',
  isLoading: false,
  error: null,
};

const FileExplorerContext = createContext<{
  state: FileExplorerState;
  dispatch: React.Dispatch<FileExplorerAction>;
  handleFileSelect: (node: FileNode) => void;
  handlePathNavigate: (index: number) => void;
  handleSearch: (query: string) => void;
  handleFilter: (type: string) => void;
  handleSort: (criteria: string) => void;
} | null>(null);

function fileExplorerReducer(state: FileExplorerState, action: FileExplorerAction): FileExplorerState {
  switch (action.type) {
    case 'SET_FILE_TREE':
      return { ...state, fileTree: action.payload };
    case 'SELECT_FILE':
      return { ...state, selectedFile: action.payload };
    case 'SET_PATH':
      return { ...state, currentPath: action.payload };
    case 'SET_SEARCH':
      return { ...state, searchQuery: action.payload };
    case 'SET_FILTER':
      return { ...state, filterType: action.payload };
    case 'SET_SORT':
      return { ...state, sortCriteria: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

export function FileExplorerProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(fileExplorerReducer, initialState);

  const handleFileSelect = useCallback((node: FileNode) => {
    dispatch({ type: 'SELECT_FILE', payload: node });
    if (node.type === 'folder') {
      dispatch({ type: 'SET_PATH', payload: [...state.currentPath, node.name] });
    }
  }, [state.currentPath]);

  const handlePathNavigate = useCallback((index: number) => {
    dispatch({ type: 'SET_PATH', payload: state.currentPath.slice(0, index + 1) });
  }, [state.currentPath]);

  const handleSearch = useCallback((query: string) => {
    dispatch({ type: 'SET_SEARCH', payload: query });
  }, []);

  const handleFilter = useCallback((type: string) => {
    dispatch({ type: 'SET_FILTER', payload: type });
  }, []);

  const handleSort = useCallback((criteria: string) => {
    dispatch({ type: 'SET_SORT', payload: criteria });
  }, []);

  const value = {
    state,
    dispatch,
    handleFileSelect,
    handlePathNavigate,
    handleSearch,
    handleFilter,
    handleSort,
  };

  return (
    <FileExplorerContext.Provider value={value}>
      {children}
    </FileExplorerContext.Provider>
  );
}

export function useFileExplorer() {
  const context = useContext(FileExplorerContext);
  if (!context) {
    throw new Error('useFileExplorer must be used within a FileExplorerProvider');
  }
  return context;
}