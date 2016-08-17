var del = require("del");
var gulp = require("gulp");
var shell = require("gulp-shell");
var git = require("gulp-git");
var runSequence = require("gulp-run-sequence");

/**
 * These tasks are based around building the ADAL iOS framework
 * README found in this project at ./src/ios/tools/Readme.md
 */

var ADALiOS = "azure-activedirectory-library-for-objc";
var iosBuildScript = "build_sdk.sh";

gulp.task("ios-run-build", shell.task("./" + ADALiOS + "/" + iosBuildScript));

gulp.task("ios-pull-adal", function(done){
    git.clone("https://github.com/AzureAD/" + ADALiOS + ".git", null, done);
});

gulp.task("ios-transfer-script", function(){
    return gulp.src("./src/ios/tools/" + iosBuildScript)
    .pipe(gulp.dest("./" + ADALiOS));
});

gulp.task("ios-transfer-build", function(){
    return gulp.src("./" + ADALiOS + "/build")
    .pipe(gulp.dest("./src/ios"));
});

gulp.task("ios-clean", function(){
    return del(ADALiOS);
});

// Steps 1 & 4
gulp.task("ios-adal-prep", function(done){
    runSequence(
        "ios-pull-adal",
        "ios-transfer-script",
        done
    );
});

// Then open in xcode, etc

// Steps 4 & 5, as well as cleanup
gulp.task("ios-adal-update", function(done){
    runSequence(
        "ios-run-build",
        "ios-transfer-build",
        "ios-clean", // comment out for debugging
        done
    );
});

// all-in-one
gulp.task("ios-adal", function(done){
    runSequence("ios-adal-prep", "ios-adal-update", done);
});