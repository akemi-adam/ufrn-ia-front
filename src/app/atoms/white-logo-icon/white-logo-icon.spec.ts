import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhiteLogoIcon } from './white-logo-icon';

describe('WhiteLogoIcon', () => {
  let component: WhiteLogoIcon;
  let fixture: ComponentFixture<WhiteLogoIcon>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WhiteLogoIcon]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WhiteLogoIcon);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
