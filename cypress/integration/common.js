/*eslint-disable */

const randomNumber = (max = 100000, min = 0) =>
	Math.floor(Math.random() * (max - min + 1) + min)

const randomText = (length = 5) => {
	let result = ''
	const characters =
		'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
	for (let i = 0; i < length; i++) {
		result += characters[Math.floor(Math.random() * 62)]
	}
	return result
}

module.exports = { randomText, randomNumber }
