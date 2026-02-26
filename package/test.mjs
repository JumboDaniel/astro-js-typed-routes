import { build } from 'astro';

const myIntegration = {
  name: 'my-integration',
  hooks: {
    'astro:config:setup': (args) => {
      console.log('Setup args keys:', Object.keys(args));
    }
  }
};

build({
  root: '.',
  integrations: [myIntegration]
}).catch(e => console.error(e));
