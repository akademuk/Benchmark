// ─── Detect Safari ───
const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

// ─── Lenis smooth scroll (disabled on Safari) ───
let lenis;
if (!isSafari) {
    lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
}

// ─── GSAP + ScrollTrigger init ───
gsap.registerPlugin(ScrollTrigger);

// Sync Lenis with ScrollTrigger
if (!isSafari && lenis) {
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
}

// ─── Hero parallax ───
const heroBg = document.querySelector('.hero__bg img');
if (heroBg) {
    gsap.fromTo(heroBg,
        { yPercent: 0 },
        {
            yPercent: -23,
            ease: 'none',
            scrollTrigger: {
                trigger: '.hero',
                start: 'top top',
                end: 'bottom top',
                scrub: true,
            },
        }
    );
}

// ─── Our Approach parallax ───
const approachBg = document.querySelector('.our-approach__bg img');
if (approachBg) {
    gsap.fromTo(approachBg,
        { yPercent: 0 },
        {
            yPercent: -23,
            ease: 'none',
            scrollTrigger: {
                trigger: '.our-approach',
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
            },
        }
    );
}

// ─── Value cards parallax ───
document.querySelectorAll('.value__card-image').forEach(card => {
    const img = card.querySelector('img');
    if (!img) return;
    gsap.fromTo(img,
        { yPercent: 0 },
        {
            yPercent: -20,
            ease: 'none',
            scrollTrigger: {
                trigger: card,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
            },
        }
    );
});

// ─── Our Projects cards parallax ───
if (window.innerWidth >= 1280) {
    document.querySelectorAll('.our-projects__card').forEach((card, i) => {
        const direction = i % 2 === 0 ? -40 : 40;
        gsap.fromTo(card,
            { y: direction },
            {
                y: -direction,
                ease: 'none',
                scrollTrigger: {
                    trigger: '.our-projects',
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true,
                },
            }
        );
    });
}

// Burger menu
const burger = document.querySelector('.header__burger');
const headerNav = document.querySelector('.header__nav');
const MENU_CLOSE_DURATION = 650; // matches clip-path transition

function openMenu() {
    headerNav.classList.add('is-open');
    burger.classList.add('is-active');
    burger.setAttribute('aria-expanded', 'true');
    if (lenis) lenis.stop();
    else document.body.style.overflow = 'hidden';
}

function closeMenu() {
    headerNav.classList.remove('is-open');
    burger.classList.remove('is-active');
    burger.setAttribute('aria-expanded', 'false');
    // wait for close animation to finish before re-enabling scroll
    setTimeout(() => {
        if (lenis) lenis.start();
        else document.body.style.overflow = '';
    }, MENU_CLOSE_DURATION);
}

burger.addEventListener('click', () => {
    headerNav.classList.contains('is-open') ? closeMenu() : openMenu();
});

// ─── All anchor links smooth scroll ───
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
        const href = link.getAttribute('href');
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();

        const isMenuOpen = headerNav.classList.contains('is-open');

        const doScroll = () => {
            if (lenis) {
                lenis.start();
                lenis.scrollTo(target, { duration: 1.4 });
            } else {
                document.body.style.overflow = '';
                target.scrollIntoView({ behavior: 'smooth' });
            }
        };

        if (isMenuOpen) {
            closeMenu();
            setTimeout(doScroll, MENU_CLOSE_DURATION);
        } else {
            doScroll();
        }
    });
});

// Header scroll
const header = document.querySelector('.header');

// ─── Who We Are Swiper ───
const whoWeAreSwiper = new Swiper('.who-we-are__swiper', {
    loop: true,
    speed: 700,
    grabCursor: true,
    navigation: {
        prevEl: '.who-we-are__swiper-prev',
        nextEl: '.who-we-are__swiper-next',
    },
    pagination: {
        el: '.who-we-are__swiper-pagination',
        clickable: true,
    },
});

// ─── What We Do Accordion ───
document.querySelectorAll('.what-we-do__accordion-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
        const panel = document.getElementById(trigger.getAttribute('aria-controls'));
        const isOpen = trigger.getAttribute('aria-expanded') === 'true';

        // Close all
        document.querySelectorAll('.what-we-do__accordion-trigger').forEach(t => {
            t.setAttribute('aria-expanded', 'false');
            t.closest('.what-we-do__accordion-item').classList.remove('is-open');
        });

        // Open clicked (if it was closed)
        if (!isOpen) {
            trigger.setAttribute('aria-expanded', 'true');
            trigger.closest('.what-we-do__accordion-item').classList.add('is-open');
        }
    });
});

function handleHeaderScroll() {
    if (window.innerWidth >= 1280) {
        if (window.scrollY >= 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    } else {
        header.classList.remove('scrolled');
    }
}

window.addEventListener('scroll', handleHeaderScroll);
window.addEventListener('resize', handleHeaderScroll);
handleHeaderScroll();
