import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useNavigate } from "react-router-dom";

const Collections = () => {
  const navigate = useNavigate();
  
  const collections = [
    {
      name: "Весна-Лето 2024",
      description: "Легкие и стильные образы для теплого сезона",
      image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f",
      items: "10 товаров",
      type: "spring-summer"
    },
    {
      name: "Деловой стиль",
      description: "Костюмы и аксессуары для бизнес-встреч",
      image: "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7",
      items: "10 товаров",
      type: "suits"
    },
    {
      name: "Вечерняя коллекция",
      description: "Элегантные образы для особых случаев",
      image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf",
      items: "10 товаров",
      type: "evening"
    },
    {
      name: "Casual Premium",
      description: "Премиальная повседневная одежда",
      image: "https://images.unsplash.com/photo-1516826957135-700dedea698c",
      items: "10 товаров",
      type: "shirts"
    },
    {
      name: "Аксессуары Luxe",
      description: "Премиальные аксессуары для завершения образа",
      image: "https://images.unsplash.com/photo-1509805225007-73e8ba4b5be8",
      items: "10 товаров",
      type: "accessories"
    },
    {
      name: "Обувь Premium",
      description: "Коллекция премиальной обуви ручной работы",
      image: "https://images.unsplash.com/photo-1549298916-b41d501d3772",
      items: "10 товаров",
      type: "shoes"
    }
  ];

  return (
    <div className="min-h-screen bg-primary">
      <Navbar />
      <div className="container mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold text-center mb-12">Коллекции</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {collections.map((collection) => (
            <div 
              key={collection.name} 
              className="bg-secondary rounded-lg overflow-hidden cursor-pointer transition-transform hover:scale-105"
              onClick={() => navigate(`/category/${collection.type}`)}
            >
              <img
                src={collection.image}
                alt={collection.name}
                className="w-full h-[300px] object-cover"
              />
              <div className="p-6">
                <h2 className="text-2xl font-semibold mb-2">{collection.name}</h2>
                <p className="text-white/80 mb-4">{collection.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-white/60">{collection.items}</span>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/category/${collection.type}`);
                    }}
                    className="bg-white text-primary px-6 py-2 rounded-md font-semibold hover:bg-white/90 transition-colors"
                  >
                    Смотреть коллекцию
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Collections;