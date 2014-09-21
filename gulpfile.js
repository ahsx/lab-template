var gulp = require('gulp')
	, jshint = require('gulp-jshint')
	, less = require('gulp-less')
	, gutil = require('gulp-util')
	, path = require('path')
	, fs = require('fs')
	, glob = require('glob')
	, mkdirp = require('mkdirp')
	, bower = require('bower')
	, Combine = require('stream-combiner')
	, uglify = require('gulp-uglify')
	, concat = require('gulp-concat')
	, svgSprites = require('gulp-svg-sprites')
	, svg = svgSprites.svg
	, livereload = require('gulp-livereload')
	, notify = require('gulp-notify')
	, plumber = require('gulp-plumber')
	;	


/////////////////////>	Configuration

/**
 *	List of all the css packages with their information
 *	Each entry in the array represent a package.
 *	This represent a standard situation, don't hesitate 
 *	to add or remove a package to reflect the application
 *	
 *	Each group have the following parameters
 *	@param name <String> The name of the group. It will be used to name the generated output
 *	@param output <String> Where to store the result
 *	@param src <String> or <Array> List of the file to include in the package
 *	@param watch <String> or <Array> Files to watch in dev
 **/
var styles = [
	{
		name:		"app",
		output:		"web/static/styles/",
		src: 		"web/static/styles/less/app.less",
		watch:	
		[
					"web/static/styles/less/app/**/*.less",
					"web/static/styles/less/app.less"
		]
	}
	,{
		name:		"vendors",
		output:		"web/static/styles/",
		src:		"web/static/styles/less/vendors.less",
		watch:	
		[
					"web/static/styles/less/vendors/**/*.less",
					"web/static/styles/less/vendors.less"
		]
	}
];

/**
 *	List of all the libs packages with their information
 *	Each entry in the array represent a package.
 *	This represent a standard situation, don't hesitate 
 *	to add or remove a package to reflect the application
 *	
 *	Each group have the following parameters:
 *	@param name <String> The name of the group. It will be used to name the generated output
 *	@param output <String> The path where to store the finale compressed output
 *	@param sourceMap <Boolean> Output the sourcemap or not (only in development).
 *	@param lint <Boolean> Lint the library.
 *	@param build <String> How to build the librairies. Available values: uglify, concat
 *	@param watch <String> or <Array> Lint the code.
 *	@param src <String> or <Array> List of all the file to include in the package
 **/
var libs = [
	{
		name:				"app",
		output:				"web/static/libs/",
		sourceMap:			true,
		lint:				false,
		build:				'concat',
		watch:				'web/static/libs/app/**/*.js',
		src:				
		[
							 'web/static/libs/app/Namespace.js'
							,'web/static/libs/app/ContextManager.js'
							,'web/static/libs/app/BootStrap.js'
							,'web/static/libs/app/commands/**/*.js'
							,'web/static/libs/app/controller/**/*.js'
							,'web/static/libs/app/events/Event.js'
							,'web/static/libs/app/events/**/*.js'
							,'web/static/libs/app/models/**/*.js'
							,'web/static/libs/app/view/**/Abstract*.js'
							,'web/static/libs/app/view/**/*.js'
							,'web/static/libs/app/start.js'
		]
	}
	,{
		name:				"vendors",
		output:				"web/static/libs/",
		template:			"application/views/includes/libs/vendors.php",
		sourceMap:			false,
		lint:				false,
		build:				'concat',
		src:				
		[
							 'web/static/libs/vendors/Class.js'
							,'web/static/libs/vendors/underscore-min.js'
							,'web/static/libs/vendors/fit.min.js'
							,'web/static/libs/vendors/jquery.1.11.min.js'
							,'web/static/libs/vendors/Pollyfill.js'
							,'web/static/libs/vendors/easeljs-0.7.1.min.js'
							,'web/static/libs/vendors/preloadjs-0.4.1.min.js'
							,'web/static/libs/vendors/snap.svg-min.js'

							,'web/static/libs/vendors/greensock/TweenMax.min.js'
							,'web/static/libs/vendors/greensock/plugins/ScrollToPlugin.min.js'
							,'web/static/libs/vendors/greensock/utils/Draggable.min.js'
							
							,'web/static/libs/vendors/ImprovedNoise.js'

		]
	}
]


/////////////////////>	Tasks

///////////> Utils

/**
 *	Lint the libraries to detect flaws
 **/
gulp.task('libs.lint', function()
{
	var n = libs.length;
	var lib;
	while(n--)
	{
		lib = libs[n];

		if ( !lib.lint || lib.lint == false )
			continue;

		gulp.src( lib.src )
			.pipe( jshint({strict:true}) )
			.pipe( jshint.reporter('default') )
		;
	}
});

/**
 *	Concatenate the libraries into a file (not compressed)
 **/
gulp.task('libs.concat', function()
{
	var n = libs.length;
	var lib;

	while(n-->0)
	{
		lib = libs[n];

		gulp.src( lib.src )
     	.pipe( concat(lib.name+'.min.js') )
     	.pipe( gulp.dest(lib.output) );
	}
});

/**
 *	Convert the svg files to a svg sprites
 **/
gulp.task('sprites', function()
{
	var config = 
	{
		  defs:true
		, cssFile: "../styles/less/app/svg-sprite.less"
		, svg: 
		{
			defs: "svg-defs.svg"
		}
	}

	gulp.src('web/static/images/svgs/*.svg')
		.pipe( svg(config) )
		.pipe( gulp.dest('web/static/images/') )
	;
});

///////////> Dev

/**
 *	Process all the styles groups in the configuration section
 *	- generate the stylesheet (uncompressed)
 *	- generate the source map file
 **/
gulp.task('styles.dev', function () 
{
	var n = styles.length;
	var style;
	var combined;

	while(n-- > 0)
	{
		style = styles[n];

		combined = Combine(
			gulp.src( style.src )
			.pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
			.pipe(
				less(
				{
					compress: false,
					sourceMap: true,
					sourceMapFileInline: true,
					sourceMapBasepath:__dirname,
					relativeUrls: true
				}))
		  	.pipe(gulp.dest( style.output ))
		);

		gutil.log( style.src );
		
		combined.on('error', function(err) {
			console.warn(err.message)
		});
	}
});

/**
 *	Process the javascript groups in the configuration section
 *	- concat the files
 *	- generate the sourcemap
 **/
gulp.task('libs.dev', ['libs.lint'], function()
{
	var n = libs.length;
	var lib;
	var map;

	while(n-->0)
	{
		lib = libs[n];
		map = lib.sourceMap == undefined ? false : lib.sourceMap;
		filename = lib.name+'.min.js';

		switch ( lib.build )
		{
			case 'uglify':
				gulp.src( lib.src )
		       	.pipe( concat(filename) )
		        .pipe( uglify({ outSourceMap:map }) )
		       	.pipe( gulp.dest(lib.output) );
				break;

			case 'concat':
			default:
				gulp.src( lib.src )
		       	.pipe( concat(filename) )
		       	.pipe( gulp.dest(lib.output) );
				break;
		}

		// if ( map )
		// {
		// 	var file = path.join( __dirname, lib.output, filename );
		// 	var mappath = path.join( lib.output, filename+'.map' );
		// 	var content = fs.readFileSync( file );
		// 	content += '//# sourceMappingURL='+mappath;


		// 	var fh = fs.openSync( file+'boo', 'w' );
		// 	fs.writeSync( fh, content );

		// 	console.log('file:', file);
		// 	console.log('mappath:', mappath);
		// 	console.log('content:', content);
		// }
	}
});

/**
 *	Developpement mode 
 *
 *	- build the styles (for dev)
 *	- build the scripts (for dev)
 *	- Watch for changed to build the scripts and/or the styles
 **/
gulp.task('dev', ['styles.dev', 'libs.dev'], function ()
{
	var server = livereload();
	
	// auto watch styles file change
	var n = styles.length;
	var style;
	while( n-- )
	{
		style = styles[n];
		if (style.watch)
		{
			gutil.log( '[watch] [styles]' + style.watch );
			gulp.watch(style.watch, ['styles.dev']).on('change', function(file)
			{
				console.log( 'file changed %s', file.path );
				server.changed(file.path);
			})
		}
	}

	// auto watch libs file change
	var n = libs.length;
	var lib;
	while ( n-- )
	{
		lib = libs[n];
		if (lib.watch)
		{
			gutil.log( '[watch] [libs]' + lib.watch );
			gulp.watch(lib.watch, ['libs.dev']).on('change', function(file)
			{
				console.log( 'file changed %s', file.path );
				server.changed(file.path);
			});
		}
	}
});

///////////> Distribution

/**
 *	Process all the styles groups in the configuration section
 *	- generate the stylesheets (compressed)
 **/
gulp.task('styles', [], function()
{
	var n = styles.length;
	var style;
	var combined;

	while(n-- > 0)
	{
		style = styles[n];

		combined = Combine(
			gulp.src( style.src )
				.pipe(
					less(
					{
						compress: true
					}))
			  .pipe(gulp.dest( style.output ))
			  .on('error', gutil.log)
		);
		
		combined.on('error', function(err) {
			console.warn(err.message)
		});
	}
});

/**
 *	Process the javascript groups in the configuration section
 *	- concat all the libraries
 *	- uglify the concatenated files
 **/
gulp.task('libs', ['libs.lint'], function()
{
	var n = libs.length;
	var lib;
	var map;

	while(n-->0)
	{
		lib = libs[n];
		map = lib.sourceMap == undefined ? false : lib.sourceMap;

		gulp.src( lib.src )
     	.pipe( concat(lib.name+'.js') )
      .pipe( uglify({}) )
     	.pipe( gulp.dest(lib.output) );
	}
});

/**
 *	Prepare the project for distribution
 *	- launch the libs task
 *	- launch the styles task
 **/
gulp.task('dist', ['libs', 'styles']);

/**
 *	Alias for the distribution
 **/	
gulp.task('prod', ['dist']);

///////////> Doc

gulp.task('default', function()
{
	console.log( 'Gulp build script for frontend development' );
	console.log( 'Version: 1.3' );
	console.log( '' );
	console.log( 'Available tasks:' );
	console.log( '' );
	console.log( ' gulp install \t Install the frontend librairies and styles with bower.' );
	console.log( ' gulp dev \t\t This is the task to launch on development, it will build the styles (for dev), build the scripts (for dev), Watch for changed to build the scripts and/or the styles' );
	console.log( ' gulp styles.dev \t Process all the styles groups in the configuration section, generate the stylesheet (uncompressed), generate the source map file' );
	console.log( ' gulp libs.dev \t\t Process the libraries groups in the configuration section, concat the files, uglify the files, generate the sourcemap' );
	console.log( '' );
	console.log( ' gulp dist \t\t This will build the scripts.min.js and the styles.css, based on the configuration on the top of the gulpfile.js. All the files will be minified and compressed.' );
	console.log( ' gulp styles \t\t Process all the styles groups in the configuration section, generate the stylesheet (compressed)' );
	console.log( ' gulp libs \t\t Process the libraries groups in the configuration section, concat the files, ugligy the files' );
	console.log( '' );
});
