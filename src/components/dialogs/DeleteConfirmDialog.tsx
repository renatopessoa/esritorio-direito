
import * as Dialog from '@radix-ui/react-dialog';
import { AlertCircle, X } from 'lucide-react';
import { Button } from '../ui/Button';

interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title: string;
  description: string;
}

export function DeleteConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  title,
  description,
}: DeleteConfirmDialogProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card p-6 rounded-lg shadow-xl w-full max-w-md">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-red-500/10 rounded-full">
              <AlertCircle className="w-6 h-6 text-red-500" />
            </div>
            <div className="flex-1">
              <Dialog.Title className="text-lg font-semibold mb-2">
                {title}
              </Dialog.Title>
              <Dialog.Description className="text-muted-foreground mb-6">
                {description}
              </Dialog.Description>
            </div>
            <Dialog.Close className="text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </Dialog.Close>
          </div>
          
          <div className="flex justify-end gap-3">
            <Dialog.Close asChild>
              <Button variant="outline">Cancelar</Button>
            </Dialog.Close>
            <Button 
              onClick={onConfirm}
              className="bg-red-500 hover:bg-red-600"
            >
              Excluir
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}