import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { PartnerLink, PartnerLinkResponse } from '../models/partner-link.model';

@Injectable({
  providedIn: 'root'
})
export class PartnerLinkService {
  // In a real application, this would be stored in a database
  private existingLinks: Map<string, string> = new Map();

  constructor() {
    // Mock data for demonstration
    this.existingLinks.set('AGENCY123', 'https://quickquote.example.com/apply?agency=AGENCY123&ga=GA456&product=term-life&partner=ExamplePartner');
  }

  /**
   * Generate a partner link based on the provided information
   */
  generatePartnerLink(partnerData: PartnerLink): Observable<PartnerLinkResponse> {
    // Check if a link already exists for this agency
    const existingLink = this.existingLinks.get(partnerData.agencyCode);
    
    // Generate a new link
    const baseUrl = 'https://quickquote.example.com/apply';
    const productSlug = partnerData.productType.toLowerCase().replace(/\s+/g, '-');
    const partnerSlug = partnerData.partnerName.toLowerCase().replace(/\s+/g, '-');
    
    const newLink = `${baseUrl}?agency=${partnerData.agencyCode}&ga=${partnerData.generalAgencyCode}&product=${productSlug}&partner=${partnerSlug}`;
    
    // In a real application, we would save this to a database
    this.existingLinks.set(partnerData.agencyCode, newLink);
    
    // Simulate API delay
    return of({
      success: true,
      link: newLink,
      existingLink
    }).pipe(delay(500));
  }

  /**
   * Check if a partner link already exists for the given agency code
   */
  checkExistingLink(agencyCode: string): Observable<string | null> {
    const existingLink = this.existingLinks.get(agencyCode) || null;
    return of(existingLink).pipe(delay(300));
  }
}
