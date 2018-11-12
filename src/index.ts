
/* IMPORT */

import chalk from 'chalk';
import * as figures from 'figures';
import * as isBinaryPath from 'is-binary-path';
import * as path from 'path';
import * as simpleGit from 'simple-git/promise';
import getFileLines from './get_file_lines';
import getFileDiffLines from './get_file_diff_lines';
import getFilesStaged from './get_files_staged';

/* SUMMARY */

const defaultOptions = {
  onlyStaged: true,
  diff: true,
  content: true
};

function factory ( customOptions?: Partial<typeof defaultOptions> ) {

  const options = Object.assign ( {}, defaultOptions, customOptions );

  return async function summary ( config, repoPath, ctx, task ) {

    const git = simpleGit ( repoPath ),
          output: string[] = [];

    /* VARIABLES */

    let staged;

    if ( !options.onlyStaged ) {

      staged =await getFilesStaged ( git );

      await git.add ( '-A' );

    }

    const status = await git.status (),
          diff = await git.diffSummary ([ 'HEAD' ]);

    if ( !options.onlyStaged ) {

      await git.reset ( 'mixed' );
      await git.add ( staged );

    }

    /* TITLE */

    task.title = `summary ${chalk.gray ( `${diff.insertions} ${diff.insertions === 1 ? 'insertion' : 'insertions'}, ${diff.deletions} ${diff.deletions === 1 ? 'deletion' : 'deletions'}` )}`;

    /* DELETED */

    if ( status.deleted.length ) {

      output.push ( `Deleted (${status.deleted.length}):` );

      for ( let filePath of status.deleted ) {

        output.push ( `  ${filePath}` );

      }

    }

    /* CONFLICTED */

    if ( status.conflicted.length ) {

      output.push ( `Conflicted (${status.conflicted.length}):` );

      for ( let filePath of status.conflicted ) {

        output.push ( `  ${filePath}` );

      }

    }

    /* RENAMED */

    if ( status.renamed.length ) {

      output.push ( `Renamed (${status.renamed.length}):` );

      for ( let {from, to} of status.renamed as any ) { //TSC

        output.push ( `  ${from} ${figures.arrowRight} ${to}` );

      }

    }

    /* MODIFIED */

    if ( status.modified.length ) {

      output.push ( `Modified (${status.modified.length}):` );

      for ( let filePath of status.modified ) {

        output.push ( `  ${filePath}` );

        if ( options.diff && !isBinaryPath ( filePath ) ) {

          const lines = await getFileDiffLines ( git, filePath );

          output.push ( ...lines );

        }

      }

    }

    /* CREATED */

    if ( status.created.length ) {

      output.push ( `Created (${status.created.length}):` );

      for ( let filePath of status.created ) {

        output.push ( `  ${filePath}` );

        if ( options.content && !isBinaryPath ( filePath ) ) {

          const lines = await getFileLines ( path.join ( repoPath, filePath ) );

          output.push ( ...lines );

        }

      }

    }

    /* UNTRACKED */

    if ( status.not_added.length ) { //TODO: What's this actually about?

      output.push ( `Untracked (${status.not_added.length}):` );

      for ( let filePath of status.not_added ) {

        output.push ( `  ${filePath}` );

      }

    }

    /* STAGED */

    if ( status.staged.length ) {

      output.push ( `Staged (${status.staged.length}):` );

      for ( let filePath of status.staged ) {

        output.push ( `  ${filePath}` );

      }

    }

    /* OUTPUT */

    if ( !output.length ) return task.skip ( 'No changes' );

    task.output = output.join ( '\n' );

  };

}

/* EXPORT */

export default factory;
