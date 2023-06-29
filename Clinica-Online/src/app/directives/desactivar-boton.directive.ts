import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appDesactivarBoton]'
})
export class DesactivarBotonDirective {

  @Input('appDisable') isDisabled!: boolean;

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {}

  ngOnChanges(): void {
    if (this.isDisabled) {
      this.renderer.setAttribute(this.elementRef.nativeElement, 'disabled', 'true');
    } else {
      this.renderer.removeAttribute(this.elementRef.nativeElement, 'disabled');
    }
  }

}
