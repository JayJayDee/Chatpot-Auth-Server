const jsdoc = require('swagger-jsdoc');
import { injectable } from 'smart-factory';
import { SwaggerModules } from './modules';

const apiDocOptions = {
  apis: [`${__dirname}/*.yaml`],
  swaggerDefinition: {
    info: {
      description: 'Chatpot Authentication APIs',
      title: 'Chatpot-Auth-API',
      version: '1.0.0'
    }
  },
};

injectable(SwaggerModules.SwaggerConfigurator,
  [],
  async () => jsdoc(apiDocOptions));