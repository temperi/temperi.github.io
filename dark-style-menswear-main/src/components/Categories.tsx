import { useNavigate } from 'react-router-dom';

const categories = [
  {
    name: "Костюмы",
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35",
    path: "/category/suits"
  },
  {
    name: "Рубашки",
    image: "https://images.unsplash.com/photo-1604695573706-53170668f6a6",
    path: "/category/shirts"
  },
  {
    name: "Обувь",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772",
    path: "/category/shoes"
  },
  {
    name: "Аксессуары",
    image: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c",
    path: "/category/accessories"
  },
];

export const Categories = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-secondary">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-12 text-center">Категории</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category) => (
            <div 
              key={category.name} 
              className="category-card cursor-pointer"
              onClick={() => navigate(category.path)}
            >
              <img src={category.image} alt={category.name} className="h-[300px]" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent flex items-end p-6">
                <h3 className="text-xl font-semibold">{category.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};