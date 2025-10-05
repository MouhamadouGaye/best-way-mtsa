import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GradientCard } from '@/components/ui/gradient-card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { authService } from '@/services/auth';
import { transferService } from '@/services/transfer';
import type { User, BeneficiaryDTO } from '@/types';
import { ArrowLeft, Send, Wallet } from 'lucide-react';

const SendMoney = () => {
  const [user, setUser] = useState<User | null>(null);
  const [beneficiaries, setBeneficiaries] = useState<BeneficiaryDTO[]>([]);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<string>('');
  const [amount, setAmount] = useState('');
  const [fromCard, setFromCard] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const userData = await authService.getCurrentUser();
      setUser(userData);
      
      const beneficiariesData = await transferService.getBeneficiaries();
      setBeneficiaries(beneficiariesData);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to load data',
        variant: 'destructive',
      });
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    try {
      await transferService.createTransfer({
        fromUserId: user.id,
        toUserId: null,
        beneficiaryId: parseInt(selectedBeneficiary),
        amount: parseFloat(amount),
        fromCard,
      });

      toast({
        title: 'Transfer successful!',
        description: `$${amount} sent successfully`,
      });
      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: 'Transfer failed',
        description: error.message || 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
              <Send className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-semibold">Send Money</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-lg">
        <GradientCard variant="elevated" className="p-6">
          <form onSubmit={handleSend} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="beneficiary">Send to</Label>
              <Select value={selectedBeneficiary} onValueChange={setSelectedBeneficiary}>
                <SelectTrigger>
                  <SelectValue placeholder="Select beneficiary" />
                </SelectTrigger>
                <SelectContent>
                  {beneficiaries.map((beneficiary) => (
                    <SelectItem key={beneficiary.id} value={beneficiary.id.toString()}>
                      <div className="flex flex-col items-start">
                        <span className="font-medium">{beneficiary.name}</span>
                        {beneficiary.accountNumber && (
                          <span className="text-sm text-muted-foreground">
                            {beneficiary.accountNumber}
                          </span>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {beneficiaries.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No beneficiaries yet.{' '}
                  <Button
                    variant="link"
                    className="p-0 h-auto text-primary"
                    onClick={() => navigate('/beneficiaries')}
                  >
                    Add one
                  </Button>
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  $
                </span>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  className="pl-8 text-2xl h-14"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label>Payment method</Label>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant={fromCard ? 'default' : 'outline'}
                  className="h-auto py-4 flex-col gap-2"
                  onClick={() => setFromCard(true)}
                >
                  <Wallet className="h-5 w-5" />
                  <span className="text-sm">Card</span>
                </Button>
                <Button
                  type="button"
                  variant={!fromCard ? 'default' : 'outline'}
                  className="h-auto py-4 flex-col gap-2"
                  onClick={() => setFromCard(false)}
                >
                  <Wallet className="h-5 w-5" />
                  <span className="text-sm">Wallet</span>
                </Button>
              </div>
            </div>

            {user && (
              <div className="p-4 rounded-lg bg-muted/50">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Available balance</span>
                  <span className="font-semibold">${user.balance?.toFixed(2) || '0.00'}</span>
                </div>
              </div>
            )}

            <Button type="submit" className="w-full h-12" disabled={isLoading || !selectedBeneficiary}>
              {isLoading ? 'Processing...' : 'Send Money'}
              <Send className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </GradientCard>
      </main>
    </div>
  );
};

export default SendMoney;
