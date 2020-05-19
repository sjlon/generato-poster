import blankIcon from '@/assets/images/缺省图.png'
const initaialHeadImg = {
	hide: false,
	shape: '方形',
	size: 50,
	x: 28,
	y: 23,
}
const initialNickName = {
	hide: false,
	x: 100,
	y: 30,
	fontSize: 16,
	color: '#596286',
	familyName :  '宋体'

}
const initialQRCode = {
	size: 179,
	x: 531,
	y: 1140
}

const loadImage = Symbol('loadImage')
const dataURItoBlob = Symbol('dataURItoBlob')

class GeneratePoster{
	constructor(posterHeadImg = initaialHeadImg, posterQRCode = initialQRCode, posterNickName = initialNickName, posterIcon = blankIcon, headimgurl = null, nickname = null, codeUrl) {
		this.width = 750
		this.height = 1334
		this.posterHeadImg = posterHeadImg
		this.posterNickName = posterNickName
		this.posterQRCode = posterQRCode
		this.ctx = null
		this.canvas = null
		this.posterIcon = posterIcon
		this.headimgurl = headimgurl
		this.nickname = nickname
		this.drawUrl = ''
		this.codeUrl = codeUrl

	}

	async convertImage() {
		this.GenerateCtx()
		await this.drawPosterBgc()
		await this.drawHeadImg()
		await this.drawNickName()
		await this.drawQRCode()
		this.drawUrl = this.canvas.toDataURL('image/png')
	}
	GenerateCtx() {
		let canvas = this.canvas = document.createElement('canvas')
		let ctx = canvas.getContext('2d')
		canvas.width = 750
		canvas.height = 1334
		this.ctx = ctx
	}
	// 海报背景图
	async drawPosterBgc() {
		let posterImage = await this[loadImage](this.posterIcon)
		this.ctx.drawImage(posterImage, 0, 0, 750, 1334)

	}
	// 微信头像
	async drawHeadImg() {
		let { hide, shape, x, y, size  } = this.posterHeadImg
		console.log(hide, shape, x, y, size, 'headimg')
		if(hide || !this.headimgurl) return
		if(shape === '圆形') {
			this.drawCircle()
		}
		// return
		let headImg = await this[loadImage](this.headimgurl)
		this.ctx.globalCompositeOperation = 'source-over'
		this.ctx.drawImage(headImg, x, y,size, size)
		this.ctx.restore()

	}
	async drawNickName() {
		let { hide, x , y , fontSize , color, familyName } = this.posterNickName
		if(hide || !this.nickname) return
		console.log(hide, x , y , fontSize , color, familyName, this.nickname)
		this.ctx.font = `${fontSize}px ${familyName}`
		this.ctx.fillStyle = `${color}`
		this.ctx.textAlign = 'left'
		this.ctx.textBaseline = 'top'
		this.ctx.fillText(this.nickname, x, y)
	}
	async drawQRCode() {
		let { x, y, size  } = this.posterQRCode
		// return
		let QRCode = await this[loadImage](this.codeUrl)
		this.ctx.globalCompositeOperation = 'source-over'
		this.ctx.drawImage(QRCode, x, y,size, size)
	}
	drawCircle() {
		// TODO
		let { size ,x, y } = this.posterHeadImg
		let radius = size / 2
		let circle = {
			x: x + radius,
			y: y + radius,
			radius
		}
		this.ctx.beginPath()
		this.ctx.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI)
		this.ctx.stroke()
		this.ctx.save()
		this.ctx.clip()
	}
	/**
	 *
	 * @param {String} imgUrl
	 * @param {Boolean} isCors
	 */

	[loadImage](imgUrl, isCors = true) {
		return new Promise((resolve, reject) => {
			let img = new Image(), objectUrl = null
			if(isCors) {
				img.setAttribute('crossOrigin', 'anonymous')
			}
			// base64 图片兼容处理
			if(imgUrl.match(/^data:(.*);base64,/) && window.URL && URL.createObjectURL) {
				objectUrl = URL.createObjectURL(this[dataURItoBlob](imgUrl))
				imgUrl = objectUrl
			}
			img.onload = () => {
				objectUrl && URL.revokeObjectURL(objectUrl)
				resolve(img)
			}
			img.onerror = err => {
				reject(err)
			}
			img.src = imgUrl
		})
	}
	/**
	 *
	 * @param {String} base64Data
	 */
	[dataURItoBlob](base64Data) {
		let byteString
		if(base64Data.split(',')[0].indexOf('base64') >= 0 ) {
			byteString = atob(base64Data.split(',')[1])
		} else {
			byteString = unescape(base64Data.split(',')[1])
		}
		let  mimeString = base64Data.split(',')[0].split(':')[1].split(';')[0]
		let ia = new Uint8Array(byteString.length)
		for(let i = 0; i < byteString.length ; i++) {
			ia[i] = byteString.charCodeAt(i)
		}
		return new Blob([ia], { type: mimeString})
	}

}

export default GeneratePoster
