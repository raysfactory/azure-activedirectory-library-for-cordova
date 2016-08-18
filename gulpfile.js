var del = require("del");
var gulp = require("gulp");
var shell = require("gulp-shell");
var git = require("gulp-git");
var runSequence = require("gulp-run-sequence");

/**
 * Hacked up tasks to manually build ADALiOS
 *
 * 1) Run "npm install" (if you haven't already), then "gulp ios-get-adal"
 * 2) open this in xcode: "azure-activedirectory-library-for-cordova/azure-activedirectory-library-for-objc/ADALiOS.xcworkspace"
 * 3) Build ADALiOS target
 * 4) in xcode finder, go to: ADALiOS -> Products
 * 5) Right click libADALiOS.a -> Show in Finder
 *
 * All build outputs will be in that folder. Since xcode generates hash-named
 * folders in the output path, you'll need to copy these manually into src/ios/
 */

var ADALiOS = {
    name: "azure-activedirectory-library-for-objc",
    path: "./src/ios/ADALiOS",
    tag: "v3.0.0-pre.2"
};

gulp.task("ios-clean-adal", function(){
    return del([ADALiOS.name, ADALiOS.path]);
});

gulp.task("ios-pull-adal", function(done){
    git.clone("https://github.com/AzureAD/" + ADALiOS.name + ".git", null, done);
});

gulp.task("ios-checkout-adal", function(done){
    git.checkout("tags/" + ADALiOS.tag, {cwd: ADALiOS.name}, done);
});

gulp.task("ios-get-adal", function(done){
    runSequence(
        "ios-clean-adal",
        "ios-pull-adal",
        "ios-checkout-adal",
        done
    );
});