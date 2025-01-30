import type { Schema, Struct } from '@strapi/strapi';

export interface PlanBenefitsBenefits extends Struct.ComponentSchema {
  collectionName: 'components_plan_benefits_benefits';
  info: {
    displayName: 'benefits';
    icon: 'check';
  };
  attributes: {
    benefit: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'plan-benefits.benefits': PlanBenefitsBenefits;
    }
  }
}
