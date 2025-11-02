'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { User } from '@/features/users/interfaces/user';

interface Props {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (id: number) => void;
  page: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
}

export const UsersTable = ({
  users,
  onEdit,
  onDelete,
  page,
  totalPages,
  onPageChange,
}: Props) => {
  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Avatar</TableHead>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="text-right"></TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {users.length > 0 ? (
            users.map((u) => (
              <TableRow
                key={u.id}
                onClick={() => onEdit(u)}
                className="hover:bg-muted/40 transition-colors cursor-pointer"
              >
                <TableCell>
                  {u.avatar ? (
                    <Image
                      src={u.avatar}
                      alt={`${u.first_name} ${u.last_name}`}
                      width={36}
                      height={36}
                      className="rounded-full border object-cover"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-xs text-muted-foreground">
                      N/A
                    </div>
                  )}
                </TableCell>

                <TableCell>{u.id}</TableCell>

                <TableCell className="font-medium">
                  {u.first_name} {u.last_name}
                </TableCell>

                <TableCell className="text-muted-foreground">
                  {u.email}
                </TableCell>

                <TableCell
                  className="text-right"
                  onClick={(e) => e.stopPropagation()} // чтобы клик по мусорке не открывал модалку
                >
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => onDelete(u.id)}
                    className="text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-center text-sm italic text-muted-foreground"
              >
                No users found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

    
      <div className="flex items-center justify-center gap-3 p-3 bg-muted/30 border-t">
        <Button
          variant="outline"
          size="icon"
          disabled={!canPrev}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <span className="text-xs text-muted-foreground">
          Page {page} of {totalPages}
        </span>

        <Button
          variant="outline"
          size="icon"
          disabled={!canNext}
          onClick={() => onPageChange(page + 1)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}