import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FaqService } from '@services/admin/faq.service';
interface faq{
  title:string
  text:string[],
  tags:string[]
}
@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.scss'
})
export class FAQComponent {
  selectedQuestionBlock = "basic"
  showFAQBlock:faq[] = []
  hideFAQ = false
  hideMainBlock = false
  hideSecondBlock = true
  constructor(private faq: FaqService){}
  ngOnInit(){
    this.showFAQBlock = this.faq.faqData.filter(value=>value.tags.includes(this.selectedQuestionBlock))
  }
  changeMainBlock(mainBlockName:string){
    if(this.selectedQuestionBlock != mainBlockName){
      this.selectedQuestionBlock = mainBlockName
      this.hideFAQ = true
      setTimeout(() => {
        this.showFAQBlock = this.faq.faqData.filter(value=>value.tags.includes(this.selectedQuestionBlock))
        this.hideFAQ = false
      }, 250);
    }
  }
  checkSearchInput(e:any){
    if(e.target.value.length > 0){
      this.hideMainBlock = true
      this.hideSecondBlock = false
      this.selectedQuestionBlock = e.target.value
      this.showFAQBlock = this.faq.faqData.filter(value => {
        const lowercaseTags = value.tags.map(tag => tag.toLowerCase());
        const lowercaseSearch = this.selectedQuestionBlock.toLowerCase();
        return lowercaseTags.some(tag => tag.includes(lowercaseSearch)) || 
               value.title.toLowerCase().includes(e.target.value);
    });
    }else{
      this.hideSecondBlock = true
      setTimeout(() => {
        this.hideMainBlock = false
        this.selectedQuestionBlock = "basic"
        this.showFAQBlock = this.faq.faqData.filter(value=>value.tags.includes(this.selectedQuestionBlock))
      }, 300);
    }
    
  }
}
