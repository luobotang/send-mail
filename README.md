# send-mail

Send e-mail by node.

## usage

```javascript
var sendMail = require('send-mail')
sendMail({
  "host": "smtp.example.com",
  "port": 25,
  "username": "luobotang@example.com",
  "password": "---",
  "from": "luobotang <luobotang@example.com>",
  "to": "luobotang1 <luobotang@example1.com>; luobotang2 <luobotang@example2.com>",
  "subject": "Hello",
  "body": "Hello!"
})
```
