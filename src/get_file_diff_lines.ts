
/* IMPORT */

import splitLines from './split_lines';

/* GET FILE DIFF LINES */

async function getFileDiffLines ( git, filePath ) {

  const content = await git.diff ([ 'HEAD', '--', filePath ]),
        lines = splitLines ( content );

  return lines.filter ( line => /^(-|\+)/.test ( line ) )
              .filter ( line => !/^(---|\+\+\+)/.test ( line ) )
              .filter ( line => !/^(-|\+)\s*$/.test ( line ) )
              .map ( line => `    ${line}` );

}

/* EXPORT */

export default getFileDiffLines;
