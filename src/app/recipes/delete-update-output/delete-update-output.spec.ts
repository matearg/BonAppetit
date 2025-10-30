import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteUpdateOutput } from './delete-update-output';

describe('DeleteUpdateOutput', () => {
  let component: DeleteUpdateOutput;
  let fixture: ComponentFixture<DeleteUpdateOutput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteUpdateOutput]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteUpdateOutput);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
