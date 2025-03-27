
import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showResendDialog, setShowResendDialog] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/profile');
      }
      setCheckingSession(false);
    };

    checkSession();
  }, [navigate]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      toast({
        variant: "destructive",
        title: "Неверный формат email",
        description: "Пожалуйста, введите корректный email адрес",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        console.error("Login error:", signInError);
        
        if (signInError.message.includes("Email not confirmed")) {
          setShowResendDialog(true);
        } else if (signInError.message.includes("Invalid login credentials")) {
          toast({
            variant: "destructive",
            title: "Неверные учетные данные",
            description: "Пожалуйста, проверьте правильность email и пароля",
          });
        } else {
          toast({
            variant: "destructive",
            title: "Ошибка входа",
            description: "Произошла ошибка при входе. Попробуйте позже.",
          });
        }
      } else {
        toast({
          title: "Успешный вход",
          description: "Добро пожаловать!",
        });
        navigate("/profile");
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Что-то пошло не так. Попробуйте позже.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendConfirmation = async () => {
    if (!validateEmail(email)) {
      toast({
        variant: "destructive",
        title: "Неверный формат email",
        description: "Пожалуйста, введите корректный email адрес",
      });
      return;
    }

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });
      
      if (error) throw error;

      toast({
        title: "Письмо отправлено",
        description: "Проверьте вашу почту для подтверждения аккаунта",
      });
      setShowResendDialog(false);
    } catch (error) {
      console.error("Resend confirmation error:", error);
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось отправить письмо для подтверждения",
      });
    }
  };

  const handleResetPassword = async () => {
    if (!validateEmail(email)) {
      toast({
        variant: "destructive",
        title: "Введите email",
        description: "Пожалуйста, введите email для сброса пароля",
      });
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      
      if (error) throw error;

      toast({
        title: "Письмо отправлено",
        description: "Проверьте вашу почту для сброса пароля",
      });
    } catch (error) {
      console.error("Reset password error:", error);
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось отправить письмо для сброса пароля",
      });
    }
  };

  if (checkingSession) {
    return <div className="min-h-screen bg-[#1A1F2C] flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-[#1A1F2C]">
      <Navbar />
      <div className="container mx-auto px-4 pt-24">
        <div className="max-w-md mx-auto bg-[#403E43]/50 p-8 rounded-lg backdrop-blur-sm">
          <h2 className="text-2xl font-bold text-center mb-6">Вход в аккаунт</h2>
          <form className="space-y-4" onSubmit={handleLogin}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="example@mail.com"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  className="pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <Button 
              type="button" 
              variant="link" 
              className="px-0 text-sm text-primary hover:text-primary/80"
              onClick={handleResetPassword}
            >
              Забыли пароль?
            </Button>
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? "Вход..." : "Войти"}
            </Button>
          </form>
          <p className="text-center mt-4 text-sm text-muted-foreground">
            Нет аккаунта?{" "}
            <Link to="/register" className="text-primary hover:underline">
              Зарегистрироваться
            </Link>
          </p>
        </div>
      </div>

      <Dialog open={showResendDialog} onOpenChange={setShowResendDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Подтвердите email</DialogTitle>
            <DialogDescription>
              Ваш email еще не подтвержден. Мы можем отправить письмо с подтверждением еще раз.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={handleResendConfirmation}>
              Отправить письмо повторно
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Login;
