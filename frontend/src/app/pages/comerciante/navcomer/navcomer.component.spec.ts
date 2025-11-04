import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavcomerComponent } from './navcomer.component';

describe('NavcomerComponent', () => {
  let component: NavcomerComponent;
  let fixture: ComponentFixture<NavcomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavcomerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavcomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
