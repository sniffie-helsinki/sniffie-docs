/* eslint-disable */
import {
  OrderLineItem,
  ProductVariant,
  CompetitorProductVariant,
  StoreProduct,
  AlternativePrice,
  Store,
  SupplementalData,
  BulkUploadResponse,
} from "./models";

export const schemaDefinitions = {
  OrderLineItem: info<OrderLineItem>(
    "OrderLineItem",
    "#/definitions/OrderLineItem"
  ),
  ProductVariant: info<ProductVariant>(
    "ProductVariant",
    "#/definitions/ProductVariant"
  ),
  CompetitorProductVariant: info<CompetitorProductVariant>(
    "CompetitorProductVariant",
    "#/definitions/CompetitorProductVariant"
  ),
  StoreProduct: info<StoreProduct>(
    "StoreProduct",
    "#/definitions/StoreProduct"
  ),
  AlternativePrice: info<AlternativePrice>(
    "AlternativePrice",
    "#/definitions/AlternativePrice"
  ),
  Store: info<Store>("Store", "#/definitions/Store"),
  SupplementalData: info<SupplementalData>(
    "SupplementalData",
    "#/definitions/SupplementalData"
  ),
  BulkUploadResponse: info<BulkUploadResponse>(
    "BulkUploadResponse",
    "#/definitions/BulkUploadResponse"
  ),
};

export interface SchemaInfo<T> {
  definitionName: string;
  schemaRef: string;
}

function info<T>(definitionName: string, schemaRef: string): SchemaInfo<T> {
  return { definitionName, schemaRef };
}
