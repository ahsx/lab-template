APPNAME = 'lab'
getPartial = function( path )
{
	return '/statics/partials/' + path;
} 

angular
	.module( APPNAME, ['ui.router'])
;