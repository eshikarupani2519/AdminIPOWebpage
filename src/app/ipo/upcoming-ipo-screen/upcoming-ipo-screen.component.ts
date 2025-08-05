import { Component, OnInit } from '@angular/core'; // Added OnInit
import { Router } from '@angular/router';
import { IpoService } from 'src/app/services/ipo.service';
import { HttpErrorResponse } from '@angular/common/http'; // Import HttpErrorResponse
import { finalize } from 'rxjs/operators'; // Import finalize operator

@Component({
  selector: 'app-upcoming-ipo-screen',
  templateUrl: './upcoming-ipo-screen.component.html',
  styleUrls: ['./upcoming-ipo-screen.component.css']
})
export class UpcomingIpoScreenComponent implements OnInit { // Implemented OnInit
  constructor(private ipoService: IpoService, private router: Router) { }

  ipos: any[] = [];
  loggedInUser: string = '';
  activePage!: number;
  currentPage: number = 1;
  itemsPerPage: number = 6;
  totalPages: number = 0;
  totalPagesArray: number[] = [];
  paginatedIPOs: any = [];

  isLoading: boolean = false; //  Property to control loader visibility

  ngOnInit() {
    this.itemsPerPage=window.innerWidth < 1000 ? 4 : 6;
    this.loadIPOs(); 
  }
updateIPOsList(newIpos: any[]) {
  this.ipos = newIpos;
  this.currentPage = 1; 
  this.totalPages = Math.ceil(this.ipos.length / this.itemsPerPage);
  this.updatePaginatedIPOs(); 
  console.log("Parent component updated IPO list:", this.ipos);
}
updatePaginatedIPOs() {
  const startIndex = (this.currentPage - 1) * this.itemsPerPage;
  const endIndex = startIndex + this.itemsPerPage;
  this.paginatedIPOs = this.ipos.slice(startIndex, endIndex);
}
  // ADDED: Method to load IPOs and handle pagination update
  loadIPOs() {
    this.isLoading = true; // Show loader when fetching IPOs
    this.ipoService.getAllIPOs().pipe(
      finalize(() => {
        this.isLoading = false; // Hide loader after fetching IPOs
      })
    ).subscribe({
      next: (ipos) => {
        this.ipos = ipos as any[];
        console.log(this.ipos);
        this.updatePagination();
      },
      error: (err) => {
        console.error('Error fetching IPOs:', err);
        alert('Failed to load IPOs. Please try again.');
      }
    });
  }

  goToRegisterIpo() {
    this.router.navigate(['register-ipo-details'])
  }

  updatePagination() {
    console.log('update pagination');
    this.totalPages = Math.ceil(this.ipos.length / this.itemsPerPage);
    this.totalPagesArray = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;

    // Ensure currentPage is valid after potential deletion
    if (this.currentPage > this.totalPages && this.totalPages > 0) {
      this.currentPage = this.totalPages;
    } else if (this.totalPages === 0) {
      this.currentPage = 1; // Reset to 1 if no pages
    }

    if (this.ipos.length > 0) { // Only paginate if there are IPOs
      this.paginatedIPOs = this.ipos.slice(startIndex, endIndex);
      console.log('pagination applied');
    } else {
      this.paginatedIPOs = []; // No IPOs, so empty the paginated list
      console.log('no IPOs to paginate');
    }
  }

  goToPage(event: Event, page: number) {
    event.preventDefault();
    if (page >= 1 && page <= this.totalPages) { // Ensure page is within bounds
      this.currentPage = page;
      this.updatePagination();
    }
  }

  goToPreviousPage(event: Event) {
    event.preventDefault();
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  goToNextPage(event: Event) {
    event.preventDefault();
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  editIPO(id: number) {
    this.router.navigate(['/register-ipo-details'], { queryParams: { id: id } });
  }

  selectedIPO: any;

  viewDetails(ipo: any) {
    this.selectedIPO = ipo;
  }

  // --- ADDED: Delete IPO functionality ---
  deleteIPO(id: number) {
    if (confirm(`Are you sure you want to delete this IPO (ID: ${id})? This action cannot be undone.`)) {
      this.isLoading = true; // Show loader during deletion
      this.ipoService.deleteIPO(id).pipe(
        finalize(() => {
          this.isLoading = false; // Hide loader after completion
        })
      ).subscribe({
        next: () => {
          alert("IPO deleted successfully!");
          // Remove the deleted IPO from the local array and update pagination
          this.ipos = this.ipos.filter(ipo => ipo.id !== id);
          this.updatePagination();
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error deleting IPO:', error);
          let errorMessage = 'Failed to delete IPO.';
          if (error.error?.message) {
            errorMessage += ' ' + error.error.message;
          } else if (typeof error.error === 'string') {
            errorMessage += ' ' + error.error;
          } else if (error.message) {
            errorMessage += ' ' + error.message;
          }
          alert(errorMessage);
        }
      });
    }
  }
  // --- END ADDED: Delete IPO functionality ---
}