//este archivo sirve para que arranque al aplicacion 

import app from './app';
import './database'

app.listen(3000);

console.log('Server listen on port', 3000);

