import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SaveSplitDialog({
  open,
  onOpenChange,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // onSave should return true if save succeeded, false otherwise
  onSave: (name: string) => boolean | Promise<boolean>;
}) {
  const [name, setName] = useState("");

  useEffect(() => {
    if (!open) setName("");
  }, [open]);

  const handleSaveClick = async () => {
    try {
      const ok = await onSave(name);
      if (ok) onOpenChange(false);
      // if not ok, keep dialog open so user can choose another name
    } catch (e) {
      // treat errors as failure; keep dialog open
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Salva Split</DialogTitle>
          <DialogDescription>Inserisci un nome per lo split (lascia vuoto per data e ora).</DialogDescription>
        </DialogHeader>

        <div className="my-2">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nome split (lascia vuoto per data e ora)"
          />
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Annulla</Button>
          </DialogClose>
          <Button onClick={handleSaveClick}>Salva</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
