import { Component, input } from '@angular/core';

@Component({
  selector: 'app-button',
  imports: [],
  templateUrl: './button.html',
  styleUrl: './button.css',
})
export class Button {
  type = input<string>('button')
  label = input<string>('')
  extraClasses = input<string>('')
  status = input<boolean>(true)
}
