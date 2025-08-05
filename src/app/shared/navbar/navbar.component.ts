import { Component, Input, Output, EventEmitter } from '@angular/core'; // Added Output and EventEmitter
import { DatabaseService } from 'src/app/database.service';
import { IpoService } from 'src/app/services/ipo.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  
  constructor(private database: DatabaseService,private ipoService:IpoService) { }
  
  // We no longer need an @Input for ipos, as we will emit the changes
  // @Input()
  // ipos!:any[];

  @Output() iposUpdated = new EventEmitter<any[]>(); // ADD THIS LINE

  loggedInUser!: string;
  searchTerm = '';

  ngOnInit() {
    this.loggedInUser = localStorage.getItem('IPOLoggedInUser') ?? '';
    if (this.loggedInUser.charAt(0) == '"') {
      this.loggedInUser = this.loggedInUser.slice(1, this.loggedInUser.length - 1);
    }
  }

  searchIPO() {
    if (this.searchTerm.trim()) {
      this.ipoService.searchIPOs(this.searchTerm).subscribe((data: any) => {
        this.iposUpdated.emit(data); // EMIT THE SEARCH RESULTS
      });
    } else {
      this.ipoService.getAllIPOs().subscribe((data: any) => {
        this.iposUpdated.emit(data); // EMIT THE FULL LIST
      });
    }
  }
}