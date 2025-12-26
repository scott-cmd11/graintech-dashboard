import React, { memo, useState, useCallback } from 'react';
import { FolderPlus, Folder, X, Plus, Trash2, Edit3, Check } from 'lucide-react';

interface Collection {
  id: string;
  name: string;
  companyIds: number[];
  createdAt: string;
}

interface CollectionsProps {
  collections: Collection[];
  onCreateCollection: (name: string) => void;
  onDeleteCollection: (id: string) => void;
  onRenameCollection: (id: string, name: string) => void;
  onAddToCollection: (collectionId: string, companyId: number) => void;
  onRemoveFromCollection: (collectionId: string, companyId: number) => void;
  onSelectCollection: (id: string | null) => void;
  selectedCollectionId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export const Collections = memo(function Collections({
  collections,
  onCreateCollection,
  onDeleteCollection,
  onRenameCollection,
  onSelectCollection,
  selectedCollectionId,
  isOpen,
  onClose,
}: CollectionsProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const handleCreate = useCallback(() => {
    if (newName.trim()) {
      onCreateCollection(newName.trim());
      setNewName('');
      setIsCreating(false);
    }
  }, [newName, onCreateCollection]);

  const handleStartRename = useCallback((collection: Collection) => {
    setEditingId(collection.id);
    setEditName(collection.name);
  }, []);

  const handleSaveRename = useCallback(() => {
    if (editingId && editName.trim()) {
      onRenameCollection(editingId, editName.trim());
      setEditingId(null);
      setEditName('');
    }
  }, [editingId, editName, onRenameCollection]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Folder className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Collections</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Create New */}
          {isCreating ? (
            <div className="mb-4 flex gap-2">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Collection name..."
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              />
              <button
                onClick={handleCreate}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsCreating(true)}
              className="w-full mb-4 flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-gray-600 dark:text-gray-400 hover:border-blue-400 hover:text-blue-600 dark:hover:border-blue-500 dark:hover:text-blue-400 transition-colors"
            >
              <FolderPlus className="w-5 h-5" />
              Create New Collection
            </button>
          )}

          {/* Collections List */}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {/* All Companies Option */}
            <button
              onClick={() => onSelectCollection(null)}
              className={`w-full p-4 text-left rounded-xl border transition-all ${
                selectedCollectionId === null
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                  : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <Folder className="w-5 h-5 text-gray-400" />
                <span className="font-medium text-gray-900 dark:text-gray-100">All Companies</span>
              </div>
            </button>

            {collections.map((collection) => (
              <div
                key={collection.id}
                className={`p-4 rounded-xl border transition-all ${
                  selectedCollectionId === collection.id
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
                }`}
              >
                {editingId === collection.id ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="flex-1 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 text-sm"
                      autoFocus
                      onKeyDown={(e) => e.key === 'Enter' && handleSaveRename()}
                    />
                    <button
                      onClick={handleSaveRename}
                      className="p-1 text-green-600 hover:text-green-700"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => onSelectCollection(collection.id)}
                      className="flex items-center gap-3 flex-1"
                    >
                      <Folder className="w-5 h-5 text-blue-500" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100 text-left">
                          {collection.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {collection.companyIds.length} companies
                        </p>
                      </div>
                    </button>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleStartRename(collection)}
                        className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteCollection(collection.id)}
                        className="p-1 text-red-400 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {collections.length === 0 && (
              <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                No collections yet. Create one to organize your favorite companies!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

export default Collections;
