var net = require('net')

var CMD_MESSAGE = '<message>'
var CMD_RCPT_TO = 'rcpt to:'
var END_LINE = '\r\n'

/*
 * send e-mail by SMTP
 */
function sendMail(options) {

	var i = 0
	var cmds = [
		'HELO ' + options.host,

		// auth
		'auth login',
		new Buffer(options.username).toString('base64'),
		new Buffer(options.password).toString('base64'),

		// from to
		'mail from:' + options.username,
		CMD_RCPT_TO + options.to,

		// message
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

	prepairRcpt(cmds)

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

/*
 * prepair rcpt cmd, check if have multiple receiptor
 * @example
 *   cmd:
 *     rcpt to:a <a@example.com>; b <b@example.com>
 *   will be replaced by two cmds:
 *     rcpt to:a@example.com
 *     rcpt to:b@example.com
 */
function prepairRcpt(cmds) {
	var idx
	var rcpts

	for (var i = 0, l = cmds.length; i < l; i++) {
		if (cmds[i].indexOf(CMD_RCPT_TO) > -1) {
			idx = i
			rcpts = cmds[i]
			break
		}
	}

	if (rcpts) {
		rcpts = rcpts.substr(CMD_RCPT_TO.length).split(/;\s*/).map(function (rcpt) {
			var address = /.*\<(.+@.+)\>.*/.exec(rcpt)
			address = address && address[1] || rcpt
			return CMD_RCPT_TO + address
		})
		cmds.splice.apply(cmds, [idx, 1].concat(rcpts))
	}
}

module.exports = sendMail