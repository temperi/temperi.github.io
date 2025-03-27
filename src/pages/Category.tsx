
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const categoryData = {
  suits: {
    title: "Костюмы",
    description: "Элегантные мужские костюмы премиального качества",
    products: [
      {
        id: 1,
        name: "Классический костюм",
        price: 89990,
        image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35"
      },
      {
        id: 2,
        name: "Деловой костюм",
        price: 79990,
        image: "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7"
      },
      {
        id: 3,
        name: "Вечерний костюм",
        price: 99990,
        image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf"
      },
      {
        id: 4,
        name: "Смокинг",
        price: 129990,
        image: "https://images.unsplash.com/photo-1598808503746-f34c53b9323e"
      },
      {
        id: 5,
        name: "Костюм-тройка",
        price: 109990,
        image: "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc"
      },
      {
        id: 6,
        name: "Летний костюм",
        price: 69990,
        image: "https://images.unsplash.com/photo-1593032465175-481ac7f401a0"
      },
      {
        id: 7,
        name: "Твидовый костюм",
        price: 94990,
        image: "https://images.unsplash.com/photo-1594938374182-f8830c46f79e"
      },
      {
        id: 8,
        name: "Костюм в полоску",
        price: 84990,
        image: "https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0"
      },
      {
        id: 9,
        name: "Костюм casual",
        price: 74990,
        image: "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc"
      },
      {
        id: 10,
        name: "Костюм slim fit",
        price: 89990,
        image: "https://images.unsplash.com/photo-1593032465175-481ac7f401a0"
      }
    ]
  },
  shirts: {
    title: "Рубашки",
    description: "Стильные мужские рубашки из премиальных материалов",
    products: [
      {
        id: 11,
        name: "Классическая рубашка",
        price: 15990,
        image: "https://images.unsplash.com/photo-1604695573706-53170668f6a6"
      },
      {
        id: 12,
        name: "Повседневная рубашка",
        price: 12990,
        image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c"
      },
      {
        id: 13,
        name: "Вечерняя рубашка",
        price: 18990,
        image: "https://images.unsplash.com/photo-1621072156002-e2fccdc0b176"
      },
      {
        id: 14,
        name: "Рубашка Oxford",
        price: 14990,
        image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10"
      },
      {
        id: 15,
        name: "Льняная рубашка",
        price: 13990,
        image: "https://images.unsplash.com/photo-1603252109303-2751441dd157"
      },
      {
        id: 16,
        name: "Рубашка в клетку",
        price: 11990,
        image: "https://images.unsplash.com/photo-1608234808654-2a8875faa7fd"
      },
      {
        id: 17,
        name: "Рубашка поло",
        price: 9990,
        image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820"
      },
      {
        id: 18,
        name: "Рубашка с коротким рукавом",
        price: 10990,
        image: "https://images.unsplash.com/photo-1596755094661-c91fe3737d69"
      },
      {
        id: 19,
        name: "Фланелевая рубашка",
        price: 12990,
        image: "https://images.unsplash.com/photo-1607345366928-199ea26cfe3e"
      },
      {
        id: 20,
        name: "Джинсовая рубашка",
        price: 11990,
        image: "https://images.unsplash.com/photo-1588359348347-9bc6cbbb689e"
      }
    ]
  },
  shoes: {
    title: "Обувь",
    description: "Премиальная мужская обувь ручной работы",
    products: [
      {
        id: 21,
        name: "Классические оксфорды",
        price: 45990,
        image: "https://images.unsplash.com/photo-1549298916-b41d501d3772"
      },
      {
        id: 22,
        name: "Элегантные дерби",
        price: 42990,
        image: "https://images.unsplash.com/photo-1614252370173-6f8bdea6f8e3"
      },
      {
        id: 23,
        name: "Лоферы",
        price: 39990,
        image: "https://images.unsplash.com/photo-1614252370173-6f8bdea6f8e3"
      },
      {
        id: 24,
        name: "Броги",
        price: 44990,
        image: "https://images.unsplash.com/photo-1614252370173-6f8bdea6f8e3"
      },
      {
        id: 25,
        name: "Монки",
        price: 46990,
        image: "https://images.unsplash.com/photo-1614252370173-6f8bdea6f8e3"
      },
      {
        id: 26,
        name: "Челси",
        price: 41990,
        image: "https://images.unsplash.com/photo-1614252370173-6f8bdea6f8e3"
      },
      {
        id: 27,
        name: "Мокасины",
        price: 38990,
        image: "https://images.unsplash.com/photo-1614252370173-6f8bdea6f8e3"
      },
      {
        id: 28,
        name: "Эспадрильи",
        price: 35990,
        image: "https://images.unsplash.com/photo-1614252370173-6f8bdea6f8e3"
      },
      {
        id: 29,
        name: "Слипоны",
        price: 34990,
        image: "https://images.unsplash.com/photo-1614252370173-6f8bdea6f8e3"
      },
      {
        id: 30,
        name: "Кеды премиум",
        price: 36990,
        image: "https://images.unsplash.com/photo-1614252370173-6f8bdea6f8e3"
      }
    ]
  },
  accessories: {
    title: "Аксессуары",
    description: "Стильные аксессуары для завершения образа",
    products: [
      {
        id: 31,
        name: "Кожаный ремень",
        price: 12990,
        image: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c"
      },
      {
        id: 32,
        name: "Шелковый галстук",
        price: 8990,
        image: "https://images.unsplash.com/photo-1589756823695-278bc923f962"
      },
      {
        id: 33,
        name: "Запонки",
        price: 15990,
        image: "https://images.unsplash.com/photo-1590548784585-643d2b9f2925"
      },
      {
        id: 34,
        name: "Портмоне",
        price: 19990,
        image: "https://images.unsplash.com/photo-1627123424574-724758594e93"
      },
      {
        id: 35,
        name: "Часы",
        price: 89990,
        image: "https://images.unsplash.com/photo-1623998022290-a74f8cc36563"
      },
      {
        id: 36,
        name: "Зонт",
        price: 14990,
        image: "https://images.unsplash.com/photo-1590845947376-2638caa89309"
      },
      {
        id: 37,
        name: "Шарф",
        price: 11990,
        image: "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9"
      },
      {
        id: 38,
        name: "Перчатки",
        price: 9990,
        image: "https://images.unsplash.com/photo-1578632292335-df3abbb0d586"
      },
      {
        id: 39,
        name: "Портфель",
        price: 45990,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62"
      },
      {
        id: 40,
        name: "Очки",
        price: 24990,
        image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f"
      }
    ]
  },
  "spring-summer": {
    title: "Весна-Лето 2024",
    description: "Легкие и стильные образы для теплого сезона",
    products: [
      {
        id: 41,
        name: "Легкий пиджак",
        price: 45990,
        image: "https://images.unsplash.com/photo-1593032465175-481ac7f401a0"
      },
      {
        id: 42,
        name: "Льняные брюки",
        price: 18990,
        image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35"
      },
      {
        id: 43,
        name: "Поло из хлопка пима",
        price: 12990,
        image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820"
      },
      {
        id: 44,
        name: "Легкая куртка",
        price: 34990,
        image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea"
      },
      {
        id: 45,
        name: "Шорты бермуды",
        price: 15990,
        image: "https://images.unsplash.com/photo-1565693413579-8ff3fdc1b03b"
      },
      {
        id: 46,
        name: "Летний джемпер",
        price: 21990,
        image: "https://images.unsplash.com/photo-1516826957135-700dedea698c"
      },
      {
        id: 47,
        name: "Легкий свитер",
        price: 23990,
        image: "https://images.unsplash.com/photo-1578587018452-892bacefd3f2"
      },
      {
        id: 48,
        name: "Хлопковая футболка",
        price: 7990,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab"
      },
      {
        id: 49,
        name: "Легкие мокасины",
        price: 29990,
        image: "https://images.unsplash.com/photo-1614252370173-6f8bdea6f8e3"
      },
      {
        id: 50,
        name: "Солнцезащитные очки",
        price: 19990,
        image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f"
      }
    ]
  },
  evening: {
    title: "Вечерняя коллекция",
    description: "Элегантные образы для особых случаев",
    products: [
      {
        id: 51,
        name: "Смокинг",
        price: 129990,
        image: "https://images.unsplash.com/photo-1598808503746-f34c53b9323e"
      },
      {
        id: 52,
        name: "Бабочка",
        price: 7990,
        image: "https://images.unsplash.com/photo-1589756823695-278bc923f962"
      },
      {
        id: 53,
        name: "Лакированные туфли",
        price: 54990,
        image: "https://images.unsplash.com/photo-1614252370173-6f8bdea6f8e3"
      },
      {
        id: 54,
        name: "Запонки",
        price: 15990,
        image: "https://images.unsplash.com/photo-1590548784585-643d2b9f2925"
      },
      {
        id: 55,
        name: "Жилет",
        price: 34990,
        image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf"
      },
      {
        id: 56,
        name: "Шелковый платок",
        price: 8990,
        image: "https://images.unsplash.com/photo-1589756823695-278bc923f962"
      },
      {
        id: 57,
        name: "Часы",
        price: 89990,
        image: "https://images.unsplash.com/photo-1623998022290-a74f8cc36563"
      },
      {
        id: 58,
        name: "Зажим для галстука",
        price: 9990,
        image: "https://images.unsplash.com/photo-1590548784585-643d2b9f2925"
      },
      {
        id: 59,
        name: "Вечерняя рубашка",
        price: 18990,
        image: "https://images.unsplash.com/photo-1621072156002-e2fccdc0b176"
      },
      {
        id: 60,
        name: "Шелковый шарф",
        price: 12990,
        image: "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9"
      }
    ]
  }
};

const Category = () => {
  const { type } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const category = type ? categoryData[type as keyof typeof categoryData] : null;

  if (!category) {
    return <div>Категория не найдена</div>;
  }

  const handleAddToCart = async (productId: number) => {
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

      // Преобразуем ID в строку, так как в Supabase они хранятся как UUID
      const productIdStr = productId.toString();
      
      // Проверяем, есть ли уже такой товар в корзине
      const { data: existingItems } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', user.id)
        .eq('product_id', productIdStr)
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
            product_id: productIdStr,
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

  return (
    <div className="min-h-screen bg-primary">
      <Navbar />
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-4">{category.title}</h1>
          <p className="text-white/80 text-center mb-12">{category.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {category.products.map((product) => (
              <div key={product.id} className="bg-secondary rounded-lg overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-[300px] object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold">{product.price.toLocaleString()} ₽</span>
                    <button
                      onClick={() => handleAddToCart(product.id)}
                      className="bg-white text-primary px-4 py-2 rounded-md font-semibold hover:bg-white/90 transition-colors"
                    >
                      В корзину
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Category;
