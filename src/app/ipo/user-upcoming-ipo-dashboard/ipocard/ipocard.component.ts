import { Component, Input } from '@angular/core';
import { environment } from 'src/environments/environment'; // Still needed for RHP/DRHP

@Component({
  selector: 'app-ipocard',
  templateUrl: './ipocard.component.html',
  styleUrls: ['./ipocard.component.css']
})
export class IpocardComponent {
  @Input()
  ipo: any;

  // Base URL for static files (e.g., uploads)
  // Still needed for RHP/DRHP documents
  private uploadsBaseUrl = environment.apiUrl.replace('/api', '/uploads');

  getRhpUrl(): string {
    return this.ipo.rhp ? `${this.uploadsBaseUrl}/${this.ipo.rhp}` : '#';
  }

  getDrhpUrl(): string {
    return this.ipo.drhp ? `${this.uploadsBaseUrl}/${this.ipo.drhp}` : '#';
  }

  getCompanyLogoUrl(): string {
    console.log(this.ipo)
    const logoSource = this.ipo.logo; // This is now expected to be a full URL
    // Return the URL directly if it exists, otherwise use a placeholder
    
    // const logoUrl = logoSource && typeof logoSource === 'string' 
    //                 ? logoSource
    //                 : '../../assets/placeholder-logo.png'; // Fallback to a local placeholder

    // --- ADDED FOR DEBUGGING LOGO (keep this for now, it's helpful) ---
    console.log(`IPO ID: ${this.ipo.id || 'N/A'}, Company: ${this.ipo.company_name || 'N/A'}`);
    console.log(`  company_logo from IPO object: "${logoSource}"`);
    console.log(`  Resolved Logo URL: "${logoSource}"`);
    // --- END DEBUGGING LOGO ---

    return logoSource;
  }
}