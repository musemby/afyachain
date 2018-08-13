export COMPOSER_PROVIDERS='{
  "github": {
    "provider": "github",
    "module": "passport-github",
    "clientID": "b5b29e03df5f80d9dc82",
    "clientSecret": "698e9c5250caef456f5a71e4c040207b57a7dce4",
    "authPath": "/auth/github",
    "callbackURL": "http://localhost:7090/students/see_token/",
    "successRedirect": "http://localhost:3000/#/dashboard",
    "failureRedirect": "/"
  }
}'
