// src/app/components/transaction-history/transaction-history.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLinkActive } from '@angular/router';
import { TransferService } from '../../services/transfer.service';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HistoryItem } from '../../models/HistoryItem';

@Component({
  selector: 'app-transaction-history',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  templateUrl: './transaction-history.component.html',
  styleUrls: ['./transaction-history.component.scss'],
})
export class TransactionHistoryComponent implements OnInit {
  userId!: number;
  // history: any[] = [];
  history: HistoryItem[] = [];

  errorMessage: string | null = null;
  loading = true;
  limit: number = 20; // default

  constructor(
    private route: ActivatedRoute,
    private transferService: TransferService
  ) {}

  ngOnInit(): void {
    this.getCurrentUser();
  }

  getCurrentUser() {
    this.transferService.getCurrentUser().subscribe({
      next: (user: any) => {
        this.userId = user.id;
        this.loadHistory();
      },
      error: (err) => {
        console.error('Could not load current user', err);
        this.loading = false;
      },
    });
  }

  private loadHistory() {
    this.transferService.getUserTail(this.userId).subscribe({
      next: (tail: any) => {
        if (!tail) {
          this.history = [];
          this.loading = false;
          return;
        }
        this.traverseBackward(tail); // 🔥 walk backwards from tail
      },
      error: (err: any) => {
        this.errorMessage = 'Could not load transaction history';
        this.loading = false;
        console.error(err);
      },
    });
  }

  // private traverseBackward(node: any) {
  //   this.history = []; // reset
  //   let current = node;

  //   const fetchPrev = () => {
  //     if (!current) {
  //       this.loading = false;
  //       return;
  //     }

  //     // ✅ push newest first
  //     this.history.push(current);

  //     if (current.prevEntryId) {
  //       this.transferService.getEntry(current.prevEntryId).subscribe({
  //         next: (prevNode: any) => {
  //           current = prevNode;
  //           fetchPrev();
  //         },
  //         error: (err: any) => {
  //           console.error('Error traversing list backward:', err);
  //           this.loading = false;
  //         },
  //       });
  //     } else {
  //       this.loading = false;
  //     }
  //   };

  //   fetchPrev();
  // }
  private traverseBackward(node: HistoryItem, limit: number = this.limit) {
    this.history = [];
    let current: HistoryItem | null = node;
    let count = 0;

    const fetchPrev = () => {
      if (!current || count >= limit) {
        this.loading = false;
        return;
      }

      this.history.push(current);
      count++;

      if (current.prevEntryId) {
        this.transferService.getEntry(current.prevEntryId).subscribe({
          next: (prevNode: HistoryItem) => {
            current = prevNode;
            fetchPrev();
          },
          error: (err: any) => {
            console.error('Error traversing list backward:', err);
            this.loading = false;
          },
        });
      } else {
        this.loading = false;
      }
    };

    fetchPrev();
  }

  onLimitChange(newLimit: number) {
    this.limit = newLimit;
    this.loading = true;
    this.transferService.getUserTail(this.userId).subscribe({
      next: (tail: any) => {
        if (tail) this.traverseBackward(tail, this.limit);
      },
    });
  }
}
