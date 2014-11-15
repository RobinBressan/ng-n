({
    baseUrl: "../src",
    name: "../bower_components/almond/almond.js",
    include: ['ng-n'],
    insertRequire: ['ng-n'],
    wrap: {
        startFile: '../build/start.frag',
        endFile: '../build/end.frag'
    },
    out: '../ng-n.min.js'
})
