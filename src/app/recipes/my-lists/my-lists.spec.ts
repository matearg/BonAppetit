import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyLists } from './my-lists';

describe('MyLists', () => {
  let component: MyLists;
  let fixture: ComponentFixture<MyLists>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyLists]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyLists);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
