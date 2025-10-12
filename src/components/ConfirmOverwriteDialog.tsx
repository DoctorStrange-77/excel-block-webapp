import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function ConfirmOverwriteDialog({
  open,
  onOpenChange,
  onConfirm,
  splitName,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  splitName?: string;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="shadow-lg animate-in zoom-in/95">
        <DialogHeader>
          <DialogTitle>Conferma sovrascrittura</DialogTitle>
          <DialogDescription>
            Stai per sovrascrivere lo split "{splitName}" esistente. Questa operazione aggiornerà lo split con lo stato corrente.
            Sei sicuro di procedere?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Annulla</Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
          >
            Sovrascrivi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
