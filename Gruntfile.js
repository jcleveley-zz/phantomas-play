module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
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
    }
  });


  grunt.loadNpmTasks('grunt-phantomas');
};