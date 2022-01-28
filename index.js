#!/usr/bin/env node

import { join } from 'path';

import child from 'child_process';
import util from 'util'
const exec = util.promisify(child.exec);

import chalk from 'chalk';
import chalkAnimation from 'chalk-animation';
import inquirer from 'inquirer';
import { createSpinner } from 'nanospinner';

const sleep = (ms = 1000) => new Promise((r) => setTimeout(r, ms));

async function welcome() {
     const rainbowTitle = chalkAnimation.rainbow(`Create an express js app\n`);

     await sleep();

     rainbowTitle.stop()
}


let projectName;

async function askProjectName() {
     const answers = await inquirer.prompt({
          name: 'project_name',
          type: 'input',
          message: 'what is your project name ?',
          default() {
               return 'my_app'
          },

     });


     projectName = answers.project_name;
}

let directory;

async function askDirectory() {
     const answers = await inquirer.prompt({
          name: 'current_directory',
          type: 'confirm',
          message: 'Do you want to make project in the current directory ?',
          default() {
               return true
          }
     });

     if (answers.current_directory) {
          const { stdout: r } = await exec('ls')

          if (r.length !== 0) {
               console.log(chalk.bgRed(`\nThere are items in current directory\n`))
               process.exit(1)
          }

          directory = process.cwd()
     } else {
          directory = join(process.cwd(), projectName)
     }
     console.log('Making your project at ' + chalk.greenBright(directory));
}

let typescript;

async function askTypescript() {
     const answers = await inquirer.prompt({
          name: 'typescript',
          type: 'confirm',
          message: 'Do you want to use typescript?',
          default() {
               return true
          }
     });

     typescript = answers.typescript;
}

async function cloneGithubRepo() {
     console.clear();

     const spinner = createSpinner('Cloning github repo').start();

     let branch = 'master';

     if (typescript) {
          branch = 'typescript'
     }

     await exec(`git clone -b ${branch} git@github.com:namanArora1022/nodejs-template.git ${directory}`);

     spinner.success({
          text: 'Cloned github repo sucessfully\n'
     });
}

function commands() {
     console.log('Use the follwing commands')
     console.log(chalk.greenBright(`
          ${directory === process.cwd() ? '' : 'cd ' + projectName}
          yarn install
          yarn dev
     `));
}

console.clear();
await welcome();
await askProjectName();
await askDirectory();
await askTypescript();
await cloneGithubRepo();
commands();