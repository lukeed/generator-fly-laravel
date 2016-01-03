const yeoman = require('yeoman-generator');
const fmtUrl = require('normalize-url');
const chalk = require('chalk');
const yosay = require('yosay');

module.exports = yeoman.generators.Base.extend({
  prompting: function() {
    const done = this.async();

    this.log(yosay(
      'Welcome to the stunning ' + chalk.red('Fly Laravel') + ' generator!'
    ));

    const prompts = [{
      name: 'username',
      message: 'What is your GitHub username?',
      store: true,
      validate: function(val) {
        return val.length > 0 ? true : 'github needed';
      }
    }, {
      name: 'website',
      message: 'What is your website?',
      store: true,
      default: function(props) {
        return 'http://github.com/' + props.username;
      }
    }, {
      type: 'confirm',
      name: 'installXO',
      message: 'Do you want to use XO\'s ESLint settings?',
      store: true,
      default: true
    }, {
      type: 'confirm',
      name: 'installAva',
      message: 'Do you want to install a test suite?',
      store: true,
      default: true
    }, {
      type: 'confirm',
      name: 'travis',
      message: 'Do you want to add Travis CI?',
      store: true,
      default: true
    }, {
      type: 'confirm',
      name: 'changelog',
      message: 'Do you need a CHANGELOG file?',
      store: true,
      default: true
    }, {
      type: 'confirm',
      name: 'gitinit',
      message: 'Initialize a Git repository?',
      store: true,
      default: true
    }];

    this.prompt(prompts, function(props) {
      this.props = props;

      this.includeXO = props.installXO;
      this.includeAva = props.installAva;

      this.website = fmtUrl(props.website);
      this.email = this.user.git.email();
      this.name = this.user.git.name();

      done();
    }.bind(this));
  },

  writing: function() {
    const done = this.async();
    const self = this;

    self.spawnCommand('git', [
      'clone', '--depth=1', 'https://github.com/laravel/laravel.git', '.'
    ]).on('close', function() {
      self.spawnCommand('rm', ['-rf', '.git', 'package.json']).on('close', function() {
        self.copy();
        done();
      });
    });
  },

  copy: function() {
    const done = this.async();
    console.log('inside copy')
    done();
  },

  install: function() {
    console.log('INSIDE INSTALL');
    this.installDependencies({bower: false});
    this.spawnCommand('composer', ['install']);
  },

  end: function() {
    if (!this.props.gitinit) return;

    const done = this.async();
    const self = this;

    console.log('\n');
    this.spawnCommand('git', ['init']).on('close', function() {
      self.spawnCommand('git', ['add', '--all']).on('close', function() {
        self.spawnCommand('git', ['commit', '-m', 'first commit, via generator-fly-laravel 🚀']).on('close', function() {
          console.log('\n');
          done();
        });
      });
    });
  }
});
