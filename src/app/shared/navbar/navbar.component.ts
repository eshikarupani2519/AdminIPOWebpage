import { Component, Input } from '@angular/core';
import { DatabaseService } from 'src/app/database.service';
import { IpoService } from 'src/app/services/ipo.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  
  constructor(private database: DatabaseService,private ipoService:IpoService) { }
  ipos:any[]=[];
  loggedInUser!: string;
  ngOnInit() {
    this.loggedInUser = localStorage.getItem('IPOLoggedInUser') ?? '';
    if (this.loggedInUser.charAt(0) == '"') {
      this.loggedInUser = this.loggedInUser.slice(1, this.loggedInUser.length - 1);
      console.log(this.loggedInUser)
    }
  }
  searchTerm = '';

searchIPO() {
  if (this.searchTerm.trim()) {
    this.ipoService.searchIPOs(this.searchTerm).subscribe((data: any) => {
      this.ipos = data;
    });
  } else {
    this.ipoService.getAllIPOs(); 
  }
}


}
