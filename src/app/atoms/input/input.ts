import { Component, input } from '@angular/core';

@Component({
  selector: 'app-input',
  imports: [],
  templateUrl: './input.html',
  styleUrl: './input.css',
})
export class Input {
  placeholder = input<string>('')
  type = input<string>('')
  name = input<string>('')
}
