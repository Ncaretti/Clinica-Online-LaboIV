import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appResaltarTexto]'
})
export class ResaltarTextoDirective {
  
  constructor(private elementRef: ElementRef, private renderer: Renderer2) {}

  @HostListener('mouseenter')
  onMouseEnter() {
    this.highlight(true);
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.highlight(false);
  }

  private highlight(isHighlighted: boolean) {
    if (isHighlighted) {
      this.renderer.setStyle(this.elementRef.nativeElement, 'background-color', 'yellow');
    } else {
      this.renderer.removeStyle(this.elementRef.nativeElement, 'background-color');
    }
  }

}
