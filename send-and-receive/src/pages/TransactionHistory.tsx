import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Download, Eye } from 'lucide-react';
import { transferService } from '@/services/transfer';
import { authService } from '@/services/auth';
import type { HistoryItem } from '@/types';
import { toast } from 'sonner';

const TransactionHistory = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const user = await authService.getCurrentUser();
        const history = await transferService.getUserHistory(user.id, 100);
        setTransactions(history as HistoryItem[]);
      } catch (error) {
        toast.error('Failed to load transaction history');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatAmount = (amount: number, type: 'sent' | 'received') => {
    const prefix = type === 'sent' ? '-' : '+';
    return `${prefix}$${Math.abs(amount).toFixed(2)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Transaction History
              </h1>
              <p className="text-muted-foreground mt-2">
                View all your transactions and download invoices
              </p>
            </div>
          </div>
        </div>

        <Card className="border-border/50 shadow-lg">
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-4">Loading transactions...</p>
            </div>
          ) : transactions.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-muted-foreground">No transactions yet</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Counterparty</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">
                      {formatDate(transaction.createdAt)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={transaction.type === 'sent' ? 'destructive' : 'default'}
                      >
                        {transaction.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {transaction.type === 'sent'
                        ? transaction.recipientName || 'Unknown'
                        : transaction.senderName || 'Unknown'}
                    </TableCell>
                    <TableCell
                      className={`text-right font-semibold ${
                        transaction.type === 'sent'
                          ? 'text-destructive'
                          : 'text-green-600'
                      }`}
                    >
                      {formatAmount(transaction.amount, transaction.type)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => navigate(`/invoice/${transaction.id}`)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => navigate(`/invoice/${transaction.id}?download=true`)}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Invoice
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>
      </div>
    </div>
  );
};

export default TransactionHistory;
