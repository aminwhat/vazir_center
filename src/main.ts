import { bootstrap } from './bootstrap';
import { init } from './init';

const production = Boolean(process.env.PRODUCTION.toLowerCase() === 'true');

init(production);

bootstrap(production);
