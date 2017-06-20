

'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');

module.exports = class extends Generator {
  prompting() {
    // Have Yeoman greet the user.
    this.log(yosay(
     chalk.white.bgRed.bold('chat bot generator')+ ' helps you to start building a chat bot by using ' +  chalk.underline.bgBlue('Node js') +", "+ chalk.underline.bgBlue('Typescript')+" and "+ chalk.underline.bgBlue('Microsoft bot builder')

    ));


    
    const prompts = [{
    type: 'input',
    name: 'name',
    message: 'What\'s the chat bot project name?',
    //Defaults to the project's folder name if the input is skipped
    default: this.appname
  }];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;
    });
  }

  writing() {


    //Copy the configuration files
  
          this.fs.copyTpl(
              this.templatePath('_package.json'),
              this.destinationPath('package.json'), {
                  name: this.props.name
              }
          );
   
    this.fs.copy(
    this.templatePath('_tsconfig.json'),
    this.destinationPath('tsconfig.json'));
   this.fs.copy(
    this.templatePath('src/_app.ts'),
    this.destinationPath('src/app.ts'));

    this.fs.copy(
    this.templatePath('src/types/_botbuilder.d.ts'),
    this.destinationPath('src/types/botbuilder.d.ts'));



   
  }

  install() {

    this.processTask = function (task) {
     
      this.log( task.cmd + ( (task.args!==undefined) ? (" " + task.args) :"") );

     this.spawnCommand(task.cmd, task.args)
     .on('exit', function (err) {
       if (err) {
          this.log.error('task failed. Error: ' + err); 
        } else {
           this.emit('nextTask');
          }
         }.bind(this));

        
};

this.on('nextTask', function(){
    var next = this.tasks.shift();
    if (next){
       this.processTask(next);
    } else {
      
    }
}.bind(this));

//preparing the list of tasks:
this.tasks = [];
this.tasks.push({cmd: 'npm', args:['install']});
this.tasks.push({cmd: 'tsc'});

//start first task

this.processTask(this.tasks.shift());


 

    
  }
  
};

