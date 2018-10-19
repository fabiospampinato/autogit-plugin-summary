
/* IMPORT */

import splitLines from './split_lines';

/* GET FILES STAGED */

async function getFilesStaged ( git ) {

  const diff = await git.diff ([ '--name-only', '--cached' ]),
        lines = splitLines ( diff );

  return lines.map ( line => line.trim () )
              .filter ( line => line.length );

}

/* EXPORT */

export default getFilesStaged;
