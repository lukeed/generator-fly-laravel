const yeoman = require('yeoman-generator');
const fmtUrl = require('normalize-url');
const chalk = require('chalk');
const yosay = require('yosay');

const repo = 'https://github.com/laravel/laravel.git';

module.exports = yeoman.generators.Base.extend({
  prompting: function() {
    const done = this.async();

    this.log(yosay(
      'Welcome to the ' + chalk.red('Fly Laravel') + ' generator!'
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
      name: 'proxy',
      message: 'What is this project\'s development URL?',
      store: true,
      default: function(props) {
        return 'http://homestead.app';
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

    this.template('flyfile', 'flyfile.js', {proxy: this.proxy});

    this.fs.copy(
      this.templatePath('assets'),
      this.destinationPath('resources/assets')
    );

    const lint = this.props.installXO ? 'eslint_xo' : 'eslint_default';
    this.template(lint, '.eslintrc');

    if (this.props.gitinit) {
      this.template('gitignore', '.gitignore');
      this.template('gitattributes', '.gitattributes');
    }

    if (this.includeAva) {
      this.fs.copy(
        this.templatePath('tests'),
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
    this.installDependencies({bower: false});
    this.spawnCommand('composer', ['install']);
    this.async()
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
