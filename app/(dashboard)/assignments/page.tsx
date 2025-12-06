'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { apiClient } from '@/lib/api-client';
import { UserShop } from '@/types/models';
import { Plus, Link2, Trash2, Loader2, Store, User } from 'lucide-react';
import { AssignmentDialog } from '@/components/assignments/AssignmentDialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<UserShop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; assignment: UserShop | null }>({
    open: false,
    assignment: null,
  });
  const { toast } = useToast();

  const fetchAssignments = async () => {
    try {
      const data = await apiClient.getUserShops();
      setAssignments(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch assignments',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleCreate = async (userId: string, shopId: string) => {
    try {
      await apiClient.assignUserToShop(userId, shopId);
      toast({
        title: 'Success',
        description: 'Assignment created successfully',
      });
      fetchAssignments();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create assignment',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog.assignment) return;

    try {
      await apiClient.removeUserFromShop(deleteDialog.assignment.id);
      toast({
        title: 'Success',
        description: 'Assignment removed successfully',
      });
      fetchAssignments();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to remove assignment',
        variant: 'destructive',
      });
    } finally {
      setDeleteDialog({ open: false, assignment: null });
    }
  };

  if (isLoading) {
    return (
      <div>
        <Header title="Assignments" description="Manage user-shop assignments" />
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-slate-600" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header
        title="Assignments"
        description="Manage user-shop assignments"
        action={
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Assignment
          </Button>
        }
      />

      <div className="p-8">
        {assignments.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                <Link2 className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No assignments yet</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                Get started by creating your first user-shop assignment
              </p>
              <Button onClick={() => setDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                New Assignment
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Shop</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Assigned On</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assignments.map((assignment) => (
                    <TableRow key={assignment.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                            {assignment.user?.firstName?.[0] ||
                              assignment.user?.email?.[0]?.toUpperCase() ||
                              'U'}
                          </div>
                          <div>
                            <div className="font-medium text-sm">
                              {assignment.user?.firstName && assignment.user?.lastName
                                ? `${assignment.user.firstName} ${assignment.user.lastName}`
                                : assignment.user?.email || 'Unknown User'}
                            </div>
                            {assignment.user?.email && assignment.user?.firstName && (
                              <div className="text-xs text-slate-500">{assignment.user.email}</div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-950 rounded-lg flex items-center justify-center">
                            <Store className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-medium text-sm">
                              {assignment.shop?.name || 'Unknown Shop'}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-1 text-xs font-medium text-slate-700 dark:text-slate-300 capitalize">
                          {assignment.user?.role || 'N/A'}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-slate-600 dark:text-slate-400">
                        {new Date(assignment.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => setDeleteDialog({ open: true, assignment })}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>

      <AssignmentDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleCreate}
      />

      <AlertDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, assignment: null })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the assignment between{' '}
              {deleteDialog.assignment?.user?.firstName && deleteDialog.assignment?.user?.lastName
                ? `${deleteDialog.assignment.user.firstName} ${deleteDialog.assignment.user.lastName}`
                : deleteDialog.assignment?.user?.email}{' '}
              and {deleteDialog.assignment?.shop?.name}. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Remove Assignment
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
