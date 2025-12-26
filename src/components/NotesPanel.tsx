import React, { memo, useState, useCallback } from 'react';
import { StickyNote, X, Save, Trash2, Plus } from 'lucide-react';

interface Note {
  id: string;
  companyId: number;
  companyName: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface NotesPanelProps {
  notes: Note[];
  onAddNote: (companyId: number, companyName: string, content: string) => void;
  onUpdateNote: (noteId: string, content: string) => void;
  onDeleteNote: (noteId: string) => void;
  selectedCompanyId?: number;
  selectedCompanyName?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const NotesPanel = memo(function NotesPanel({
  notes,
  onAddNote,
  onUpdateNote,
  onDeleteNote,
  selectedCompanyId,
  selectedCompanyName,
  isOpen,
  onClose,
}: NotesPanelProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');

  const companyNotes = selectedCompanyId
    ? notes.filter((n) => n.companyId === selectedCompanyId)
    : notes;

  const handleStartEdit = useCallback((note: Note) => {
    setEditingId(note.id);
    setEditContent(note.content);
  }, []);

  const handleSaveEdit = useCallback(() => {
    if (editingId && editContent.trim()) {
      onUpdateNote(editingId, editContent.trim());
      setEditingId(null);
      setEditContent('');
    }
  }, [editingId, editContent, onUpdateNote]);

  const handleCancelEdit = useCallback(() => {
    setEditingId(null);
    setEditContent('');
  }, []);

  const handleAddNote = useCallback(() => {
    if (selectedCompanyId && selectedCompanyName && newNoteContent.trim()) {
      onAddNote(selectedCompanyId, selectedCompanyName, newNoteContent.trim());
      setNewNoteContent('');
    }
  }, [selectedCompanyId, selectedCompanyName, newNoteContent, onAddNote]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-y-0 right-0 w-96 bg-white dark:bg-gray-800 shadow-2xl z-50 flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <StickyNote className="w-5 h-5 text-yellow-500" />
          <h2 className="font-bold text-gray-900 dark:text-gray-100">
            {selectedCompanyName ? `Notes: ${selectedCompanyName}` : 'All Notes'}
          </h2>
        </div>
        <button
          onClick={onClose}
          className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Add Note (if company selected) */}
      {selectedCompanyId && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <textarea
            value={newNoteContent}
            onChange={(e) => setNewNoteContent(e.target.value)}
            placeholder="Add a note..."
            className="w-full h-24 p-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
          />
          <button
            onClick={handleAddNote}
            disabled={!newNoteContent.trim()}
            className="mt-2 w-full flex items-center justify-center gap-2 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
            Add Note
          </button>
        </div>
      )}

      {/* Notes List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {companyNotes.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">
            {selectedCompanyId ? 'No notes for this company yet.' : 'No notes yet.'}
          </p>
        ) : (
          companyNotes.map((note) => (
            <div
              key={note.id}
              className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4 border border-yellow-200 dark:border-yellow-800"
            >
              {!selectedCompanyId && (
                <p className="text-xs font-medium text-yellow-700 dark:text-yellow-400 mb-2">
                  {note.companyName}
                </p>
              )}

              {editingId === note.id ? (
                <>
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full h-24 p-2 border border-yellow-300 dark:border-yellow-700 rounded-lg resize-none focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-gray-100"
                    autoFocus
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={handleSaveEdit}
                      className="flex-1 flex items-center justify-center gap-1 py-1 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600"
                    >
                      <Save className="w-3 h-3" />
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="flex-1 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{note.content}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(note.updatedAt).toLocaleDateString()}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleStartEdit(note)}
                        className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDeleteNote(note.id)}
                        className="text-xs text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
});

export default NotesPanel;
