import {
  Directive,
  HostBinding,
  HostListener,
  ElementRef,
} from '@angular/core';

/* 
* How does this directive work?
? You insert a property appDropdown on an element and then when you click on that element, this directive will toggle 'open' class on that element
*/

@Directive({
  selector: '[appDropdown]',
})
export class DropdownDirective {
  @HostBinding('class.open') isOpen = false;

  // This has been commented out because this solution does not cover closing the dropdown when clicking outside of that element
  // @HostListener('click') toggleOpen() {
  //   this.isOpen = !this.isOpen;
  // }

  @HostListener('document:click', ['$event']) toggleOpen(event: Event) {
    this.isOpen = this.elRef.nativeElement.contains(event.target)
      ? !this.isOpen
      : false;
  }
  constructor(private elRef: ElementRef) {}
}
