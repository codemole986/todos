import {Inject, Directive, Input, ElementRef} from '@angular/core';

@Directive({ selector: '[focus]' })

export class FocusDirective {

	@Input()
    focus:boolean;
    constructor(@Inject(ElementRef) private element: ElementRef) {}
    protected ngOnChanges() {
    	if (this.focus) {
    		this.element.nativeElement.focus();
    	}
    }

}