import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appDestacarBoton]'
})
export class DestacarBotonDirective {

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {}

  @HostListener('mouseenter')
  onMouseEnter() {
    this.growButton();
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.resetButton();
  }

  private growButton() {
    this.renderer.setStyle(this.elementRef.nativeElement, 'transform', 'scale(1.1)');
    this.renderer.setStyle(this.elementRef.nativeElement, 'transition', 'transform 0.3s');
  }

  private resetButton() {
    this.renderer.setStyle(this.elementRef.nativeElement, 'transform', 'scale(1)');
    this.renderer.setStyle(this.elementRef.nativeElement, 'transition', 'transform 0.3s');
  }

}
