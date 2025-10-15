import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Download, FileText } from 'lucide-react';
import { authService } from '@/services/auth';
import type { HistoryItem, User } from '@/types';
import { toast } from 'sonner';

const Invoice = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const shouldDownload = searchParams.get('download') === 'true';
  
  const [transaction, setTransaction] = useState<HistoryItem | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await authService.getCurrentUser();
        setCurrentUser(user);
        
        // Fetch transaction details - in real app, you'd have a getTransactionById endpoint
        const history = await authService.getCurrentUser();
        // For demo, we'll create mock data - replace with actual API call
        const mockTransaction: HistoryItem = {
          id: parseInt(id || '0'),
          userId: user.id,
          transferId: parseInt(id || '0'),
          amount: 150.00,
          type: 'sent',
          createdAt: new Date().toISOString(),
          recipientName: 'John Doe',
        };
        setTransaction(mockTransaction);
        
        if (shouldDownload) {
          setTimeout(() => handleDownload(), 500);
        }
      } catch (error) {
        toast.error('Failed to load invoice');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, shouldDownload]);

  const handleDownload = () => {
    window.print();
    toast.success('Invoice ready to download');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center">
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">Invoice not found</p>
          <Button onClick={() => navigate('/transactions')} className="mt-4">
            Back to Transactions
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="mb-6 print:hidden">
          <Button
            variant="ghost"
            onClick={() => navigate('/transactions')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Transactions
          </Button>
        </div>

        <Card className="p-8 md:p-12 shadow-lg">
          {/* Invoice Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold">INVOICE</h1>
              </div>
              <p className="text-muted-foreground">Transaction Receipt</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Invoice #</p>
              <p className="text-lg font-mono font-semibold">
                INV-{transaction.id.toString().padStart(6, '0')}
              </p>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Transaction Details */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="font-semibold mb-3 text-sm text-muted-foreground uppercase">
                From
              </h3>
              <div className="space-y-1">
                <p className="font-semibold text-lg">
                  {transaction.type === 'sent' 
                    ? currentUser?.username 
                    : transaction.senderName}
                </p>
                <p className="text-sm text-muted-foreground">
                  {currentUser?.email}
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3 text-sm text-muted-foreground uppercase">
                To
              </h3>
              <div className="space-y-1">
                <p className="font-semibold text-lg">
                  {transaction.type === 'sent' 
                    ? transaction.recipientName 
                    : currentUser?.username}
                </p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="font-semibold mb-3 text-sm text-muted-foreground uppercase">
                Transaction Date
              </h3>
              <p className="text-base">{formatDate(transaction.createdAt)}</p>
            </div>

            <div>
              <h3 className="font-semibold mb-3 text-sm text-muted-foreground uppercase">
                Transaction ID
              </h3>
              <p className="text-base font-mono">TXN-{transaction.transferId}</p>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Amount Summary */}
          <div className="bg-muted/30 rounded-lg p-6 mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-muted-foreground">Transaction Type</span>
              <span className="font-medium capitalize">{transaction.type}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">${transaction.amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-muted-foreground">Transaction Fee</span>
              <span className="font-medium">$0.00</span>
            </div>
            <Separator className="my-4" />
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Total Amount</span>
              <span className="text-2xl font-bold text-primary">
                ${transaction.amount.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-muted-foreground">
            <p>Thank you for using our service</p>
            <p className="mt-2">
              This is a computer-generated invoice and does not require a signature
            </p>
          </div>

          {/* Download Button */}
          <div className="mt-8 print:hidden">
            <Button onClick={handleDownload} className="w-full" size="lg">
              <Download className="h-4 w-4 mr-2" />
              Download Invoice
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Invoice;
