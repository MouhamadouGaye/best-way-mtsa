import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Wallet, Send, Shield, Zap, ArrowRight } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-mesh">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-mesh" />
        <div className="container mx-auto px-4 py-24 md:py-32 relative">
          <div className="max-w-4xl mx-auto text-center space-y-10 animate-fade-in">
            <div className="flex justify-center">
              <div className="w-24 h-24 rounded-[2rem] bg-gradient-primary flex items-center justify-center shadow-glow animate-float">
                <Wallet className="w-12 h-12 text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
              Send Money
              <br />
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Instantly & Securely
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Transfer money to friends, family, and businesses with just a few taps. Fast, secure, and fee-free.
            </p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center pt-4">
              <Button size="lg" className="text-lg px-10 h-14 shadow-glow hover:shadow-elevated transition-all duration-300 hover:scale-105" onClick={() => navigate('/register')}>
                Get Started
                <ArrowRight className="ml-2 h-6 w-6" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-10 h-14 glass-strong hover:bg-card transition-all duration-300 hover:scale-105" onClick={() => navigate('/login')}>
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 animate-fade-in">Why Choose Us</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="glass-strong p-8 rounded-3xl shadow-soft hover:shadow-elevated transition-all duration-500 hover:scale-105 space-y-4 animate-slide-up">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center shadow-glow">
                <Zap className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-bold">Lightning Fast</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Instant transfers to anyone, anywhere. Money arrives in seconds, not days.
              </p>
            </div>

            <div className="glass-strong p-8 rounded-3xl shadow-soft hover:shadow-elevated transition-all duration-500 hover:scale-105 space-y-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="w-16 h-16 rounded-2xl bg-gradient-success flex items-center justify-center shadow-glow">
                <Shield className="w-8 h-8 text-success-foreground" />
              </div>
              <h3 className="text-2xl font-bold">Bank-Level Security</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Your money and data are protected with enterprise-grade encryption.
              </p>
            </div>

            <div className="glass-strong p-8 rounded-3xl shadow-soft hover:shadow-elevated transition-all duration-500 hover:scale-105 space-y-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-primary flex items-center justify-center shadow-glow">
                <Send className="w-8 h-8 text-accent-foreground" />
              </div>
              <h3 className="text-2xl font-bold">Easy to Use</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Simple, intuitive interface. Send money in just a few taps.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-gradient-primary rounded-[2.5rem] p-12 md:p-16 text-center text-primary-foreground shadow-glow animate-slide-up">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Ready to get started?
            </h2>
            <p className="text-xl mb-10 text-primary-foreground/95 max-w-2xl mx-auto leading-relaxed">
              Join thousands of users who trust us with their money transfers
            </p>
            <Button
              size="lg"
              variant="secondary"
              className="text-lg px-12 h-14 hover:scale-105 transition-all duration-300 shadow-elevated"
              onClick={() => navigate('/register')}
            >
              Create Free Account
              <ArrowRight className="ml-2 h-6 w-6" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
