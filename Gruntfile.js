module.exports = function(grunt) {

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
    aws: grunt.file.readJSON('secret.json'),
    s3: {
      options: {
        key: '<%= aws.key %>',
        secret: '<%= aws.secret %>',
        bucket: '<%= aws.bucket %>',
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
    }
  });

  grunt.task.registerTask('default', ['phantomas', 's3']);

  grunt.loadNpmTasks('grunt-s3');
  grunt.loadNpmTasks('grunt-phantomas');
};