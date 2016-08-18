var del = require("del");
var gulp = require("gulp");
var shell = require("gulp-shell");
var git = require("gulp-git");
var runSequence = require("gulp-run-sequence");

/**
 * ADALiOS update flow:
 *
 * 1) npm install (only if not already installed)
 * 2) gulp ios-update-adal
 */

var ADALiOS = {
    dir: "azure-activedirectory-library-for-objc",
    tag: "3.0.0-pre6",
    script: "build_sdk.sh",
    framework: "ADALiOS.framework"
};

gulp.task("ios-clean-adal", function(){
    return del(ADALiOS.dir);
});

gulp.task("ios-pull-adal", function(done){
    git.clone("https://github.com/AzureAD/" + ADALiOS.dir + ".git", null, done);
});

gulp.task("ios-checkout-adal", function(done){
    if(ADALiOS.tag){
        git.checkout("tags/" + ADALiOS.tag, {cwd: ADALiOS.dir}, done);
    } else {
        console.log("no tag found, skipping checkout");
        done();
    }
});

gulp.task("ios-get-adal", function(done){
    runSequence(
        "ios-clean-adal",
        "ios-pull-adal",
        "ios-checkout-adal",
        done
    );
});

gulp.task("ios-move-script", function(){
    return gulp.src("./src/ios/tools/" + ADALiOS.script)
    .pipe(gulp.dest("./" + ADALiOS.dir));
});

gulp.task("ios-run-script", shell.task("./" + ADALiOS.script, {cwd: ADALiOS.dir}));

gulp.task("ios-script", function(done){
    runSequence(
        "ios-move-script",
        "ios-run-script",
        done
    );
});

gulp.task("ios-transfer-adal", function(){
    return gulp.src("./" + ADALiOS.dir + "/build/" + ADALiOS.framework + "/*", {read: false})
    .pipe(gulp.dest("./src/ios/" + ADALiOS.framework));
});

gulp.task("ios-update-adal", function(done){
    runSequence(
        "ios-get-adal",
        "ios-script",
        "ios-transfer-adal",
        done
    );
});