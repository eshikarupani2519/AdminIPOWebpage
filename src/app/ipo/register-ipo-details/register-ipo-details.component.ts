// register-ipo-details.ts
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IpoService } from 'src/app/services/ipo.service';
import { finalize } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-register-ipo-details',
  templateUrl: './register-ipo-details.component.html',
  styleUrls: ['./register-ipo-details.component.css']
})
export class RegisterIpoDetailsComponent implements OnInit {
  // Existing properties
   // Make sure this import exists

// ... inside your RegisterIpoDetailsComponent class
private backendBaseUrl = environment.apiUrl.replace('/api', ''); // Get the base URL (e.g., 'http://localhost:5000')

getLogoPath(logo: string | null): string {
  if (!logo) {
    // Return a default placeholder image if no logo is available
    return 'assets/nse-india-logo.png';
  }

  // Check if the logo is a full URL (http or https)
  if (logo.startsWith('http://') || logo.startsWith('https://')) {
    return logo;
  }
  
  // If it's not a full URL, it's a filename from our server
  // We need to construct the full path to the uploads folder
  return `${this.backendBaseUrl}/uploads/${logo}`;
}
  existingRhpFilename: string | null = null;
  existingDrhpFilename: string | null = null;
  isNewListedDetailsLocked: boolean = false;
  isLoading: boolean = false;
  editingId: number | null = null;

  // New properties for logo handling
  logoFile: File | null = null; // To hold the selected logo file
  logoPreview: string | ArrayBuffer | null = 'assets/nse-india-logo.png'; // To display a preview of the logo
  companyExists: boolean = false; // To track if the company exists in the DB

  constructor(
    private fb: FormBuilder,
    private ipoService: IpoService,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  companyDetails = new FormGroup({
    companyName: new FormControl('', [Validators.required]),
    priceBand: new FormControl('', [Validators.required]),
    open: new FormControl('', [Validators.required]),
    close: new FormControl('', [Validators.required]),
    issueSize: new FormControl('', [Validators.required]),
    issueType: new FormControl('ongoing', [Validators.required]),
    listingDate: new FormControl('', [Validators.required]),
    status: new FormControl('', [Validators.required]),
    // We add a FormControl for the logo here, but it's not bound to an input
    // The logo file is handled separately with the onLogoFileChange method
    companyLogo: new FormControl('')
  });

  newListedDetails = new FormGroup({
    ipoPrice: new FormControl(''),
    listingPrice: new FormControl(''),
    listingGain: new FormControl(''),
    cmp: new FormControl(''),
    currentReturn: new FormControl(''),
    rhp: new FormControl(''),
    drhp: new FormControl('')
  });

  enableNewListedForm() {
    this.newListedDetails.enable();
    this.newListedDetails.get('ipoPrice')?.setValidators([Validators.required]);
    this.newListedDetails.get('listingPrice')?.setValidators([Validators.required]);
    this.newListedDetails.get('listingGain')?.setValidators([Validators.required]);
    this.newListedDetails.get('cmp')?.setValidators([Validators.required]);
    this.newListedDetails.get('currentReturn')?.setValidators([Validators.required]);
    this.newListedDetails.updateValueAndValidity();
  }
navigateToPage(page:string){
  this.router.navigate([page]);
}
ngOnInit() {
  //  check if we're in edit mode.
  this.route.queryParams.subscribe(params => {
    const id = params['id'];

    if (id) {
      // We are in EDIT mode
      this.editingId = +id;

      //  Since we're editing an existing IPO, the company already exists.
     
      this.companyExists = true;

      this.ipoService.getIPO(this.editingId).subscribe((ipo: any) => {
        console.log('IPO response from API:', ipo);
        
        // Patch the form with existing IPO data
        this.companyDetails.patchValue({
          companyName: ipo.company_name,
          priceBand: ipo.price_band,
          open: ipo.open_date,
          close: ipo.close_date,
          issueSize: ipo.issue_size,
          issueType: ipo.issue_type,
          listingDate: ipo.listing_date,
          status: ipo.status,
        });

        this.logoPreview = this.getLogoPath(ipo.logo);
        
 
        this.existingRhpFilename = ipo.rhp;
        this.existingDrhpFilename = ipo.drhp;

        // Conditional logic for New Listed details
        if (ipo.ipo_price) {
          this.isNewListedDetailsLocked = true;
          this.newListedDetails.patchValue({
            ipoPrice: ipo.ipo_price,
            listingPrice: ipo.listing_price,
            listingGain: ipo.listing_gain,
            cmp: ipo.cmp,
            currentReturn: ipo.current_return,
          });
          this.newListedDetails.disable();
        } else {
          this.newListedDetails.enable();
        }
      });
    } else {
      // We are in CREATE new IPO mode
      this.newListedDetails.disable();
      this.logoPreview = 'assets/nse-india-logo.png';
      this.companyExists = false; // Initial state for a new company
    }
  });

  // This subscription handles the form behavior when the 'status' changes
  this.companyDetails.get('status')?.valueChanges.subscribe(status => {
    if (!this.isNewListedDetailsLocked && status === 'New Listed') {
      this.enableNewListedForm();
    } else {
      this.newListedDetails.reset();
      this.newListedDetails.disable();
    }
  });}
deleteLogo(){
  this.logoPreview=  'assets/nse-india-logo.png';
}

  // Method to check if the company exists already in db
  checkCompanyExistence() {
    const companyName = this.companyDetails.get('companyName')?.value;
    if (companyName) {
      this.ipoService.checkCompanyExists(companyName).subscribe((exists: boolean) => {
        this.companyExists = exists;
      });
    }
  }

  onLogoFileChange(event: Event) {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    if (file) {
      this.logoFile = file;

      // Display a preview of the logo
      const reader = new FileReader();
      reader.onload = () => {
        this.logoPreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onFileChange(event: any, type: 'rhp' | 'drhp') {
    const file = event.target.files[0];
    if (type === 'rhp') this.existingRhpFilename = file;
    else if (type === 'drhp') this.existingDrhpFilename = file;
  }

  submitIPO() {
    const formValue = this.companyDetails.value;
  
    // Add validation for logo upload if company doesn't exist
    if (!this.companyExists && !this.logoFile) {
      alert("A new company requires a logo upload.");
      return;
    }
  
    const formData = new FormData();
  
    // Append company details
    const companyValues = this.companyDetails.value as Record<string, string | null>;
    for (const key in companyValues) {
      formData.append(key, companyValues[key] ?? '');
    }
  
    // Append new listed details
    (Object.keys(this.newListedDetails.value) as Array<keyof typeof this.newListedDetails.value>).forEach(key => {
      formData.append(key, this.newListedDetails.value[key] as string ?? '');
    });
  
    // Append the logo file if one was selected
    if (this.logoFile) {
      formData.append('logo', this.logoFile);
    }
  
    // Append RHP and DRHP files
    if (this.existingRhpFilename) formData.append('rhp', this.existingRhpFilename);
    if (this.existingDrhpFilename) formData.append('drhp', this.existingDrhpFilename);
  
    this.isLoading = true;
  
    const apiCall = this.editingId
      ? this.ipoService.updateIPO(this.editingId.toString(), formData)
      : this.ipoService.createIPO(formData);
  

      // handles the after processing part
    apiCall.pipe(
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe({
      next: () => {
        alert("IPO " + (this.editingId ? "updated" : "registered") + " successfully!");
        this.router.navigate(['/upcoming-IPO']);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error processing IPO:', error);
        let errorMessage = 'Failed to process IPO.';
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