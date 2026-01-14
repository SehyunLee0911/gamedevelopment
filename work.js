(function () {
  // ====== 프로젝트 데이터 ======
  // youtubeId: 오류 153 방지를 위해 유효한 ID를 넣으세요.
  // videoSrc: 100MB 이하로 압축된 파일이어야 GitHub Pages에서 안정적으로 재생됩니다.
  var projects = [
    {
      title: "Magic School Arpia - Remake (2022)",
      tags: ["Programming", "2D Art"],
      desc: "A remake version of Magic School Arpia from NCSOFT until Episode 0. It is unavailable for play due to copyright issues.",
      bullets: [
        "Character Instantiation",
        "Player Default Movement",
        "BGM/SFX Instantiation",
        "UI Intergration",
        "Sprite Layer System for Orthographic View",
        "Turn-based Duel System",
        "Quest System",
        "Typewriter Effects",
        "Scene Management",
        "Interactions with NPC"
      ],
      youtubeId: "zRcMOqF0-zs", 
      videoSrc: "vid/arpia.mp4",
      thumb: "img/arpia.png"
    },
    {
      title: "Master of Fantasy - Remake (2022)",
      tags: ["Programming", "2D Art"],
      desc: "A remake version of Master of Fantasy from BuddyBuddy with minigames. It is unavailable for play due to copyright issues.",
      bullets: [
        "Character Sprite & Animation Swapping",
        "Player Default Movement",
        "UI Intergration",
        "BGM & SFX Integration",
        "Minigame Sprite Swap based on Difficulty",
        "Interactions with NPC",
        "Scene Management"
      ],
      youtubeId: "JioguVBeclA&t=1s", 
      videoSrc: "vid/mof.mp4",
      thumb: "img/mof.png"
    },
    {
      title: "37' 131' (2024)",
      tags: ["Programming", "Game Design"],
      desc: "An educational game to learn about Dokdo with simple clicker puzzles.",
      bullets: [
        "Camera Movement Designs",
        "Dialogue System Implementation",
        "Sprite Swap & Animation Coding",
        "X/O System with Health System",
        "BGM & SFX Integration",
        "Typewritter System",
        "Korean/English Preference System"
      ],
      youtubeId: "LA-hmOOiOIk&t=2s", 
      videoSrc: "vid/dokdo_game.mp4", // 파일명에 특수문자(') 제거 추천
      thumb: "img/37'131'.png"
    },
    {
      title: "Patriot Circuit (2025)",
      tags: ["Programming", "Game Design"],
      desc: "A racing game inside George Mason University.",
      bullets: [
        "Basic Kart Movement",
        "Burger Kart Ability Design & Programming",
        "Slipstream Programming",
      ],
      youtubeId: "NBgTHzx-cQg", 
      videoSrc: "vid/patriot_circuit.mp4",
      thumb: "img/patriot_circuit.png"
    }
  ];

  // ====== DOM ======
  var workTitle = document.getElementById("workTitle");
  var workTags = document.getElementById("workTags");
  var workDesc = document.getElementById("workDesc");
  var workBullets = document.getElementById("workBullets");
  var thumbs = document.getElementById("thumbs");
  var prevBtn = document.getElementById("prevBtn");
  var nextBtn = document.getElementById("nextBtn");

  var ytContainer = document.getElementById("ytPlayer");
  var htmlVideo = document.getElementById("htmlVideo");

  var currentIndex = 0;
  var thumbButtons = [];
  var player = null;
  var ytReady = false;
  var loadToken = 0;

  // ====== 유틸리티 함수 ======
  function renderTags(tags) {
    workTags.innerHTML = "";
    tags.forEach(function(tag) {
      var span = document.createElement("span");
      var tagName = tag.toLowerCase().replace(/\s+/g, "-");
      span.className = "tag tag--" + tagName;
      span.textContent = tag;
      workTags.appendChild(span);
    });
  }

  function renderBullets(items) {
    workBullets.innerHTML = "";
    items.forEach(function(item) {
      var li = document.createElement("li");
      li.textContent = item;
      workBullets.appendChild(li);
    });
  }

  function setActiveThumb(index) {
    thumbButtons.forEach(function(btn, i) {
      btn.className = (i === index) ? "thumb-btn is-active" : "thumb-btn";
    });
  }

  function updateRightPanel(p) {
    workTitle.textContent = p.title;
    workDesc.textContent = p.desc;
    renderTags(p.tags);
    renderBullets(p.bullets);
  }

  // ====== 플레이어 제어 ======
  function showYouTubeLayer() {
    ytContainer.style.display = "block";
    htmlVideo.style.display = "none";
  }

  function showMp4Layer() {
    ytContainer.style.display = "none";
    htmlVideo.style.display = "block";
  }

  function playMp4(src) {
    showMp4Layer();
    if (!src) return;
    htmlVideo.pause();
    htmlVideo.src = src;
    htmlVideo.load();
    htmlVideo.play().catch(function(e) { console.log("Auto-play blocked"); });
  }

  function loadVideo(p) {
    var myToken = ++loadToken;
    
    // 유튜브 ID가 없는 경우 즉시 MP4 재생
    if (!p.youtubeId) {
      playMp4(p.videoSrc);
      return;
    }

    showYouTubeLayer();

    if (ytReady && player && player.loadVideoById) {
      player.loadVideoById({
        videoId: p.youtubeId,
        startSeconds: p.start || 0
      });

      // 153 오류 등 로딩 실패 대비 타이머 (2초 내에 시작 안 되면 MP4 전환)
      setTimeout(function() {
        if (myToken !== loadToken) return;
        var state = -999;
        try { state = player.getPlayerState(); } catch(e) {}
        if (state === -1 || state === 5 || state === -999) {
          console.warn("YouTube fallback to MP4...");
          playMp4(p.videoSrc);
        }
      }, 2000);
    } else {
      // API 미준비 시 MP4 재생
      playMp4(p.videoSrc);
    }
  }

  function showProject(index) {
    if (index < 0) index = projects.length - 1;
    if (index >= projects.length) index = 0;
    currentIndex = index;

    var p = projects[index];
    updateRightPanel(p);
    setActiveThumb(index);
    loadVideo(p);
  }

  // ====== 초기화 ======
  function buildThumbs() {
    thumbs.innerHTML = "";
    projects.forEach(function(project, i) {
      var btn = document.createElement("button");
      btn.className = "thumb-btn";
      var img = document.createElement("img");
      img.src = project.thumb;
      img.alt = project.title;
      btn.appendChild(img);
      btn.onclick = function() { showProject(i); };
      thumbs.appendChild(btn);
      thumbButtons.push(btn);
    });
  }

  prevBtn.onclick = function () { showProject(currentIndex - 1); };
  nextBtn.onclick = function () { showProject(currentIndex + 1); };

  // ====== YouTube API (전역 함수) ======
  window.onYouTubeIframeAPIReady = function () {
    player = new YT.Player("ytPlayer", {
      width: "100%",
      height: "100%",
      playerVars: {
        rel: 0,
        playsinline: 1,
        modestbranding: 1,
        enablejsapi: 1,
        origin: window.location.origin // 핵심: 오류 153 방지
      },
      events: {
        onReady: function () {
          ytReady = true;
          showProject(0);
        },
        onError: function () {
          playMp4(projects[currentIndex].videoSrc);
        }
      }
    });
  };

  buildThumbs();
  updateRightPanel(projects[0]);
  setActiveThumb(0);
})();