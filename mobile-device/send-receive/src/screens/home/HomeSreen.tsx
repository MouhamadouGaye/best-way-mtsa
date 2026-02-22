// // src/screens/home/HomeScreen.tsx
// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   StyleSheet,
//   Alert,
//   TouchableOpacity,
//   FlatList,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { useAuth } from '../../context/AuthContext';
// import { useTransfer } from '../../context/TransferContext';
// import { Input } from '../../components/common/Input';
// import { Button } from '../../components/common/Buttons';
// import { Card } from '../../components/common/Card';
// import { Loading } from '../../components/common/Loading';
// import { colors } from '../../styles/colors';
// import { typography } from '../../styles/typography';
// import { spacing } from '../../styles/spacing';

// interface Beneficiary {
//   id: number;
//   fullName: string;
//   phoneNumber: string;
//   email?: string;
//   countryCode: string;
//   currency?: string;
// }

// interface Transfer {
//   id: number;
//   amount: number;
//   createdAt: string;
//   status: string;
//   recipientName: string;
//   beneficiaryId?: number;
// }

// const HomeScreen: React.FC = () => {
//   const { user } = useAuth();
//   const { sendMoney, loading } = useTransfer();
//   const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
//   const [recentTransfers, setRecentTransfers] = useState<Transfer[]>([]);
//   const [showBeneficiaries, setShowBeneficiaries] = useState(false);
//   const [selectedBeneficiary, setSelectedBeneficiary] = useState<Beneficiary | null>(null);
//   const [amount, setAmount] = useState('');
//   const [convertedAmount, setConvertedAmount] = useState('');
//   const [fromCard, setFromCard] = useState(false);
//   const [loadingData, setLoadingData] = useState(true);

//   useEffect(() => {
//     loadData();
//   }, []);

//   const loadData = async () => {
//     try {
//       // Simulate API calls - replace with your actual API calls
//       const mockBeneficiaries: Beneficiary[] = [
//         {
//           id: 1,
//           fullName: 'John Smith',
//           phoneNumber: '+1234567890',
//           email: 'john@example.com',
//           countryCode: 'US',
//           currency: 'USD'
//         },
//         {
//           id: 2,
//           fullName: 'Maria Garcia',
//           phoneNumber: '+441234567890',
//           countryCode: 'UK',
//           currency: 'GBP'
//         }
//       ];

//       const mockTransfers: Transfer[] = [
//         {
//           id: 1,
//           amount: 150.00,
//           createdAt: new Date().toISOString(),
//           status: 'COMPLETED',
//           recipientName: 'John Smith',
//           beneficiaryId: 1
//         },
//         {
//           id: 2,
//           amount: 75.50,
//           createdAt: new Date(Date.now() - 86400000).toISOString(),
//           status: 'COMPLETED',
//           recipientName: 'Maria Garcia',
//           beneficiaryId: 2
//         }
//       ];

//       setBeneficiaries(mockBeneficiaries);
//       setRecentTransfers(mockTransfers);

//       // TODO: Replace with actual API calls
//       // const beneficiariesData = await beneficiaryService.getAll();
//       // const transfersData = await transferService.getAll();
//       // setBeneficiaries(beneficiariesData);
//       // setRecentTransfers(transfersData);

//     } catch (error) {
//       console.error('Failed to load data:', error);
//       Alert.alert('Error', 'Failed to load data');
//     } finally {
//       setLoadingData(false);
//     }
//   };

//   const handleBeneficiarySelect = (beneficiary: Beneficiary) => {
//     setSelectedBeneficiary(beneficiary);
//     setShowBeneficiaries(false);
//     // Reset amounts when beneficiary changes
//     setAmount('');
//     setConvertedAmount('');
//   };

//   const handleAmountChange = (value: string) => {
//     // Allow only numbers and decimal point
//     const cleanedValue = value.replace(/[^0-9.]/g, '');

//     // Ensure only one decimal point
//     const parts = cleanedValue.split('.');
//     if (parts.length > 2) {
//       return;
//     }

//     setAmount(cleanedValue);

//     // Calculate converted amount
//     if (cleanedValue && selectedBeneficiary) {
//       const numAmount = parseFloat(cleanedValue);
//       if (!isNaN(numAmount)) {
//         // Simple conversion rates - replace with real API call
//         const conversionRates: { [key: string]: number } = {
//           'USD': 1,
//           'EUR': 0.85,
//           'GBP': 0.73,
//           'CAD': 1.25,
//         };

//         const fromCurrency = user?.currency || 'USD';
//         const toCurrency = selectedBeneficiary.currency || 'USD';

//         const fromRate = conversionRates[fromCurrency] || 1;
//         const toRate = conversionRates[toCurrency] || 1;

//         const converted = (numAmount / fromRate) * toRate;
//         setConvertedAmount(converted.toFixed(2));
//       }
//     } else {
//       setConvertedAmount('');
//     }
//   };

//   const handleSendMoney = async () => {
//     if (!selectedBeneficiary) {
//       Alert.alert('Error', 'Please select a beneficiary');
//       return;
//     }

//     if (!amount || parseFloat(amount) <= 0) {
//       Alert.alert('Error', 'Please enter a valid amount');
//       return;
//     }

//     const numAmount = parseFloat(amount);

//     // Check wallet balance if not using card
//     if (!fromCard && user && user.balance && numAmount > user.balance) {
//       Alert.alert('Insufficient Balance', 'You do not have enough balance in your wallet');
//       return;
//     }

//     try {
//       await sendMoney(
//         selectedBeneficiary.id,
//         numAmount,
//         user?.currency || 'USD',
//         selectedBeneficiary.fullName,
//         fromCard
//       );

//       // Reset form
//       setAmount('');
//       setConvertedAmount('');
//       setSelectedBeneficiary(null);

//       // Reload recent transfers and user balance
//       loadData();

//       Alert.alert('Success', 'Transfer completed successfully!');

//     } catch (error: any) {
//       Alert.alert('Transfer Failed', error.message);
//     }
//   };

//   const formatCurrency = (amount: number, currency: string = 'USD') => {
//     return new Intl.NumberFormat('en-US', {
//       style: 'currency',
//       currency: currency,
//     }).format(amount);
//   };

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit',
//     });
//   };

//   const getFlagEmoji = (countryCode: string) => {
//     // Simple flag emoji mapping - you might want a more comprehensive solution
//     const flags: { [key: string]: string } = {
//       'US': '🇺🇸',
//       'UK': '🇬🇧',
//       'CA': '🇨🇦',
//       'FR': '🇫🇷',
//       'DE': '🇩🇪',
//       'ES': '🇪🇸',
//       'IT': '🇮🇹',
//       'NG': '🇳🇬',
//       'KE': '🇰🇪',
//       'GH': '🇬🇭',
//     };
//     return flags[countryCode] || '🌍';
//   };

//   if (loadingData) {
//     return <Loading message="Loading..." />;
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView
//         style={styles.scrollView}
//         showsVerticalScrollIndicator={false}
//       >
//         {/* Header with Balance */}
//         <View style={styles.header}>
//           <View style={styles.welcomeSection}>
//             <Text style={styles.welcomeText}>Welcome back,</Text>
//             <Text style={styles.userName}>{user?.username || user?.email || 'User'}</Text>
//           </View>

//           <Card style={styles.balanceCard}>
//             <Text style={styles.balanceLabel}>Available Balance</Text>
//             <Text style={styles.balanceAmount}>
//               {formatCurrency(user?.balance || 0, user?.currency)}
//             </Text>
//             <Text style={styles.balanceSubtext}>
//               {fromCard ? 'Payment will be charged to your card' : 'Funds will be deducted from your wallet'}
//             </Text>
//           </Card>
//         </View>

//         {/* Transfer Form */}
//         <Card style={styles.transferCard}>
//           <Text style={styles.cardTitle}>Send Money</Text>

//           {/* Beneficiary Selection */}
//           <View style={styles.inputContainer}>
//             <Text style={styles.inputLabel}>Send to</Text>
//             <TouchableOpacity
//               style={styles.beneficiarySelector}
//               onPress={() => setShowBeneficiaries(!showBeneficiaries)}
//             >
//               <Text style={[
//                 styles.beneficiaryText,
//                 !selectedBeneficiary && styles.placeholderText
//               ]}>
//                 {selectedBeneficiary ? selectedBeneficiary.fullName : 'Select beneficiary'}
//               </Text>
//               <Text style={styles.dropdownIcon}>▼</Text>
//             </TouchableOpacity>

//             {showBeneficiaries && (
//               <View style={styles.beneficiariesList}>
//                 {beneficiaries.length > 0 ? (
//                   beneficiaries.map((beneficiary) => (
//                     <TouchableOpacity
//                       key={beneficiary.id}
//                       style={styles.beneficiaryItem}
//                       onPress={() => handleBeneficiarySelect(beneficiary)}
//                     >
//                       <View style={styles.beneficiaryAvatar}>
//                         <Text style={styles.beneficiaryAvatarText}>
//                           {beneficiary.fullName.charAt(0).toUpperCase()}
//                         </Text>
//                       </View>
//                       <View style={styles.beneficiaryInfo}>
//                         <Text style={styles.beneficiaryName}>{beneficiary.fullName}</Text>
//                         <Text style={styles.beneficiaryDetails}>
//                           {beneficiary.phoneNumber} • {getFlagEmoji(beneficiary.countryCode)}
//                         </Text>
//                       </View>
//                       <Text style={styles.beneficiaryCurrency}>
//                         {beneficiary.currency || 'USD'}
//                       </Text>
//                     </TouchableOpacity>
//                   ))
//                 ) : (
//                   <View style={styles.noBeneficiaries}>
//                     <Text style={styles.noBeneficiariesText}>
//                       No beneficiaries saved
//                     </Text>
//                     <Text style={styles.noBeneficiariesSubtext}>
//                       Add beneficiaries to start sending money
//                     </Text>
//                   </View>
//                 )}
//               </View>
//             )}
//           </View>

//           {/* Amount Inputs */}
//           <View style={styles.amountRow}>
//             <View style={styles.amountInput}>
//               <Text style={styles.inputLabel}>Amount ({user?.currency || 'USD'})</Text>
//               <Input
//                 placeholder="0.00"
//                 value={amount}
//                 onChangeText={handleAmountChange}
//                 keyboardType="decimal-pad"
//                 style={styles.amountField}
//               />
//             </View>

//             <View style={styles.amountInput}>
//               <Text style={styles.inputLabel}>
//                 {selectedBeneficiary?.currency ? `Amount (${selectedBeneficiary.currency})` : 'Converted'}
//               </Text>
//               <Input
//                 placeholder="0.00"
//                 value={convertedAmount}
//                 editable={false}
//                 style={[styles.amountField, styles.convertedField]}
//               />
//             </View>
//           </View>

//           {/* Payment Method */}
//           <View style={styles.paymentMethodContainer}>
//             <Text style={styles.inputLabel}>Payment Method</Text>
//             <View style={styles.paymentMethodRow}>
//               <TouchableOpacity
//                 style={[
//                   styles.paymentMethod,
//                   !fromCard && styles.paymentMethodSelected
//                 ]}
//                 onPress={() => setFromCard(false)}
//               >
//                 <View style={styles.paymentMethodContent}>
//                   <Text style={[
//                     styles.paymentMethodText,
//                     !fromCard && styles.paymentMethodTextSelected
//                   ]}>
//                     Wallet
//                   </Text>
//                   <Text style={styles.paymentMethodBalance}>
//                     {formatCurrency(user?.balance || 0, user?.currency)}
//                   </Text>
//                 </View>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 style={[
//                   styles.paymentMethod,
//                   fromCard && styles.paymentMethodSelected
//                 ]}
//                 onPress={() => setFromCard(true)}
//               >
//                 <View style={styles.paymentMethodContent}>
//                   <Text style={[
//                     styles.paymentMethodText,
//                     fromCard && styles.paymentMethodTextSelected
//                   ]}>
//                     Card
//                   </Text>
//                   <Text style={styles.paymentMethodSubtext}>
//                     Credit/Debit Card
//                   </Text>
//                 </View>
//               </TouchableOpacity>
//             </View>
//           </View>

//           {/* Send Button */}
//           <Button
//             title={loading ? "Sending..." : "Send Money"}
//             onPress={handleSendMoney}
//             disabled={loading || !selectedBeneficiary || !amount}
//             loading={loading}
//             variant="primary"
//             size="large"
//             style={styles.sendButton}
//           />
//         </Card>

//         {/* Recent Transfers */}
//         <View style={styles.recentSection}>
//           <View style={styles.sectionHeader}>
//             <Text style={styles.sectionTitle}>Recent Transfers</Text>
//             <TouchableOpacity>
//               <Text style={styles.seeAllText}>See All</Text>
//             </TouchableOpacity>
//           </View>

//           {recentTransfers.length > 0 ? (
//             <Card style={styles.transfersCard}>
//               <FlatList
//                 data={recentTransfers}
//                 scrollEnabled={false}
//                 renderItem={({ item }) => (
//                   <View style={styles.transferItem}>
//                     <View style={styles.transferAvatar}>
//                       <Text style={styles.transferAvatarText}>
//                         {item.recipientName.charAt(0).toUpperCase()}
//                       </Text>
//                     </View>
//                     <View style={styles.transferInfo}>
//                       <Text style={styles.recipientName}>{item.recipientName}</Text>
//                       <Text style={styles.transferDate}>{formatDate(item.createdAt)}</Text>
//                     </View>
//                     <View style={styles.transferAmount}>
//                       <Text style={[
//                         styles.amountText,
//                         item.status === 'COMPLETED' ? styles.amountSuccess : styles.amountPending
//                       ]}>
//                         -{formatCurrency(item.amount)}
//                       </Text>
//                       <View style={[
//                         styles.statusBadge,
//                         item.status === 'COMPLETED' ? styles.statusSuccess : styles.statusPending
//                       ]}>
//                         <Text style={styles.statusText}>{item.status.toLowerCase()}</Text>
//                       </View>
//                     </View>
//                   </View>
//                 )}
//                 keyExtractor={(item) => item.id.toString()}
//               />
//             </Card>
//           ) : (
//             <Card style={styles.emptyState}>
//               <Text style={styles.emptyStateText}>No recent transfers</Text>
//               <Text style={styles.emptyStateSubtext}>
//                 Send money to see your transaction history here
//               </Text>
//             </Card>
//           )}
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: colors.background,
//   },
//   scrollView: {
//     flex: 1,
//   },
//   header: {
//     padding: spacing.large,
//   },
//   welcomeSection: {
//     marginBottom: spacing.medium,
//   },
//   welcomeText: {
//     ...typography.bodyMedium,
//     color: colors.textSecondary,
//     marginBottom: spacing.tiny,
//   },
//   userName: {
//     ...typography.heading2,
//     color: colors.textPrimary,
//   },
//   balanceCard: {
//     backgroundColor: colors.primary,
//   },
//   balanceLabel: {
//     ...typography.bodyMedium,
//     color: colors.background,
//     opacity: 0.9,
//     marginBottom: spacing.small,
//   },
//   balanceAmount: {
//     ...typography.heading1,
//     color: colors.background,
//     fontWeight: '700',
//     marginBottom: spacing.tiny,
//   },
//   balanceSubtext: {
//     ...typography.caption,
//     color: colors.background,
//     opacity: 0.8,
//   },
//   transferCard: {
//     margin: spacing.large,
//     marginTop: 0,
//     marginBottom: spacing.medium,
//   },
//   cardTitle: {
//     ...typography.heading3,
//     color: colors.textPrimary,
//     marginBottom: spacing.large,
//   },
//   inputContainer: {
//     marginBottom: spacing.large,
//   },
//   inputLabel: {
//     ...typography.bodyMedium,
//     color: colors.textPrimary,
//     fontWeight: '500',
//     marginBottom: spacing.small,
//   },
//   beneficiarySelector: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     borderWidth: 1,
//     borderColor: colors.border,
//     borderRadius: 12,
//     padding: spacing.medium,
//     backgroundColor: colors.surface,
//   },
//   beneficiaryText: {
//     ...typography.bodyMedium,
//     color: colors.textPrimary,
//   },
//   placeholderText: {
//     color: colors.textTertiary,
//   },
//   dropdownIcon: {
//     color: colors.textTertiary,
//     fontSize: 12,
//   },
//   beneficiariesList: {
//     marginTop: spacing.small,
//     borderWidth: 1,
//     borderColor: colors.border,
//     borderRadius: 12,
//     backgroundColor: colors.background,
//     maxHeight: 200,
//   },
//   beneficiaryItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: spacing.medium,
//     borderBottomWidth: 1,
//     borderBottomColor: colors.divider,
//   },
//   beneficiaryAvatar: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: colors.primary,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: spacing.medium,
//   },
//   beneficiaryAvatarText: {
//     ...typography.bodyMedium,
//     color: colors.background,
//     fontWeight: '600',
//   },
//   beneficiaryInfo: {
//     flex: 1,
//   },
//   beneficiaryName: {
//     ...typography.bodyMedium,
//     color: colors.textPrimary,
//     fontWeight: '500',
//     marginBottom: spacing.tiny,
//   },
//   beneficiaryDetails: {
//     ...typography.bodySmall,
//     color: colors.textSecondary,
//   },
//   beneficiaryCurrency: {
//     ...typography.bodyMedium,
//     color: colors.primary,
//     fontWeight: '600',
//   },
//   noBeneficiaries: {
//     padding: spacing.large,
//     alignItems: 'center',
//   },
//   noBeneficiariesText: {
//     ...typography.bodyMedium,
//     color: colors.textSecondary,
//     marginBottom: spacing.tiny,
//   },
//   noBeneficiariesSubtext: {
//     ...typography.bodySmall,
//     color: colors.textTertiary,
//   },
//   amountRow: {
//     flexDirection: 'row',
//     gap: spacing.medium,
//     marginBottom: spacing.large,
//   },
//   amountInput: {
//     flex: 1,
//   },
//   amountField: {
//     textAlign: 'center',
//     fontSize: 18,
//     fontWeight: '600',
//   },
//   convertedField: {
//     backgroundColor: colors.divider,
//     color: colors.textSecondary,
//   },
//   paymentMethodContainer: {
//     marginBottom: spacing.large,
//   },
//   paymentMethodRow: {
//     flexDirection: 'row',
//     gap: spacing.medium,
//   },
//   paymentMethod: {
//     flex: 1,
//     borderWidth: 1,
//     borderColor: colors.border,
//     borderRadius: 12,
//     backgroundColor: colors.surface,
//   },
//   paymentMethodSelected: {
//     borderColor: colors.primary,
//     backgroundColor: colors.primary + '10',
//   },
//   paymentMethodContent: {
//     padding: spacing.medium,
//   },
//   paymentMethodText: {
//     ...typography.bodyMedium,
//     color: colors.textSecondary,
//     fontWeight: '500',
//     marginBottom: spacing.tiny,
//   },
//   paymentMethodTextSelected: {
//     color: colors.primary,
//   },
//   paymentMethodBalance: {
//     ...typography.bodySmall,
//     color: colors.success,
//     fontWeight: '600',
//   },
//   paymentMethodSubtext: {
//     ...typography.bodySmall,
//     color: colors.textTertiary,
//   },
//   sendButton: {
//     marginTop: spacing.small,
//   },
//   recentSection: {
//     padding: spacing.large,
//     paddingTop: 0,
//   },
//   sectionHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: spacing.medium,
//   },
//   sectionTitle: {
//     ...typography.heading3,
//     color: colors.textPrimary,
//   },
//   seeAllText: {
//     ...typography.bodyMedium,
//     color: colors.primary,
//     fontWeight: '500',
//   },
//   transfersCard: {
//     padding: 0,
//   },
//   transferItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: spacing.medium,
//     borderBottomWidth: 1,
//     borderBottomColor: colors.divider,
//   },
//   transferAvatar: {
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     backgroundColor: colors.primary + '20',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: spacing.medium,
//   },
//   transferAvatarText: {
//     ...typography.bodySmall,
//     color: colors.primary,
//     fontWeight: '600',
//   },
//   transferInfo: {
//     flex: 1,
//   },
//   recipientName: {
//     ...typography.bodyMedium,
//     color: colors.textPrimary,
//     fontWeight: '500',
//     marginBottom: spacing.tiny,
//   },
//   transferDate: {
//     ...typography.bodySmall,
//     color: colors.textSecondary,
//   },
//   transferAmount: {
//     alignItems: 'flex-end',
//   },
//   amountText: {
//     ...typography.bodyMedium,
//     fontWeight: '600',
//     marginBottom: spacing.tiny,
//   },
//   amountSuccess: {
//     color: colors.textPrimary,
//   },
//   amountPending: {
//     color: colors.warning,
//   },
//   statusBadge: {
//     paddingHorizontal: spacing.small,
//     paddingVertical: spacing.tiny,
//     borderRadius: 12,
//   },
//   statusSuccess: {
//     backgroundColor: colors.success + '20',
//   },
//   statusPending: {
//     backgroundColor: colors.warning + '20',
//   },
//   statusText: {
//     ...typography.caption,
//     color: colors.textTertiary,
//     fontWeight: '500',
//     textTransform: 'capitalize',
//   },
//   emptyState: {
//     alignItems: 'center',
//     padding: spacing.huge,
//   },
//   emptyStateText: {
//     ...typography.bodyMedium,
//     color: colors.textSecondary,
//     marginBottom: spacing.small,
//   },
//   emptyStateSubtext: {
//     ...typography.bodySmall,
//     color: colors.textTertiary,
//     textAlign: 'center',
//   },
// });

// export default HomeScreen;

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../context/AuthContext";
import { useTransfer } from "../../context/TransferContext";
import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Buttons";
import { Card } from "../../components/common/Card";
import { Loading } from "../../components/common/Loading";
import { colors } from "../../styles/colors";
import { typography } from "../../styles/typography";
import { spacing } from "../../styles/spacing";
import { beneficiaryService } from "../../api/beneficiaryService";
import { transferService } from "../../api/transferService";

import type {
  Beneficiary as ApiBeneficiary,
  Beneficiary,
} from "../../api/beneficiaryService";
import { useNavigation } from "@react-navigation/native";
import AddBeneficiaryModal from "../../components/modals/AddBeneficiaryModal";
import { Icon } from "lucide-react-native";

// type Beneficiary = ApiBeneficiary;

interface Transfer {
  id: number;
  amount: number;
  createdAt: string;
  status: string;
  recipientName: string;
  beneficiaryId?: number;
  fromCurrency?: string;
  toCurrency?: string;
  convertedAmount?: number;
  fromCard?: boolean;
}

const HomeScreen: React.FC = () => {
  const { user, logout } = useAuth();
  const {
    sendMoney,
    loading,
    amount,
    setAmount,
    convertedAmount,
    setConvertedAmount,
    fromCurrency,
    toCurrency,
    updateBeneficiaryCurrency,
    conversionRate,
    detectCurrencyFromPhoneNumber,
  } = useTransfer();

  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [recentTransfers, setRecentTransfers] = useState<Transfer[]>([]);
  const [showBeneficiaries, setShowBeneficiaries] = useState(false);
  const [selectedBeneficiary, setSelectedBeneficiary] =
    useState<Beneficiary | null>(null);
  const [fromCard, setFromCard] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  const [showAddBeneficiary, setShowAddBeneficiary] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    loadData();
  }, []);

  // Update beneficiary currency when selected
  useEffect(() => {
    if (selectedBeneficiary?.currency) {
      updateBeneficiaryCurrency(selectedBeneficiary.currency);
    }
  }, [selectedBeneficiary, updateBeneficiaryCurrency]);

  const loadData = async () => {
    try {
      setLoadingData(true);

      // Load beneficiaries and transfers in parallel
      const [beneficiariesResponse, transfersResponse] = await Promise.all([
        beneficiaryService.getAll(),
        transferService.getAll(),
      ]);

      setBeneficiaries(beneficiariesResponse || []);
      setRecentTransfers(transfersResponse || []);
    } catch (error) {
      console.error("Failed to load data:", error);
      Alert.alert("Error", "Failed to load data");
    } finally {
      setLoadingData(false);
    }
  };

  const handleBeneficiarySelect = (beneficiary: Beneficiary) => {
    setSelectedBeneficiary(beneficiary);
    setShowBeneficiaries(false);
    // Reset amounts when beneficiary changes
    setAmount("");
    setConvertedAmount("");
  };

  const handleSendMoney = async () => {
    if (!selectedBeneficiary) {
      Alert.alert("Error", "Please select a beneficiary");
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert("Error", "Please enter a valid amount");
      return;
    }

    const numAmount = parseFloat(amount);

    // Check wallet balance if not using card
    if (!fromCard && user && user.balance && numAmount > user.balance) {
      Alert.alert(
        "Insufficient Balance",
        "You do not have enough balance in your wallet"
      );
      return;
    }

    try {
      await sendMoney(
        selectedBeneficiary.id,
        numAmount,
        user?.currency || "USD",
        selectedBeneficiary.fullName,
        fromCard
      );

      // Reset form
      setAmount("");
      setConvertedAmount("");
      setSelectedBeneficiary(null);

      // Reload recent transfers to show the new transfer
      await loadData();
    } catch (error: any) {
      // Error is already handled in the context
      console.error("Transfer error:", error);
    }
  };

  const formatCurrency = (amount: number, currency: string = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getFlagEmoji = (countryCode: string) => {
    const flags: { [key: string]: string } = {
      SN: "🇸🇳",
      US: "🇺🇸",
      UK: "🇬🇧",
      GB: "🇬🇧",
      CA: "🇨🇦",
      FR: "🇫🇷",
      DE: "🇩🇪",
      ES: "🇪🇸",
      IT: "🇮🇹",
      NG: "🇳🇬",
      KE: "🇰🇪",
      GH: "🇬🇭",
    };
    return flags[countryCode] || "🌍";
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigation.navigate("login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  const handleForceLogout = () => {
    Alert.alert(
      "Clear Cookies?",
      "This will clear all cookies and force you to login again.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear Cookies",
          onPress: () => {
            // For development - you might need to implement cookie clearing
            // This is platform-specific
            logout();
            navigation.navigate("login");
          },
        },
      ]
    );
  };

  if (loadingData) {
    return <Loading message="Loading..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with Balance */}
        <View style={styles.header}>
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.userName}>
              {user?.username || user?.email || "User"}
            </Text>
          </View>
          {/* the start of logout */}
          <View style={styles.container}>
            <Text
            // style={styles.title}
            >
              Welcome Home!
            </Text>
            <Text
            // style={styles.subtitle}
            >
              Hello, {user?.username || user?.email}!
            </Text>

            {/* <TouchableOpacity onPress={handleLogout}>
              <Text>Normal Logout</Text>
            </TouchableOpacity> */}
            {/* 
            <TouchableOpacity onPress={handleForceLogout}>
              <Text>Force Logout (Dev)</Text>
            </TouchableOpacity> */}
          </View>
          {/* the end of logout */}

          <Card style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>Available Balance</Text>
            <Text style={styles.balanceAmount}>
              {formatCurrency(user?.balance || 0, user?.currency)}
            </Text>
            <Text style={styles.balanceSubtext}>
              {fromCard
                ? "Payment will be charged to your card"
                : "Funds will be deducted from your wallet"}
            </Text>
          </Card>
        </View>

        {/* Transfer Form */}
        <Card style={styles.transferCard}>
          <Text style={styles.cardTitle}>Send Money</Text>

          {/* Beneficiary Selection */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Send to</Text>
            <TouchableOpacity
              style={styles.beneficiarySelector}
              onPress={() => setShowBeneficiaries(!showBeneficiaries)}
            >
              <Text
                style={[
                  styles.beneficiaryText,
                  !selectedBeneficiary && styles.placeholderText,
                ]}
              >
                {selectedBeneficiary
                  ? `${selectedBeneficiary.fullName} (${selectedBeneficiary.countryCode}) `
                  : "Select beneficiary"}
              </Text>
              <Text style={styles.dropdownIcon}>▼</Text>
            </TouchableOpacity>

            {showBeneficiaries && (
              <View style={styles.beneficiariesList}>
                <TouchableOpacity
                  style={styles.addBeneficiaryButton}
                  onPress={() => {
                    setShowBeneficiaries(false);
                    setShowAddBeneficiary(true);
                  }}
                >
                  {/* <View style={styles.addBeneficiaryButton}> */}
                  <Text style={styles.addBeneficiaryIcon}>+</Text>
                  <Text style={styles.addBeneficiaryText}>
                    Add New Beneficiary
                  </Text>
                  {/* </View> */}
                </TouchableOpacity>

                <FlatList
                  data={beneficiaries}
                  scrollEnabled={true}
                  nestedScrollEnabled={true}
                  style={styles.beneficiariesFlatList}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.beneficiaryItem}
                      onPress={() => handleBeneficiarySelect(item)}
                    >
                      <View style={styles.beneficiaryAvatar}>
                        <Text style={styles.beneficiaryAvatarText}>
                          {item.fullName.charAt(0).toUpperCase()}
                        </Text>
                      </View>
                      <View style={styles.beneficiaryInfo}>
                        <Text style={styles.beneficiaryName}>
                          {item.fullName}
                        </Text>
                        <Text style={styles.beneficiaryDetails}>
                          {item.phoneNumber} • {getFlagEmoji(item.countryCode)}
                        </Text>
                      </View>
                      <Text style={styles.beneficiaryCurrency}>
                        {item.currency ||
                          detectCurrencyFromPhoneNumber(item.phoneNumber)}
                      </Text>
                    </TouchableOpacity>
                  )}
                  keyExtractor={(item) => item.id.toString()}
                  ListEmptyComponent={
                    <View style={styles.noBeneficiaries}>
                      <Text style={styles.noBeneficiariesText}>
                        No beneficiaries saved
                      </Text>
                      <Text style={styles.noBeneficiariesSubtext}>
                        Add beneficiaries to start sending money
                      </Text>
                    </View>
                  }
                />
              </View>
            )}
          </View>

          {/* Amount Inputs with Bidirectional Conversion */}
          <View style={styles.amountRow}>
            <View style={styles.amountInput}>
              <Text style={styles.inputLabel}>Amount ({fromCurrency})</Text>
              <Input
                placeholder="0.00"
                value={amount}
                onChangeText={setAmount}
                keyboardType="decimal-pad"
                style={styles.amountField}
              />
              {conversionRate !== 1 && (
                <Text style={styles.conversionRateText}>
                  1 {fromCurrency} = {conversionRate.toFixed(4)} {toCurrency}
                </Text>
              )}
            </View>

            <View style={styles.swapIconContainer}>
              <Text style={styles.swapIcon}>⇄</Text>
            </View>

            <View style={styles.amountInput}>
              <Text style={styles.inputLabel}>Amount ({toCurrency})</Text>
              <Input
                placeholder="0.00"
                value={convertedAmount}
                onChangeText={setConvertedAmount}
                keyboardType="decimal-pad"
                style={styles.amountField}
              />
              {conversionRate !== 1 && (
                <Text style={styles.conversionRateText}>
                  1 {toCurrency} = {(1 / conversionRate).toFixed(4)}{" "}
                  {fromCurrency}
                </Text>
              )}
            </View>
          </View>

          {/* Payment Method */}
          <View style={styles.paymentMethodContainer}>
            <Text style={styles.inputLabel}>Payment Method</Text>
            <View style={styles.paymentMethodRow}>
              <TouchableOpacity
                style={[
                  styles.paymentMethod,
                  !fromCard && styles.paymentMethodSelected,
                ]}
                onPress={() => setFromCard(false)}
              >
                <View style={styles.paymentMethodContent}>
                  <Text
                    style={[
                      styles.paymentMethodText,
                      !fromCard && styles.paymentMethodTextSelected,
                    ]}
                  >
                    Wallet
                  </Text>
                  <Text style={styles.paymentMethodBalance}>
                    {formatCurrency(user?.balance || 0, user?.currency)}
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.paymentMethod,
                  fromCard && styles.paymentMethodSelected,
                ]}
                onPress={() => setFromCard(true)}
              >
                <View style={styles.paymentMethodContent}>
                  <Text
                    style={[
                      styles.paymentMethodText,
                      fromCard && styles.paymentMethodTextSelected,
                    ]}
                  >
                    Card
                  </Text>
                  <Text style={styles.paymentMethodSubtext}>
                    Credit/Debit Card
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Send Button */}
          <Button
            title={loading ? "Sending..." : "Send Money"}
            onPress={handleSendMoney}
            disabled={loading || !selectedBeneficiary || !amount}
            loading={loading}
            variant="primary"
            size="large"
            style={styles.sendButton}
          />
        </Card>

        {/* Recent Transfers */}
        <View style={styles.recentSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Transfers</Text>
            <TouchableOpacity onPress={loadData}>
              <Text style={styles.seeAllText}>Refresh</Text>
            </TouchableOpacity>
          </View>

          {recentTransfers.length > 0 ? (
            <Card style={styles.transfersCard}>
              <FlatList
                data={recentTransfers}
                scrollEnabled={false}
                renderItem={({ item }) => (
                  <View style={styles.transferItem}>
                    <View style={styles.transferAvatar}>
                      <Text style={styles.transferAvatarText}>
                        {item.recipientName.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                    <View style={styles.transferInfo}>
                      <Text style={styles.recipientName}>
                        {item.recipientName}
                      </Text>
                      <Text style={styles.transferDate}>
                        {formatDate(item.createdAt)}
                      </Text>
                      <Text style={styles.paymentMethodLabel}>
                        {item.fromCard ? "💳 Card" : "💰 Wallet"}
                      </Text>
                    </View>
                    <View style={styles.transferAmount}>
                      <Text
                        style={[
                          styles.amountText,
                          item.status === "COMPLETED"
                            ? styles.amountSuccess
                            : item.status === "PENDING"
                            ? styles.amountPending
                            : styles.amountFailed,
                        ]}
                      >
                        -
                        {formatCurrency(
                          item.amount,
                          item.fromCurrency || user?.currency
                        )}
                      </Text>
                      {item.convertedAmount && item.toCurrency && (
                        <Text style={styles.convertedAmountText}>
                          {formatCurrency(
                            item.convertedAmount,
                            item.toCurrency
                          )}
                        </Text>
                      )}
                      <View
                        style={[
                          styles.statusBadge,
                          item.status === "COMPLETED"
                            ? styles.statusSuccess
                            : item.status === "PENDING"
                            ? styles.statusPending
                            : styles.statusFailed,
                        ]}
                      >
                        <Text style={styles.statusText}>
                          {item.status.toLowerCase()}
                        </Text>
                      </View>
                    </View>
                  </View>
                )}
                keyExtractor={(item) => item.id.toString()}
              />
            </Card>
          ) : (
            <Card style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No recent transfers</Text>
              <Text style={styles.emptyStateSubtext}>
                Send money to see your transaction history here
              </Text>
            </Card>
          )}
        </View>
      </ScrollView>

      {/* Add the modal at the bottom of your return statement */}
      <AddBeneficiaryModal
        visible={showAddBeneficiary}
        onClose={() => setShowAddBeneficiary(false)}
        onBeneficiaryAdded={loadData}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: spacing.large,
  },
  welcomeSection: {
    marginBottom: spacing.medium,
  },
  welcomeText: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    marginBottom: spacing.tiny,
  },
  userName: {
    ...typography.heading2,
    color: colors.textPrimary,
  },
  balanceCard: {
    backgroundColor: colors.primary,
  },
  balanceLabel: {
    ...typography.bodyMedium,
    color: colors.background,
    opacity: 0.9,
    marginBottom: spacing.small,
  },
  balanceAmount: {
    ...typography.heading1,
    color: colors.background,
    fontWeight: "700",
    marginBottom: spacing.tiny,
  },
  balanceSubtext: {
    ...typography.caption,
    color: colors.background,
    opacity: 0.8,
  },
  transferCard: {
    margin: spacing.large,
    marginTop: 0,
    marginBottom: spacing.medium,
  },
  cardTitle: {
    ...typography.heading3,
    color: colors.textPrimary,
    marginBottom: spacing.large,
  },
  inputContainer: {
    marginBottom: spacing.large,
  },
  inputLabel: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
    fontWeight: "500",
    marginBottom: spacing.small,
  },
  beneficiarySelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: spacing.medium,
    backgroundColor: colors.surface,
  },
  beneficiaryText: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
  },
  placeholderText: {
    color: colors.textTertiary,
  },
  dropdownIcon: {
    color: colors.textTertiary,
    fontSize: 12,
  },
  beneficiariesList: {
    marginTop: spacing.small,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.background,
    maxHeight: 200,
  },
  beneficiaryItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.medium,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  beneficiaryAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.medium,
  },
  beneficiaryAvatarText: {
    ...typography.bodyMedium,
    color: colors.background,
    fontWeight: "600",
  },
  beneficiaryInfo: {
    flex: 1,
  },
  beneficiaryName: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
    fontWeight: "500",
    marginBottom: spacing.tiny,
  },
  beneficiaryDetails: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  beneficiaryCurrency: {
    ...typography.bodyMedium,
    color: colors.primary,
    fontWeight: "600",
  },
  noBeneficiaries: {
    padding: spacing.large,
    alignItems: "center",
  },
  noBeneficiariesText: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    marginBottom: spacing.tiny,
  },
  noBeneficiariesSubtext: {
    ...typography.bodySmall,
    color: colors.textTertiary,
  },
  amountRow: {
    flexDirection: "row",
    gap: spacing.medium,
    marginBottom: spacing.large,
  },
  amountInput: {
    flex: 1,
  },
  amountField: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
  },
  swapIconContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: spacing.large,
  },
  swapIcon: {
    fontSize: 20,
    color: colors.primary,
    fontWeight: "bold",
  },
  conversionRateText: {
    ...typography.caption,
    color: colors.textTertiary,
    textAlign: "center",
    marginTop: spacing.tiny,
  },
  paymentMethodContainer: {
    marginBottom: spacing.large,
  },
  paymentMethodRow: {
    flexDirection: "row",
    gap: spacing.medium,
  },
  paymentMethod: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.surface,
  },
  paymentMethodSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + "10",
  },
  paymentMethodContent: {
    padding: spacing.medium,
  },
  paymentMethodText: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    fontWeight: "500",
    marginBottom: spacing.tiny,
  },
  paymentMethodTextSelected: {
    color: colors.primary,
  },
  paymentMethodBalance: {
    ...typography.bodySmall,
    color: colors.success,
    fontWeight: "600",
  },
  paymentMethodSubtext: {
    ...typography.bodySmall,
    color: colors.textTertiary,
  },
  sendButton: {
    marginTop: spacing.small,
  },
  recentSection: {
    padding: spacing.large,
    paddingTop: 0,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.medium,
  },
  sectionTitle: {
    ...typography.heading3,
    color: colors.textPrimary,
  },
  seeAllText: {
    ...typography.bodyMedium,
    color: colors.primary,
    fontWeight: "500",
  },
  transfersCard: {
    padding: 0,
  },
  transferItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.medium,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  transferAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary + "20",
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.medium,
  },
  transferAvatarText: {
    ...typography.bodySmall,
    color: colors.primary,
    fontWeight: "600",
  },
  transferInfo: {
    flex: 1,
  },
  recipientName: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
    fontWeight: "500",
    marginBottom: spacing.tiny,
  },
  transferDate: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  paymentMethodLabel: {
    ...typography.caption,
    color: colors.textTertiary,
    marginTop: spacing.tiny,
  },
  transferAmount: {
    alignItems: "flex-end",
  },
  amountText: {
    ...typography.bodyMedium,
    fontWeight: "600",
    marginBottom: spacing.tiny,
  },
  amountSuccess: {
    color: colors.textPrimary,
  },
  amountPending: {
    color: colors.warning,
  },
  amountFailed: {
    color: colors.error,
  },
  convertedAmountText: {
    ...typography.caption,
    color: colors.textTertiary,
    marginBottom: spacing.tiny,
  },
  statusBadge: {
    paddingHorizontal: spacing.small,
    paddingVertical: spacing.tiny,
    borderRadius: 12,
  },
  statusSuccess: {
    backgroundColor: colors.success + "20",
  },
  statusPending: {
    backgroundColor: colors.warning + "20",
  },
  statusFailed: {
    backgroundColor: colors.error + "20",
  },
  statusText: {
    ...typography.caption,
    color: colors.textTertiary,
    fontWeight: "500",
    textTransform: "capitalize",
  },
  emptyState: {
    alignItems: "center",
    padding: spacing.huge,
  },
  emptyStateText: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    marginBottom: spacing.small,
  },
  emptyStateSubtext: {
    ...typography.bodySmall,
    color: colors.textTertiary,
    textAlign: "center",
  },

  beneficiariesFlatList: {
    maxHeight: 200,
  },

  // Add the modal at the bottom of your return statement

  // Add these new styles
  addBeneficiaryButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.medium,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
    backgroundColor: colors.primary + "10",
  },
  addBeneficiaryIcon: {
    fontSize: 20,
    color: colors.primary,
    marginRight: spacing.small,
    fontWeight: "600",
  },
  addBeneficiaryText: {
    ...typography.bodyMedium,
    color: colors.primary,
    fontWeight: "600",
  },
  manageCardsButton: {
    marginTop: spacing.small,
    padding: spacing.small,
    alignItems: "center",
  },
  manageCardsText: {
    ...typography.bodySmall,
    color: colors.primary,
    fontWeight: "500",
  },
});

export default HomeScreen;
