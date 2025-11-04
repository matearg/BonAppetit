import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeUpdate } from './recipe-update';

describe('RecipeUpdate', () => {
  let component: RecipeUpdate;
  let fixture: ComponentFixture<RecipeUpdate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecipeUpdate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecipeUpdate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
