import type { Schema, Struct } from '@strapi/strapi';

export interface HomeHome extends Struct.ComponentSchema {
  collectionName: 'components_home_homes';
  info: {
    displayName: 'Home';
    icon: 'house';
  };
  attributes: {
    benefit: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'home.home': HomeHome;
    }
  }
}
