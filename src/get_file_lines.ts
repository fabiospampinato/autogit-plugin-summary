
/* IMPORT */

import * as fs from 'fs';
import * as pify from 'pify';
import splitLines from './split_lines';

/* GET FILE LINES */

async function getFileLines ( filePath ) {

  const content = await pify ( fs.readFile )( filePath, { encoding: 'utf8' } ),
        lines = splitLines ( content );

  return lines.filter ( line => line.trim ().length )
              .map ( ( line, i ) => `    ${line}` );

}

/* EXPORT */

export default getFileLines;
