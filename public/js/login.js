(function($) {
	"use strict"

	var INDEX = {
		init: function(me) {
			me.$btnReg   = $('.btn-register')
			me.$register = $('.register')
			me.$mask     = $('.r-mask')

			me.swiper(me)

			me.$btnReg.on('click', function() {
				me.$register.addClass('show')
			})

			me.$mask.on('click', function() {
				me.$register.removeClass('show')
			})

			me.login.init(me.login)
			me.register.init(me.register)
		},
		login: {
			init: function(me) {
				me.$formLogin = $('#formLogin')
				me.$btnReg    = $('.btn-register')
				me.$btnSubmit = me.$formLogin.find('#lSubmit')
				me.$name      = me.$formLogin.find('[name=loginname]')
				me.$password  = me.$formLogin.find('[name=password]')

				// 登录表单提交
				me.$btnSubmit.on('click', function(e) { me.loginSubmit(e, me) })

				if (message) {
					INDEX.message(message)
				}
			},
			loginSubmit: function(e, me) {
				e.preventDefault()
				var nameVal = me.$name.val().trim()
				var passVal = me.$password.val().trim()
				if (!nameVal || !passVal) {
					INDEX.message('信息填写不完整!')
					return false
				} else {
					me.$formLogin.submit()
				}
			}
		},
		register: {
			init: function(me) {
				me.$formRegister = $('#formRegister')
				me.$btnSubmit  = me.$formRegister.find('#rSubmit')
				me.$name       = me.$formRegister.find('[name=loginname]')
				me.$email      = me.$formRegister.find('[name=email]')
				me.$password   = me.$formRegister.find('[name=password]')
				me.$passwordR  = me.$formRegister.find('[name=passwordR]')

				// 注册表单提交
				me.$btnSubmit.on('click', function(e) { me.registerSubmit(e, me) })
			},
			registerSubmit: function(e, me) {
				e.preventDefault()
				var msg  = ''
				var emailRE    = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/,
					nameRE     = /^([a-zA-Z0-9_-])+$/,
					phoneRE    = /^1(3|4|5|7|8)\d{9}$/,
					passwordRE = /^[A-Za-z0-9]{6,20}$/,		// 6-20位字母数字组合
					isLetter   = /[A-Za-z]+/,
					isNumber   = /[\d]+/
				var name      = me.$name.val().trim(),
					email     = me.$email.val().trim(),
					password  = me.$password.val().trim(),
					passwordR = me.$passwordR.val().trim()

				if (!nameRE.test(name)) msg = '用户名不正确'
				if (!emailRE.test(email)) msg = '邮箱不正确'
				if (!passwordRE.test(password) || (!isLetter.test(password) || !isNumber.test(password))) msg = '密码格式不正确'
				if (password != passwordR) msg = '两次输入的密码不一致'

				if (msg) {
					INDEX.message(msg)
					return false
				} else {
					me.$formRegister.submit()
				}
			}
		},
		// 背景切换
		swiper: function() {
			var imgSwiper = new Swiper($('.banner')[0], {
				autoplay: 5000,
				speed: 1000,
				loop: true,
				effect: 'fade'
			})
		},
		message: function(msg) {
			var id  = 'msg_'+(new Date()*1)
			var dom = '<div id="'+id+'" class="i-message">'+msg+'</div>'
			$('body').append(dom)
			var d = $('#'+id)
			d.slideDown()
			setTimeout(function() {
				d.slideUp(function() {
					d.remove()
				})
			}, 3000)
		}
	}
	INDEX.init(INDEX)
})(jQuery)