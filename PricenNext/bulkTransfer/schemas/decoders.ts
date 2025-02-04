/* eslint-disable */

import Ajv from "ajv";

import { Decoder } from "./helpers";
import { validateJson } from "./validate";
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
import jsonSchema from "./schema.json";

const ajv = new Ajv({ strict: false });
ajv.compile(jsonSchema);

// Decoders
export const OrderLineItemDecoder: Decoder<OrderLineItem> = {
  definitionName: "OrderLineItem",
  schemaRef: "#/definitions/OrderLineItem",

  decode(json: unknown): OrderLineItem {
    const schema = ajv.getSchema(OrderLineItemDecoder.schemaRef);
    if (!schema) {
      throw new Error(
        `Schema ${OrderLineItemDecoder.definitionName} not found`
      );
    }
    return validateJson(json, schema, OrderLineItemDecoder.definitionName);
  },
};
export const ProductVariantDecoder: Decoder<ProductVariant> = {
  definitionName: "ProductVariant",
  schemaRef: "#/definitions/ProductVariant",

  decode(json: unknown): ProductVariant {
    const schema = ajv.getSchema(ProductVariantDecoder.schemaRef);
    if (!schema) {
      throw new Error(
        `Schema ${ProductVariantDecoder.definitionName} not found`
      );
    }
    return validateJson(json, schema, ProductVariantDecoder.definitionName);
  },
};
export const CompetitorProductVariantDecoder: Decoder<CompetitorProductVariant> =
  {
    definitionName: "CompetitorProductVariant",
    schemaRef: "#/definitions/CompetitorProductVariant",

    decode(json: unknown): CompetitorProductVariant {
      const schema = ajv.getSchema(CompetitorProductVariantDecoder.schemaRef);
      if (!schema) {
        throw new Error(
          `Schema ${CompetitorProductVariantDecoder.definitionName} not found`
        );
      }
      return validateJson(
        json,
        schema,
        CompetitorProductVariantDecoder.definitionName
      );
    },
  };
export const StoreProductDecoder: Decoder<StoreProduct> = {
  definitionName: "StoreProduct",
  schemaRef: "#/definitions/StoreProduct",

  decode(json: unknown): StoreProduct {
    const schema = ajv.getSchema(StoreProductDecoder.schemaRef);
    if (!schema) {
      throw new Error(`Schema ${StoreProductDecoder.definitionName} not found`);
    }
    return validateJson(json, schema, StoreProductDecoder.definitionName);
  },
};
export const AlternativePriceDecoder: Decoder<AlternativePrice> = {
  definitionName: "AlternativePrice",
  schemaRef: "#/definitions/AlternativePrice",

  decode(json: unknown): AlternativePrice {
    const schema = ajv.getSchema(AlternativePriceDecoder.schemaRef);
    if (!schema) {
      throw new Error(
        `Schema ${AlternativePriceDecoder.definitionName} not found`
      );
    }
    return validateJson(json, schema, AlternativePriceDecoder.definitionName);
  },
};
export const StoreDecoder: Decoder<Store> = {
  definitionName: "Store",
  schemaRef: "#/definitions/Store",

  decode(json: unknown): Store {
    const schema = ajv.getSchema(StoreDecoder.schemaRef);
    if (!schema) {
      throw new Error(`Schema ${StoreDecoder.definitionName} not found`);
    }
    return validateJson(json, schema, StoreDecoder.definitionName);
  },
};
export const SupplementalDataDecoder: Decoder<SupplementalData> = {
  definitionName: "SupplementalData",
  schemaRef: "#/definitions/SupplementalData",

  decode(json: unknown): SupplementalData {
    const schema = ajv.getSchema(SupplementalDataDecoder.schemaRef);
    if (!schema) {
      throw new Error(
        `Schema ${SupplementalDataDecoder.definitionName} not found`
      );
    }
    return validateJson(json, schema, SupplementalDataDecoder.definitionName);
  },
};
export const BulkUploadResponseDecoder: Decoder<BulkUploadResponse> = {
  definitionName: "BulkUploadResponse",
  schemaRef: "#/definitions/BulkUploadResponse",

  decode(json: unknown): BulkUploadResponse {
    const schema = ajv.getSchema(BulkUploadResponseDecoder.schemaRef);
    if (!schema) {
      throw new Error(
        `Schema ${BulkUploadResponseDecoder.definitionName} not found`
      );
    }
    return validateJson(json, schema, BulkUploadResponseDecoder.definitionName);
  },
};
