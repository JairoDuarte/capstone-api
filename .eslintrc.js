module.exports = {
    "env": {
        "node": true,
        "jest/globals": true
    },
    "plugins": ["jest"],
    "extends": ["airbnb","eslint:recommended","plugin:jest/recommended"],
    
    "globals": {
        "use": true,
        "Helpers": true,
        "fails":true,
        "async":true
    },
    "rules": {
        "no-constant-condition":"off",
        "no-console": "off",
    }
};