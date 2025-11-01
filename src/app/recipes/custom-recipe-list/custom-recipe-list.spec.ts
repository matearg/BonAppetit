import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomRecipeList } from './custom-recipe-list';

describe('CustomRecipeList', () => {
  let component: CustomRecipeList;
  let fixture: ComponentFixture<CustomRecipeList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomRecipeList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomRecipeList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
