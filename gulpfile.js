var del = require("del");
var gulp = require("gulp");
var shell = require("gulp-shell");
var git = require("gulp-git");
var runSequence = require("gulp-run-sequence");

/**
 * ADALiOS update flow:
 *
 * 1) npm install (only if not already installed)
 * 2) gulp ios-get-adal
 * 3) cd azure-activedirectory-library-for-objc
 * 4) ./build_sdk.sh
 * 5) cd ..
 * 6) gulp ios-transfer-adal
 */

var ADALiOS = {
    name: "azure-activedirectory-library-for-objc",
    path: "./src/ios/ADALiOS",
    tag: "3.0.0-pre6",
    script: "build_sdk.sh",
    framework: "ADALiOS.framework"
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

gulp.task("ios-move-script", function(){
    return gulp.src("./src/ios/tools/" + ADALiOS.script)
    .pipe(gulp.dest("./" + ADALiOS.name));
});

gulp.task("ios-get-adal", function(done){
    runSequence(
        "ios-clean-adal",
        "ios-pull-adal",
        "ios-checkout-adal",
        "ios-move-script",
        done
    );
});

gulp.task("ios-transfer-adal", function(){
    return gulp.src("./" + ADALiOS.name + "/build/" + ADALiOS.framework)
    .pipe(gulp.dest("./src/ios"));
});