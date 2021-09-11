const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'F8_PLAYER'

const player =$('.player')
const cd = $('.cd')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const progress = $('#progress')
const nextBtn =$('.btn-next')
const prevBtn=$('.btn-prev');
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playList = $('.playlist')
const duration = $('#duration')
const timeupdate = $('#timeupdate')

const app = {
   
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    
  songs: [
    {
      name: "Attention",
      singer: "Charlie Puth",
      path: "./music/song1.mp3",
      image: "./img/attention.jpg",
    },
    {
      name: "The Night",
      singer: "Avicii",
      path: "./music/song2.mp3",
      image: "./img/thenights.jpg",
    },
    {
      name: "Fade",
      singer: "Alan Walker",
      path: "./music/song3.mp3",
      image: "./img/faded.jpg",
    },
    {
      name: "Wellerman",
      singer: "Nathan Evans",
      path: "./music/song4.mp3",
      image: "./img/wellerman.jpg",
    },
    {
      name: "Thunder",
      singer: "Graby Ponte",
      path: "./music/song5.mp3",
      image: "./img/thunder.jpeg",
    },
    {
      name: "Salt",
      singer: "Ava Max",
      path: "./music/song6.mp3",
      image: "./img/salt.jpg",
    },
    {
      name: "Đúng cũng thành sai",
      singer: "Mỹ Tâm",
      path: "./music/song7.mp3",
      image: "./img/mytam.jpg",
    },
  ],
  setConfig: function(key,value){
    this.config[key]=value;
    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
  },
  render: function () {
    const htmls = this.songs.map((song,index) => {
      return `
             <div class="song ${index=== this.currentIndex?'active':''}" data-index=${index}>
                <div class="thumb" style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                <h3 class="title">${song.name}</h3>
                <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `;
    });
    $('.playlist').innerHTML = htmls.join('')
  },
  defineProperties: function(){
    Object.defineProperty(this,'currentSong', {
        get: function() {
            return this.songs[this.currentIndex]
        }
    })
  },
  handleEvents: function(){
    const _this = this
    const cdWidth =cd.offsetWidth

    // Xu ly CD quay/ dung
    const cdThumbAnimate = cdThumb.animate([
        {transform: 'rotate(360deg)'}
    ],{
        duration: 10000,
        iterations: Infinity
    }
    )
    cdThumbAnimate.pause()

      // Xu ly phong to / thu nho CD
    document.onscroll = function(){
        const scrollTop = document.documentElement.scrollTop||window.scrollY
        const newCdWidth = cdWidth -scrollTop
        cd.style.width = newCdWidth>0 ? newCdWidth+'px':0
        cd.style.opacity=newCdWidth/cdWidth
    }
    // Xu ly khi click play
    playBtn.onclick = function(){
        if(_this.isPlaying){
            audio.pause()
        }else{
            audio.play()
        }
        
    }
    // Khi bai hat duoc play
    audio.onplay = function() {
        _this.isPlaying = true
        audio.play();
        player.classList.add('playing')
        cdThumbAnimate.play()
    }
    audio.onpause = function(){
        _this.isPlaying = false
        audio.pause()
        player.classList.remove('playing')
        cdThumbAnimate.pause()
    }
    // Khi tien do bai hat thay doi
    audio.ontimeupdate = function() {
        if(audio.duration){
            const progressPercent=Math.floor(audio.currentTime/audio.duration * 100)
            progress.value=progressPercent
        }
        const currentTime =Math.ceil(audio.currentTime)
        const minute = Math.floor(audio.currentTime/60)
        const second =Math.abs(Math.round(audio.currentTime-minute*60))
        timeupdate.innerHTML=`${minute}:${second}`
     
        
        
        
    }
    // Lay tong thoi gian cua bai hat
    audio.onloadeddata = function(){
      const minute = Math.floor(audio.duration/60)
      const second =Math.abs(Math.round(audio.duration-minute*60))
      duration.innerHTML=`${minute}:${second}`
      
    }
    // Xu ly khi tua bai hat
    progress.oninput = function (e) {
        const seekTime = e.target.value*audio.duration/100
        audio.currentTime =seekTime
        // audio.play()
    
    }
    nextBtn.onclick =function () {
      if(_this.isRandom){
        _this.playRandomSong()
      }else{
        _this.nextSong()
      }
        audio.play()
       _this.addActive()
        _this.scrollToActiveSong()

    }
    prevBtn.onclick=function() {
      if(_this.isRandom){
        _this.playRandomSong()
      }else{
        _this.prevSong()
      }
        audio.play() 
       _this.addActive()
        _this.scrollToActiveSong()
        
    }
    //Xu ly random
    randomBtn.onclick = function(e) {
      _this.isRandom= ! _this.isRandom
      _this.setConfig('isRandom',_this.isRandom)
        randomBtn.classList.toggle('active',_this.isRandom)
     
    }
    // Xu ly khi ket thuc bai hat
    audio.onended = function(){
      if(_this.isRepeat){
        audio.play()
      }else{
      nextBtn.click()
    }
    }
    // Xu ly lap lai mot bai hat
    repeatBtn.onclick = function (){
      _this.isRepeat=!_this.isRepeat
      _this.setConfig('isRepeat',_this.isRepeat)
      repeatBtn.classList.toggle('active', _this.isRepeat)
    }
    // Lang nghe hanh vi click vao playlist
    playList.onclick = function (e) {
      const songNode = e.target.closest('.song:not(.active)');
  
        if(songNode && !e.target.closest('.option')){
         
          _this.currentIndex=Number(songNode.dataset.index)
          _this.addActive()
          _this.loadCurrentSong()
          audio.play()
        }else if(e.target.closest('.option')){
          console.log('dcm')
        }
      
        }
    

  },
  loadCurrentSong: function(){
      heading.textContent = this.currentSong.name
      cdThumb.style.backgroundImage = `url(${this.currentSong.image})`
      audio.src=this.currentSong.path
     
   
      
  },
  loadConfig: function(){
    this.isRandom = this.config.isRandom
    this.isRepeat =this.config.isRepeat
  },
  addActive: function() {
    if ($('.song.active')) 
    {
      $('.song.active').classList.remove('active');
    }
      $$('.song')[app.currentIndex].classList.add('active')

  },
 nextSong: function() {
    this.currentIndex++
    if(this.currentIndex>=this.songs.length){
        this.currentIndex=0;
    }
    this.loadCurrentSong()
 },
 prevSong: function() {
    this.currentIndex--
    if(this.currentIndex<0){
        this.currentIndex=this.songs.length-1
    }
    this.loadCurrentSong()
 },
 playRandomSong: function() {
   let newIndex
    do{
      newIndex=Math.floor(Math.random()*this.songs.length)
    }while(newIndex===this.currentIndex)
    console.log(newIndex)
    this.currentIndex = newIndex
    this.loadCurrentSong()
    
  
 },
 scrollToActiveSong: function() {
  setTimeout(() => {
    $('.song.active').scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      
    });
  }, 100);
}

    
 ,
  start: function () {
    this.loadConfig()
    // Lắng nghe / xử lý các sự kiên (DOM Events)
    this.handleEvents()
    // Định nghĩa các thuộc tính cho object
    this.defineProperties()
    // Tải thông tin bài hát vào UI khi chạy ứng dụng
    this.loadCurrentSong()
    // Render playlist
    this.render();
    //
    randomBtn.classList.toggle('active',this.isRandom)
    repeatBtn.classList.toggle('active', this.isRepeat)
  },
};
app.start();
