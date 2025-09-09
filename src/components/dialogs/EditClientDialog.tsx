
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { ClientForm } from '../clients/ClientForm';
import type { Client } from '../../services/clientService';
import type { ClientFormData } from '../../lib/validation/clientSchema';

interface EditClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: Client;
  onSubmit: (data: ClientFormData) => Promise<void>;
}

export function EditClientDialog({
  open,
  onOpenChange,
  client,
  onSubmit,
}: EditClientDialogProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card p-6 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <Dialog.Title className="text-lg font-semibold">
              Editar Cliente
            </Dialog.Title>
            <Dialog.Close className="text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </Dialog.Close>
          </div>

          <ClientForm
            initialData={{
              name: client.name,
              documentId: client.documentId,
              email: client.email,
              phone: client.phone,
              address: client.address,
              notes: client.notes || undefined,
            }}
            onSubmit={onSubmit}
            onCancel={() => onOpenChange(false)}
          />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}