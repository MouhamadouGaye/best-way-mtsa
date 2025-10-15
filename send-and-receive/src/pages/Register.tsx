import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { authService } from '@/services/auth';
import { ArrowRight, Wallet } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    phoneNumber: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await authService.register(formData);
      toast({
        title: 'Account created!',
        description: 'Please sign in to continue',
      });
      navigate('/login');
    } catch (error: any) {
      toast({
        title: 'Registration failed',
        description: error.message || 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-mesh p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-mesh opacity-50" />
      <div className="w-full max-w-md space-y-8 relative z-10 animate-fade-in">
        <div className="text-center space-y-3">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-3xl bg-gradient-primary flex items-center justify-center shadow-glow animate-float">
              <Wallet className="w-10 h-10 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Create account</h1>
          <p className="text-muted-foreground text-lg">Join us to start sending money easily</p>
        </div>

        <Card className="glass-strong shadow-elevated backdrop-blur-xl animate-slide-up">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl">Sign up</CardTitle>
            <CardDescription className="text-base">Fill in your details to get started</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium">Username</Label>
                <Input
                  id="username"
                  placeholder="johndoe"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                  className="h-11 transition-all duration-300 focus:scale-[1.02]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="h-11 transition-all duration-300 focus:scale-[1.02]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="text-sm font-medium">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  placeholder="+1234567890"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  required
                  className="h-11 transition-all duration-300 focus:scale-[1.02]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  className="h-11 transition-all duration-300 focus:scale-[1.02]"
                />
              </div>

              <Button type="submit" className="w-full h-12 text-base font-semibold shadow-glow hover:shadow-elevated transition-all duration-300 hover:scale-[1.02]" disabled={isLoading}>
                {isLoading ? 'Creating account...' : 'Create account'}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <Button
                  variant="link"
                  className="p-0 h-auto font-semibold text-primary"
                  onClick={() => navigate('/login')}
                >
                  Sign in
                </Button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;
