
// WARNING: Always import React as "import * as React from 'react'" — do NOT use "import React from 'react'".
import * as React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface NoteHeaderProps {
  title: string;
  onRename: (newTitle: string) => void;
  onDelete: () => void;
  onNewNote: () => void;
}

export const NoteHeader = ({ title, onRename, onDelete, onNewNote }: NoteHeaderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newTitle, setNewTitle] = useState(title);

  const handleRename = () => {
    if (newTitle.trim()) {
      onRename(newTitle);
      setIsOpen(false);
    }
  };

  useEffect(() => {
    setNewTitle(title);
  }, [title]);

  return (
    <div className="border-b p-2 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onNewNote}>
          Nova nota
        </Button>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              Renomear
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Renomear Nota</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Digite o novo título"
              />
            </div>
            <div className="flex justify-end">
              <Button onClick={handleRename}>Salvar</Button>
            </div>
          </DialogContent>
        </Dialog>
        <Button 
          variant="destructive" 
          size="sm"
          onClick={() => {
            if (window.confirm('Tem certeza que deseja excluir esta nota?')) {
              onDelete();
            }
          }}
        >
          Excluir
        </Button>
      </div>
      <span className="text-sm font-medium">
        {title}
      </span>
    </div>
  );
};
