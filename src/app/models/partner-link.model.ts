export interface PartnerLink {
  agencyCode: string;
  generalAgencyCode: string;
  productType: string;
  partnerName: string;
  partnerWebsite: string;
  partnerPhone: string;
  generatedLink?: string;
}

export interface PartnerLinkResponse {
  success: boolean;
  link: string;
  existingLink?: string;
}

export enum ProductType {
  TERM_LIFE = 'Term Life',
  WHOLE_LIFE = 'Whole Life',
  UNIVERSAL_LIFE = 'Universal Life',
  VARIABLE_LIFE = 'Variable Life',
  INDEXED_UNIVERSAL_LIFE = 'Indexed Universal Life'
} 