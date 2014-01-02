module.exports = function(grunt) {

  var secrets = grunt.file.readJSON('secret.json');
  var cert = '';

  try {
    cert = grunt.file.read(secrets.ssh.privateKey);
  } catch (e) {
  }

  // Project configuration.
  grunt.initConfig({
    phantomas: {
      frontPageDesktop : {
        options : {
          indexPath : './output/frontPageDesktop/',
          raw       : [],
          url       : 'http://www.live.bbc.co.uk/news',
          numberOfRuns : 1
        }
      },
      frontPageMobile : {
        options : {
          indexPath : './output/frontPageMobile/',
          raw       : ['--viewport=[400]x[800]'],
          url       : 'http://www.live.bbc.co.uk/news',
          numberOfRuns : 1
        }
      }
    },
    secrets: grunt.file.readJSON('secret.json'),
    s3: {
      options: {
        key: '<%= secrets.aws.key %>',
        secret: '<%= secrets.aws.secret %>',
        bucket: '<%= secrets.aws.bucket %>',
        access: 'public-read'
      },
      dev: {
        upload: [
          {
            src: 'output/frontPageMobile/index.html',
            dest: 'frontPageMobile.html'
          },
          {
            src: 'output/frontPageDesktop/index.html',
            dest: 'frontPageDesktop.html'
          },
          {
            src: 'output/*/data/*.json',
            dest: 'data/'
          },
          {
            src: 'output/frontPageMobile/public/scripts/*',
            dest: 'public/scripts'
          },
          {
            src: 'output/frontPageMobile/public/styles/*',
            dest: 'public/styles'
          },
          {
            src: 'index.html',
            dest: 'index.html'
          }
        ]
      }
    },
    sshexec: {
      test: {
        command:
          [
            'cd /home/phantomas',
            'cd /home/phantomas && git pull https://github.com/jcleveley/phantomas-play',
            'cd /home/phantomas && npm install'
          ],
        options: {
          host: '<%= secrets.ssh.host %>',
          username: '<%= secrets.ssh.username %>',
          privateKey: cert,
        }
      }
    }
  });

  grunt.task.registerTask('default', ['phantomas', 's3']);

  grunt.loadNpmTasks('grunt-s3');
  grunt.loadNpmTasks('grunt-phantomas');
  grunt.loadNpmTasks('grunt-ssh');
};