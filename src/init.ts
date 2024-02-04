import * as clc from 'cli-color';
import * as dotenv from 'dotenv';
// import * as child_process from 'child_process';
// import * as fs from 'fs';

function Abort(error: any): void {
  console.log(clc.red(error));
  console.log(clc.red('Aborting...'));
  process.exit(1);
}

export function init(production: boolean): void {
  console.log('\nInit Started');

  console.log(
    production ? clc.green('Production Mode') : clc.yellow('Development Mode'),
  );

  dotenv.config({ debug: !production });

  console.log({ env: process.env });

  console.log('Init Done\n');
}
