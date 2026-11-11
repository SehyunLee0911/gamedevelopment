(function () {
  // ====== 프로젝트 데이터 ======
  // youtubeId: 오류 153 방지를 위해 유효한 ID를 넣으세요.
  // 영상은 클릭할 때만 유튜브 플레이어를 불러옵니다(첫 로딩을 가볍게 유지).

  /* eslint-disable */
	
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
        "Interactions with NPC",
		"Instatinated Episode 0 from Original Game",
      ],
      youtubeId: "zRcMOqF0-zs", 
      thumb: "img/thumb_arpia.webp"
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
      youtubeId: "JioguVBeclA", 
      thumb: "img/thumb_mof.webp"
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
      youtubeId: "YQ5NrwZwJ54", 
      thumb: "img/thumb_37-131.webp"
    },
    {
      title: "Patriot Circuit (2025)",
      tags: ["Programming", "Game Design"],
      desc: "A racing game inside George Mason University.",
      bullets: [
        "Basic Kart Movement",
        "Burger Kart Ability Design & Programming",
		"Burger Kart Ability: Throws a giant mustard & ketchup ball that boosts the Burger Kart and slips other karts",
        "Slipstream Programming",
      ],
      youtubeId: "NBgTHzx-cQg", 
      thumb: "img/thumb_patriot_circuit.webp"
    },
	{
      title: "Fruits Go Boom (2025)",
      tags: ["Programming", "Game Design", "2D Art"],
      desc: "An old style 2D Platformer shooting game. Ready? Aim, Shoot! Fruits Go Boom!",
      bullets: [
        "Game Design Document Develop",
        "Basic Tank & Enemy Movement",
        "Trajectory Lines & Ammo Functions",
		"Dialogue & Achievement Systems",
		"Game Reset Function",
		"Tutorial System Setup",
		"Boss Attack & Movement",
	    "Tank & Level Unlock Setup",
		"UI, BGM & SFX Intergration"
      ],
      youtubeId: "7NO5quQptqE", 
      thumb: "img/thumb_fruits_go_boom.webp"
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

  var currentIndex = 0;
  var thumbButtons = [];
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

  // ====== 플레이어 제어 (클릭 시 로드) ======
  function loadVideo(p) {
    ytContainer.innerHTML = "";
    if (!p.youtubeId) return;

    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "yt-poster";
    btn.setAttribute("aria-label", "Play video: " + p.title);
    btn.style.backgroundImage = "url(https://i.ytimg.com/vi/" + p.youtubeId + "/hqdefault.jpg)";
    btn.innerHTML = '<span class="yt-poster__icon" aria-hidden="true"></span>';
    btn.onclick = function () {
      var iframe = document.createElement("iframe");
      iframe.src = "https://www.youtube.com/embed/" + p.youtubeId +
        "?autoplay=1&rel=0&playsinline=1&start=" + (p.start || 0);
      iframe.title = p.title;
      iframe.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
      iframe.allowFullscreen = true;
      iframe.referrerPolicy = "strict-origin-when-cross-origin";
      ytContainer.innerHTML = "";
      ytContainer.appendChild(iframe);
    };
    ytContainer.appendChild(btn);
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

  buildThumbs();
  showProject(0);
})();