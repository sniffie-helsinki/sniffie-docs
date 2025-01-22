import { PriceSuggestion } from './PriceSuggestion';
import { CompetitorProduct } from './CompetitorProduct';
export interface SqsMessage {
	message: PriceSuggestion[] | CompetitorProduct[];
}
