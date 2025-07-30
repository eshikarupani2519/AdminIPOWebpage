import { HttpClient } from '@angular/common/http';
import { Component, Output } from '@angular/core';
import { IpoService } from 'src/app/services/ipo.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent {
  totalIPOs: number | undefined;
  totalCompanies: number | undefined;

  constructor(private http: HttpClient, private ipoService: IpoService) { }

  ngOnInit(): void {
    this.ipoService.getStats()?.subscribe((stats: any) => {
      this.totalIPOs = stats.total_ipos;
      this.totalCompanies = stats.total_companies;
    });
  }

  updateUser(event: any) {
    console.log(event);
  }

  //bes
  
  //bee
}
