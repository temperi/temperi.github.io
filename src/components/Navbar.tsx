
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";
import { Menu, User, ShoppingCart, Diamond, Heart, Star } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export const Navbar = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [cartItemsCount, setCartItemsCount] = useState(0);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsLoggedIn(!!user);

      if (user) {
        // Check if user is admin - using a safer approach to avoid type errors
        const { data: adminData, error: adminError } = await supabase
          .from('admin_users')
          .select('id')
          .eq('id', user.id);
        
        setIsAdmin(!!adminData && adminData.length > 0);
        
        // Загружаем количество товаров в корзине
        const { data: cartData, error: cartError } = await supabase
          .from('cart_items')
          .select('quantity')
          .eq('user_id', user.id);
          
        if (!cartError && cartData) {
          const count = cartData.reduce((sum, item) => sum + item.quantity, 0);
          setCartItemsCount(count);
        }
      }
    };

    checkAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setIsLoggedIn(!!session);
      checkAuth();
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  // Simplified links array - removed unnecessary tabs
  const links = [
    { name: "Коллекции", href: "/collections", icon: Diamond },
    { name: "Отзывы", href: "/reviews", icon: Star },
    { name: "О нас", href: "/about", icon: Heart },
  ];

  if (isAdmin) {
    links.push({ name: "Админ панель", href: "/admin", icon: User });
  }

  const NavLinks = () => (
    <>
      {links.map((link) => (
        <Link
          key={link.href}
          to={link.href}
          className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
        >
          {link.icon && <link.icon className="w-4 h-4" />}
          {link.name}
        </Link>
      ))}
    </>
  );

  const AuthButtons = () => (
    <div className="flex items-center gap-4">
      {isLoggedIn ? (
        <>
          <Link to="/cart" className="relative">
            <Button variant="ghost" size="icon">
              <ShoppingCart className="w-5 h-5" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {cartItemsCount}
                </span>
              )}
            </Button>
          </Link>
          <Link to="/profile">
            <Button variant="ghost" size="icon">
              <User className="w-5 h-5" />
            </Button>
          </Link>
          <Button variant="secondary" onClick={handleLogout}>
            Выйти
          </Button>
        </>
      ) : (
        <>
          <Link to="/login">
            <Button variant="ghost">Войти</Button>
          </Link>
          <Link to="/register">
            <Button variant="secondary">Регистрация</Button>
          </Link>
        </>
      )}
    </div>
  );

  return (
    <nav className="bg-primary sticky top-0 z-50 py-4 border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-white">
            <Diamond className="h-8 w-8 text-white" />
            <span>LUXMEN</span>
          </Link>

          {isMobile ? (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Меню</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-4 mt-4">
                  <NavLinks />
                  <div className="pt-4 border-t">
                    <AuthButtons />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          ) : (
            <div className="flex items-center gap-8">
              <NavLinks />
              <AuthButtons />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
