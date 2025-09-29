import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardService } from '../../services/card.service';
import { RouterLink } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-payment-info',
  standalone: true,
  imports: [CommonModule, SidebarComponent],
  templateUrl: './payment-infos.component.html',
  styleUrls: ['./payment-infos.component.scss'],
})
export class PaymentInfosComponent implements OnInit {
  cards: any[] = [];
  loading = true;
  error = '';

  constructor(private cardService: CardService) {}

  ngOnInit(): void {
    this.cardService.getMyCards().subscribe({
      next: (data) => {
        this.cards = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load cards';
        this.loading = false;
      },
    });
  }
}
