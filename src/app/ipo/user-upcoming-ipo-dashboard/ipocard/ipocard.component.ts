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

  // This function is now much simpler as the backend sends the full logo URL
  getCompanyLogoUrl(): string {
    console.log(this.ipo.logo+":ipo logo")
    return this.ipo.logo 
    // && typeof this.ipo.logo === 'string'
    //   ? this.ipo.logo
    //   : '../../assets/placeholder-logo.png'; // Make sure this path is correct
  }
}