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

    this.selectedBeneficiary = `${phoneForFlag} ${b.fullName} ${b.phoneNumber}`;
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

      let usingCard = false;

      if (user.hasSavedCard) {
        usingCard = true;
      } else if (
        this.cardInfo.cardNumber &&
        this.cardInfo.expiryMonth &&
        this.cardInfo.expiryYear &&
        this.cardInfo.cvv
      ) {
        usingCard = true;

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

      // // Attach Stripe payment method only if no card is saved
      // if (usingCard && !user.hasSavedCard) {
      //   if (!this.stripe || !this.cardElement) {
      //     this.error = 'Stripe not ready';
      //     this.loading = false;
      //     return;
      //   }
      //   const { paymentMethod, error } = await this.stripe.createPaymentMethod({
      //     type: 'card',
      //     card: this.cardElement,
      //   });

      //   if (error) {
      //     this.error = error.message ?? 'Payment failed';
      //     this.loading = false;
      //     return;
      //   }

      //   await this.userService
      //     .attachPaymentMethod(user.id, paymentMethod.id)
      //     .toPromise();
      // }

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
