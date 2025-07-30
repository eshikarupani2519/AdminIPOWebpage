import { AfterViewInit, Component } from '@angular/core';

@Component({
  selector: 'app-faqs',
  templateUrl: './faqs.component.html',
  styleUrls: ['./faqs.component.css']
})
export class FaqsComponent implements AfterViewInit{
faqs = [
    { question: 'How to Subscribe to an IPO?', answer: `Step 1: Login to your respective service provider.\nStep 2: Click on the IPO button.\nStep 3: Select the IPO you want to bid and enter the relevant details.\nStep4: Your subscription will be completed once you make the payment or give permission.` },
   { question: 'How to Subscribe to an IPO?', answer: `Step 1: Login to your respective service provider.\nStep 2: Click on the IPO button.\nStep 3: Select the IPO you want to bid and enter the relevant details.\nStep4: Your subscription will be completed once you make the payment or give permission.` },
   { question: 'How to Subscribe to an IPO?', answer: `Step 1: Login to your respective service provider.\nStep 2: Click on the IPO button.\nStep 3: Select the IPO you want to bid and enter the relevant details.\nStep4: Your subscription will be completed once you make the payment or give permission.` },
   { question: 'How to Subscribe to an IPO?', answer: `Step 1: Login to your respective service provider.\nStep 2: Click on the IPO button.\nStep 3: Select the IPO you want to bid and enter the relevant details.\nStep4: Your subscription will be completed once you make the payment or give permission.` }
    // add more
  ];

  ngAfterViewInit() {
    const buttons = document.querySelectorAll('.accordion-button');
    buttons.forEach(btn => {
      const icon = btn.querySelector('.icon') as HTMLElement;
      btn.addEventListener('click', () => {
        setTimeout(() => {
          if (btn.classList.contains('collapsed')) {
            if(icon)icon.textContent = '+';
          } else {
            if(icon)icon.textContent = '–';
          }
        }, 0);
      });
    });
  }
}
