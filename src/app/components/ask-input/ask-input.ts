import { Component, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { EventEmitter } from '@angular/core';
import { finalize, Observable } from 'rxjs';

@Component({
  selector: 'app-ask-input',
  imports: [MatIconModule],
  templateUrl: './ask-input.html',
})
export class AskInput {
  @Input() content: string = '';
  @Output() contentChange = new EventEmitter<string>();
  @Input() action!: () => Observable<void>;
  @Input() isDisabled: boolean = false; // <-- novo
  maxRows: number = 5;

  onInput(event: Event) {
    const textArea = event.target as HTMLTextAreaElement;
    const value = textArea.value;
    this.contentChange.emit(value);
    this.resize(textArea);
  }

  sendContent(textArea: HTMLTextAreaElement) {
    if (this.action) {
      this.action()
        .pipe(
          finalize(() => {
            textArea.focus();
            this.content = '';
            this.contentChange.emit('');
            textArea.value = '';
            textArea.style.height = 'auto';
          })
        )
        .subscribe();
    }
  }

  resize(textArea: HTMLTextAreaElement) {
    textArea.style.height = 'auto';
    const lineHeight = parseInt(window.getComputedStyle(textArea).lineHeight, 10);
    const maxHeight = lineHeight * this.maxRows;
    const newHeight = Math.min(textArea.scrollHeight, maxHeight);
    textArea.style.height = newHeight + 'px';
  }
}
