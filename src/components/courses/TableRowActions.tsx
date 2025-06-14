
// WARNING: Always import React as "import * as React from 'react'".
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Pencil, Trash2 } from "lucide-react";
import { Course } from "./types";
import { CourseForm } from "./CourseForm";

interface TableRowActionsProps {
  course: Course;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (open: boolean) => void;
  onUpdate: () => void;
  onDeleteClick: (course: Course) => void;
}

export function TableRowActions({
  course,
  isEditDialogOpen,
  setIsEditDialogOpen,
  onUpdate,
  onDeleteClick,
}: TableRowActionsProps) {
  return (
    <div className="flex gap-2">
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon">
            <Pencil className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Curso</DialogTitle>
          </DialogHeader>
          <CourseForm
            initialData={course}
            onSuccess={() => {
              setIsEditDialogOpen(false);
              onUpdate();
            }}
          />
        </DialogContent>
      </Dialog>
      <Button
        variant="outline"
        size="icon"
        onClick={() => onDeleteClick(course)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
