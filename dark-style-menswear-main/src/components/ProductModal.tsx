
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useState } from "react";
import { Star, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ProductGallery } from "./product/ProductGallery";
import { ProductDetails } from "./product/ProductDetails";
import { ProductReviews } from "./product/ProductReviews";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: string;
    name: string;
    price: number;
    images: string[];
    description: string;
  };
}

export const ProductModal = ({ isOpen, onClose, product }: ProductModalProps) => {
  const [selectedSize, setSelectedSize] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const sizes = ["S", "M", "L", "XL", "XXL"];
  const rating = 4.9;
  const reviewCount = 1278;
  
  const productDetails = {
    season: "Зима",
    material: "Полиэстер, Эластан",
    composition: "Полиэстер 95%, эластан 5%",
    collection: "Осень-зима 2024",
    style: "Повседневный"
  };
  
  const mockReviews = [
    { 
      id: 1, 
      rating: 5, 
      author: "Zen", 
      date: "11 декабря 2024",
      comment: "Шикарный товар! Начиная с фирменной упаковки с логотипом, продолжая самим комплектом термобелья и заканчивая приятным презентом! Сам комплект очень качественный, сшит максимально аккуратно.",
      verified: true 
    },
    { 
      id: 2, 
      rating: 5, 
      author: "Михаил", 
      date: "10 декабря 2024",
      comment: "Отличное качество пошива, приятный материал. Размер соответствует заявленному.",
      verified: true 
    }
  ];

  const handleAddToCart = async () => {
    if (!selectedSize) {
      toast({
        title: "Выберите размер",
        description: "Пожалуйста, выберите размер перед добавлением в корзину",
      });
      return;
    }

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
        .eq('product_id', product.id)
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
            product_id: product.id,
            quantity: 1
          });

        if (result.error) throw result.error;
        
        toast({
          title: "Товар добавлен в корзину",
          description: "Перейдите в корзину для оформления заказа",
        });
      }
      
      onClose();
    } catch (error) {
      console.error('Error adding item to cart:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось добавить товар в корзину",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-[#1A1F2C]">
        <DialogHeader>
          <DialogTitle className="text-2xl text-white">{product.name}</DialogTitle>
          <DialogDescription>
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <span className="ml-1 font-semibold text-white">{rating}</span>
              </div>
              <span className="text-white/60">• {reviewCount} отзывов</span>
            </div>
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
          <ProductGallery images={product.images} name={product.name} />
          
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-3xl font-bold text-white">{product.price.toLocaleString()} ₽</h3>
                <span className="bg-red-500 text-white px-3 py-1 rounded-full">-50%</span>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2 text-white">Выберите размер:</h4>
                <div className="flex gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-12 h-12 rounded-md border ${
                        selectedSize === size
                          ? "bg-blue-500 text-white border-blue-500"
                          : "border-white/20 hover:border-blue-500 text-white"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <button
              onClick={handleAddToCart}
              className="w-full bg-white text-primary px-4 py-3 rounded-md font-semibold hover:bg-white/90 transition-colors"
            >
              Добавить в корзину
            </button>
            
            <ProductDetails details={productDetails} />
            <ProductReviews reviews={mockReviews} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
