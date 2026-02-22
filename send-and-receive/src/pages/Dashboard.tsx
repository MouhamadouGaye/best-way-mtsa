import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { GradientCard } from '@/components/ui/gradient-card';
import { useToast } from '@/hooks/use-toast';
import { authService } from '@/services/auth';
import { transferService } from '@/services/transfer';
import type { User, HistoryItem } from '@/types';
import {
  ArrowUpRight,
  ArrowDownLeft,
  Send,
  History,
  Plus,
  LogOut,
  Wallet,
  CreditCard,
} from 'lucide-react';

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const userData = await authService.getCurrentUser();
      setUser(userData);
      
      const historyData = await transferService.getUserHistory(userData.id, 10);
      setHistory(historyData as HistoryItem[]);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to load data',
        variant: 'destructive',
      });
      navigate('/login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate('/login');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to logout',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow animate-pulse mx-auto">
            <Wallet className="w-8 h-8 text-primary-foreground" />
          </div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
              <Wallet className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h2 className="font-semibold">Hi, {user?.username}</h2>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Balance Card */}
        <GradientCard variant="elevated" className="p-6 bg-gradient-primary text-primary-foreground border-0">
          <div className="space-y-2">
            <p className="text-primary-foreground/80 text-sm font-medium">Total Balance</p>
            <h1 className="text-4xl font-bold">${user?.balance?.toLocaleString() || '0.00'}</h1>
          </div>
          <div className="flex gap-3 mt-6">
            <Button
              className="flex-1 bg-card/20 hover:bg-card/30 text-primary-foreground border-primary-foreground/20"
              onClick={() => navigate('/send')}
            >
              <Send className="mr-2 h-4 w-4" />
              Send Money
            </Button>
            <Button
              variant="outline"
              className="flex-1 bg-card/20 hover:bg-card/30 text-primary-foreground border-primary-foreground/20"
              onClick={() => navigate('/add-card')}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Card
            </Button>
          </div>
        </GradientCard>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button
            variant="outline"
            className="h-auto flex-col gap-2 p-4"
            onClick={() => navigate('/send')}
          >
            <ArrowUpRight className="h-6 w-6 text-primary" />
            <span className="text-sm font-medium">Send</span>
          </Button>
          <Button variant="outline" className="h-auto flex-col gap-2 p-4">
            <ArrowDownLeft className="h-6 w-6 text-success" />
            <span className="text-sm font-medium">Request</span>
          </Button>
          <Button
            variant="outline"
            className="h-auto flex-col gap-2 p-4"
            onClick={() => navigate('/beneficiaries')}
          >
            <CreditCard className="h-6 w-6 text-accent" />
            <span className="text-sm font-medium">Beneficiaries</span>
          </Button>
          <Button
            variant="outline"
            className="h-auto flex-col gap-2 p-4"
            onClick={() => navigate('/transactions')}
          >
            <History className="h-6 w-6 text-muted-foreground" />
            <span className="text-sm font-medium">History</span>
          </Button>
        </div>

        {/* Recent Transactions */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Recent Transactions</h2>
          {history.length === 0 ? (
            <GradientCard className="p-8 text-center">
              <History className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No transactions yet</p>
              <p className="text-sm text-muted-foreground mt-2">
                Start by sending money to someone
              </p>
            </GradientCard>
          ) : (
            <div className="space-y-3">
              {history.map((item) => (
                <GradientCard key={item.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          item.type === 'sent'
                            ? 'bg-destructive/10 text-destructive'
                            : 'bg-success/10 text-success'
                        }`}
                      >
                        {item.type === 'sent' ? (
                          <ArrowUpRight className="h-5 w-5" />
                        ) : (
                          <ArrowDownLeft className="h-5 w-5" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">
                          {item.type === 'sent' ? 'Sent to' : 'Received from'}{' '}
                          {item.recipientName || item.senderName || 'Unknown'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <p
                      className={`font-semibold ${
                        item.type === 'sent' ? 'text-destructive' : 'text-success'
                      }`}
                    >
                      {item.type === 'sent' ? '-' : '+'}${item.amount.toFixed(2)}
                    </p>
                  </div>
                </GradientCard>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
