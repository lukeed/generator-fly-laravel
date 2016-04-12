const yeoman = require('yeoman-generator');
const fmtUrl = require('normalize-url');
const chalk = require('chalk');
const yosay = require('yosay');

const base = 'https://github.com/laravel';

module.exports = yeoman.generators.Base.extend({
  prompting: function() {
    const done = this.async();

    this.log(yosay(
      'Welcome to the ' + chalk.red('Fly Laravel') + ' generator!'
    ));

    const prompts = [{
      name: 'framework',
      type: 'list',
      message: 'Would you like to work with Laravel or Lumen?',
      store: true,
      choices: ['Laravel', 'Lumen']
    }, {
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
      name: 'proxy',
      message: 'What is this project\'s development URL?',
      store: true,
      default: function(props) {
        return 'http://homestead.app';
      }
    }, {
      type: 'confirm',
      name: 'useProcessor',
      message: 'Do you want to use a CSS preprocessor?',
      store: true,
      default: true
    }, {
      type: 'list',
      name: 'cssTool',
      message: chalk.green('Good choice! ') + 'Which CSS preprocessor would you like?',
      store: true,
      choices: ['SASS', 'LESS', 'Stylus'],
      when: function (response) {
        return response.useProcessor;
      }
    }, {
      type: 'confirm',
      name: 'useXO',
      message: 'Do you want to use XO\'s ESLint settings?',
      store: true,
      default: true
    }, {
      type: 'confirm',
      name: 'useTests',
      message: 'Do you want to install a test suite?',
      store: true,
      default: true
    }, {
      type: 'list',
      name: 'testrunner',
      message: chalk.green('Great! ') + 'Which test runner would you like to use?',
      choices: [ 'Ava', 'Mocha' ], // 'Karma', 'Protractor', 'Tape'
      store: true,
      when: function (response) {
        return response.useTests;
      }
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

      this.useTests = props.useTests;
      this.testrunner = props.useTests ? props.testrunner.toLowerCase() : null;
      this.cssTool = props.useProcessor ? props.cssTool.toLowerCase() : 'css';

      this.proxy = fmtUrl(props.proxy);
      this.website = fmtUrl(props.website);
      this.email = this.user.git.email();
      this.name = this.user.git.name();

      done();
    }.bind(this));
  },

  writing: function() {
    const done = this.async();
    const self = this;
    const repo = base + '/' + this.props.framework.toLowerCase() + '.git';

    self.spawnCommand('git', ['clone', '--depth=1', repo, '.']).on('close', function() {
      const files = ['.git', 'package.json', '.gitignore', '.gitattributes', 'resources/assets'];
      const args  = ['-rf'].concat(files);

      self.spawnCommand('rm', args).on('close', function() {
        self.copy();
        done();
      });
    });
  },

  copy: function() {
    const done = this.async();

    this.template('LICENSE');
    // this.template('README.md');
    this.template('editorconfig', '.editorconfig');
    this.template('_package.json', 'package.json');

    // Prepare FlyFile styles' path selector
    const ext = (this.cssTool == 'sass')
      ? '{sass,scss}' : (this.cssTool == 'stylus')
      ? 'styl' : this.cssTool;

    // Copy FlyFile
    this.template('flyfile', 'flyfile.js', {
      proxy: this.proxy,
      cssTool: this.cssTool,
      cssPath: "/styles/**/*."+ext
    });

    // Copy Static Assets, no alternatives
    const statics = ['fonts', 'images', 'scripts'];
    statics.forEach(function(s) {
      this.fs.copy(
        this.templatePath('assets/'+s),
        this.destinationPath('resources/assets/'+s)
      );
    }.bind(this));

    // Copy Style Assets, based on response
    this.fs.copy(
      this.templatePath('assets/styles/'+this.cssTool),
      this.destinationPath('resources/assets/styles')
    );

    if (this.props.gitinit) {
      this.template('gitignore', '.gitignore');
      this.template('gitattributes', '.gitattributes');
    }

    if (this.props.useTests) {
      this.fs.copy(
        this.templatePath('tests/' + this.testrunner),
        this.destinationPath('resources/tests')
      );
    }

    if (this.props.travis) {
      this.template('_travis.yml', '.travis.yml');
    }

    if (this.props.changelog) {
      this.template('changelog.md');
    }

    done();
  },

  install: function() {
    var plugins = [];
    if (this.testrunner) plugins.push('fly-'+this.testrunner);
    if (this.props.useProcessor) plugins.push('fly-'+this.cssTool);
    if (this.props.useXO) plugins.push('fly-xo');

    this.spawnCommand('composer', ['install', '--quiet']);

    this.installDependencies({bower: false});
    this.npmInstall(plugins, {saveDev: true});

    this.async();
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
