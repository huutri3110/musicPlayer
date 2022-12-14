// Doi tuong validator

function Validator(options) {
  function getParent(element, selector) {
    while (element.parentElement) {
      if (element.parentElement.matches(selector)) {
        return element.parentElement;
      }
      element = element.parentElement;
    }
  }

  var selectorRules = {};

  // Ham thuc hien validate
  function validate(inputElement, rule) {
    // var errorElement = getParent(inputElement, '.form-group')
    var errorMessage;
    var errorElement = getParent(
      inputElement,
      options.formGroupSelector
    ).querySelector(options.errorSelector);

    //Lay ra cac rule cua selector
    var rules = selectorRules[rule.selector];

    for (var i = 0; i < rules.length; i++) {
      switch (inputElement.type) {
        case "checkbox":
        case "radio":
          errorMessage = rules[i](
            formElement.querySelector(rule.selector + ":checked")
          );
          break;
        default:
          errorMessage = rules[i](inputElement.value);
      }
      if (errorMessage) break;
    }

    if (errorMessage) {
      errorElement.innerText = errorMessage;
      getParent(inputElement, options.formGroupSelector).classList.add(
        "invalid"
      );
    } else {
      errorElement.innerText = "";
      getParent(inputElement, options.formGroupSelector).classList.remove(
        "invalid"
      );
    }

    return !errorMessage;
  }

  //Lay element cua form can validate
  let formElement = document.querySelector(options.form);
  if (formElement) {
    //Khi submit form
    formElement.onsubmit = function (e) {
      e.preventDefault();

      var isFormValid = true;

      //Thuc hien lap qua tung rule va validate
      options.rules.forEach(function (rule) {
        var inputElement = formElement.querySelector(rule.selector);
        var isValid = validate(inputElement, rule);
        if (!isValid) {
          isFormValid = false;
        }
      });

      if (isFormValid) {
        //Truong hop submit voi Js
        if (typeof options.onSubmit === "function") {
          var enableInputs = formElement.querySelectorAll(
            "[name]:not([disabled])"
          );

          var formValues = Array.from(enableInputs).reduce(function (
            values,
            input
          ) {
            switch (input.type) {
              case "radio":
                if (input.matches(":checked")) {
                  values[input.name] = input.value;
                }
                break;
              case "checkbox":
                if (!input.matches(":checked")) {
                  values[input.name] = [];
                  return values;
                }
                if (!Array.isArray(values[input.name])) {
                  values[input.name] = [];
                }
                values[input.name].push(input.value);
                break;
              case "file":
                values[input.name] = input.files;
                break;
              default:
                values[input.name] = input.value;
            }

            return values;
          },
          {});

          options.onSubmit(formValues);
        }
        //Truong hop submit voi hanh vi mac dinh
        else {
          formElement.submit();
        }
      }
    };

    //Lap qua moi rule va xu ly (lang nghe su kien blur, input,...)
    options.rules.forEach(function (rule) {
      //Luu lai cac rules cho moi input
      if (Array.isArray(selectorRules[rule.selector])) {
        selectorRules[rule.selector].push(rule.test);
      } else {
        selectorRules[rule.selector] = [rule.test];
      }

      var inputElements = formElement.querySelectorAll(rule.selector);

      Array.from(inputElements).forEach(function (inputElement) {
        if (inputElement) {
          // Xu ly truong hop blur khoi input
          inputElement.onblur = function () {
            validate(inputElement, rule);
          };

          //Xu ly moi khi nguoi dung nhap vao input
          inputElement.oninput = function () {
            var errorElement = inputElement.parentElement.querySelector(
              options.errorSelector
            );
            errorElement.innerText = "";
            inputElement.parentElement.classList.remove("invalid");
          };
        }
      });
    });
  }
}
// Dinh nghia rules
// Nguyen tac cua cac rules:
// 1. Khi co loi => tra ra message loi
// 2. Khi hop le => tra ra undefine
Validator.isRequired = function (selector, message) {
  return {
    selector,
    test: function (value) {
      return value ? undefined : message || "Vui long nhap truong nay";
    }
  };
};

Validator.isEmail = function (selector) {
  return {
    selector,
    test: function (value) {
      var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      return regex.test(value) ? undefined : "Truong nay phai la email";
    }
  };
};

Validator.minLength = function (selector, min) {
  return {
    selector,
    test: function (value) {
      return value.length >= min
        ? undefined
        : `Vui long nhap toi thieu ${min} ki tu`;
    }
  };
};

Validator.isConfirmed = function (selector, getConfirmValue, message) {
  return {
    selector,
    test: function (value) {
      return value === getConfirmValue()
        ? undefined
        : message || "Gia tri nhap vao khong chinh xac";
    }
  };
};



const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)


const PLAYER_STORAGE_KEY = 'THAO_PLAYER'

const player = $('.player')
const cd = $('.cd')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const progress = $('#progress')
const prevBtn = $('.btn-prev')
const nextBtn = $('.btn-next')
const resetBtn = $('.btn-reset')
const volumeBtn = $('.btn-volume')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playList = $('.playlist')
const volumeSetUp = $('.volume-set-up')
const formLogin = $('.form__logIn')
const formSignUp = $('.form__signUp')
const signUpBtn = $('#signUpBtn')
const signUpSubmit = $('#signUpSubmit')

let show

signUpBtn.onclick = function () {
  formLogin.style.display = 'none'
  formSignUp.style.display = 'flex'
}

Validator({
  form: "#form-1",
  formGroupSelector: ".form-group",
  errorSelector: ".form-message",
  rules: [
    Validator.isRequired("#fullname", "Vui long nhap ten day du cua ban"),
    Validator.isRequired("#email"),
    Validator.isEmail("#email"),
    Validator.minLength("#password", 6),
    Validator.isRequired("#password_confirmation"),
    Validator.isConfirmed(
      "#password_confirmation",
      function () {
        return document.querySelector("#form-1 #password").value;
      },
      "Mat khau nhap lai khong chinh xac"
    )
  ],
  onSubmit: function (data) {
    //call API
    console.log(data);

    var checkEmail = true;

    var accounts = JSON.parse(localStorage.getItem('accounts'))

    if (accounts === null) accounts = []

    accounts.forEach(function (account) {
      if (data.email === account.email) {
        checkEmail = false;
      }
    })

    if (checkEmail) {
      
      accounts.push({
        email: data.email,
        password: data.password,
      })
      localStorage.setItem('accounts', JSON.stringify(accounts))
      formSignUp.style.display = 'none'
      player.style.display = 'block'
      app.start()
    } else {
      formSignUp.style.display = 'none'
      formSignUp.style.display = 'block'
    }



  }
});


Validator({
  form: "#form-2",
  formGroupSelector: ".form-group",
  errorSelector: ".form-message",
  rules: [
    Validator.isRequired("#email", "Vui long nhap email"),
    Validator.minLength("#password", 6),
  ],
  onSubmit: function (data) {
    //call API
    console.log(data);


    var accounts = JSON.parse(localStorage.getItem('accounts'))

    accounts.forEach((account) => {
      if (account.email === data.email && account.password === data.password) {
        formLogin.style.display = 'none'
        player.style.display = 'block'
        app.start()
      }
    })




  }
});











const app = {
  currentIndex: 0,
  viewedIndex: [],
  prevScrollTop: 0,
  isPlaying: false,
  isVolumeUp: false,
  isRandomUp: false,
  isRepeatUp: false,
  isScroll: true,
  config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
  songs: [
    {
      id: 0,
      name: 'Grand Escape',
      singer: 'RADWIMPS',
      path: './assests/music/song1.mp3',
      image: './assests/img/song1.png',
    },
    {
      id: 1,
      name: '????????????????????? - ???Truy t??m gi???c m?? ???????',
      singer: ' IKURA',
      path: './assests/music/song2.mp3',
      image: './assests/img/song2.png',
    },
    {
      id: 2,
      name: 'Stand By Me',
      singer: '???????????? & ??????',
      path: './assests/music/song3.mp3',
      image: './assests/img/song3.png',
    },
    {
      id: 3,
      name: 'Lemon - Kenshi Yonezu',
      singer: 'Kobasolo & Harutya',
      path: './assests/music/song4.mp3',
      image: './assests/img/song4.png',
    },
    {
      id: 4,
      name: '????????????/DAOKO ?? ????????????',
      singer: '???????????? & ?????? & ?????????',
      path: './assests/music/song5.mp3',
      image: './assests/img/song5.png',
    },
    {
      id: 5,
      name: 'Haiiro to Ao + Masahiro Sugita',
      singer: 'Kobalsolo & Harutya',
      path: './assests/music/song6.mp3',
      image: './assests/img/song6.png',
    },
    {
      id: 6,
      name: 'Gurenge',
      singer: 'Lisa',
      path: './assests/music/song7.mp3',
      image: './assests/img/song7.png',
    },
    {
      id: 7,
      name: 'Sparkle',
      singer: 'RADWIMPS',
      path: './assests/music/song8.mp3',
      image: './assests/img/song8.png',
    },
    {
      id: 8,
      name: '??nh N???ng C???a Anh',
      singer: '?????c Ph??c',
      path: './assests/music/song9.mp3',
      image: './assests/img/song9.png',
    },
    {
      id: 9,
      name: 'S??i G??n ??au L??ng Qu??',
      singer: 'H???A KIM TUY???N & HO??NG DUY??N',
      path: './assests/music/song10.mp3',
      image: './assests/img/song10.png',
    },
    {
      id: 10,
      name: 'Anh ??i ??? L???i',
      singer: 'Chi Pu',
      path: './assests/music/song11.mp3',
      image: './assests/img/song11.png',
    },
    {
      id: 11,
      name: 'N??ng Th??',
      singer: 'Ho??ng D??ng',
      path: './assests/music/song12.mp3',
      image: './assests/img/song12.png',
    },
    {
      id: 12,
      name: 'Ng??y Ch??a Gi??ng B??o',
      singer: 'B??i Lan H????ng',
      path: './assests/music/song13.mp3',
      image: './assests/img/song13.png',
    },
    {
      id: 13,
      name: 'Th???ng ??i??n',
      singer: 'JUSTATEE x PH????NG LY',
      path: './assests/music/song14.mp3',
      image: './assests/img/song14.png',
    },
    {
      id: 14,
      name: 'Th??ng T?? L?? L???i N??i D???i C???a Em',
      singer: 'H?? Anh Tu???n',
      path: './assests/music/song15.mp3',
      image: './assests/img/song15.png',
    },
    {
      id: 15,
      name: 'H???t Th????ng C???n Nh???',
      singer: '?????C PH??C ',
      path: './assests/music/song16.mp3',
      image: './assests/img/song16.png',
    },
  ],

  setConfig: function (key, value) {
    this.config[key] = value
    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
  },

  render: function () {
    let _this = app
    const htmls = this.songs.map((song, index) => {
      return `<div class="song ${index === this.currentIndex ? 'active' : ''}" data-id="${song.id}">
        <div class="thumb" style="background-image: url('${song.image}');">
        </div>
        <div class="body">
          <h3 class="title">${song.name}</h3>
          <p class="author">${song.singer}</p>
        </div>
        <div class="option">
          <i class="fas fa-ellipsis-h"></i>
        </div>
      </div>`
    })
    playList.innerHTML = htmls.join('')

    playList.onclick = function (e) {
      const songsClass = $$('.song')
      const songNode = e.target.closest('.song:not(.active)')
      if (songNode || e.target.closest('.option')) {
        // Xu ly khi click vao song
        if (songNode) {
          songsClass[_this.currentIndex].classList.remove('active') //phuong an 1
          _this.currentIndex = Number(songNode.dataset.id)
          songsClass[_this.currentIndex].classList.add('active') // Phuong an 1
          // _this.render()  // phuong an 2
          _this.loadCurrentSong()
          audio.play()
        }
        // Xu ly khi click vao option
        if (e.target.closest('.option')) {

        }
      }
    }



  },
  defineProperties: function () {
    Object.defineProperty(this, 'currentSong', {
      get: function () {
        return this.songs[this.currentIndex]
      }
    })
  },
  handleEvents: function () {
    const _this = this
    const cdWidth = cd.offsetWidth
    console.log(cd.offsetWidth)



    // Xu ly CD quay / dung 
    const cdThumbAnimate = cdThumb.animate([
      { transform: 'rotate(360deg)' }
    ], {
      duration: 10000, // 10 seconds
      iterations: Infinity
    })
    cdThumbAnimate.pause()

    // Xu ly phong to/ thu nho CD
    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop
      if (_this.isScroll) {
        if (scrollTop < _this.prevScrollTop) {
          const newCdWidth = cdWidth - scrollTop
          console.log(newCdWidth)
          if (cd.offsetWidth > newCdWidth) {

          } else {

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth
          }
        } else {
          const newCdWidth = cdWidth - scrollTop
          console.log(newCdWidth)

          cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
          cd.style.opacity = newCdWidth / cdWidth
        }

      }
      if (_this.currentIndex === 0) {
        const newCdWidth = cdWidth - scrollTop
        cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
        cd.style.opacity = newCdWidth / cdWidth
      }
      _this.prevScrollTop = scrollTop
    }

    // Xu ly khi click play
    playBtn.onclick = function () {
      if (_this.isPlaying) {
        audio.pause()
      } else {
        audio.play()
      }
    }

    // Xu ly khi click reset
    resetBtn.onclick = function () {
      audio.currentTime = 0
      audio.play()
    }

    // Xu ly khi click repeat
    repeatBtn.onclick = function () {
      _this.isRepeatUp = !_this.isRepeatUp
      _this.setConfig('isRepeatUp', _this.isRepeatUp)
      repeatBtn.classList.toggle('active', _this.isRepeatUp)
    }

    // Khi click random song
    randomBtn.onclick = function () {
      _this.isRandomUp = !_this.isRandomUp
      _this.setConfig('isRandomUp', _this.isRandomUp)
      randomBtn.classList.toggle('active', _this.isRandomUp)
    }

    // Khi song duoc play
    audio.onplay = function () {
      _this.isPlaying = true
      player.classList.add('playing')
      cdThumbAnimate.play()
    }

    // Khi song bi pause
    audio.onpause = function () {
      _this.isPlaying = false
      player.classList.remove('playing')
      cdThumbAnimate.pause()
    }

    // Khi tien do bai hat thay doi
    audio.ontimeupdate = function () {
      if (audio.duration) {
        const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
        progress.value = progressPercent
      }
    }

    // Khi bai hat ket thuc
    audio.onended = function () {
      if (_this.isRepeatUp) {
        resetBtn.click()
      } else {
        nextBtn.click()
      }
    }

    // Khi ly khi click volume
    volumeBtn.onclick = function (e) {
      _this.isVolumeUp = !_this.isVolumeUp
      volumeSetUp.classList.toggle('show', _this.isVolumeUp)
      // volumeBtn.style.display = 'none'
      e.stopPropagation()
    }

    window.onclick = () => {
      if (_this.isVolumeUp) {
        _this.isVolumeUp = !_this.isVolumeUp
        volumeSetUp.classList.remove('show', _this.isVolumeUp)
        // volumeBtn.style.display = 'block'
      }
    }


    // Khi thanh volume bi dieu chinh
    volumeSetUp.oninput = function (e) {
      audio.volume = e.target.value
    }


    volumeSetUp.ontouchend = () => {
      if (_this.isVolumeUp) {
        _this.isVolumeUp = !_this.isVolumeUp
        volumeSetUp.classList.remove('show', _this.isVolumeUp)
      }
    }

    // Xu ly khi tua song
    progress.oninput = function (e) {
      const seekTime = audio.duration / 100 * e.target.value
      audio.currentTime = seekTime
    }

    //Khi next song
    nextBtn.onclick = function () {

      const songsClass = $$('.song')
      songsClass[_this.currentIndex].classList.remove('active')
      if (_this.isRandomUp) {
        _this.playRandomSong()
      } else {
        _this.nextSong()
      }
      songsClass[_this.currentIndex].classList.add('active')
      audio.play()
      _this.render()
      _this.scrollToActiveSong()
    }

    // Khi prev song
    prevBtn.onclick = function () {

      const songsClass = $$('.song')
      songsClass[_this.currentIndex].classList.remove('active')
      if (_this.isRandomUp) {
        _this.playRandomSong()
      } else {
        _this.prevSong()
      }
      songsClass[_this.currentIndex].classList.add('active')
      audio.play()
      _this.render()
      _this.scrollToActiveSong()

    }

    //Xu ly khi an phim Right || Left Arrow || Up Arrow || Down Arrow
    window.onkeydown = (e) => {
      e.preventDefault();
      if (e.keyCode === 39) {
        nextBtn.click()
      }
      if (e.keyCode === 37) {
        prevBtn.click()
      }
      if (e.keyCode === 32) {
        playBtn.click()
      }
      if (e.keyCode === 38) {

        if (audio.volume <= 0.9) {
          audio.volume = audio.volume + 0.1
        }
        if (audio.volume > 0.9) {
          audio.volume = 1
        }

        volumeSetUp.value = audio.volume

        clearTimeout(show)
        volumeSetUp.classList.add('show', _this.isVolumeUp)
        show = setTimeout(function () {
          volumeSetUp.classList.remove('show', _this.isVolumeUp)

          console.log(audio.volume, "len")
        }, 2000)




      }
      if (e.keyCode === 40) {
        if (audio.volume >= 0.1) {
          audio.volume = audio.volume - 0.1
        } else if (audio.volume < 0.1) {
          audio.volume = 0
        }
        volumeSetUp.value = audio.volume

        clearTimeout(show)
        volumeSetUp.classList.add('show', _this.isVolumeUp)
        show = setTimeout(function () {
          volumeSetUp.classList.remove('show', _this.isVolumeUp)
          console.log(audio.volume, "xuong")
        }, 2000)




      }


    }


  },

  scrollToActiveSong: function () {
    this.isScroll = false

    $('.song.active').scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    })

    setTimeout(() => {
      this.isScroll = true

    }, 750)
  },

  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
    audio.src = this.currentSong.path
  },

  loadConfig: function () {
    this.isRandomUp = this.config.isRandomUp
    this.isRepeatUp = this.config.isRepeatUp
  },

  nextSong: function () {
    this.currentIndex++
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0
    }
    this.loadCurrentSong()
  },

  prevSong: function () {

    this.currentIndex--
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1
    }
    this.loadCurrentSong()
  },


  playRandomSong: function () {
    let randomIndex
    if (this.viewedIndex.length === this.songs.length) {
      this.viewedIndex = []
    }
    do {
      randomIndex = Math.floor(Math.random() * this.songs.length)
    } while (this.viewedIndex.includes(randomIndex))

    this.currentIndex = randomIndex
    this.viewedIndex.push(this.currentIndex)
    this.loadCurrentSong()
    audio.play()
  },

  start: function () {

    this.loadConfig()

    // Dinh nghia cac thuoc tinh cho object
    this.defineProperties()

    // Lang nghe / xu ly cac xu kien (DOM Event)
    this.handleEvents()

    // Tai thong tin bai hat dau tien vao UI khi chay ung dung
    this.loadCurrentSong()
    // Render playlist



    this.render()


    repeatBtn.classList.toggle('active', this.isRepeatUp)
    randomBtn.classList.toggle('active', this.isRandomUp)

  },
}
