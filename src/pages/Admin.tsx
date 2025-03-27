
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Trash2, Plus } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  images: string[];
  category_id: string;
}

interface ProductStatistics {
  product_id: string;
  total_views: number;
  total_sales: number;
  revenue: number;
  product_name?: string;
}

export const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [statistics, setStatistics] = useState<ProductStatistics[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // New product form state
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    description: "",
    images: [""],
    category_id: ""
  });

  // Check if user is admin
  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/login');
        return;
      }

      const { data: adminData } = await supabase
        .from('admin_users')
        .select('id')
        .eq('id', user.id)
        .single();

      if (!adminData) {
        navigate('/');
        toast({
          title: "Доступ запрещен",
          description: "У вас нет прав администратора",
        });
        return;
      }

      setIsAdmin(true);
      loadData();
    };

    checkAdmin();
  }, [navigate]);

  const loadData = async () => {
    try {
      // Load products
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*');

      if (productsError) throw productsError;

      // Load statistics
      const { data: statsData, error: statsError } = await supabase
        .from('product_statistics')
        .select(`
          product_id,
          total_views,
          total_sales,
          revenue,
          products (
            name
          )
        `);

      if (statsError) throw statsError;

      setProducts(productsData);
      setStatistics(statsData.map(stat => ({
        ...stat,
        product_name: stat.products?.name
      })));
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить данные",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddProduct = async () => {
    try {
      const { error } = await supabase
        .from('products')
        .insert({
          name: newProduct.name,
          price: parseFloat(newProduct.price),
          description: newProduct.description,
          images: newProduct.images,
          category_id: newProduct.category_id
        });

      if (error) throw error;

      toast({
        title: "Успешно",
        description: "Товар добавлен",
      });
      
      loadData();
      setNewProduct({
        name: "",
        price: "",
        description: "",
        images: [""],
        category_id: ""
      });
    } catch (error) {
      console.error('Error adding product:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось добавить товар",
      });
    }
  };

  const handleUpdateProduct = async () => {
    if (!selectedProduct) return;

    try {
      const { error } = await supabase
        .from('products')
        .update({
          name: selectedProduct.name,
          price: selectedProduct.price,
          description: selectedProduct.description,
          images: selectedProduct.images,
          category_id: selectedProduct.category_id
        })
        .eq('id', selectedProduct.id);

      if (error) throw error;

      toast({
        title: "Успешно",
        description: "Товар обновлен",
      });
      
      loadData();
      setSelectedProduct(null);
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось обновить товар",
      });
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Успешно",
        description: "Товар удален",
      });
      
      loadData();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось удалить товар",
      });
    }
  };

  if (!isAdmin || isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Панель администратора</h1>

        {/* Statistics Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Статистика продаж</h2>
          <div className="bg-card p-4 rounded-lg">
            <BarChart width={800} height={300} data={statistics}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="product_name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total_sales" fill="#8884d8" name="Продажи" />
              <Bar dataKey="revenue" fill="#82ca9d" name="Выручка" />
            </BarChart>
          </div>
        </section>

        {/* Products Management Section */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Управление товарами</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Добавить товар
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Добавить новый товар</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="Название"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  />
                  <Input
                    placeholder="Цена"
                    type="number"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  />
                  <Textarea
                    placeholder="Описание"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  />
                  <Input
                    placeholder="URL изображения"
                    value={newProduct.images[0]}
                    onChange={(e) => setNewProduct({ ...newProduct, images: [e.target.value] })}
                  />
                  <Input
                    placeholder="ID категории"
                    value={newProduct.category_id}
                    onChange={(e) => setNewProduct({ ...newProduct, category_id: e.target.value })}
                  />
                  <Button onClick={handleAddProduct}>Добавить</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="bg-card rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Название</TableHead>
                  <TableHead>Цена</TableHead>
                  <TableHead>Категория</TableHead>
                  <TableHead>Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.price.toLocaleString()} ₽</TableCell>
                    <TableCell>{product.category_id}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="icon" onClick={() => setSelectedProduct(product)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Редактировать товар</DialogTitle>
                            </DialogHeader>
                            {selectedProduct && (
                              <div className="space-y-4">
                                <Input
                                  placeholder="Название"
                                  value={selectedProduct.name}
                                  onChange={(e) => setSelectedProduct({ ...selectedProduct, name: e.target.value })}
                                />
                                <Input
                                  placeholder="Цена"
                                  type="number"
                                  value={selectedProduct.price}
                                  onChange={(e) => setSelectedProduct({ ...selectedProduct, price: parseFloat(e.target.value) })}
                                />
                                <Textarea
                                  placeholder="Описание"
                                  value={selectedProduct.description}
                                  onChange={(e) => setSelectedProduct({ ...selectedProduct, description: e.target.value })}
                                />
                                <Input
                                  placeholder="URL изображения"
                                  value={selectedProduct.images[0]}
                                  onChange={(e) => setSelectedProduct({ ...selectedProduct, images: [e.target.value] })}
                                />
                                <Input
                                  placeholder="ID категории"
                                  value={selectedProduct.category_id}
                                  onChange={(e) => setSelectedProduct({ ...selectedProduct, category_id: e.target.value })}
                                />
                                <Button onClick={handleUpdateProduct}>Сохранить</Button>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        <Button 
                          variant="destructive" 
                          size="icon"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default Admin;
