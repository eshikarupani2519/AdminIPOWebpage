import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { IpoService } from 'src/app/services/ipo.service';
import Chart from 'chart.js/auto'; // Import Chart.js

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  totalIPOs: number | undefined;
  totalCompanies: number | undefined;
  ipoGainCount: number | undefined;
  ipoLossCount: number | undefined;
  upcomingIPOs: number | undefined;
  newListedIPOs: number | undefined;
  ongoingIPOs: number | undefined;

  constructor(private http: HttpClient, private ipoService: IpoService) { }

  ngOnInit(): void {
    // Fetch data for all charts from a new combined stats endpoint
    this.ipoService.getStats().subscribe((stats: any) => {
      // Data for IPO Dashboard India
      this.totalIPOs = stats.ipoDashboard.totalIpos;
      this.ipoGainCount = stats.ipoDashboard.iposInGain;
      this.ipoLossCount = stats.ipoDashboard.iposInLoss;

      // Data for Main Board IPO Doughnut Chart
      this.upcomingIPOs = stats.mainBoardIpo.upcoming;
      this.newListedIPOs = stats.mainBoardIpo.newListed;
      this.ongoingIPOs = stats.mainBoardIpo.ongoing;

      // Initialize the doughnut chart after getting the data
      this.createMainBoardIpoChart();
    });
  }

  createMainBoardIpoChart(): void {
    const ctx = document.getElementById('mainBoardIpoChart') as HTMLCanvasElement;
    console.log('Canvas element found:', ctx);
    if (ctx) {
      new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Upcoming', 'New Listed', 'Ongoing'],
          datasets: [{
            data: [this.upcomingIPOs, this.newListedIPOs, this.ongoingIPOs],
            backgroundColor: [
              '#8593ED', //  Upcoming
              ' #5A6ACF ', //  New Listed
              ' #C7CEFF'  // Ongoing
            ],
            hoverBackgroundColor: [
              '#a1abecff',
              ' #6a76c5ff ',
              ' #d5d9fcff'
            ],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false // Hide the default legend as we have a custom one
            },
            tooltip: {
              enabled: false // Disable default tooltip
            }
          },
          cutout: '80%', 
        }
      });
    }
  }
}