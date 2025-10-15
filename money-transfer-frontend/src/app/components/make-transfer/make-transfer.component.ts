import { Component } from '@angular/core';
import { TransferService } from '../../services/transfer.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-make-transfer',
  imports: [FormsModule],
  templateUrl: './make-transfer.component.html',
  styleUrl: './make-transfer.component.scss',
})
export class MakeTransferComponent {
  amount: number = 0;
  transferId: number = 0; // picked from some transfer selection
  userId!: number;

  constructor(private transferService: TransferService) {}

  ngOnInit() {
    // Assume we load current user somewhere
    this.userId = 2; // just for example
  }

  submit() {
    this.transferService
      .createEntry(this.userId, this.transferId, this.amount)
      .subscribe({
        next: (newEntry) => {
          console.log('Created transaction entry:', newEntry);
          alert('Transaction saved!');
        },
        error: (err) => {
          console.error('Error creating entry:', err);
          alert('Could not save transaction');
        },
      });
  }
}
