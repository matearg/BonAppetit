import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Initial } from './initial';

describe('Initial', () => {
  let component: Initial;
  let fixture: ComponentFixture<Initial>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Initial]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Initial);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
