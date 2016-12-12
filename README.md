# ADAL Cordova Plugin Patch For B2C

## Overview

This is a chopped version of [cordova-plugin-ms-adal](https://github.com/AzureAD/azure-activedirectory-library-for-cordova) that works with Azure AD B2C.

Be forewarned that this patch is _barely_ working, with minimal "happy-path" testing, and I do not intend to maintain it after the [original plugin libraries get updated](https://github.com/AzureAD/azure-activedirectory-library-for-cordova/issues/85#issuecomment-240819239).

- Android - ADAL library has been updated to 2.0.3-alpha and now has policies / tokens integrated correctly

- iOS - ADAL library has been updated to 3.0.0-pre6 and works correctly with B2C, token caching now works as well

- Windows - currently no plans to update this platform's support

## Installation

Via cordova CLI:

```
cordova plugin add https://github.com/jospete/azure-activedirectory-library-for-cordova
```

**NOTE** - this patch will conflict with the original plugin if the original already exists in your project. The original plugin must be **replaced** by this one. This plugin is tagged as "cordova-plugin-ms-adal-b2c-patch", so you should delete "cordova-plugin-ms-adal" in your /plugins directory if that exists.

## Sample Usage

```javascript
require("Q");

var AzureB2C = {};

AzureB2C.params = {
    
    // default to use
    redirectUrl: "urn:ietf:wg:oauth:2.0:oob",
    
    // default used by the updated ADAL libraries
    extraQueryParams: "nux=1",
    
    // ** required **
    authority: "https://login.microsoftonline.com/[YOUR_TENANT]",
    
    // ** required ** also sometimes called "App ID", looks something like this: f6dad784-f7d3-****-92bd-******
    clientId: "[YOUR_CLIENT_ID]",
    
    // ** required **
    policy: "[YOUR_SIGNIN_POLICY]",
    
    // don't need to track this in most cases
    userId: null,
    
    // legacy - no longer needed in the updated ADAL libraries
    resourceUrl: null
};

AzureB2C.authContext = new window.Microsoft.ADAL.AuthenticationContext(params.authority);
AzureB2C.authorizationHeader = null; // use this to make API requests after login

// Use this to do a loud sign in initially...
AzureB2C.acquireTokenAsync = function(){
    return authContext.acquireTokenAsync(
        params.resourceUrl,
        params.clientId,
        params.redirectUrl,
        params.userId,
        params.extraQueryParams,
        params.policy
    );
};

// Use this when the user has already signed in recently...
AzureB2C.acquireTokenSilentAsync = function(){
    return authContext.acquireTokenSilentAsync(
        params.resourceUrl,
        params.clientId,
        params.userId,
        params.redirectUrl,
        params.policy
    );
};

// Authentication Flow...
// NOTE: this will fail if it is called before cordova's "ready" event
AzureB2C.authenticate = function(clear){
    
    if(clear){
        console.log("clearing cache before login...");
        authContext.tokenCache.clear();
    }

    var deferred = Q.defer();
    
    var loginSuccess = function(jwt){
        console.log("login success: " + JSON.stringify(jwt, null, "\t"));
        authorizationHeader = "Bearer " + jwt.token;
        deferred.resolve(jwt);
    };
    
    var loginError = function(error){
        console.log("login error: " + JSON.stringify(error, null, "\t"));
        deferred.reject(error);
    };

    var loudSignIn = function(){
        acquireTokenAsync().then(loginSuccess, loginError);
    };

    var parseCache = function(items){

        if(items.length > 0){
            console.log("cache has items, attempting silent login");
            acquireTokenSilentAsync().then(loginSuccess, loudSignIn);
            
        } else {
            console.log("cache is empty, attempting loud sign in");
            loudSignIn(); 
        }
    };

    authContext.tokenCache.readItems().then(parseCache, loudSignIn);

    return deferred.promise;
};

var onCordovaReady = function(){
    AzureB2C.authenticate();
};

document.addEventListener("deviceready", onCordovaReady, false);

```

## Build / Update ADALiOS.framework (iOS)

NOTE: you shouldn't need to do this since the correct ADAL iOS version is
baked into this project, but I've added this in for better insight on how the whole thing works.

** This is not guaranteed to be functional - I barely got it running when I rebuilt the framework libs. **

at the root of this project:
- npm install
- gulp ios-update-adal

See gulpfile.js for details on how this works

## Other Documentation

See the [original plugin docs](https://github.com/AzureAD/azure-activedirectory-library-for-cordova/blob/master/README.md) for more info on how all of this works / should be used.