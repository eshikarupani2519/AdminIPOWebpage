import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {

  
  constructor(private router:Router,private activatedRoute:ActivatedRoute){}
    activeLinkArray:string[]=this.router.url.split('/');
    activeLink: string = this.router.url.split('/').pop() || '';
    
navigateToPage(page:string){
//  this.setActiveLink(page)
this.router.navigate([page])
console.log("page navigated:"+page)
}
// setActiveLink(link:string){
//  this.activeLink=link;
 
// }
getLinkClass(link: string): string {
  // console.log("changing classes of:"+this.activeLink);
  if(this.activeLink=='register-ipo-details'){
    this.activeLink='upcoming-IPO'
  }
    return `sidebar-link ${this.activeLink === link ? 'text-purple' : 'text-gray'}`;
  }
}
