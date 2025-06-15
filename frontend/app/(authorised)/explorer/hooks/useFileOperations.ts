import { useCallback } from 'react';
import { useFileExplorer } from '../context/FileExplorerContext';

export function useFileOperations() {
  const { dispatch } = useFileExplorer();

  const fetchFileTree = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      // TODO: Replace with actual API call
      const response = await fetch('/api/files/tree');
      if (!response.ok) {
        throw new Error('Failed to fetch file tree');
      }

      const data = await response.json();
      dispatch({ type: 'SET_FILE_TREE', payload: data });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to fetch file tree' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [dispatch]);

  const downloadFile = useCallback(async (fileId: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      // TODO: Replace with actual API call
      const response = await fetch(`/api/files/${fileId}/download`);
      if (!response.ok) {
        throw new Error('Failed to download file');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileId; // TODO: Get actual filename from response headers
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to download file' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [dispatch]);

  const shareFile = useCallback(async (fileId: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      // TODO: Replace with actual API call
      const response = await fetch(`/api/files/${fileId}/share`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Failed to share file');
      }

      const { shareUrl } = await response.json();
      return shareUrl;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to share file' });
      return null;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [dispatch]);

  const getFileContent = useCallback(async (fileId: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      // TODO: Replace with actual API call
      const response = await fetch(`/api/files/${fileId}/content`);
      if (!response.ok) {
        throw new Error('Failed to fetch file content');
      }

      const data = await response.json();
      return data.content;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to fetch file content' });
      return null;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [dispatch]);

  return {
    fetchFileTree,
    downloadFile,
    shareFile,
    getFileContent,
  };
}