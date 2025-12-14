import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogoIcon } from './logo-icon';

describe('LogoIcon', () => {
  let component: LogoIcon;
  let fixture: ComponentFixture<LogoIcon>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogoIcon]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LogoIcon);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
