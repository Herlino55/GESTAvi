'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { GetShops } from '@/dal/shop/get.shop';
import { UpdateShop } from '@/dal/shop/update.shop';
import { CreateShop } from '@/dal/shop/create.shop';
import { DeleteShop } from '@/dal/shop/delete.shop';
import { Shop } from '@/types/model';
import { Plus, Store, Edit, Trash2, Loader2, MapPin } from 'lucide-react';
import { ShopDialog } from '@/components/shops/ShopDialog';
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
import { useAuthStore } from '@/stores';

export default function ShopsPage() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingShop, setEditingShop] = useState<Shop | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; shop: Shop | null }>({
    open: false,
    shop: null,
  });
  const { toast } = useToast();
  const { company } = useAuthStore();
  

  const fetchShops = async () => {
    try {
      const data = await GetShops(company);
      setShops(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch shops',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchShops();
  }, []);

  const handleCreateOrUpdate = async (data: Partial<Shop>) => {
    try {
      if (editingShop) {
        await UpdateShop(company, editingShop.id, data);
        toast({
          title: 'Success',
          description: 'Shop updated successfully',
        });
      } else {
        await CreateShop(data, company);
        toast({
          title: 'Success',
          description: 'Shop created successfully',
        });
      }
      fetchShops();
      setEditingShop(null);
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${editingShop ? 'update' : 'create'} shop`,
        variant: 'destructive',
      });
      throw error;
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog.shop) return;

    try {
      await DeleteShop(company,deleteDialog.shop.id);
      toast({
        title: 'Success',
        description: 'Shop deleted successfully',
      });
      fetchShops();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete shop',
        variant: 'destructive',
      });
    } finally {
      setDeleteDialog({ open: false, shop: null });
    }
  };

  if (isLoading) {
    return (
      <div>
        <Header title="Shops" description="Manage your retail locations" />
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-slate-600" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header
        title="Shops"
        description="Manage your retail locations"
        action={
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Shop
          </Button>
        }
      />

      <div className="p-8">
        {shops.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                <Store className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No shops yet</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                Get started by creating your first shop
              </p>
              <Button onClick={() => setDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Shop
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {shops.map((shop) => (
              <Card key={shop.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-950 rounded-xl flex items-center justify-center">
                      <Store className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => {
                          setEditingShop(shop);
                          setDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setDeleteDialog({ open: true, shop })}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold mb-1 line-clamp-1">{shop.name}</h3>
                  {shop.description && (
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
                      {shop.description}
                    </p>
                  )}

                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{shop.currencyCode}</span>
                    </div>
                    <div className="text-xs">
                      {new Date(shop.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <ShopDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditingShop(null);
        }}
        shop={editingShop}
        onSubmit={handleCreateOrUpdate}
      />

      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, shop: null })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {deleteDialog.shop?.name}. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
