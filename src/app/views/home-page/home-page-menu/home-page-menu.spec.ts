import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomePageMenu } from './home-page-menu';

describe('HomePageMenu', () => {
  let component: HomePageMenu;
  let fixture: ComponentFixture<HomePageMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomePageMenu]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomePageMenu);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
