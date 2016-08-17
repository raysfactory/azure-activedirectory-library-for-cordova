var del = require("del");
var gulp = require("gulp");
var shell = require("gulp-shell");
var git = require("gulp-git");
var runSequence = require("gulp-run-sequence");


// To get framework file for ios:
// 1) Build
// 2) Right-click "libADALiOS.a" in xcode
// 3) click "Show in Finder"
// 4) copy source file into src/ios/

// NOTE: build product will be at:
// /Libary/Developer/Xcode/DerivedData/ADALiOS-*******/Build/Products/Debug-iphoneos/libADALiOS.a

// TODO: automate process for moving product output to src/ios folder

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