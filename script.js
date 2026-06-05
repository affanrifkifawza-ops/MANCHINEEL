/* ============================================
   BATAS KEGELAPAN - JavaScript
   Horror Comic Website Interactions
   ============================================ */

"use strict";

// ============ LOADING SCREEN ============
class LoadingScreen {
  constructor() {
    this.screen = document.getElementById("loading-screen");
    this.bar = document.querySelector(".loading-bar");
    this.text = document.querySelector(".loading-text");
    this.messages = [
      "MENGINISIALISASI...",
      "MEMUAT KEGELAPAN...",
      "MEMBUKA PORTAL...",
      "JANGAN LIHAT KE BELAKANG...",
      "SELAMAT DATANG...",
    ];
    this.init();
  }

  init() {
    if (!this.screen) return;

    let progress = 0;
    let msgIndex = 0;

    const interval = setInterval(() => {
      progress += Math.random() * 15 + 5;
      if (progress > 100) progress = 100;

      if (this.bar) this.bar.style.width = progress + "%";

      if (this.text && progress > msgIndex * 20) {
        this.text.textContent = this.messages[msgIndex] || "";
        msgIndex++;
      }

      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => this.hide(), 500);
      }
    }, 180);
  }

  hide() {
    if (this.screen) {
      this.screen.classList.add("hidden");
      document.body.style.overflow = "";
    }
  }
}

// ============ CUSTOM CURSOR ============
class HorrorCursor {
  constructor() {
    this.cursor = document.querySelector(".cursor");
    this.ring = document.querySelector(".cursor-ring");
    this.pos = { x: 0, y: 0 };
    this.ringPos = { x: 0, y: 0 };
    this.hoverEls = document.querySelectorAll(
      "a, button, .chapter-card, .btn-primary, .btn-secondary, .reader-btn, .social-btn, .fullscreen-btn",
    );
    this.init();
  }

  init() {
    if (!this.cursor || !this.ring) return;
    if (window.matchMedia("(hover: none)").matches) {
      this.cursor.style.display = "none";
      this.ring.style.display = "none";
      return;
    }

    document.addEventListener("mousemove", (e) => {
      this.pos.x = e.clientX;
      this.pos.y = e.clientY;
      this.cursor.style.left = e.clientX - 6 + "px";
      this.cursor.style.top = e.clientY - 6 + "px";
    });

    this.animateRing();
    this.bindHoverEvents();
  }

  animateRing() {
    const lerp = (a, b, t) => a + (b - a) * t;
    const animate = () => {
      this.ringPos.x = lerp(this.ringPos.x, this.pos.x, 0.12);
      this.ringPos.y = lerp(this.ringPos.y, this.pos.y, 0.12);
      if (this.ring) {
        this.ring.style.left = this.ringPos.x - 18 + "px";
        this.ring.style.top = this.ringPos.y - 18 + "px";
      }
      requestAnimationFrame(animate);
    };
    animate();
  }

  bindHoverEvents() {
    const addHover = () => {
      document
        .querySelectorAll(
          "a, button, .chapter-card, .btn-primary, .btn-secondary, .reader-btn, .social-btn, .fullscreen-btn",
        )
        .forEach((el) => {
          el.addEventListener("mouseenter", () => {
            this.cursor?.classList.add("hover");
            this.ring?.classList.add("hover");
          });
          el.addEventListener("mouseleave", () => {
            this.cursor?.classList.remove("hover");
            this.ring?.classList.remove("hover");
          });
        });
    };
    addHover();
    // Re-bind after dynamic content
    setTimeout(addHover, 1000);
  }
}

// ============ NAVBAR ============
class Navbar {
  constructor() {
    this.nav = document.querySelector(".navbar");
    this.hamburger = document.querySelector(".nav-hamburger");
    this.mobileMenu = document.querySelector(".mobile-menu");
    this.mobileLinks = document.querySelectorAll(".mobile-menu a");
    this.init();
  }

  init() {
    if (!this.nav) return;

    window.addEventListener("scroll", () => this.onScroll(), { passive: true });

    if (this.hamburger) {
      this.hamburger.addEventListener("click", () => this.toggleMenu());
    }

    this.mobileLinks.forEach((link) => {
      link.addEventListener("click", () => this.closeMenu());
    });

    // Set active link
    const path = window.location.pathname;
    document
      .querySelectorAll(".nav-links a, .mobile-menu a")
      .forEach((link) => {
        if (
          link.getAttribute("href") === path.split("/").pop() ||
          (path === "/" && link.getAttribute("href") === "index.html")
        ) {
          link.classList.add("active");
        }
      });
  }

  onScroll() {
    if (!this.nav) return;
    if (window.scrollY > 50) {
      this.nav.classList.add("scrolled");
    } else {
      this.nav.classList.remove("scrolled");
    }
  }

  toggleMenu() {
    this.hamburger?.classList.toggle("active");
    this.mobileMenu?.classList.toggle("open");
    document.body.classList.toggle("menu-open");
  }

  closeMenu() {
    this.hamburger?.classList.remove("active");
    this.mobileMenu?.classList.remove("open");
    document.body.classList.remove("menu-open");
  }
}

// ============ SCROLL ANIMATIONS ============
class ScrollAnimations {
  constructor() {
    this.elements = document.querySelectorAll(".fade-in-up, .fade-in");
    this.init();
  }

  init() {
    if (!this.elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add("visible");
            }, i * 80);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
    );

    this.elements.forEach((el) => observer.observe(el));
  }
}

class SynopsisToggle {
  constructor() {
    this.button = document.getElementById("synopsis-toggle");
    this.synopsis = document.querySelector(".comic-synopsis");
    this.init();
  }

  init() {
    if (!this.button || !this.synopsis) return;
    this.synopsis.classList.add("collapsed");
    this.button.textContent = "Tampilkan teks";
    this.button.addEventListener("click", () => this.toggle());
  }

  toggle() {
    const collapsed = this.synopsis.classList.toggle("collapsed");
    this.button.textContent = collapsed ? "Tampilkan teks" : "Sembunyikan teks";
  }
}

// ============ AMBIENT PARTICLES ============
class AmbientParticles {
  constructor(container) {
    this.container = container;
    if (this.container) this.init();
  }

  init() {
    const count = 15;
    for (let i = 0; i < count; i++) {
      setTimeout(() => this.createParticle(), i * 300);
    }
  }

  createParticle() {
    const p = document.createElement("div");
    p.className = "particle";
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      animation-duration: ${Math.random() * 10 + 8}s;
      animation-delay: ${Math.random() * 5}s;
      width: ${Math.random() * 3 + 1}px;
      height: ${Math.random() * 3 + 1}px;
      opacity: ${Math.random() * 0.5};
    `;
    this.container.appendChild(p);
  }
}

// ============ GLITCH EFFECT ============
class GlitchEffect {
  constructor() {
    this.targets = document.querySelectorAll(".glitch");
    this.init();
  }

  init() {
    this.targets.forEach((el) => {
      el.setAttribute("data-text", el.textContent);
    });
  }
}

// ============ READER ============
class ComicReader {
  constructor() {
    this.currentPage = 0;
    this.pages = document.querySelectorAll(".comic-page");
    this.progressBar = document.querySelector(".chapter-progress-fill");
    this.pageCounter = document.querySelector(".page-counter");
    this.topbar = document.querySelector(".reader-topbar");
    this.chapterId =
      parseInt(new URLSearchParams(window.location.search).get("chapter")) || 1;
    this.lastScrollY = 0;
    this.hideTimer = null;
    this.isFullscreen = false;
    this.init();
  }

  init() {
    if (!document.querySelector(".reader-page")) return;

    this.setupScrollTracking();
    this.setupLazyImages();
    this.setupTopbarHide();
    this.setupFullscreen();
    this.updateChapterInfo();
    this.setupKeyboard();
  }

  setupScrollTracking() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.05 },
    );

    this.pages.forEach((page) => observer.observe(page));

    window.addEventListener(
      "scroll",
      () => {
        this.updateProgress();
      },
      { passive: true },
    );
  }

  updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;

    if (this.progressBar) {
      this.progressBar.style.width = Math.min(progress, 100) + "%";
    }

    // Update page counter
    const visible = this.getVisiblePage();
    if (this.pageCounter && visible !== null) {
      this.pageCounter.textContent = `${visible + 1} / ${this.pages.length}`;
    }
  }

  getVisiblePage() {
    let closest = null;
    let closestDist = Infinity;
    this.pages.forEach((page, i) => {
      const rect = page.getBoundingClientRect();
      const dist = Math.abs(rect.top);
      if (dist < closestDist) {
        closestDist = dist;
        closest = i;
      }
    });
    return closest;
  }

  setupLazyImages() {
    const imgObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target.querySelector("img[data-src]");
            if (img) {
              img.src = img.dataset.src;
              img.removeAttribute("data-src");
            }
          }
        });
      },
      { rootMargin: "200px" },
    );

    this.pages.forEach((page) => imgObserver.observe(page));
  }

  setupTopbarHide() {
    window.addEventListener(
      "scroll",
      () => {
        const currentY = window.scrollY;
        if (currentY > this.lastScrollY + 5 && currentY > 100) {
          this.topbar?.classList.add("hidden");
        } else if (currentY < this.lastScrollY - 5) {
          this.topbar?.classList.remove("hidden");
        }
        this.lastScrollY = currentY;
      },
      { passive: true },
    );

    // Show on mouse move near top
    document.addEventListener("mousemove", (e) => {
      if (e.clientY < 80) {
        this.topbar?.classList.remove("hidden");
      }
    });
  }

  setupFullscreen() {
    const btn = document.querySelector(".fullscreen-btn");
    if (!btn) return;

    btn.addEventListener("click", () => {
      if (!document.fullscreenElement) {
        document.documentElement
          .requestFullscreen()
          .then(() => {
            this.isFullscreen = true;
            btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/></svg>`;
          })
          .catch(() => {});
      } else {
        document.exitFullscreen();
        this.isFullscreen = false;
        btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>`;
      }
    });
  }

  setupKeyboard() {
    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown" || e.key === "PageDown") {
        window.scrollBy({ top: window.innerHeight * 0.8, behavior: "smooth" });
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        window.scrollBy({ top: -window.innerHeight * 0.8, behavior: "smooth" });
      } else if (e.key === "f" || e.key === "F") {
        document.querySelector(".fullscreen-btn")?.click();
      }
    });
  }

  updateChapterInfo() {
    const info = CHAPTER_DATA[this.chapterId - 1];
    if (!info) return;

    const numEl = document.querySelector(".reader-chapter-num");
    const titleEl = document.querySelector(".reader-chapter-title");
    const introLabel = document.getElementById("reader-ch-label");
    const introTitle = document.getElementById("reader-ch-title");
    const introDesc = document.getElementById("reader-ch-desc");
    const chapterSelect = document.getElementById("chapter-select");

    if (numEl) numEl.textContent = `Chapter ${this.chapterId}`;
    if (titleEl) titleEl.textContent = info.title;
    if (introLabel)
      introLabel.textContent = `CHAPTER ${String(this.chapterId).padStart(2, "0")}`;
    if (introTitle) introTitle.textContent = info.title;
    if (introDesc) introDesc.textContent = info.desc;
    if (chapterSelect) chapterSelect.value = String(this.chapterId);
    document.title = `MANCHINEEL — ${info.title}`;

    // Nav buttons
    const prevBtn = document.getElementById("prev-chapter-btn");
    const nextBtn = document.getElementById("next-chapter-btn");
    const prevEnd = document.getElementById("prev-chapter-end");
    const nextEnd = document.getElementById("next-chapter-end");

    if (prevBtn) prevBtn.disabled = this.chapterId <= 1;
    if (nextBtn) nextBtn.disabled = this.chapterId >= CHAPTER_DATA.length;

    const prevHref =
      this.chapterId > 1 ? `reader.html?chapter=${this.chapterId - 1}` : "#";
    const nextHref =
      this.chapterId < CHAPTER_DATA.length
        ? `reader.html?chapter=${this.chapterId + 1}`
        : "#";

    if (prevBtn)
      prevBtn.onclick = () => {
        if (this.chapterId > 1) window.location.href = prevHref;
      };
    if (nextBtn)
      nextBtn.onclick = () => {
        if (this.chapterId < CHAPTER_DATA.length)
          window.location.href = nextHref;
      };
    if (prevEnd) {
      if (this.chapterId > 1) {
        prevEnd.href = prevHref;
        prevEnd.style.display = "";
      } else {
        prevEnd.style.display = "none";
      }
    }
    if (nextEnd) {
      if (this.chapterId < CHAPTER_DATA.length) {
        nextEnd.href = nextHref;
        nextEnd.textContent = "Lanjut ke chapter berikutnya >>";
      } else {
        nextEnd.textContent = "Ulangi dari awal";
        nextEnd.href = "reader.html?chapter=1";
      }
    }
  }
}

// ============ CHAPTER DATA ============
const CHAPTER_DATA = [
  {
    id: 1,
    title: "Benang Tak Kasat Mata",
    desc: "Seorang pengendara motor terjebak dalam situasi fatal yang terjadi dalam hitungan detik ketika seutas benang layangan melilit lehernya dan tersangkut pada truk yang melaju kencang, menciptakan horor yang tenang namun mematikan di tengah jalan raya.",
    date: "June 05, 2026",
    pages: 2,
    thumb: "assets/ch1.png",
    pageFolder: "assets/reader/chapter-1",
  },
  {
    id: 2,
    title: "Perempuan di Kursi Belakang",
    desc: "Ketika sebuah taksi banting setir untuk menghindari tabrakan maut, seorang penumpang wanita yang sedang tertidur lelap terbangun dalam kengerian setelah antingnya yang tersangkut di sandaran kepala merobek telinganya akibat hantaman keras.",
    date: "coming soon!",
    pages: 2,
    thumb: "assets/ch2.png",
    pageFolder: "assets/reader/chapter-2",
  },
  {
    id: 3,
    title: "Di Belakang Punggungnya",
    desc: "Di tengah tenangnya sore di taman, seorang pria yang memakai earphone tewas seketika ketika bilah logam dari mesin pemotong rumput yang rusak terlepas dan melesat menghantam kepalanya dari belakang.",
    date: "coming soon!",
    pages: 2,
    thumb: "assets/ch3.png",
    pageFolder: "assets/reader/chapter-3",
  },
  {
    id: 4,
    title: "Yang tidak Ditandai",
    desc: "Sebuah tragedi memilukan terjadi ketika seorang anak kecil salah mengambil pisau dapur asli yang tertinggal di meja makan, mengira benda tajam itu adalah pisau mainannya saat mengajak sang kakek bermain perang-perangan.",
    date: "coming soon!",
    pages: 2,
    thumb: "assets/ch4.png",
    pageFolder: "assets/reader/chapter-4",
  },
  {
    id: 5,
    title: "Tepi Jembatan",
    desc: "Sebuah lompatan maut terjadi di jembatan wisata ketika seorang pemula melompat terlalu dini akibat provokasi penonton, sementara operator belum sempat menyesuaikan panjang tali pengaman pasca penggunaan sebelumnya.",
    date: "coming soon!",
    pages: 2,
    thumb: "assets/ch5.png",
    pageFolder: "assets/reader/chapter-5",
  },
  {
    id: 6,
    title: "Malam yang Tidak Sampai Rumah",
    desc: "Di bawah gemerlap lampu kota yang tenang, seorang pemuda yang terhanyut dalam musik di earphone-nya menjadi korban kecelakaan maut saat seorang pengemudi mabuk kehilangan fokus demi meraih ponsel yang terjatuh. ",
    date: "coming soon!",
    pages: 2,
    thumb: "assets/ch6.png",
    pageFolder: "assets/reader/chapter-6",
  },
];

// ============ HOME PAGE CHAPTERS RENDER ============
class ChapterRenderer {
  constructor() {
    this.container = document.getElementById("chapters-container");
    this.init();
  }

  init() {
    if (!this.container) return;
    this.render();
  }

  render() {
    this.container.innerHTML = CHAPTER_DATA.map(
      (ch, i) => `
      <a class="chapter-card fade-in-up" href="reader.html?chapter=${ch.id}" style="animation-delay: ${i * 0.1}s">
        <div class="chapter-thumb">
          <img 
            src="${ch.thumb}" 
            alt="${ch.title}"
            loading="lazy"
          />
          <div class="chapter-thumb-overlay">
            <div class="chapter-play-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>
            </div>
          </div>
          <div class="chapter-number-badge">CH. ${String(ch.id).padStart(2, "0")}</div>
        </div>
        <div class="chapter-body">
          <div class="chapter-num">Chapter ${ch.id}</div>
          <div class="chapter-title">${ch.title}</div>
          <div class="chapter-desc">${ch.desc}</div>
          <div class="chapter-footer">
            <span class="chapter-date">${ch.date}</span>
            <span class="chapter-pages">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/></svg>
              ${ch.pages} Halaman
            </span>
          </div>
        </div>
      </a>
    `,
    ).join("");

    // Re-trigger scroll animations
    new ScrollAnimations();
    new HorrorCursor();
  }
}

// ============ READER PAGES RENDER ============
class ReaderPagesRenderer {
  constructor() {
    this.container = document.getElementById("reader-pages");
    this.chapterId =
      parseInt(new URLSearchParams(window.location.search).get("chapter")) || 1;
    this.init();
  }

  init() {
    if (!this.container) return;
    this.render();
  }

  getPageImageUrl(chapter, pageIndex) {
    if (chapter.pageFolder) {
      return `${chapter.pageFolder}/page-${pageIndex + 1}.png`;
    }

    return chapter.thumb || "assets/Screenshot 2026-06-03 200851.png";
  }

  render() {
    const chapter = CHAPTER_DATA[this.chapterId - 1];
    if (!chapter) return;

    const pageCount = chapter.pages;
    let html = "";

    for (let i = 0; i < Math.min(pageCount, 100); i++) {
      const imageSrc = this.getPageImageUrl(chapter, i);
      html += `
        <div class="comic-page">
          <img 
            ${i === 0 ? `src="${imageSrc}"` : `data-src="${imageSrc}"`}
            alt="Chapter ${this.chapterId} - Halaman ${i + 1}"
            loading="${i === 0 ? "eager" : "lazy"}"
            style="filter: grayscale(20%) contrast(1.1) brightness(0.85);"
          />
        </div>
        ${i < pageCount - 1 ? '<div class="page-separator"></div>' : ""}
      `;
    }

    this.container.innerHTML = html;
  }
}

// ============ HORROR TEXT EFFECTS ============
class HorrorTextEffects {
  constructor() {
    this.init();
  }

  init() {
    // Random flicker on horror elements
    const flickers = document.querySelectorAll(".flicker-random");
    flickers.forEach((el) => {
      setInterval(() => {
        if (Math.random() < 0.05) {
          el.style.opacity = "0.3";
          setTimeout(() => {
            el.style.opacity = "1";
            if (Math.random() < 0.5) {
              setTimeout(() => {
                el.style.opacity = "0.6";
                setTimeout(() => {
                  el.style.opacity = "1";
                }, 50);
              }, 80);
            }
          }, 60);
        }
      }, 1000);
    });
  }
}

// ============ INIT ============
document.addEventListener("DOMContentLoaded", () => {
  // Add grain overlay
  const grain = document.createElement("div");
  grain.className = "grain-overlay";
  document.body.appendChild(grain);

  // Start loading screen
  if (document.getElementById("loading-screen")) {
    document.body.style.overflow = "hidden";
    new LoadingScreen();
  }

  // Init all modules
  new HorrorCursor();
  new Navbar();
  new ScrollAnimations();
  new GlitchEffect();
  new ChapterRenderer();
  new ReaderPagesRenderer();
  new ComicReader();
  new SynopsisToggle();
  new HorrorTextEffects();

  // Ambient particles on hero
  const particleContainer = document.querySelector(".ambient-particles");
  if (particleContainer) new AmbientParticles(particleContainer);

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const target = document.querySelector(a.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
});
