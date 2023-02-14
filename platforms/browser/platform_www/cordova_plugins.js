cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/cordova-plugin-firebase/www/firebase-browser.js",
        "id": "cordova-plugin-firebase.FirebasePlugin",
        "pluginId": "cordova-plugin-firebase",
        "clobbers": [
            "FirebasePlugin"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-firebase": "2.0.5"
}
// BOTTOM OF METADATA
});