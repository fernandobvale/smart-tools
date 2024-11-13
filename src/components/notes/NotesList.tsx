import { useState } from "react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Note {
  id: string;
  title: string;
  updated_at: string;
}

interface NotesListProps {
  notes: Note[];
  onNoteSelect: (id: string) => void;
  selectedNoteId: string | null;
}

export const NotesList = ({ notes, onNoteSelect, selectedNoteId }: NotesListProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-64 border-r h-full flex flex-col">
      <div className="p-4 border-b">
        <Input
          placeholder="Pesquisar notas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
      </div>
      <ScrollArea className="flex-1">
        <div className="space-y-1 p-2">
          {filteredNotes.map((note) => (
            <button
              key={note.id}
              onClick={() => onNoteSelect(note.id)}
              className={`w-full text-left p-2 rounded hover:bg-accent transition-colors ${
                selectedNoteId === note.id ? "bg-accent" : ""
              }`}
            >
              <div className="font-medium truncate">{note.title}</div>
              <div className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(note.updated_at), {
                  addSuffix: true,
                  locale: ptBR,
                })}
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};