import { useState, useEffect } from 'react';
import { syncManager } from '../utils/syncManager';

interface Novel {
  id: number;
  titulo: string;
  genero: string;
  capitulos: number;
  año: number;
  descripcion?: string;
  pais?: string;
  imagen?: string;
  estado?: 'transmision' | 'finalizada';
}

export function useNovelSync() {
  const [novels, setNovels] = useState<Novel[]>([]);
  const [novelsInTransmission, setNovelsInTransmission] = useState<Novel[]>([]);
  const [novelsFinished, setNovelsFinished] = useState<Novel[]>([]);
  const [loading, setLoading] = useState(true);

  // Función para categorizar novelas
  const categorizeNovels = (novelList: Novel[]) => {
    const transmission = novelList.filter(novel => novel.estado === 'transmision');
    const finished = novelList.filter(novel => novel.estado === 'finalizada');
    
    setNovels(novelList);
    setNovelsInTransmission(transmission);
    setNovelsFinished(finished);
  };

  // Cargar novelas iniciales
  useEffect(() => {
    const loadInitialNovels = () => {
      try {
        setLoading(true);
        
        let loadedNovels: Novel[] = [];

        // Intentar cargar desde múltiples fuentes en orden de prioridad
        try {
          const adminConfig = localStorage.getItem('system_config');
          if (adminConfig) {
            const config = JSON.parse(adminConfig);
            if (config.novels && Array.isArray(config.novels)) {
              loadedNovels = config.novels;
            }
          }
          
          // Si no hay novelas en system_config, intentar admin_system_state
          if (loadedNovels.length === 0) {
            const adminState = localStorage.getItem('admin_system_state');
            if (adminState) {
              const state = JSON.parse(adminState);
              if (state.novels && Array.isArray(state.novels)) {
                loadedNovels = state.novels;
              }
            }
          }
        } catch (parseError) {
          console.warn('Error parsing novels data:', parseError);
          loadedNovels = [];
        }

        categorizeNovels(loadedNovels);
      } catch (error) {
        console.error('Error loading initial novels:', error);
        categorizeNovels([]);
      } finally {
        setLoading(false);
      }
    };

    loadInitialNovels();
  }, []);

  // Suscribirse a cambios de novelas
  useEffect(() => {
    const unsubscribe = syncManager.subscribe('novels', (updatedNovels: Novel[]) => {
      categorizeNovels(updatedNovels || []);
    });

    // Escuchar eventos de storage
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'admin_system_state' || event.key === 'system_config') {
        const currentNovels = syncManager.getCurrentData('novels');
        if (currentNovels) {
          categorizeNovels(currentNovels);
        }
      }
    };

    // Escuchar eventos personalizados del admin
    const handleAdminChange = (event: CustomEvent) => {
      if (event.detail.type?.includes('novel') || event.detail.type === 'novels_sync') {
        const currentNovels = syncManager.getCurrentData('novels');
        if (currentNovels) {
          categorizeNovels(currentNovels);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('admin_state_change', handleAdminChange as EventListener);

    return () => {
      unsubscribe();
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('admin_state_change', handleAdminChange as EventListener);
    };
  }, []);

  // Función para refrescar novelas manualmente
  const refreshNovels = () => {
    const currentNovels = syncManager.getCurrentData('novels');
    if (currentNovels) {
      categorizeNovels(currentNovels);
    }
  };

  return {
    novels,
    novelsInTransmission,
    novelsFinished,
    loading,
    refreshNovels,
    totalNovels: novels.length,
    transmissionCount: novelsInTransmission.length,
    finishedCount: novelsFinished.length
  };
}