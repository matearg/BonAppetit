import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyRecipeDetails } from './my-recipe-details';

describe('MyRecipeDetails', () => {
  let component: MyRecipeDetails;
  let fixture: ComponentFixture<MyRecipeDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyRecipeDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyRecipeDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
