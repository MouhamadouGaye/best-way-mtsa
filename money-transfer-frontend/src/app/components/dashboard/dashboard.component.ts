// import {
//   Component,
//   CUSTOM_ELEMENTS_SCHEMA,
//   HostListener,
//   OnInit,
// } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { CommonModule } from '@angular/common';
// import { TransferService } from '../../services/transfer.service';
// import { AuthService } from '../../services/auth.service';
// import { countries, rates, countryPrefixes } from '../../data';
// import { BeneficiaryDTO } from '../../types/BeneficiaryDTO';
// import { SidebarComponent } from '../sidebar/sidebar.component';
// import { Stripe, StripeCardElement } from '@stripe/stripe-js';
// import { loadStripe } from '@stripe/stripe-js';
// import { UserService } from '../../services/user.service';

// @Component({
//   selector: 'app-dashboard',
//   standalone: true,
//   imports: [CommonModule, FormsModule, SidebarComponent],
//   templateUrl: './dashboard.component.html',
//   styleUrls: ['./dashboard.component.scss'],
// })
// export class DashboardComponent implements OnInit {
//   constructor(
//     private transferService: TransferService,
//     private authService: AuthService,
//     private userService: UserService
//   ) {}

//   stripe!: Stripe | null;
//   cardElement!: StripeCardElement;

//   // ------------------------------
//   // Data & dropdowns
//   // ------------------------------
//   countries: any[] = [];
//   countryPrefixes: any[] = [];
//   beneficiaries: any[] = [];
//   rates: any = null;

//   filteredCountries: any[] = [];
//   filteredBeneficiaries: any[] = [];

//   // ------------------------------
//   // User info
//   // ------------------------------
//   balance: number | null = 0;
//   recentTransfers: any[] = [];
//   senderCurrency: string = 'USD';

//   // ------------------------------
//   // Beneficiary
//   // ------------------------------
//   selectedBeneficiary: string = '';
//   selectedBeneficiaryId: number | null = null;
//   toUserId: number | null = null;
//   toBeneficiaryId: number | null = null;
//   showAddBeneficiary: boolean = false;
//   newBeneficiary: Partial<BeneficiaryDTO> = {
//     fullName: '',
//     prefix: '',
//     phoneNumber: '',
//     email: '',
//   };

//   // ------------------------------
//   // Country
//   // ------------------------------
//   selectedCountry: string = '';
//   receiverCurrency: string = '';
//   flagCountry: string = '';

//   // ------------------------------
//   // Amounts
//   // ------------------------------
//   amountSender: number | null = null;
//   amountReceiver: number | null = null;

//   // ------------------------------
//   // Card info
//   // ------------------------------
//   cardInfo = { cardNumber: '', expiryMonth: '', expiryYear: '', cvv: '' };
//   loading: boolean = false;

//   // ------------------------------
//   // Messages
//   // ------------------------------
//   error: string = '';
//   success: string = '';
//   openDropdown: 'country' | 'beneficiary' | null = null;

//   // ------------------------------
//   // Lifecycle
//   // ------------------------------
//   async ngOnInit(): Promise<void> {
//     this.loadUserData();
//     this.loadBeneficiaries();
//     this.countries = countries;
//     this.countryPrefixes = countryPrefixes;
//     this.rates = rates;
//     // All of this part is for stripe management
//     this.stripe = await loadStripe(
//       'pk_test_51SCPMhPbpQBxJwBbKvhe3XYU6CDsSwrauS6NYKXjsXsTFW77Uk98tAlrfDincSjq89Ojt8F87Sd9X9YXL63NFRVv00KJAzUqkt'
//     );

//     const elements = this.stripe!.elements();
//     this.cardElement = elements.create('card');
//     this.cardElement.mount('#card-element'); // make sure you have <div id="card-element"></div> in template
//   }

//   @HostListener('document:click')
//   closeAllDropdowns() {
//     this.openDropdown = null;
//   }

//   // ------------------------------
//   // Load user info & recent transfers
//   // ------------------------------
//   // loadUserData() {
//   //   this.authService.getCurrentUser().subscribe({
//   //     next: (user: any) => {
//   //       if (!user) return;
//   //       this.balance = user.balance;
//   //       this.senderCurrency = user.currency || 'USD';
//   //       this.loadTransfers(user.id);
//   //     },
//   //     error: (err) => {
//   //       this.error = 'Failed to load user info';
//   //       console.error(err);
//   //     },
//   //   });
//   // }

//   loadUserData() {
//     this.authService.getCurrentUser().subscribe({
//       next: (user: any) => {
//         if (!user) return; // Sanity check
//         this.balance = user.balance;

//         this.senderCurrency = user.currency || 'USD';
//         this.loadTransfers();
//       },
//       error: (err) => {
//         this.error = 'Failed to load user info';
//         console.error(err);
//       },
//     });
//   }

//   // loadTransfers(userId: number) {
//   //   this.transferService.getTransfers(userId).subscribe({
//   //     next: (transfers) => {
//   //       this.recentTransfers = transfers.slice(-5).reverse();
//   //     },
//   //     error: (err) => console.error(err),
//   //   });
//   // }

//   loadTransfers() {
//     this.transferService.getTransfers().subscribe({
//       next: (transfers) => {
//         this.recentTransfers = transfers.slice(-5).reverse();
//       },
//       error: (err) => console.error(err),
//     });
//   }

//   // ------------------------------
//   // Beneficiaries
//   // ------------------------------
//   loadBeneficiaries() {
//     this.transferService.getBeneficiaries().subscribe({
//       next: (list) => (this.beneficiaries = list),
//       error: (err) => console.error('Failed to load beneficiaries', err),
//     });
//   }

//   filterBeneficiaries() {
//     const term = this.selectedBeneficiary.toLowerCase();
//     this.filteredBeneficiaries = this.beneficiaries.filter(
//       (b) =>
//         b.fullName.toLowerCase().includes(term) ||
//         b.phoneNumber.toLowerCase().includes(term)
//     );
//   }

//   chooseBeneficiary(b: any) {
//     let phoneForFlag = b.phoneNumber;

//     const matches = this.countryPrefixes.find((c) =>
//       phoneForFlag.startsWith(c.prefix)
//     );
//     if (matches) phoneForFlag = matches.flag;

//     this.selectedBeneficiary = ` ${phoneForFlag} ${b.fullName} (${b.phoneNumber})`;
//     // this.toUserId = b.id;
//     this.toBeneficiaryId = b.id;
//     this.filteredBeneficiaries = [];
//     this.openDropdown = null;
//   }

//   // chooseBeneficiary(b: any) {
//   //   this.selectedBeneficiary = `${b.flag} ${b.fullName} (${b.phoneNumber})`;
//   //   this.selectedBeneficiaryId = b.id; // ✅ beneficiary.id goes here
//   //   this.toUserId = null; // clear internal transfer field
//   //   this.filteredBeneficiaries = [];
//   //   this.openDropdown = null;
//   // }

//   addBeneficiary() {
//     this.error = '';
//     this.success = '';

//     // Validate required fields
//     if (!this.newBeneficiary.fullName || !this.newBeneficiary.phoneNumber) {
//       this.error = 'Full name and phone number are required';
//       return;
//     }

//     // Clean phone (remove spaces & dashes)
//     let phone = this.newBeneficiary.prefix + this.newBeneficiary.phoneNumber;
//     // .replace(/\s+/g, '')
//     // .replace(/-/g, '');

//     // end test

//     // Auto-detect prefix from known countryPrefixes
//     const matchedPrefix = this.countryPrefixes.find((c) =>
//       phone.startsWith(c.prefix)
//     );
//     console.log('matchedPrefix: WITH "+ ' + matchedPrefix);
//     console.log('matchedPrefix WITH ",": ', matchedPrefix);

//     if (matchedPrefix) {
//       phone = phone;
//       // if (!phone.startsWith('+')) phone = matchedPrefix.prefix + phone;
//     } else {
//       const fallbackPrefix = '+33'; // France default
//       phone = fallbackPrefix + phone;
//     }

//     this.newBeneficiary.phoneNumber = phone;

//     this.loading = true;

//     this.transferService
//       .addBeneficiary({
//         fullName: this.newBeneficiary.fullName,
//         phoneNumber: this.newBeneficiary.phoneNumber,
//         email: this.newBeneficiary.email,
//       })
//       .subscribe({
//         next: (b) => {
//           this.beneficiaries.push(b);
//           this.chooseBeneficiary(b);
//           this.newBeneficiary = { fullName: '', phoneNumber: '', email: '' };
//           this.showAddBeneficiary = false;
//           this.success = 'Beneficiary added successfully!';
//           this.loading = false;
//         },
//         error: (err) => {
//           this.error = err.error?.message || 'Failed to add beneficiary';
//           this.loading = false;
//         },
//       });
//   }

//   // ------------------------------
//   // Country dropdown
//   // ------------------------------
//   filterCountries() {
//     const term = this.selectedCountry.toLowerCase();
//     this.filteredCountries = this.countryPrefixes.filter((c) =>
//       c.name.toLowerCase().includes(term)
//     );
//   }

//   chooseCountry(c: any) {
//     this.flagCountry = c.flag;
//     this.selectedCountry = c.name;
//     this.receiverCurrency = c.currency;
//     this.updateConvertedAmount('sender');
//     this.filteredCountries = [];
//     this.openDropdown = null;
//   }

//   // ------------------------------
//   // Amount conversion
//   // ------------------------------
//   round2(value: number): number {
//     return Number(value.toFixed(2));
//   }

//   updateConvertedAmount(source: 'sender' | 'receiver') {
//     const rate = this.rates?.[this.receiverCurrency] || 1;

//     if (source === 'sender') {
//       this.amountReceiver =
//         this.amountSender != null
//           ? this.round2(this.amountSender * rate)
//           : null;
//     } else {
//       this.amountSender =
//         this.amountReceiver != null
//           ? this.round2(this.amountReceiver / rate)
//           : null;
//     }
//   }

//   // ------------------------------
//   // Send transfer
//   // ------------------------------
//   // sendTransfer() {
//   //   if (!this.toUserId || !this.amountSender) return;

//   //   if (
//   //     !this.cardInfo.cardNumber ||
//   //     !this.cardInfo.expiryMonth ||
//   //     !this.cardInfo.expiryYear ||
//   //     !this.cardInfo.cvv
//   //   ) {
//   //     this.error = 'Please fill in all card details';
//   //     return;
//   //   }

//   //   this.error = '';
//   //   this.success = '';
//   //   this.loading = true;

//   //   this.authService.getCurrentUser().subscribe({
//   //     next: (user: any) => {
//   //       if (!user) {
//   //         this.error = 'User not found';
//   //         this.loading = false;
//   //         return;
//   //       }

//   //       this.transferService
//   //         .createTransfer(
//   //           user.id,
//   //           this.selectedBeneficiaryId,
//   //           this.amountSender
//   //         )
//   //         .subscribe({
//   //           next: () => {
//   //             this.success = 'Transfer successful!';
//   //             this.loadUserData();
//   //             this.resetTransferForm();
//   //           },
//   //           error: (err) => {
//   //             this.error = err.error?.message || 'Transfer failed';
//   //             this.loading = false;
//   //           },
//   //         });
//   //     },
//   //     error: () => {
//   //       this.error = 'Failed to load current user';
//   //       this.loading = false;
//   //     },
//   //   });
//   // }

//   // dashboard.component.ts

//   // sendTransfer() {
//   //   if (!this.toUserId && !this.toBeneficiaryId) {
//   //     this.error = 'Please select a recipient';
//   //     return;
//   //   }
//   //   if (!this.amountSender) {
//   //     this.error = 'Please enter an amount';
//   //     return;
//   //   }

//   //   // Determine if the user is using a card
//   //   const usingCard =
//   //     this.cardInfo.cardNumber &&
//   //     this.cardInfo.expiryMonth &&
//   //     this.cardInfo.expiryYear &&
//   //     this.cardInfo.cvv;

//   //   this.error = '';
//   //   this.success = '';
//   //   this.loading = true;

//   //   this.authService.getCurrentUser().subscribe({
//   //     next: (user: any) => {
//   //       if (!user) {
//   //         this.error = 'User not found';
//   //         this.loading = false;
//   //         return;
//   //       }

//   //       this.transferService
//   //         .createTransfer(
//   //           user.id,
//   //           this.toUserId || null,
//   //           this.toBeneficiaryId || null,
//   //           this.amountSender,
//   //           !!usingCard // tell backend if it’s card or wallet
//   //         )
//   //         .subscribe({
//   //           next: (transfer) => {
//   //             console.log('Transfer: ', transfer);
//   //             this.success = 'Transfer successful!';
//   //             this.loadUserData(); // refresh balance and transfers
//   //             this.resetTransferForm();
//   //           },
//   //           error: (err) => {
//   //             this.error = err.error?.message || 'Transfer failed';
//   //             this.loading = false;
//   //           },
//   //         });
//   //     },
//   //     error: () => {
//   //       this.error = 'Failed to load current user';
//   //       this.loading = false;
//   //     },
//   //   });
//   // }

//   async sendTransfer() {
//     if (!this.toUserId && !this.toBeneficiaryId) {
//       this.error = 'Please select a recipient';
//       return;
//     }
//     if (!this.amountSender) {
//       this.error = 'Please enter an amount';
//       return;
//     }

//     this.error = '';
//     this.success = '';
//     this.loading = true;

//     try {
//       // 1️⃣ Get current user
//       const user: any = await this.authService.getCurrentUser().toPromise();
//       if (!user) {
//         this.error = 'User not found';
//         this.loading = false;
//         return;
//       }

//       // 2️⃣ Determine if the user is using a card
//       const usingCard =
//         this.cardInfo.cardNumber &&
//         this.cardInfo.expiryMonth &&
//         this.cardInfo.expiryYear &&
//         this.cardInfo.cvv;

//       // 3️⃣ Ensure a payment method is attached if using a card
//       if (usingCard) {
//         // Create a PaymentMethod via Stripe.js
//         if (!this.stripe) {
//           this.error = 'Stripe is not initialized';
//           this.loading = false;
//           return;
//         }
//         const { paymentMethod, error } = await this.stripe.createPaymentMethod({
//           type: 'card',
//           card: this.cardElement, // Your Stripe Card Element
//         });

//         if (error) {
//           this.error = error.message ?? 'An error occurred';
//           this.loading = false;
//           return;
//         }

//         // Attach the PaymentMethod to the backend user
//         await this.userService
//           .attachPaymentMethod(user.id, paymentMethod.id)
//           .toPromise();
//       }

//       // 4️⃣ Call backend transfer API
//       const transfer = await this.transferService
//         .createTransfer(
//           user.id,
//           this.toUserId || null,
//           this.toBeneficiaryId || null,
//           this.amountSender,
//           !!usingCard // only flag, backend reads stored PaymentMethod
//         )
//         .toPromise();

//       console.log('Transfer:', transfer);
//       this.success = 'Transfer successful!';
//       this.loadUserData(); // refresh balance and transfers
//       this.resetTransferForm();
//     } catch (err: any) {
//       console.error(err);
//       this.error = err.error?.message || 'Transfer failed';
//     } finally {
//       this.loading = false;
//     }
//   }

//   // Reset form after a successful transfer
//   resetTransferForm() {
//     this.amountSender = null;
//     this.amountReceiver = null;
//     this.selectedBeneficiary = '';
//     this.toUserId = null;
//     this.toBeneficiaryId = null;
//     this.selectedCountry = '';
//     this.cardInfo = {
//       cardNumber: '',
//       expiryMonth: '',
//       expiryYear: '',
//       cvv: '',
//     };
//     this.openDropdown = null;
//   }

//   // for testing
//   sendTransferTest() {
//     if (!this.toBeneficiaryId || !this.amountSender) {
//       this.error = 'Please select a recipient and enter an amount';
//       return;
//     }

//     this.error = '';
//     this.success = '';
//     this.loading = true;

//     this.authService.getCurrentUser().subscribe({
//       next: (user: any) => {
//         if (!user) {
//           this.error = 'User not found';
//           this.loading = false;
//           return;
//         }

//         this.transferService
//           .createTransfer(
//             user.id,
//             null,
//             this.toBeneficiaryId, // toBeneficiaryId
//             this.amountSender,
//             true // fromCard
//           )
//           .subscribe({
//             next: () => {
//               this.loading = true;
//               setTimeout(() => (this.loading = false), 2000);
//               this.success = 'Transfer successful!';
//               this.loadUserData();
//               this.resetTransferForm();
//             },
//             error: (err) => {
//               this.error = err.error?.message || 'Transfer failed';
//               this.loading = false;
//             },
//           });
//       },
//       error: () => {
//         this.error = 'Failed to load current user';
//         this.loading = false;
//       },
//     });
//   }

//   onCountryCodeChange(event: Event) {
//     const selectedPrefix = (event.target as HTMLSelectElement).value;
//     console.log('Selected prefix:', selectedPrefix);

//     // Example: auto-update phone number with prefix
//     if (
//       this.newBeneficiary.phoneNumber &&
//       !this.newBeneficiary.phoneNumber.startsWith(selectedPrefix)
//     ) {
//       this.newBeneficiary.phoneNumber =
//         selectedPrefix + this.newBeneficiary.phoneNumber.replace(/^\+?\d*/, '');
//     }
//   }

//   // ------------------------------
//   // Dropdown open handler
//   // ------------------------------
//   onDropdownMenu(type: 'country' | 'beneficiary', event: FocusEvent) {
//     event.stopPropagation();
//     this.openDropdown = type;

//     if (type === 'country') this.filteredCountries = [...this.countryPrefixes];
//     if (type === 'beneficiary')
//       this.filteredBeneficiaries = [...this.beneficiaries];
//   }

//   closeModal() {
//     this.showAddBeneficiary = false;
//   }
// }

import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  HostListener,
  OnInit,
  ElementRef,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TransferService } from '../../services/transfer.service';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { countries, rates, countryPrefixes } from '../../data';
import { BeneficiaryDTO } from '../../types/BeneficiaryDTO';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { Stripe, StripeCardElement } from '@stripe/stripe-js';
import { loadStripe } from '@stripe/stripe-js';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, AfterViewInit {
  // ------------------------------
  // Stripe integration
  // ------------------------------
  stripe!: Stripe | null;
  cardElement!: StripeCardElement;
  @ViewChild('cardContainer') cardContainer!: ElementRef;

  // ------------------------------
  // Data & dropdowns
  // ------------------------------
  countries: any[] = [];
  countryPrefixes: any[] = [];
  beneficiaries: BeneficiaryDTO[] = [];
  rates: any = null;

  filteredCountries: any[] = [];
  filteredBeneficiaries: BeneficiaryDTO[] = [];

  // ------------------------------
  // User info
  // ------------------------------
  balance: number | null = 0;
  senderCurrency: string = 'USD';
  recentTransfers: any[] = [];

  // ------------------------------
  // Beneficiary
  // ------------------------------
  selectedBeneficiary: string = '';
  selectedBeneficiaryId: number | null = null;
  toUserId: number | null = null;
  toBeneficiaryId: number | null = null;
  showAddBeneficiary: boolean = false;
  newBeneficiary: Partial<BeneficiaryDTO> = {
    fullName: '',
    prefix: '',
    phoneNumber: '',
    email: '',
  };

  // ------------------------------
  // Country
  // ------------------------------
  selectedCountry: string = '';
  receiverCurrency: string = '';
  flagCountry: string = '';

  // ------------------------------
  // Amounts
  // ------------------------------
  amountSender: number | null = null;
  amountReceiver: number | null = null;

  // ------------------------------
  // Card info
  // ------------------------------
  cardInfo = { cardNumber: '', expiryMonth: '', expiryYear: '', cvv: '' };

  // ------------------------------
  // Loading & messages
  // ------------------------------
  loading: boolean = false;
  error: string = '';
  success: string = '';
  openDropdown: 'country' | 'beneficiary' | null = null;

  constructor(
    private transferService: TransferService,
    private authService: AuthService,
    private userService: UserService
  ) {}

  // ------------------------------
  // Lifecycle
  // ------------------------------
  ngOnInit(): void {
    this.loadUserData();
    this.loadBeneficiaries();
    this.countries = countries;
    this.countryPrefixes = countryPrefixes;
    this.rates = rates;
  }

  ngAfterViewInit(): void {
    this.initStripe();
  }

  // ------------------------------
  // Stripe initialization
  // ------------------------------
  private async initStripe() {
    this.stripe = await loadStripe(
      'pk_test_51SCPMhPbpQBxJwBbKvhe3XYU6CDsSwrauS6NYKXjsXsTFW77Uk98tAlrfDincSjq89Ojt8F87Sd9X9YXL63NFRVv00KJAzUqkt'
    );
    if (!this.stripe) {
      console.error('Stripe failed to load');
      return;
    }

    const elements = this.stripe.elements();
    this.cardElement = elements.create('card');

    if (this.cardContainer) {
      this.cardElement.mount(this.cardContainer.nativeElement);
    } else {
      console.error('Card container not found');
    }
  }

  // ------------------------------
  // Close dropdowns on click outside
  // ------------------------------
  @HostListener('document:click')
  closeAllDropdowns() {
    this.openDropdown = null;
  }

  // ------------------------------
  // Load user info & recent transfers
  // ------------------------------
  private loadUserData() {
    this.authService.getCurrentUser().subscribe({
      next: (user: any) => {
        if (!user) return;
        this.balance = user.balance;
        this.senderCurrency = user.currency || 'USD';
        this.loadTransfers();
      },
      error: (err) => {
        this.error = 'Failed to load user info';
        console.error(err);
      },
    });
  }

  private loadTransfers() {
    this.transferService.getTransfers().subscribe({
      next: (transfers) => {
        this.recentTransfers = transfers.slice(-5).reverse();
      },
      error: (err) => console.error(err),
    });
  }

  // ------------------------------
  // Load beneficiaries
  // ------------------------------
  private loadBeneficiaries() {
    this.transferService.getBeneficiaries().subscribe({
      next: (list) => (this.beneficiaries = list),
      error: (err) => console.error('Failed to load beneficiaries', err),
    });
  }

  filterBeneficiaries() {
    const term = this.selectedBeneficiary.toLowerCase();
    this.filteredBeneficiaries = this.beneficiaries.filter(
      (b) =>
        b.fullName.toLowerCase().includes(term) ||
        b.phoneNumber.toLowerCase().includes(term)
    );
  }

  chooseBeneficiary(b: BeneficiaryDTO) {
    let phoneForFlag = b.phoneNumber;
    const match = this.countryPrefixes.find((c) =>
      phoneForFlag.startsWith(c.prefix)
    );
    if (match) phoneForFlag = match.flag;

    this.selectedBeneficiary = ` ${phoneForFlag} ${b.fullName} (${b.phoneNumber})`;
    this.toBeneficiaryId = b.id;
    this.filteredBeneficiaries = [];
    this.openDropdown = null;
  }

  addBeneficiary() {
    this.error = '';
    this.success = '';

    if (!this.newBeneficiary.fullName || !this.newBeneficiary.phoneNumber) {
      this.error = 'Full name and phone number are required';
      return;
    }

    let phone =
      (this.newBeneficiary.prefix || '') + this.newBeneficiary.phoneNumber;
    const matchedPrefix = this.countryPrefixes.find((c) =>
      phone.startsWith(c.prefix)
    );
    if (!matchedPrefix) phone = '+33' + phone; // fallback

    this.newBeneficiary.phoneNumber = phone;
    this.loading = true;

    this.transferService
      .addBeneficiary(this.newBeneficiary as BeneficiaryDTO)
      .subscribe({
        next: (b) => {
          this.beneficiaries.push(b);
          this.chooseBeneficiary(b);
          this.newBeneficiary = { fullName: '', phoneNumber: '', email: '' };
          this.showAddBeneficiary = false;
          this.success = 'Beneficiary added successfully!';
          this.loading = false;
        },
        error: (err) => {
          this.error = err.error?.message || 'Failed to add beneficiary';
          this.loading = false;
        },
      });
  }

  // ------------------------------
  // Country dropdown
  // ------------------------------
  filterCountries() {
    const term = this.selectedCountry.toLowerCase();
    this.filteredCountries = this.countryPrefixes.filter((c) =>
      c.name.toLowerCase().includes(term)
    );
  }

  chooseCountry(c: any) {
    this.flagCountry = c.flag;
    this.selectedCountry = c.name;
    this.receiverCurrency = c.currency;
    this.updateConvertedAmount('sender');
    this.filteredCountries = [];
    this.openDropdown = null;
  }

  // ------------------------------
  // Amount conversion
  // ------------------------------
  private round2(value: number): number {
    return Number(value.toFixed(2));
  }

  updateConvertedAmount(source: 'sender' | 'receiver') {
    const rate = this.rates?.[this.receiverCurrency] || 1;

    if (source === 'sender') {
      this.amountReceiver =
        this.amountSender != null
          ? this.round2(this.amountSender * rate)
          : null;
    } else {
      this.amountSender =
        this.amountReceiver != null
          ? this.round2(this.amountReceiver / rate)
          : null;
    }
  }

  // ------------------------------
  // Send transfer (wallet or card)
  // ------------------------------
  async sendTransfer() {
    if (!this.toUserId && !this.toBeneficiaryId) {
      this.error = 'Please select a recipient';
      return;
    }
    if (!this.amountSender) {
      this.error = 'Please enter an amount';
      return;
    }

    this.error = '';
    this.success = '';
    this.loading = true;

    try {
      // Get current user
      const user: any = await this.authService.getCurrentUser().toPromise();
      if (!user) {
        this.error = 'User not found';
        this.loading = false;
        return;
      }

      // Determine if card payment
      const usingCard =
        this.cardInfo.cardNumber &&
        this.cardInfo.expiryMonth &&
        this.cardInfo.expiryYear &&
        this.cardInfo.cvv;

      // Attach Stripe payment method if card
      if (usingCard) {
        if (!this.stripe || !this.cardElement) {
          this.error = 'Stripe not ready';
          this.loading = false;
          return;
        }

        const { paymentMethod, error } = await this.stripe.createPaymentMethod({
          type: 'card',
          card: this.cardElement,
        });

        if (error) {
          this.error = error.message ?? 'Payment failed';
          this.loading = false;
          return;
        }

        await this.userService
          .attachPaymentMethod(user.id, paymentMethod.id)
          .toPromise();
      }

      // Call backend transfer API
      const transfer = await this.transferService
        .createTransfer(
          user.id,
          this.toUserId || null,
          this.toBeneficiaryId || null,
          this.amountSender,
          !!usingCard
        )
        .toPromise();

      console.log('Transfer:', transfer);
      this.success = 'Transfer successful!';
      this.loadUserData();
      this.resetTransferForm();
    } catch (err: any) {
      console.error(err);
      this.error = err.error?.message || 'Transfer failed';
    } finally {
      this.loading = false;
    }
  }

  // ------------------------------
  // Reset transfer form
  // ------------------------------
  resetTransferForm() {
    this.amountSender = null;
    this.amountReceiver = null;
    this.selectedBeneficiary = '';
    this.toUserId = null;
    this.toBeneficiaryId = null;
    this.selectedCountry = '';
    this.cardInfo = {
      cardNumber: '',
      expiryMonth: '',
      expiryYear: '',
      cvv: '',
    };
    this.openDropdown = null;
  }

  // ------------------------------
  // Dropdown open handlers
  // ------------------------------
  onDropdownMenu(type: 'country' | 'beneficiary', event: FocusEvent) {
    event.stopPropagation();
    this.openDropdown = type;
    if (type === 'country') this.filteredCountries = [...this.countryPrefixes];
    if (type === 'beneficiary')
      this.filteredBeneficiaries = [...this.beneficiaries];
  }

  // ------------------------------
  // Close add beneficiary modal
  // ------------------------------
  closeModal() {
    this.showAddBeneficiary = false;
  }

  // ------------------------------
  // Handle country code change in beneficiary form
  // ------------------------------
  onCountryCodeChange(event: Event) {
    const selectedPrefix = (event.target as HTMLSelectElement).value;
    if (
      this.newBeneficiary.phoneNumber &&
      !this.newBeneficiary.phoneNumber.startsWith(selectedPrefix)
    ) {
      this.newBeneficiary.phoneNumber =
        selectedPrefix + this.newBeneficiary.phoneNumber.replace(/^\+?\d*/, '');
    }
  }
}
