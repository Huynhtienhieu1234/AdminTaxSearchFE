import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-toast',
    standalone: true,
    imports: [NgIf],
    templateUrl: './toast.html'
})
export class ToastComponent implements OnChanges {
    @Input() message = '';
    @Input() duration = 3000;

    visible = false;
    private timeoutId: any;

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['message'] && this.message) {
            this.show();
        }
    }

    show(): void {
        this.visible = true;
        clearTimeout(this.timeoutId);
        this.timeoutId = setTimeout(() => {
            this.visible = false;
            this.message = '';
        }, this.duration);
    }

    close(): void {
        this.visible = false;
        this.message = '';
        clearTimeout(this.timeoutId);
    }
}
