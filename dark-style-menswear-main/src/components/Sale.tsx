
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { ProductModal } from "./ProductModal";
import { supabase } from "@/integrations/supabase/client";
import { Heart } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  oldPrice: number;
  images: string[];
  description: string;
}

export const Sale = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

  const products: Product[] = [
    {
      id: "d2f7d475-5910-4c45-8b96-2e0e2c0d29d3",
      name: "Премиум костюм",
      price: 49990,
      oldPrice: 99990,
      images: [
        "https://images.unsplash.com/photo-1617137968427-85924c800a22?crop=1",
        "https://images.unsplash.com/photo-1593032465175-481ac7f401a0",
        "https://images.unsplash.com/photo-1594938328870-9623159c8c99"
      ],
      description: "Элегантный костюм премиум-класса, идеально подходит для особых случаев и деловых встреч. Изготовлен из высококачественной шерсти."
    },
    {
      id: "c68c8b5c-7fb8-4e8a-9df1-0e6f61d98c46",
      name: "Классический костюм",
      price: 49990,
      oldPrice: 99990,
      images: [
        "https://images.unsplash.com/photo-1617137968427-85924c800a22?crop=2",
        "https://images.unsplash.com/photo-1593032465175-481ac7f401a0",
        "https://images.unsplash.com/photo-1594938328870-9623159c8c99"
      ],
      description: "Классический костюм из премиальной ткани, подходит для любых официальных мероприятий. Отличное качество пошива и материалов."
    },
    {
      id: "f7e1ae24-8951-4cea-a812-6e789c46d0e4",
      name: "Деловой костюм",
      price: 49990,
      oldPrice: 99990,
      images: [
        "https://images.unsplash.com/photo-1617137968427-85924c800a22?crop=3",
        "https://images.unsplash.com/photo-1593032465175-481ac7f401a0",
        "https://images.unsplash.com/photo-1594938328870-9623159c8c99"
      ],
      description: "Современный деловой костюм, сочетающий в себе комфорт и элегантность. Идеально подходит для повседневной офисной работы."
    }
  ];

  const handleBuy = async (itemId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Требуется авторизация",
          description: "Пожалуйста, войдите в систему чтобы добавить товар в корзину",
        });
        navigate('/login');
        return;
      }

      // Проверяем, есть ли уже такой товар в корзине
      const { data: existingItems } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', user.id)
        .eq('product_id', itemId)
        .single();

      let result;
      
      if (existingItems) {
        // Если товар уже в корзине, увеличиваем количество
        result = await supabase
          .from('cart_items')
          .update({ 
            quantity: existingItems.quantity + 1,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingItems.id);
          
        if (result.error) throw result.error;
        
        toast({
          title: "Количество товара увеличено",
          description: "Товар уже был в корзине, количество увеличено",
        });
      } else {
        // Если товара еще нет в корзине, добавляем новый
        result = await supabase
          .from('cart_items')
          .insert({
            user_id: user.id,
            product_id: itemId,
            quantity: 1
          });

        if (result.error) throw result.error;
        
        toast({
          title: "Товар добавлен в корзину",
          description: "Перейдите в корзину для оформления заказа",
        });
      }
    } catch (error) {
      console.error('Error adding item to cart:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось добавить товар в корзину",
      });
    }
  };

  const toggleFavorite = async (productId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Требуется авторизация",
          description: "Пожалуйста, войдите в систему чтобы добавить товар в избранное",
        });
        navigate('/login');
        return;
      }

      if (favorites.includes(productId)) {
        // Remove from favorites
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', productId);

        if (error) throw error;

        setFavorites(favorites.filter(id => id !== productId));
        toast({
          title: "Удалено из избранного",
          description: "Товар успешно удален из избранного",
        });
      } else {
        // Add to favorites
        const { error } = await supabase
          .from('favorites')
          .insert({
            user_id: user.id,
            product_id: productId
          });

        if (error) throw error;

        setFavorites([...favorites, productId]);
        toast({
          title: "Добавлено в избранное",
          description: "Товар успешно добавлен в избранное",
        });
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось обновить избранное",
      });
    }
  };

  // Load user's favorites when component mounts
  const loadFavorites = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('favorites')
        .select('product_id')
        .eq('user_id', user.id);

      if (error) throw error;

      setFavorites(data.map(fav => fav.product_id));
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  return (
    <section className="py-20 bg-accent">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">Специальное предложение</h2>
        <p className="text-xl mb-8 text-white/80">Скидки до 50% на выбранные товары</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((product) => (
            <div key={product.id} className="bg-secondary p-6 rounded-lg">
              <div className="relative mb-4">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-[300px] object-cover rounded-lg cursor-pointer"
                  onClick={() => setSelectedProduct(product)}
                />
                <span className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full">
                  -50%
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(product.id);
                  }}
                  className="absolute top-4 left-4 p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
                >
                  <Heart
                    className={`w-5 h-5 ${
                      favorites.includes(product.id)
                        ? "text-red-500 fill-red-500"
                        : "text-white"
                    }`}
                  />
                </button>
              </div>
              <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-red-500 font-bold">{product.price.toLocaleString()} ₽</span>
                  <span className="ml-2 text-white/60 line-through">{product.oldPrice.toLocaleString()} ₽</span>
                </div>
                <button 
                  onClick={() => handleBuy(product.id)}
                  className="bg-white text-primary px-4 py-2 rounded-md font-semibold hover:bg-white/90 transition-colors"
                >
                  Купить
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedProduct && (
        <ProductModal
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          product={selectedProduct}
        />
      )}
    </section>
  );
};
