(function () {
  // ====== 프로젝트 데이터 ======
  // youtubeId: "zRcMOqF0-zs" 처럼 ID만
  // videoSrc: mp4 파일 경로 또는 https URL (fallback용, "무조건 재생"의 핵심)
  var projects = [
    {
      title: "Magic School Arpia - Remake (2022)",
      tags: ["Programming", "2D Art"],
      desc:
        "A remake version of Magic School Arpia from NCSOFT until Episode 0. It is unavailable for play due to copyright issues.",
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
      start: 0,
      videoSrc: "vid/arpia.mp4",
      thumb: "img/arpia.png"
    },
    {
      title: "Master of Fantasy - Remake (2022)",
      tags: ["Programming", "2D Art"],
      desc:
        "A remake version of Master of Fantasy from BuddyBuddy with minigames. It is unavailable for play due to copyright issues.",
      bullets: [
        "Character Sprite & Animation Swapping",
		"Player Default Movement",
		"UI Intergration",
        "BGM & SFX Integration",
        "Minigame Sprite Swap based on Difficulty",
		"Interactions with NPC",
        "Scene Management",
        "Interactions with NPC"
      ],
      start: 0,
      videoSrc: "vid/mof.mp4",
      thumb: "img/mof.png"
    },
	{
      title: "37' 131' (2024)",
      tags: ["Programming", "Game Design"],
      desc:
        "An educational game to learn about Dokdo with simple clicker puzzles.",
      bullets: [
        "Camera Movement Designs",
		"Dialogue System Implementation",
		"Sprite Swap & Animation Coding",
        "X/O System with Health System",
        "BGM & SFX Integration",
		"Typewritter System",
        "Scene Management",
        "Korean/English Preference System"
      ],
      start: 0,
      videoSrc: "vid/37'131'.mp4",
      thumb: "img/37'131'.png"
    },
	 {
      title: "Patriot Circuit (2025)",
      tags: ["Programming", "Game Design"],
      desc:
        "A racing game inside George Mason University.",
      bullets: [
        "Basic Kart Movement",
		"Burger Kart Ability Design & Programming",
		"Slipstream Programming",
      ],
      start: 0,
      videoSrc: "vid/patriot_circuit.mp4",
      thumb: "img/patriot_circuit.png"
    },
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

  // ====== YouTube Player ======
  var player = null;
  var ytReady = false;
  var loadToken = 0; // 전환 중 race 방지

function renderTags(tags) {
  workTags.innerHTML = "";

  for (var i = 0; i < tags.length; i++) {
    var span = document.createElement("span");
    span.className = "tag";

    // 태그별 클래스 추가
    var tagName = tags[i].toLowerCase().replace(/\s+/g, "-");
    span.className += " tag--" + tagName;

    span.appendChild(document.createTextNode(tags[i]));
    workTags.appendChild(span);
  }
}

  function renderBullets(items) {
    workBullets.innerHTML = "";
    for (var i = 0; i < items.length; i++) {
      var li = document.createElement("li");
      li.appendChild(document.createTextNode(items[i]));
      workBullets.appendChild(li);
    }
  }

  function setActiveThumb(index) {
    for (var i = 0; i < thumbButtons.length; i++) {
      thumbButtons[i].className = (i === index) ? "thumb-btn is-active" : "thumb-btn";
    }
  }

  function updateRightPanel(p) {
    workTitle.innerHTML = p.title;
    workDesc.innerHTML = p.desc;
    renderTags(p.tags);
    renderBullets(p.bullets);
  }

  // ====== Player switching ======
  function showYouTubeLayer() {
    ytContainer.style.display = "block";
    htmlVideo.style.display = "none";
  }

  function showMp4Layer() {
    ytContainer.style.display = "none";
    htmlVideo.style.display = "block";
  }

  function stopMp4() {
    try {
      htmlVideo.pause();
      htmlVideo.removeAttribute("src");
      htmlVideo.load();
    } catch (e) {}
  }

  function playMp4(src) {
    showMp4Layer();
    stopMp4();
    if (!src) {
      // fallback 소스가 없으면 플레이어는 뜨지만 재생할 게 없음
      return;
    }
    htmlVideo.src = src;
    htmlVideo.load();
    // 자동재생은 정책상 막힐 수 있으니 강제하지 않음(플레이어는 항상 표시)
  }

  function loadYouTubeOrFallback(p, myToken) {
    // 1) YouTube 레이어 먼저 시도
    showYouTubeLayer();

    // 2) 유튜브 플레이어가 준비 안 됐거나, videoId가 없으면 바로 mp4
    if (!ytReady || !player || !p.youtubeId) {
      playMp4(p.videoSrc);
      return;
    }

    // 3) YouTube 로드 시도
    try {
      player.loadVideoById({
        videoId: p.youtubeId,
        startSeconds: p.start || 0
      });
    } catch (e) {
      // 로드 자체 실패하면 mp4
      playMp4(p.videoSrc);
      return;
    }

    // 4) “일정 시간 내 재생/준비 신호가 없으면” mp4로 전환 (환경 차단 대비)
    // 유튜브는 외부 플레이어 실패를 100% 이벤트로 안 주는 경우가 있어 timeout이 안전장치입니다.
    window.setTimeout(function () {
      if (myToken !== loadToken) return;

      // 플레이어 상태가 -1(UNSTARTED)에서 오래 머물면 실패로 간주
      var st = -999;
      try { st = player.getPlayerState(); } catch (e2) {}

      // -1: unstarted / 5: cued 정도에서 멈춘 채 진행이 없으면 fallback
      if (st === -1 || st === 5 || st === -999) {
        playMp4(p.videoSrc);
      }
    }, 1500);
  }

  function showProject(index) {
    if (index < 0) index = projects.length - 1;
    if (index >= projects.length) index = 0;

    currentIndex = index;
    loadToken++;

    var p = projects[index];
    updateRightPanel(p);
    setActiveThumb(index);

    // mp4는 매번 정리 후 새로 로드
    stopMp4();

    // 유튜브 먼저 시도 → 실패하면 mp4
    loadYouTubeOrFallback(p, loadToken);
  }

  function buildThumbs() {
    thumbs.innerHTML = "";
    thumbButtons = [];

    for (var i = 0; i < projects.length; i++) {
      (function (idx) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "thumb-btn";
        btn.setAttribute("aria-label", "Open project " + (idx + 1));

        var img = document.createElement("img");
        img.src = projects[idx].thumb;
        img.alt = projects[idx].title;

        btn.appendChild(img);
        btn.onclick = function () { showProject(idx); };

        thumbs.appendChild(btn);
        thumbButtons.push(btn);
      })(i);
    }
  }

  // arrows
  prevBtn.onclick = function () { showProject(currentIndex - 1); };
  nextBtn.onclick = function () { showProject(currentIndex + 1); };

  // ====== YouTube API callback (필수: 전역) ======
  window.onYouTubeIframeAPIReady = function () {
    player = new YT.Player("ytPlayer", {
      width: "100%",
      height: "100%",
      videoId: projects[0].youtubeId || "",
      host: "https://www.youtube-nocookie.com",
      playerVars: {
        rel: 0,
        playsinline: 1,
        modestbranding: 1
      },
      events: {
        onReady: function () {
          ytReady = true;
          // 초기 렌더
          showProject(0);
        },
        onError: function () {
          // 임베드 금지(101/150)든, 기타 오류든 → mp4로 즉시 전환
          var p = projects[currentIndex];
          playMp4(p.videoSrc);
        }
      }
    });
  };

  // ====== Init UI (YouTube 준비 전에도 우측/썸네일은 보이게) ======
  buildThumbs();
  // YouTube 준비 전에는 우측 패널만 먼저 세팅
  updateRightPanel(projects[0]);
  setActiveThumb(0);
  // 플레이어는 유튜브 준비 후 showProject(0)에서 처리
})();