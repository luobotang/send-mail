var net = require('net')

var CMD_MESSAGE = '<message>'
var END_LINE = '\r\n'

/*
 * send e-mail by SMTP
 */
function sendMail(options) {

	var i = 0
	var cmds = [
		'HELO ' + options.host,

		'auth login',
		new Buffer(options.username).toString('base64'),
		new Buffer(options.password).toString('base64'),

		// message
		'mail from:' + options.username,
		'rcpt to:' + options.to,

		'data',
		CMD_MESSAGE,

		'quit'
	]
	var message = [
		'from:' + options.from,
		'to:' + options.to,
		'subject:' + options.subject,
		'',
		options.body,
		'.'
	]

	var client = net.connect({
		host: options.host,
		port: options.port
	})

	client.on('connect', function () {
		console.log('connected')
	})

	client.on('data', function (data) {
		console.log('Serer: ' + data.toString().replace(END_LINE, ''))

		if (i >= cmds.length) {
			client.end()
			return
		}

		var cmd = cmds[i++]

		if (cmd === CMD_MESSAGE) {
			console.log('message body:')
			message.forEach(function (line) {
				console.log('> ' + line)
				client.write(line + END_LINE)
			})
		} else {
			console.log('ME: ' + cmd)
			client.write(cmd + END_LINE)
		}
	})

	client.on('error', function (er) {
		console.log('error: ' + er)
	})

	client.on('end', function () {
		console.log('send mail finish')
	})
}

module.exports = sendMail