import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core'; // Added OnInit
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DatabaseService } from 'src/app/database.service';
import { IpoService } from 'src/app/services/ipo.service';
import { finalize } from 'rxjs/operators'; // Import finalize operator

@Component({
  selector: 'app-register-ipo-details',
  templateUrl: './register-ipo-details.component.html',
  styleUrls: ['./register-ipo-details.component.css']
})
export class RegisterIpoDetailsComponent implements OnInit { // Implement OnInit
  existingRhpFilename: string | null = null;
  existingDrhpFilename: string | null = null;

  isLoading: boolean = false; // <-- ADDED: Property to control loader visibility

  constructor(private fb: FormBuilder, private ipoService: IpoService, private http: HttpClient, private router: Router, private route: ActivatedRoute) { }

  companyDetails = new FormGroup({
    companyName: new FormControl('Vodafone idea', [Validators.required]),
    priceBand: new FormControl('123-234', [Validators.required]),
    open: new FormControl('01-02-2024', [Validators.required]),
    close: new FormControl('02-03-2024', [Validators.required]),
    issueSize: new FormControl('23', [Validators.required]),
    issueType: new FormControl('ongoing', [Validators.required]),
    listingDate: new FormControl('03-04-2024', [Validators.required]),
    status: new FormControl('', [Validators.required])
  })
  // for new listed ipos,additional info to collect
  newListedDetails = new FormGroup({
    ipoPrice: new FormControl(''),
    listingPrice: new FormControl(''),
    listingGain: new FormControl(''),
    // listingDate: new FormControl(''),
    cmp: new FormControl(''),
    currentReturn: new FormControl(''),
    rhp: new FormControl(''),
    drhp: new FormControl(''),
  })
  editingId: number | null = null; // Track if in edit mode
  enableNewListedForm() {
    this.newListedDetails.enable();

    this.newListedDetails.get('ipoPrice')?.setValidators([Validators.required]);
    this.newListedDetails.get('listingPrice')?.setValidators([Validators.required]);
    this.newListedDetails.get('listingGain')?.setValidators([Validators.required]);
    // Note: listingDate in newListedDetails is commented out in HTML, so its validator might not be effective unless uncommented
    this.newListedDetails.get('cmp')?.setValidators([Validators.required]);
    this.newListedDetails.get('currentReturn')?.setValidators([Validators.required]);

    this.newListedDetails.updateValueAndValidity();
  }


  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.editingId = +id;

        this.ipoService.getIPO(this.editingId).subscribe((ipo: any) => {
          console.log('IPO response from API:', ipo);
          console.log('Status from API:', ipo.status);
          const isNewListed = ipo.status === 'New Listed';

          // Patch company details first
          this.companyDetails.patchValue({
            companyName: ipo.company_name,
            priceBand: ipo.price_band,
            open: ipo.open_date,
            close: ipo.close_date,
            issueSize: ipo.issue_size,
            issueType: ipo.issue_type,
            listingDate: ipo.listing_date,
            status: ipo.status  // Patch this AFTER subscribing below
          });

          // Force enable if status is New Listed BEFORE patching listing details
          if (isNewListed) {
            this.enableNewListedForm();

            // Patch the listing-related fields after enabling
            this.newListedDetails.patchValue({
              ipoPrice: ipo.ipo_price,
              listingPrice: ipo.listing_price,
              listingGain: ipo.listing_gain,
              // listingDate: ipo.listing_date, // This field is commented out in HTML, consider if it's truly needed
              cmp: ipo.cmp,
              currentReturn: ipo.current_return

            });

          } else {
            this.newListedDetails.disable(); // Ensure disabled if not new listed
          }
        });
      }
    });

    // Attach listener AFTER initial load
    this.companyDetails.get('status')?.valueChanges.subscribe(status => {
      if (status === 'New Listed') {
        this.enableNewListedForm();
      } else {
        this.newListedDetails.reset();
        this.newListedDetails.disable();
      }
    });
  }

  onStatusChange() {
    const status = this.companyDetails.get('status')?.value;
    if (status === 'New Listed') {
      this.enableNewListedForm();
    } else {
      this.newListedDetails.reset();
      this.newListedDetails.disable();
    }
  }

  submitIPO() {
    const formValue = this.companyDetails.value;

    if (this.companyDetails.invalid) {
      this.companyDetails.markAllAsTouched();
      alert("Fill all required company details.");
      return;
    }

    const status = this.companyDetails.value.status;
    if (status === 'New Listed' && this.newListedDetails.invalid) {
      this.newListedDetails.markAllAsTouched();
      alert("Fill all required listing details.");
      return;
    }

    const formData = new FormData();
    const companyValues = this.companyDetails.value as Record<string, string | null>;
    for (const key in companyValues) {
      formData.append(key, companyValues[key] ?? '');
    }

    (Object.keys(this.newListedDetails.value) as Array<keyof typeof this.newListedDetails.value>).forEach(key => {
      formData.append(key, this.newListedDetails.value[key] as string ?? '');
    });

    if (this.rhpFile) formData.append('rhp', this.rhpFile);
    if (this.drhpFile) formData.append('drhp', this.drhpFile);

    this.isLoading = true; // <-- ADDED: Show loader before the request starts

    const apiCall = this.editingId
      ? this.ipoService.updateIPO(this.editingId.toString(), formData)
      : this.ipoService.createIPO(formData);

    apiCall.pipe(
      finalize(() => {
        this.isLoading = false; // <-- ADDED: Hide loader when the request completes (success or error)
      })
    ).subscribe({
      next: () => {
        alert("IPO " + (this.editingId ? "updated" : "registered") + " successfully!");
        this.router.navigate(['/upcoming-IPO']); // Navigate on success
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error processing IPO:', error); // Changed from 'Error updating IPO:' for consistency

        let errorMessage = 'Failed to process IPO.'; // Changed from 'Failed to update IPO.'
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

  rhpFile: File | null = null;
  drhpFile: File | null = null;

  onFileChange(event: any, type: 'rhp' | 'drhp') {
    const file = event.target.files[0];
    if (type === 'rhp') this.rhpFile = file;
    else if (type === 'drhp') this.drhpFile = file;
  }

  selectedFile!: File;

  uploadFile() {
    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.http.post(`http://localhost:5000/api/ipos/1/upload`, formData).subscribe(res => {
      alert('Uploaded!');
    });
  }
}