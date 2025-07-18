import React, { useState, useEffect } from 'react';
import { FileText, Plus, Trash2, Save, Search, Edit, Check, X, Download } from 'lucide-react';

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const NoteTaker: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // Load notes from localStorage on component mount
  useEffect(() => {
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
      try {
        const parsedNotes = JSON.parse(savedNotes).map((note: any) => ({
          ...note,
          createdAt: new Date(note.createdAt),
          updatedAt: new Date(note.updatedAt)
        }));
        setNotes(parsedNotes);
      } catch (error) {
        console.error('Failed to parse saved notes:', error);
      }
    }
  }, []);

  // Save notes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  // Create a new note
  const createNewNote = () => {
    // Save current note if there is one
    if (activeNoteId) {
      saveNote();
    }

    const newNote: Note = {
      id: `note_${Date.now()}`,
      title: 'Untitled Note',
      content: '',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setNotes([newNote, ...notes]);
    setActiveNoteId(newNote.id);
    setTitle(newNote.title);
    setContent(newNote.content);
    setIsEditing(true);
  };

  // Select a note to view/edit
  const selectNote = (noteId: string) => {
    // Save current note if there is one
    if (activeNoteId && isEditing) {
      saveNote();
    }

    const note = notes.find(n => n.id === noteId);
    if (note) {
      setActiveNoteId(noteId);
      setTitle(note.title);
      setContent(note.content);
      setIsEditing(false);
    }
  };

  // Save the current note
  const saveNote = () => {
    if (!activeNoteId) return;

    const updatedNotes = notes.map(note => {
      if (note.id === activeNoteId) {
        return {
          ...note,
          title: title || 'Untitled Note',
          content,
          updatedAt: new Date()
        };
      }
      return note;
    });

    setNotes(updatedNotes);
    setIsEditing(false);
  };

  // Delete a note
  const deleteNote = (noteId: string, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation();
    }
    
    const updatedNotes = notes.filter(note => note.id !== noteId);
    setNotes(updatedNotes);
    
    if (activeNoteId === noteId) {
      setActiveNoteId(updatedNotes.length > 0 ? updatedNotes[0].id : null);
      if (updatedNotes.length > 0) {
        setTitle(updatedNotes[0].title);
        setContent(updatedNotes[0].content);
      } else {
        setTitle('');
        setContent('');
      }
      setIsEditing(false);
    }
  };

  // Toggle edit mode
  const toggleEditMode = () => {
    if (isEditing) {
      saveNote();
    } else {
      setIsEditing(true);
    }
  };

  // Cancel editing
  const cancelEditing = () => {
    if (activeNoteId) {
      const activeNote = notes.find(note => note.id === activeNoteId);
      if (activeNote) {
        setTitle(activeNote.title);
        setContent(activeNote.content);
      }
    }
    setIsEditing(false);
  };

  // Export notes as JSON
  const exportNotes = () => {
    const dataStr = JSON.stringify(notes, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileDefaultName = `notes_${new Date().toISOString().slice(0, 10)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Filter notes based on search query
  const filteredNotes = notes.filter(note => {
    const searchLower = searchQuery.toLowerCase();
    return (
      note.title.toLowerCase().includes(searchLower) ||
      note.content.toLowerCase().includes(searchLower)
    );
  });

  // Format date
  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Note Taker</h2>
        <p className="text-slate-300">Create, edit, and organize your notes</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Notes List */}
        <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
          <div className="p-4 border-b border-slate-700">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white font-medium">Notes</h3>
              <button
                onClick={createNewNote}
                className="p-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                title="New Note"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notes..."
                className="w-full bg-slate-900 text-white rounded-lg pl-9 pr-4 py-2 border border-slate-700 focus:border-blue-500 focus:outline-none transition-colors duration-200"
              />
            </div>
          </div>

          <div className="h-96 overflow-y-auto">
            {filteredNotes.length > 0 ? (
              <div className="divide-y divide-slate-700">
                {filteredNotes.map((note) => (
                  <div
                    key={note.id}
                    onClick={() => selectNote(note.id)}
                    className={`p-4 cursor-pointer hover:bg-slate-700 transition-colors duration-200 ${
                      activeNoteId === note.id ? 'bg-slate-700' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-medium truncate">{note.title}</h4>
                        <p className="text-slate-400 text-sm truncate mt-1">{note.content}</p>
                        <p className="text-slate-500 text-xs mt-2">
                          {formatDate(note.updatedAt)}
                        </p>
                      </div>
                      <button
                        onClick={(e) => deleteNote(note.id, e)}
                        className="ml-2 p-1 text-slate-400 hover:text-red-400 rounded"
                        title="Delete Note"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <FileText className="w-12 h-12 text-slate-600 mb-2" />
                <p className="text-slate-400">
                  {searchQuery
                    ? 'No notes match your search'
                    : 'No notes yet. Create your first note!'}
                </p>
              </div>
            )}
          </div>

          <div className="p-3 border-t border-slate-700 bg-slate-800">
            <button
              onClick={exportNotes}
              disabled={notes.length === 0}
              className="w-full flex items-center justify-center gap-2 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              Export Notes
            </button>
          </div>
        </div>

        {/* Note Editor */}
        <div className="md:col-span-2 bg-slate-800 rounded-lg border border-slate-700 flex flex-col">
          {activeNoteId ? (
            <>
              <div className="p-4 border-b border-slate-700 flex justify-between items-center">
                {isEditing ? (
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="flex-1 bg-slate-900 text-white rounded-lg px-3 py-2 border border-slate-700 focus:border-blue-500 focus:outline-none"
                    placeholder="Note title"
                  />
                ) : (
                  <h3 className="text-white font-medium truncate">{title}</h3>
                )}
                <div className="flex gap-2 ml-2">
                  {isEditing ? (
                    <>
                      <button
                        onClick={saveNote}
                        className="p-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg"
                        title="Save"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                        title="Cancel"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={toggleEditMode}
                      className="p-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <div className="flex-1 p-4 overflow-y-auto">
                {isEditing ? (
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full h-full bg-slate-900 text-white rounded-lg p-4 border border-slate-700 focus:border-blue-500 focus:outline-none resize-none"
                    placeholder="Write your note here..."
                  />
                ) : (
                  <div className="prose prose-invert max-w-none">
                    {content ? (
                      <div className="whitespace-pre-wrap">{content}</div>
                    ) : (
                      <div className="text-slate-400 italic">No content</div>
                    )}
                  </div>
                )}
              </div>

              <div className="p-3 border-t border-slate-700 text-xs text-slate-400">
                Last updated: {formatDate(notes.find(n => n.id === activeNoteId)?.updatedAt || new Date())}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-96 text-center p-4">
              <FileText className="w-16 h-16 text-slate-600 mb-3" />
              <h3 className="text-slate-400 text-lg font-medium mb-2">No Note Selected</h3>
              <p className="text-slate-500 mb-4">
                Select a note from the list or create a new one
              </p>
              <button
                onClick={createNewNote}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                <Plus className="w-4 h-4" />
                New Note
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NoteTaker; 