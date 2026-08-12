import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { FolderPlus, Bookmark, Check, X } from 'lucide-react';

interface Collection {
  id: string;
  name: string;
  postsCount: number;
}

interface SaveCollectionModalProps {
  isOpen: boolean;
  postId: string;
  onClose: () => void;
}

export const SaveCollectionModal: React.FC<SaveCollectionModalProps> = ({ isOpen, postId, onClose }) => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [newFolder, setNewFolder] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchCollections();
    }
  }, [isOpen]);

  const fetchCollections = async () => {
    try {
      const res = await api.get('/collections');
      if (res.data?.collections) {
        setCollections(res.data.collections);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolder.trim() || isCreating) return;
    setIsCreating(true);

    try {
      const res = await api.post('/collections', { name: newFolder.trim() });
      if (res.data?.collection) {
        setCollections([res.data.collection, ...collections]);
        setNewFolder('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsCreating(false);
    }
  };

  const handleToggleCollection = async (collectionId: string) => {
    try {
      const res = await api.post('/collections/toggle', { collectionId, postId });
      if (res.data?.success) {
        if (res.data.isInCollection) {
          setSelectedIds([...selectedIds, collectionId]);
        } else {
          setSelectedIds(selectedIds.filter((id) => id !== collectionId));
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 w-full max-w-sm border border-gray-100 dark:border-slate-700 shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-base text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-orange-500" /> Save to Collection
          </h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Create new folder input */}
        <form onSubmit={handleCreateCollection} className="flex items-center gap-2 mb-4">
          <input
            type="text"
            placeholder="New collection name..."
            value={newFolder}
            onChange={(e) => setNewFolder(e.target.value)}
            className="flex-1 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-orange-500 dark:text-gray-100"
          />
          <button
            type="submit"
            disabled={!newFolder.trim() || isCreating}
            className="p-2 rounded-xl bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-50 transition-colors"
          >
            <FolderPlus className="w-4 h-4" />
          </button>
        </form>

        {/* Collections list */}
        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
          {collections.length === 0 ? (
            <p className="text-xs text-center text-gray-500 dark:text-slate-400 py-4">No collections yet. Create your first folder!</p>
          ) : (
            collections.map((col) => {
              const isSaved = selectedIds.includes(col.id);
              return (
                <button
                  key={col.id}
                  onClick={() => handleToggleCollection(col.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-2xl border transition-all text-xs ${
                    isSaved
                      ? 'border-orange-500 bg-orange-50 dark:bg-orange-500/10 font-semibold'
                      : 'border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50'
                  }`}
                >
                  <span className="text-gray-800 dark:text-gray-200">{col.name}</span>
                  {isSaved && <Check className="w-4 h-4 text-orange-500" />}
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
