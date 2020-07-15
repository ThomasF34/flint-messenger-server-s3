# Server Side Flint Messenger app

## Make DB work locally

> :warning: If you want to use a local Mongo database you'll have to remove the `+srv` from the DB URI on both `src/database.ts` and `src/authentication/sessionStore.ts` files.

Activate Authentication when running mongo daemon with the `--auth` option:
```
mongod --auth --config /usr/local/etc/mongod.conf #for Mac
mongod --auth --config /etc/mongod.conf 
```

Or add these line to the conf file:
```
security:
  authorization: "enabled"
```

Create users:
```
use admin
db.createUser(
  {
    user: "superAdmin",
    pwd: "complexPwd",
    roles: [ { role: "userAdminAnyDatabase", db: "admin" }, "readWriteAnyDatabase" ]
  }
)

use flint-messenger
db.createUser(
  {
    user: "flint",
    pwd: "myPwd",
    roles: [ { role: "readWrite", db: "flint-messenger" } ]
  }
)
```

