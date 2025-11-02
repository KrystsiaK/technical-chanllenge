'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface UserFormModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

export function UserModal({ open, title, onClose, children }: UserFormModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      {open && (
        <DialogContent className="sm:max-w-[425px] bg-white dark:bg-black">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          {children}
        </DialogContent>
      )}
    </Dialog>
  );
}