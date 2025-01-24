export interface CompetitorProduct {
    productName: string;
    ean: string;
    sku: string;
    manufacturerCode: string;
    website: string;
    productUrl: string;
    latestUpdate: Date;
    addedOn: Date;
    category: string;
    price: number;
    priceText: string;
    priceEur: number;
    currency: string;
    availability: string;
    availabilityFloat: number;
    sniffieId: number;
    sniffieMatchId: number;
  }