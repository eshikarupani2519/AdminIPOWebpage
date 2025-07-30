import { Component, OnInit } from '@angular/core';
import { IpoService } from 'src/app/services/ipo.service'; // Import IpoService
import { finalize } from 'rxjs/operators'; // Import finalize for loader

@Component({
  selector: 'app-page-body',
  templateUrl: './page-body.component.html',
  styleUrls: ['./page-body.component.css']
})
export class PageBodyComponent implements OnInit {
  IPOs: any[] = [];
  isLoading: boolean = false; // Add loading state

  constructor(private ipoService: IpoService) { } // Inject IpoService

  ngOnInit() {
    this.loadNewListedIPOs();
  }

  loadNewListedIPOs() {
    this.isLoading = true; // Show loader
    this.ipoService.getAllIPOs().pipe( // Fetch all IPOs
      finalize(() => {
        this.isLoading = false; // Hide loader when complete
      })
    ).subscribe({
      next: (data: any) => {
        // Filter for 'New Listed' IPOs
        this.IPOs = data.filter((ipo: any) => ipo.status === 'New Listed');
        console.log('New Listed IPOs:', this.IPOs);
      },
      error: (error) => {
        console.error('Error fetching new listed IPOs:', error);
        alert('Failed to load new listed IPOs. Please try again.');
        this.IPOs = []; // Clear IPOs on error
      }
    });
  }
}