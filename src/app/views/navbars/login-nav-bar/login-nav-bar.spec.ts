import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginNavBar } from './login-nav-bar';

describe('LoginNavBar', () => {
  let component: LoginNavBar;
  let fixture: ComponentFixture<LoginNavBar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginNavBar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginNavBar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
