var del = require("del");
var gulp = require("gulp");
var shell = require("gulp-shell");
var git = require("gulp-git");
var runSequence = require("gulp-run-sequence");

var ADALiOS = {
    name: "azure-activedirectory-library-for-objc",
    path: "./src/ios/ADALiOS",
    tag: "v3.0.0-pre.2"
};

gulp.task("ios-clean-adal", function(){
    return del(ADALiOS.path);
});

gulp.task("ios-pull-adal", function(done){
    git.clone("https://github.com/AzureAD/" + ADALiOS.name + ".git", {args: ADALiOS.path}, done);
});

gulp.task("ios-checkout-adal", function(done){
    git.checkout("tags/" + ADALiOS.tag, {cwd: ADALiOS.path}, done);
});

gulp.task("ios-get-adal", function(done){
    runSequence(
        "ios-clean-adal",
        "ios-pull-adal",
        "ios-checkout-adal",
        done
    );
});