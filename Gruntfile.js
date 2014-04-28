module.exports = function(grunt) {

  var secrets = grunt.file.readJSON('secret.json');
  var cert = '';

  try {
    cert = grunt.file.read(secrets.ssh.privateKey);
  } catch (e) {
  }

  // Project configuration.
  grunt.initConfig({
    secrets: grunt.file.readJSON('secret.json'),
    phantomas: {
      frontPageDesktop : {
        options : {
          indexPath : './output/frontPageDesktop/',
          raw       : [],
          url       : 'http://www.live.bbc.co.uk/news',
          numberOfRuns : 3
        }
      },
      frontPageMobile : {
        options : {
          indexPath : './output/frontPageMobile/',
          raw       : ['--viewport=[400]x[800]'],
          url       : 'http://www.live.bbc.co.uk/news',
          numberOfRuns : 3
        }
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
    },
    aws_s3: {
      options: {
        accessKeyId: '<%= secrets.aws.key %>', // Use the variables
        secretAccessKey: '<%= secrets.aws.secret %>', // You can also use env variables
        bucket: '<%= secrets.aws.bucket %>',
        region: 'eu-west-1',
        access: 'public-read'
      },
      prod: {
        options: {
          differential: true // Only uploads the files that have changed
        },
        files: [
          {expand: true, cwd: 'output/', src: ['**'], dest: ''},
          {src: ['index.html'], dest: 'index.html'}
        ]
      }
    }
  });

  grunt.task.registerTask('default', ['phantomas', 'aws_s3']);
  grunt.task.registerTask('deploy', ['sshexec']);

  grunt.loadNpmTasks('grunt-aws-s3');
  grunt.loadNpmTasks('grunt-phantomas');
  grunt.loadNpmTasks('grunt-ssh');
};