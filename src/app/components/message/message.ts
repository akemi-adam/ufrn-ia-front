import { Component, input } from '@angular/core';
import { MarkdownModule } from 'ngx-markdown';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [MarkdownModule],
  templateUrl: './message.html',
})
export class Message {
  backgroundColor = input<string>('bg-(--color-light-blue)');
  textColor = input<string>('text-(--color-dark-blue)');
  content = input<string>('');
  extraClasses = input<string>('');
}
