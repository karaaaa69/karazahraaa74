const pages = Array.from(document.querySelectorAll('.page'));
const bgm = document.getElementById('bgm');
const audioPrompt = document.getElementById('audioPrompt');
const audioBtn = document.getElementById('audioBtn');
const modal = document.getElementById('photoModal');
const modalImg = document.getElementById('modalImg');
const modalCaption = document.getElementById('modalCaption');
const modalClose = document.getElementById('modalClose');
const heartLayer = document.getElementById('heartLayer');

let currentPage = 1;
let countdownSeconds = 15;
let countdownTimer = null;
let typingState = { page4Done: false, page7Done: false };
let musicPausedForVideo = false;

const letters4 = [
  'Happy Birthday Fatima Zahra, May Allah Bless youuuu',
  'Yaumul Milad Barakallah Fii Umrik Habibi, May ur faith and devotion to Allah SWT grow stronger in this new age',
  'May Allah protect ur steps and make u a woman longed for in Jannah',
  'May Allah make it easy for us to walk towards a holy bond, and make u a pious woman who always obeys Allah',
  'May Allah always forgive all the sins that we, our families, and our loved ones have committed',
  'May we always be given smoothness in our affairs, rizq, and career, and may Allah help always come wherever we are',
  'In every prayer, i always pray that we remain disciplined, competent, consistent, responsible, and honest',
  'I also pray that we continue to grow daily, diligently studying and diligently praying',
  'I never forget to pray that we can look after each other, care for each other, and love each other for the sake of Allah. And i hope we meet at the right time',
  'You will achieve all the dreams u are fighting for right now, i believe uuu can do it!',
  'Never give up!! and I also want you to pray for me after every ur salat',
  'Keep Going Habibiiiiiiii!!!!'
];

const letters7 = [
  'U knowwwwwww whattt?? Today is my girl Birthday!',
  'Happy birthday! Thank you for being the most comfortable place to share stories. May you always be blessed with good rizq, happiness, and love for me even more, okay?! hhhh'
];

function createHearts(count = 40){
  for(let i = 0; i < count; i++){
    const heart = document.createElement('span');
    heart.className = 'heart';
    const size = 10 + Math.random() * 22;
    heart.textContent = '♥';
    heart.style.left = `${Math.random() * 100}%`;
    heart.style.fontSize = `${size}px`;
    heart.style.opacity = `${0.45 + Math.random() * 0.55}`;
    heart.style.setProperty('--drift', `${(Math.random() * 2 - 1) * 120}px`);
    heart.style.animationDuration = `${9 + Math.random() * 9}s`;
    heart.style.animationDelay = `${-Math.random() * 12}s`;
    heart.style.transform = `translate3d(0,-12vh,0) rotate(${Math.random() * 180}deg)`;
    heartLayer.appendChild(heart);
  }
}

function showPage(pageNumber){
  const next = pages.find(p => Number(p.dataset.page) === pageNumber);
  if(!next) return;
  const prev = pages.find(p => Number(p.dataset.page) === currentPage);
  if(prev && prev !== next){
    prev.classList.remove('active');
    prev.classList.add(pageNumber > currentPage ? 'leave-left' : 'leave-right');
    setTimeout(() => prev.classList.remove('leave-left', 'leave-right'), 750);
  }
  next.classList.add('active');
  currentPage = pageNumber;
  onEnterPage(pageNumber);
}

function onEnterPage(pageNumber){
  if(pageNumber === 1){
    if(countdownTimer) clearInterval(countdownTimer);
    countdownSeconds = 15;
    updateCountdown();
    countdownTimer = setInterval(() => {
      countdownSeconds--;
      updateCountdown();
      if(countdownSeconds <= 0){
        clearInterval(countdownTimer);
        countdownTimer = null;
        unlockBtn(document.getElementById('giftBtn1'));
      }
    }, 1000);
  }

  if(pageNumber === 4 && !typingState.page4Done){
    startTyping(document.getElementById('typedLetter4'), letters4, document.getElementById('memoriesBtn'), () => {
      typingState.page4Done = true;
    });
  }

  if(pageNumber === 7 && !typingState.page7Done){
    startTyping(document.getElementById('typedLetter7'), letters7, document.getElementById('giftsBtn'), () => {
      typingState.page7Done = true;
    });
  }

  if(pageNumber === 6){
    const video = document.getElementById('karaVideo');
    const playBtn = document.getElementById('videoPlayBtn');
    video.pause();
    video.currentTime = 0;
    playBtn.classList.remove('hidden');
    document.getElementById('wishesBtn').classList.add('hidden');
    musicPausedForVideo = false;
    bgm.play().catch(() => {});
  }
}

function updateCountdown(){
  const d = document.getElementById('d');
  const h = document.getElementById('h');
  const m = document.getElementById('m');
  const s = document.getElementById('s');
  const total = Math.max(0, countdownSeconds);
  const days = Math.floor(total / 86400);
  const hours = Math.floor((total % 86400) / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  d.textContent = String(days).padStart(2, '0');
  h.textContent = String(hours).padStart(2, '0');
  m.textContent = String(minutes).padStart(2, '0');
  s.textContent = String(seconds).padStart(2, '0');
}

function unlockBtn(btn){
  btn.disabled = false;
  btn.classList.remove('btn-locked');
}

function lockBtn(btn){
  btn.disabled = true;
  btn.classList.add('btn-locked');
}

function typeLine(container, line, done){
  const p = document.createElement('p');
  const cursor = document.createElement('span');
  cursor.className = 'cursor';
  p.appendChild(cursor);
  container.appendChild(p);

  let i = 0;
  function tick(){
    if(i < line.length){
      cursor.insertAdjacentText('beforebegin', line[i]);
      i++;
      const speed = line[i - 1] === ' ' ? 12 : 22;
      setTimeout(tick, speed);
    }else{
      cursor.remove();
      done && done();
    }
  }
  tick();
}

function startTyping(container, lines, button, onDone){
  container.innerHTML = '';
  button.classList.add('hidden');

  let index = 0;
  function next(){
    if(index < lines.length){
      typeLine(container, lines[index], () => {
        index++;
        container.parentElement.scrollTop = container.parentElement.scrollHeight;
        setTimeout(next, 260);
      });
    } else {
      onDone && onDone();
      setTimeout(() => button.classList.remove('hidden'), 150);
    }
  }
  next();
}

function openModal(src, caption){
  modalImg.src = src;
  modalCaption.textContent = caption || '';
  modal.classList.remove('hidden');
  modal.setAttribute('aria-hidden', 'false');
}

function closeModal(){
  modal.classList.add('hidden');
  modal.setAttribute('aria-hidden', 'true');
  modalImg.src = '';
  modalCaption.textContent = '';
}

function addClickHandlers(){
  document.getElementById('giftBtn1').addEventListener('click', () => showPage(2));

  const giftBox1 = document.getElementById('giftBox1');
  giftBox1.addEventListener('click', () => {
    if(giftBox1.classList.contains('open')) return;
    giftBox1.classList.add('open');
    setTimeout(() => {
      showPage(3);
    }, 780);
  });
  giftBox1.addEventListener('keydown', e => {
    if(e.key === 'Enter' || e.key === ' ') giftBox1.click();
  });

  document.getElementById('readLetterBtn').addEventListener('click', () => showPage(4));
  document.getElementById('memoriesBtn').addEventListener('click', () => showPage(5));
  document.getElementById('watchVideoBtn').addEventListener('click', () => showPage(6));
  document.getElementById('wishesBtn').addEventListener('click', () => showPage(7));
  document.getElementById('giftsBtn').addEventListener('click', () => showPage(8));

  const giftBox2 = document.getElementById('giftBox2');
  giftBox2.addEventListener('click', () => {
    if(giftBox2.classList.contains('open')) return;
    giftBox2.classList.add('open');
    document.getElementById('fromWhoBtn').classList.remove('hidden');
  });
  giftBox2.addEventListener('keydown', e => {
    if(e.key === 'Enter' || e.key === ' ') giftBox2.click();
  });

  document.getElementById('fromWhoBtn').addEventListener('click', () => showPage(9));
  document.getElementById('nextBtn9').addEventListener('click', () => showPage(10));
  document.getElementById('finalBtn').addEventListener('click', () => showPage(11));
  document.getElementById('homeBtn').addEventListener('click', () => window.location.reload());

  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if(e.target.classList.contains('modal-backdrop')) closeModal();
  });

  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('click', () => {
      const src = img.getAttribute('src');
      const caption = img.getAttribute('alt') || '';
      if(!src) return;
      openModal(src, caption);
    });
  });

  const video = document.getElementById('karaVideo');
  const playBtn = document.getElementById('videoPlayBtn');
  const wishesBtn = document.getElementById('wishesBtn');

  function startVideo(){
    if(!musicPausedForVideo){
      musicPausedForVideo = true;
      bgm.pause();
    }
    video.play().then(() => {
      playBtn.classList.add('hidden');
    }).catch(() => {
      playBtn.classList.remove('hidden');
    });
  }

  playBtn.addEventListener('click', startVideo);
  video.addEventListener('click', () => {
    if(video.paused) startVideo();
    else video.pause();
  });
  video.addEventListener('play', () => playBtn.classList.add('hidden'));
  video.addEventListener('pause', () => {
    if(!video.ended) playBtn.classList.remove('hidden');
  });
  video.addEventListener('ended', () => {
    playBtn.classList.add('hidden');
    wishesBtn.classList.remove('hidden');
    if(musicPausedForVideo){
      musicPausedForVideo = false;
      bgm.play().catch(() => {
        audioPrompt.classList.remove('hidden');
      });
    }
  });
}

function tryAutoplayMusic(){
  bgm.volume = 0.28;
  const playPromise = bgm.play();
  if(playPromise && typeof playPromise.then === 'function'){
    playPromise.then(() => {
      audioPrompt.classList.add('hidden');
    }).catch(() => {
      audioPrompt.classList.remove('hidden');
    });
  }
}

audioBtn.addEventListener('click', () => {
  bgm.play().then(() => {
    audioPrompt.classList.add('hidden');
  }).catch(() => {});
});

document.addEventListener('visibilitychange', () => {
  if(document.visibilityState === 'visible' && currentPage !== 6){
    bgm.play().catch(() => {});
  }
});

createHearts(48);
addClickHandlers();
lockBtn(document.getElementById('giftBtn1'));
updateCountdown();
tryAutoplayMusic();
onEnterPage(1);
