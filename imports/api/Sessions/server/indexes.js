import createIndex from '../../../modules/server/create-index';
import Sessions from '../Sessions';

createIndex(Sessions, { owner: 1 });
