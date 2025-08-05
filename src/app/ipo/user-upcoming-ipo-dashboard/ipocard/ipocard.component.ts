import { Component, Input } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-ipocard',
  templateUrl: './ipocard.component.html',
  styleUrls: ['./ipocard.component.css']
})
export class IpocardComponent {
  @Input()
  ipo: any;

  private uploadsBaseUrl = environment.apiUrl.replace('/api', '/uploads');

  getRhpUrl(): string {
    return this.ipo.rhp ? `${this.uploadsBaseUrl}/${this.ipo.rhp}` : '#';
  }

  getDrhpUrl(): string {
    return this.ipo.drhp ? `${this.uploadsBaseUrl}/${this.ipo.drhp}` : '#';
  }

  // RECTIFIED: This function now builds the full URL for the logo
 getCompanyLogoUrl(): string {
    if (!this.ipo?.logo) {
      // Return a default placeholder if no logo is available
      return '../../assets/nova-logo.png'; 
    }

    // Check if the logo string is already a full URL
    if (this.ipo.logo.startsWith('http://') || this.ipo.logo.startsWith('https://')) {
      return this.ipo.logo; // It's already a complete URL, use it as is
    }

    // Otherwise, assume it's a filename and build the URL
    return `${this.uploadsBaseUrl}/${this.ipo.logo}`;
  }
}