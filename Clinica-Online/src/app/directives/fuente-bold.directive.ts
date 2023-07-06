import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appFuenteBold]'
})
export class FuenteBoldDirective {

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {}

  @HostListener('mouseenter')
  onMouseEnter() {
    this.setBold();
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.removeBold();
  }

  private setBold() {
    this.renderer.setStyle(this.elementRef.nativeElement, 'font-weight', 'bold');
  }

  private removeBold() {
    this.renderer.removeStyle(this.elementRef.nativeElement, 'font-weight');
  }

}
