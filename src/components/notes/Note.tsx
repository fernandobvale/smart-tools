
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNoteMutations } from "./NoteMutations";
import { toast } from "sonner";

interface NoteType {
  id: string;
  created_at: string;
  title: string;
  content: string;
}

interface NoteProps {
  note: NoteType;
  onDeleteSuccess: () => void;
}

export const Note = ({ note, onDeleteSuccess }: NoteProps) => {
  const { deleteNoteMutation } = useNoteMutations(onDeleteSuccess);

  const handleDelete = () => {
    if (
      window.confirm("Tem certeza que deseja excluir esta nota?")
    ) {
      deleteNoteMutation.mutate(note.id);
    }
  };

  return (
    <Card className="p-4 flex flex-col justify-between h-full">
      <div>
        <h2 className="text-lg font-semibold mb-2 truncate">{note.title}</h2>
        <p className="text-sm text-muted-foreground line-clamp-4 whitespace-pre-line">{note.content}</p>
      </div>
      <div className="mt-4 flex justify-end">
        <Button
          variant="destructive"
          size="sm"
          onClick={handleDelete}
          disabled={deleteNoteMutation.isPending}
        >
          Excluir
        </Button>
      </div>
    </Card>
  );
};
