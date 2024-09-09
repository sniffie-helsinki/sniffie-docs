export interface PriceSuggestion {
  sku: string; // sku of the product in Sniffie
  strategyId: string; // id of the strategy in Sniffie
  strategyName: string; // Name of the strategy in Sniffie
  originalPrice: number; // normal price or compare at price if discounted
  campaignPrice: number | null; // price if discounted
  validFrom: string; // ISO datetime string
  validTo: string; // ISO datetime string
  shopName: string; // name of the shop in Sniffie
  }
