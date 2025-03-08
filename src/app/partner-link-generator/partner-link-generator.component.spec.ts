import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerLinkGeneratorComponent } from './partner-link-generator.component';

describe('PartnerLinkGeneratorComponent', () => {
  let component: PartnerLinkGeneratorComponent;
  let fixture: ComponentFixture<PartnerLinkGeneratorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PartnerLinkGeneratorComponent]
    });
    fixture = TestBed.createComponent(PartnerLinkGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
