module.exports = {
	globDirectory: 'dist/',
	globPatterns: [
		'**/*.{css,js,html,ttf,png,ico,json}'
	],
	swDest: 'dist/sw.js',
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	]
};