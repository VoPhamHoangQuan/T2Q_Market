const bcrypt = require('bcrypt');
const sendMail = require('./sendMail')
const jwt = require('jsonwebtoken')
const { google } = require('googleapis')
const { OAuth2 } = google.auth
const fetch = require('node-fetch')
const userModel = require('../models/users');

const client = new OAuth2(process.env.MAILING_SERVICE_CLIENT_ID)

// POST /register
exports.register = async (req, res, next) => {
	try {
		const { name, email, password } = req.body

		if (!name || !email || !password)
			return res.status(400).json({ msg: "Hay dien toan bo cac thong tin" })

		// if (!validateEmail(email))
		// 	return res.status(400).json({ msg: "Invalid emails." })

		const user = await userModel.findOne({ email })
		if (user) return res.status(400).json({ msg: "Email nay da ton tai" })

		if (password.length < 6)
			return res.status(400).json({ msg: "Mat khau phai bao gom 6 ki tu" })

		const passwordHash = await bcrypt.hash(password, 12)

		const newUser = {
			name, email, password: passwordHash
		}

		const activation_token = createActivationToken(newUser)

		const url = `http://localhost:3000/activation/${activation_token}`
		sendMail(email, url, "Verify your email address")


		res.json({ msg: "Dang ki thanh cong. Vui long kich hoat tai khoan tai email cua ban!" })
	} catch (err) {
		return res.status(500).json({ msg: err.message })
	};
}

exports.activateEmail = async (req, res) => {
	try {
		const { activation_token } = req.body
		const user = jwt.verify(activation_token, process.env.ACTIVATION_TOKEN_SECRET)

		const { name, email, password } = user

		const check = await userModel.findOne({ email })
		if (check) return res.status(400).json({ msg: "Email da ton tai" })

		const newUser = new userModel({
			name, email, password
		})

		await newUser.save()

		res.json({ msg: "Tai khoan da duoc kich hoat" })

	} catch (err) {
		return res.status(500).json({ msg: err.message })
	}
}

// POST /login
exports.login = async (req, res) => {
	try {
		const { email, password } = req.body
		const user = await userModel.findOne({ email })
		if (user.deleted === true) {
			return res.status(400).json({ msg: "Tai khoan da bi xoa hoac khong ton tai vui long lien he admin!" })
		} else {
			if (!user) return res.status(400).json({ msg: "Thong tin tai khoan hoac mat khau khong chinh xac" })

			const isMatch = await bcrypt.compare(password, user.password)
			if (!isMatch) return res.status(400).json({ msg: "Thong tin tai khoan hoac mat khau khong chinh xac" })

			const refresh_token = createRefreshToken({ id: user._id })
			res.cookie('refreshtoken', refresh_token, {
				httpOnly: true,
				path: '/refresh_token',
				maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
			})

			res.json({ msg: "Dang nhap thanh cong!" })
		}
	} catch (err) {
		return res.status(500).json({ msg: err.message })
	}
};

exports.getAccessToken = (req, res) => {
	try {
		const rf_token = req.cookies.refreshtoken
		if (!rf_token) return res.status(400).json({ msg: "Ban chua dang nhap" })

		jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
			if (err) return res.status(400).json({ msg: "Ban chua dang nhap" })

			const access_token = createAccessToken({ id: user.id })
			res.json({ access_token })
		})
	} catch (err) {
		return res.status(500).json({ msg: err.message })
	}
}

// POST /forgot
exports.forgotPassword = async (req, res) => {
	try {
		const { email } = req.body
		const user = await userModel.findOne({ email })
		if (!user) return res.status(400).json({ msg: "Email khong ton tai" })

		const access_token = createAccessToken({ id: user._id })
		const url = `http://localhost:3000/reset/${access_token}`

		sendMail(email, url, "Reset your password")
		res.json({ msg: "Kiem tra mail cua ban" })
	} catch (err) {
		return res.status(500).json({ msg: err.message })
	}
}

// POST /reset 
exports.resetPassword = async (req, res) => {
	try {
		const { password } = req.body
		console.log(password)
		const passwordHash = await bcrypt.hash(password, 12)

		await userModel.findOneAndUpdate({ _id: req.user.id }, {
			password: passwordHash
		})

		res.json({ msg: "Mat khau da duoc thay doi!" })
	} catch (err) {
		return res.status(500).json({ msg: err.message })
	}
},

	// GET /logout
	exports.logout = async (req, res) => {
		try {
			res.clearCookie('refreshtoken')
			return res.json({ msg: "Da dang xuat" })
		} catch (err) {
			return res.status(500).json({ msg: err.message })
		}
	},

	// Google Login
	exports.googleLogin = async (req, res) => {
		try {
			const { tokenId } = req.body

			const verify = await client.verifyIdToken({ idToken: tokenId, audience: process.env.MAILING_SERVICE_CLIENT_ID })

			const { email_verified, email, name, picture } = verify.payload

			const password = email + process.env.GOOGLE_SECRET

			const passwordHash = await bcrypt.hash(password, 12)

			if (!email_verified) return res.status(400).json({ msg: "Email verification failed." })

			const user = await userModel.findOne({ email })

			if (user) {
				// const isMatch = await bcrypt.compare(password, user.password)
				// if (!isMatch) return res.status(400).json({ msg: "Password is incorrect." })

				const refresh_token = createRefreshToken({ id: user._id })
				res.cookie('refreshtoken', refresh_token, {
					httpOnly: true,
					path: '/refresh_token',
					maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
				})

				res.json({ msg: "Login success!" })
			} else {
				const newUser = new userModel({
					name, email, password: passwordHash, avatar: picture
				})

				await newUser.save()

				const refresh_token = createRefreshToken({ id: newUser._id })
				res.cookie('refreshtoken', refresh_token, {
					httpOnly: true,
					path: '/refresh_token',
					maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
				})

				res.json({ msg: "Login success!" })
			}


		} catch (err) {
			return res.status(500).json({ msg: err.message })
		}
	},

	// Facebook Login
	exports.facebookLogin = async (req, res) => {
		try {
			const { accessToken, userID } = req.body

			const URL = `https://graph.facebook.com/v2.9/${userID}/?fields=id,name,email,picture&access_token=${accessToken}`

			const data = await fetch(URL).then(res => res.json()).then(res => { return res })

			const { email, name, picture } = data

			const password = email + process.env.FACEBOOK_SECRET

			const passwordHash = await bcrypt.hash(password, 12)

			const user = await userModel.findOne({ email })

			if (user) {
				// const isMatch = await bcrypt.compare(password, user.password)
				// if (!isMatch) return res.status(400).json({ msg: "Password is incorrect." })

				const refresh_token = createRefreshToken({ id: user._id })
				res.cookie('refreshtoken', refresh_token, {
					httpOnly: true,
					path: '/refresh_token',
					maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
				})

				res.json({ msg: "Login success!" })
			} else {
				const newUser = new userModel({
					name, email, password: passwordHash, avatar: picture.data.url
				})

				await newUser.save()

				const refresh_token = createRefreshToken({ id: newUser._id })
				res.cookie('refreshtoken', refresh_token, {
					httpOnly: true,
					path: '/refresh_token',
					maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
				})

				res.json({ msg: "Login success!" })
			}
		} catch (err) {
			return res.status(500).json({ msg: err.message })
		}
	}


// Validate Email
function validateEmail(email) {
	const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(String(email).toLowerCase());
}

const createActivationToken = (payload) => {
	return jwt.sign(payload, process.env.ACTIVATION_TOKEN_SECRET, { expiresIn: '5m' })
}

const createAccessToken = (payload) => {
	return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' })
}

const createRefreshToken = (payload) => {
	return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' })
}