import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { clearRequestedActivities } from '@/lib/requestedActivities';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const { login } = useAuth();
  const { toast } = useToast();

  // Clear requested activities when user comes to login page
  useEffect(() => {
    clearRequestedActivities();
  }, []);

  const handleSubmit = async () => {
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        // For demo purposes, auto-login after registration
        // In real app, would register then login
        await login(email, password);
      }
      toast({ title: "Welcome to Unalon!" });
    } catch (error) {
      toast({ 
        title: "Authentication failed", 
        description: "Please check your credentials and try again.",
        variant: "destructive" 
      });
    }
  };

  const handleDemoLogin = async (demoEmail: string) => {
    try {
      await login(demoEmail, 'demo');
      toast({ title: "Welcome to Unalon!" });
    } catch (error) {
      toast({ 
        title: "Demo login failed", 
        description: "Please try again.",
        variant: "destructive" 
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-unalon-50 to-unalon-100 flex flex-col">
      {/* Header Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-16 pb-8">
        <div className="text-center space-y-4">
          <h1 className="text-5xl md:text-6xl font-black text-unalon-900 unalon-logo leading-tight">
            unalon
          </h1>
          <p className="text-unalon-600 text-sm font-medium tracking-widest uppercase">
            Never do it alon
          </p>
        </div>
      </div>

      {/* Login Section */}
      <div className="px-6 pb-8 space-y-4">
        <div className="space-y-3">
          <button
            onClick={() => handleDemoLogin('ethan@example.com')}
            className="w-full h-14 bg-unalon-900 text-white rounded-2xl font-semibold text-base transition-all duration-200 active:scale-95 shadow-lg"
          >
            Continue as Ethan
          </button>
        </div>
        
        <p className="text-unalon-500 text-xs text-center pt-2">
          By continuing, you agree to our Terms and Conditions
        </p>
      </div>
    </div>
  );
}
