/* Static site generator for the Alvee Jewels redesign.
 * Run: node tools/build.js
 * Output: fully static HTML files in the project root.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

const brand = {
  name: 'Alvee Jewels',
  legal: 'Alvee Jewels Private Limited',
  phone: '+91 2616105100',
  phoneHref: '+912616105100',
  email: 'info@elvee.in',
  address: 'Plot No. M1 To M6, Gujarat Hira Bourse Gem & Jewellery Park, Pal-Hazira Road, Ichchhapore, Surat, Gujarat - 394510'
};

const nav = [
  { label: 'Home', href: 'index.html' },
  { label: 'About', href: 'about.html' },
  { label: 'Services', href: 'customer-services.html' },
  { label: 'For Business', href: 'b2b.html' },
  { label: 'Customize', href: 'customize.html' },
  { label: 'FAQ', href: 'faq.html' },
  { label: 'Contact', href: 'contact.html' }
];

const footerCompany = [
  { label: 'About Us', href: 'about.html' },
  { label: 'For Business', href: 'b2b.html' },
  { label: 'Careers', href: 'careers.html' },
  { label: 'Contact Us', href: 'contact.html' },
  { label: 'Terms and Conditions', href: 'terms.html' }
];

const footerCare = [
  { label: 'Customer Services', href: 'customer-services.html' },
  { label: 'Request a Quote', href: 'b2b.html#rfq' },
  { label: 'Book an Appointment', href: 'appointment.html' },
  { label: 'Customize', href: 'customize.html' },
  { label: 'FAQ', href: 'faq.html' }
];

const icon = {
  arrow: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6"/></svg>',
  diamond: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M14 8h20l8 12-18 22L6 20 14 8Z"/><path d="M6 20h36M14 8l6 12 4 18 4-18 6-12"/></svg>',
  gold: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M8 34 24 8l16 26-16 8-16-8Z"/><path d="M8 34h32M24 8v34"/></svg>',
  silver: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 5 43 24 24 43 5 24 24 5Z"/><path d="M5 24h38M24 5v38"/></svg>',
  facebook: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 8h3V4h-3c-3 0-5 2-5 5v3H6v4h3v8h4v-8h3l1-4h-4V9c0-.6.4-1 1-1Z"/></svg>',
  instagram: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1"/></svg>',
  linkedin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9v11M6 5.5v.01M11 20V9m0 4c0-2.5 2-4 4-4s4 1.3 4 4v7"/></svg>',
  pinterest: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a9 9 0 0 0-3 17.5c0-2 .4-4 1.5-6.5.4-1 .7-2 .7-3 0-2-1.4-3.5-3.4-3.5C5.7 7.5 4 9.7 4 12.6c0 4.4 2.7 7.4 6.5 7.4 1.2 0 2.4-.6 2.8-1.4.3-.8.6-1.9.3-2.7-.3-.7-.6-1-1.3-1-.7 0-1.2.5-1.2 1.2 0 .8.3 1.8.2 2.4"/></svg>',
  youtube: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="5" width="20" height="14" rx="4"/><path d="m10 9 5 3-5 3V9Z"/></svg>'
};

/* Distinct gradient IDs so the header and footer marks can coexist on one page. */
function brandMark(id) {
  return `<svg class="brand__mark" viewBox="0 0 56 56" aria-hidden="true" focusable="false">
    <defs>
      <linearGradient id="alvee-gold-${id}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#F6E7BE"/>
        <stop offset=".48" stop-color="#C9A227"/>
        <stop offset="1" stop-color="#8B6A1B"/>
      </linearGradient>
    </defs>
    <rect x="1.5" y="1.5" width="53" height="53" rx="15" fill="#10100F" stroke="url(#alvee-gold-${id})" stroke-width="1.4"/>
    <rect x="6" y="6" width="44" height="44" rx="11" fill="none" stroke="#C9A227" stroke-opacity=".28" stroke-width=".8"/>
    <path d="M15 45 28 14 41 45" fill="none" stroke="url(#alvee-gold-${id})" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M20 32h16" fill="none" stroke="#EAD6A0" stroke-width="2.4" stroke-linecap="round"/>
    <path class="brand__gem" d="M28 27.3 32.2 32 28 36.7 23.8 32Z" fill="#10100F" stroke="#F6E7BE" stroke-width="1.3" stroke-linejoin="round"/>
    <path d="M28 27.3v9.4M23.8 32h8.4" fill="none" stroke="#C9A227" stroke-opacity=".7" stroke-width=".6"/>
    <circle cx="44" cy="16" r="1.5" fill="#F6E7BE"/>
  </svg>`;
}

function header(active) {
  const links = nav.map(item => {
    const isActive = item.href === active ? ' aria-current="page"' : '';
    return `<li><a class="nav-link" href="${item.href}"${isActive}>${item.label}</a></li>`;
  }).join('');

  return `
<a class="skip-link" href="#main-content">Skip to content</a>
<header class="site-header" id="top">
  <div class="container header__inner">
    <a class="brand" href="index.html">
      ${brandMark('header')}
      <span class="brand__text"><strong>ALVEE</strong><small>JEWELS</small></span>
    </a>
    <button class="nav-toggle" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="primary-nav">
      <span></span><span></span><span></span>
    </button>
    <nav class="primary-nav" id="primary-nav" aria-label="Primary navigation">
      <ul>${links}</ul>
    </nav>
    <a class="btn btn--small btn--gold header__cta" href="appointment.html">Book an Appointment</a>
  </div>
</header>`;
}

function footer() {
  const socials = [
    ['Instagram', 'https://www.instagram.com/', icon.instagram],
    ['Facebook', 'https://www.facebook.com/', icon.facebook],
    ['LinkedIn', 'https://www.linkedin.com/', icon.linkedin],
    ['Pinterest', 'https://www.pinterest.com/', icon.pinterest],
    ['YouTube', 'https://www.youtube.com/', icon.youtube]
  ].map(([label, href, svg]) => `<a href="${href}" target="_blank" rel="noopener noreferrer" aria-label="${label}">${svg}</a>`).join('');

  return `
<footer class="site-footer">
  <div class="container footer__grid">
    <div class="footer__brand">
      <a class="brand brand--footer" href="index.html">
        ${brandMark('footer')}
        <span class="brand__text"><strong>ALVEE</strong><small>JEWELS</small></span>
      </a>
      <p>Where design meets precision, and craftsmanship meets trust.</p>
      <div class="footer__socials" aria-label="Social media">${socials}</div>
    </div>
    <div class="footer__col">
      <h2>Our Company</h2>
      <ul>${footerCompany.map(l => `<li><a href="${l.href}">${l.label}</a></li>`).join('')}</ul>
    </div>
    <div class="footer__col">
      <h2>Customer Care</h2>
      <ul>${footerCare.map(l => `<li><a href="${l.href}">${l.label}</a></li>`).join('')}</ul>
    </div>
    <div class="footer__col">
      <h2>Visit &amp; Contact</h2>
      <p>${brand.address}</p>
      <p><a href="tel:${brand.phoneHref}">${brand.phone}</a><br><a href="mailto:${brand.email}">${brand.email}</a></p>
    </div>
  </div>
  <div class="container footer__bottom">
    <p>&copy; <span id="year">2026</span> ${brand.legal}. All Rights Reserved.</p>
    <p>Crafted in Surat, India.</p>
  </div>
</footer>
<button class="to-top" type="button" aria-label="Back to top" title="Back to top">${icon.arrow}</button>`;
}

function pageHero({ eyebrow, title, text, image = 'assets/images/heritage-banner.png' }) {
  return `
<section class="page-hero" style="background-image:linear-gradient(90deg, rgba(16,16,15,.94) 0%, rgba(16,16,15,.72) 55%, rgba(16,16,15,.35) 100%), url('${image}')">
  <div class="page-hero__inner container">
    <p class="eyebrow reveal">${eyebrow}</p>
    <h1 class="reveal" style="--delay:.08s">${title}</h1>
    ${text ? `<p class="page-hero__text reveal" style="--delay:.16s">${text}</p>` : ''}
  </div>
</section>`;
}

function sideDecor() {
  return `
<div class="side-decor" aria-hidden="true">
  <svg class="side-decor__path side-decor__path--left" viewBox="0 0 180 900" preserveAspectRatio="none">
    <path d="M150 -20 C 20 170, 210 300, 80 470 S 20 720, 130 920" />
  </svg>
  <svg class="side-decor__path side-decor__path--right" viewBox="0 0 180 900" preserveAspectRatio="none">
    <path d="M30 -20 C 170 170, -20 320, 110 500 S 170 740, 50 920" />
  </svg>
  <span class="side-decor__shape side-decor__shape--ring"></span>
  <span class="side-decor__shape side-decor__shape--diamond"></span>
  <span class="side-decor__shape side-decor__shape--dot"></span>
</div>`;
}

function layout({ file, title, description, body }) {
  const ld = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'JewelryStore',
    name: brand.name,
    legalName: brand.legal,
    telephone: brand.phone,
    email: brand.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: brand.address,
      addressLocality: 'Surat',
      addressRegion: 'Gujarat',
      addressCountry: 'IN'
    },
    url: 'https://www.elveester.com/' + file
  }, null, 2);

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="${description}">
  <meta name="theme-color" content="#10100F">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${title} | ${brand.name}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="assets/images/slider-1.webp">
  <link rel="icon" href="assets/images/favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="assets/css/styles.css">
  <script type="application/ld+json">${ld}</script>
  <title>${title} | ${brand.name}</title>
</head>
<body>
<div class="page-shell">
${sideDecor()}
${header(file)}
<div class="scroll-progress" aria-hidden="true"><span></span></div>
<main id="main-content">
${body}
</main>
${footer()}
</div>
<script src="assets/js/gsap.min.js" defer></script>
<script src="assets/js/ScrollTrigger.min.js" defer></script>
<script src="assets/js/main.js" defer></script>
</body>
</html>
`;
}

/* ------------------------------- HOME ---------------------------------- */
const home = `
<section class="hero" id="home" aria-label="Alvee Jewels featured collection">
  <div class="hero__slides" data-carousel>
    <div class="hero__slide is-active" style="--bg:linear-gradient(135deg,#2a2118,#0d0d0c)">
      <span class="hero__img-wrap"><img class="hero__img" src="assets/images/slider-1.webp" alt="Alvee Jewels signature collection" width="1600" height="900" fetchpriority="high" decoding="async"></span>
    </div>
    <div class="hero__slide" style="--bg:linear-gradient(135deg,#33261a,#100f0d)">
      <span class="hero__img-wrap"><img class="hero__img" src="assets/images/slider-2.webp" alt="Gold jewellery crafted at the Alvee atelier" width="1600" height="900" loading="lazy" decoding="async"></span>
    </div>
    <div class="hero__slide" style="--bg:linear-gradient(135deg,#1d1c1a,#0b0b0a)">
      <span class="hero__img-wrap"><img class="hero__img" src="assets/images/slider-3.webp" alt="Diamond jewellery by Alvee Jewels" width="1600" height="900" loading="lazy" decoding="async"></span>
    </div>
    <div class="hero__slide" style="--bg:linear-gradient(135deg,#3a2c1d,#12100d)">
      <span class="hero__img-wrap"><img class="hero__img" src="assets/images/slider-4.webp" alt="Silver and contemporary designs by Alvee" width="1600" height="900" loading="lazy" decoding="async"></span>
    </div>
    <div class="hero__slide" style="--bg:linear-gradient(135deg,#241d16,#0c0c0b)">
      <span class="hero__img-wrap"><img class="hero__img" src="assets/images/slider-5.webp" alt="Finishing and polishing at Alvee Jewels" width="1600" height="900" loading="lazy" decoding="async"></span>
    </div>
  </div>
  <div class="hero__overlay" aria-hidden="true"></div>
  <div class="container hero__inner">
    <p class="eyebrow eyebrow--light reveal">Surat &middot; India &middot; Master Artisans</p>
    <h1 class="hero__title reveal" style="--delay:.08s">Where design meets <em>precision.</em></h1>
    <p class="hero__text reveal" style="--delay:.16s">Diamond, gold and silver jewellery, imagined and finished under one roof — blending heritage technique with contemporary innovation.</p>
    <div class="hero__actions reveal" style="--delay:.24s">
      <a class="btn btn--gold" href="about.html">Discover Our Craft ${icon.arrow}</a>
      <a class="btn btn--ghost" href="appointment.html">Book an Appointment</a>
    </div>
  </div>
  <div class="container hero__controls">
    <div class="carousel-dots" role="tablist" aria-label="Choose a slide">
      <button type="button" class="carousel-dot is-active" role="tab" aria-selected="true" aria-label="Slide 1" data-slide="0"></button>
      <button type="button" class="carousel-dot" role="tab" aria-selected="false" aria-label="Slide 2" data-slide="1"></button>
      <button type="button" class="carousel-dot" role="tab" aria-selected="false" aria-label="Slide 3" data-slide="2"></button>
      <button type="button" class="carousel-dot" role="tab" aria-selected="false" aria-label="Slide 4" data-slide="3"></button>
      <button type="button" class="carousel-dot" role="tab" aria-selected="false" aria-label="Slide 5" data-slide="4"></button>
    </div>
    <div class="carousel-arrows">
      <button type="button" class="carousel-arrow" data-dir="prev" aria-label="Previous slide">${icon.arrow}</button>
      <button type="button" class="carousel-arrow" data-dir="next" aria-label="Next slide">${icon.arrow}</button>
    </div>
  </div>
  <div class="hero__scroll" aria-hidden="true"><span>Scroll</span><i></i></div>
</section>

<div class="marquee" aria-label="Our specialities">
  <div class="marquee__track">
    <span>Diamond Jewellery <b>&#9670;</b> Gold Jewellery <b>&#9670;</b> Silver Jewellery <b>&#9670;</b> Private Label <b>&#9670;</b> Job Work <b>&#9670;</b></span>
    <span aria-hidden="true">Diamond Jewellery <b>&#9670;</b> Gold Jewellery <b>&#9670;</b> Silver Jewellery <b>&#9670;</b> Private Label <b>&#9670;</b> Job Work <b>&#9670;</b></span>
  </div>
</div>

<section class="section">
  <div class="container split">
    <div class="split__media reveal">
      <div class="frame">
        <span class="frame__media"><img src="assets/images/heritage-banner.png" alt="Inside the Alvee Jewels atelier" width="720" height="480" loading="lazy" decoding="async"></span>
      </div>
      <div class="split__badge"><span>100%</span><small>In-house<br>craftsmanship</small></div>
    </div>
    <div class="split__content">
      <p class="eyebrow reveal">Who We Are</p>
      <h2 class="section__title reveal" style="--delay:.08s">From the first sketch to the final polish.</h2>
      <p class="reveal" style="--delay:.14s">Every step of the journey takes place within the walls of our atelier, where master artisans breathe life into raw materials, transforming them into timeless works of art.</p>
      <p class="reveal" style="--delay:.2s">At Alvee Jewels Private Limited, we turn imagination into timeless elegance. As one of India&rsquo;s leading jewellery manufacturing houses, we craft each piece with a blend of traditional technique and contemporary innovation — a harmonious balance between heritage and modernity.</p>
      <a class="text-link reveal" style="--delay:.26s" href="about.html">More about our story ${icon.arrow}</a>
    </div>
  </div>
</section>

<section class="section section--tint">
  <div class="container">
    <div class="section__head reveal">
      <p class="eyebrow">Our Craft</p>
      <h2 class="section__title">Explore our collections.</h2>
      <p>Choose a metal to see how our artisans shape it — from first sketch to final polish.</p>
    </div>
    <div class="explorer reveal" data-explorer>
      <div class="explorer__tabs" role="tablist" aria-label="Jewellery collections" aria-orientation="vertical">
        <button class="explorer-tab is-active" type="button" role="tab" id="tab-diamond" aria-controls="panel-diamond" aria-selected="true" tabindex="0" data-key="diamond">
          <span class="explorer-tab__num">01</span>
          <span class="explorer-tab__icon">${icon.diamond}</span>
          <span class="explorer-tab__text"><strong>Diamond</strong><small>Intricate brilliance, precision set.</small></span>
          <span class="explorer-tab__arrow">${icon.arrow}</span>
        </button>
        <button class="explorer-tab" type="button" role="tab" id="tab-gold" aria-controls="panel-gold" aria-selected="false" tabindex="-1" data-key="gold">
          <span class="explorer-tab__num">02</span>
          <span class="explorer-tab__icon">${icon.gold}</span>
          <span class="explorer-tab__text"><strong>Gold</strong><small>14K &amp; 18K, tradition and trend.</small></span>
          <span class="explorer-tab__arrow">${icon.arrow}</span>
        </button>
        <button class="explorer-tab" type="button" role="tab" id="tab-silver" aria-controls="panel-silver" aria-selected="false" tabindex="-1" data-key="silver">
          <span class="explorer-tab__num">03</span>
          <span class="explorer-tab__icon">${icon.silver}</span>
          <span class="explorer-tab__text"><strong>Silver</strong><small>Modern, affordable, everyday elegant.</small></span>
          <span class="explorer-tab__arrow">${icon.arrow}</span>
        </button>
      </div>
      <div class="explorer__panels">
        <div class="explorer-panel is-active" role="tabpanel" id="panel-diamond" aria-labelledby="tab-diamond" data-key="diamond">
          <img class="explorer-panel__img" src="assets/images/slider-3.webp" alt="Diamond jewellery by Alvee Jewels" width="1600" height="900" loading="lazy" decoding="async">
          <div class="explorer-panel__overlay" aria-hidden="true"></div>
          <div class="explorer-panel__content">
            <p class="eyebrow eyebrow--light">Collection 01</p>
            <h3>Diamond Jewellery</h3>
            <p>Intricately designed and precision-set to perfection, where every facet is given the attention it deserves.</p>
            <ul class="explorer-panel__specs"><li>Precision setting</li><li>Facet matching</li><li>Quality checked</li></ul>
            <a class="btn btn--gold" href="customize.html">Explore custom options ${icon.arrow}</a>
          </div>
        </div>
        <div class="explorer-panel" role="tabpanel" id="panel-gold" aria-labelledby="tab-gold" data-key="gold" hidden>
          <img class="explorer-panel__img" src="assets/images/slider-2.webp" alt="Gold jewellery crafted at the Alvee atelier" width="1600" height="900" loading="lazy" decoding="async">
          <div class="explorer-panel__overlay" aria-hidden="true"></div>
          <div class="explorer-panel__content">
            <p class="eyebrow eyebrow--light">Collection 02</p>
            <h3>Gold Jewellery</h3>
            <p>Crafted in 14K and 18K purity, reflecting both tradition and trend in every carefully finished form.</p>
            <ul class="explorer-panel__specs"><li>14K &amp; 18K purity</li><li>Classic &amp; modern forms</li><li>Consistent finishing</li></ul>
            <a class="btn btn--gold" href="customize.html">Explore custom options ${icon.arrow}</a>
          </div>
        </div>
        <div class="explorer-panel" role="tabpanel" id="panel-silver" aria-labelledby="tab-silver" data-key="silver" hidden>
          <img class="explorer-panel__img" src="assets/images/slider-4.webp" alt="Silver and contemporary designs by Alvee" width="1600" height="900" loading="lazy" decoding="async">
          <div class="explorer-panel__overlay" aria-hidden="true"></div>
          <div class="explorer-panel__content">
            <p class="eyebrow eyebrow--light">Collection 03</p>
            <h3>Silver Jewellery</h3>
            <p>Modern, affordable and elegantly styled for everyday wear, without ever compromising on craft.</p>
            <ul class="explorer-panel__specs"><li>Everyday elegance</li><li>Contemporary styling</li><li>Carefully finished</li></ul>
            <a class="btn btn--gold" href="customize.html">Explore custom options ${icon.arrow}</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="stats">
  <div class="container stats__grid">
    <div class="stat reveal"><span class="stat__number" data-count="3">0</span><span class="stat__label">Precious metal categories</span></div>
    <div class="stat reveal" style="--delay:.1s"><span class="stat__number" data-count="18" data-suffix="K">0</span><span class="stat__label">Gold purity, available in 14K &amp; 18K</span></div>
    <div class="stat reveal" style="--delay:.2s"><span class="stat__number" data-count="100" data-suffix="%">0</span><span class="stat__label">Made within our own atelier</span></div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section__head reveal">
      <p class="eyebrow">How We Work</p>
      <h2 class="section__title">A journey of four careful steps.</h2>
    </div>
    <ol class="timeline">
      <li class="timeline__item reveal"><span class="timeline__dot">01</span><div><h3>Imagine</h3><p>Concept, mood and form are explored until the idea feels unmistakably yours.</p></div></li>
      <li class="timeline__item reveal" style="--delay:.08s"><span class="timeline__dot">02</span><div><h3>Craft</h3><p>Master artisans shape the metal by hand, balancing traditional skill with modern tooling.</p></div></li>
      <li class="timeline__item reveal" style="--delay:.16s"><span class="timeline__dot">03</span><div><h3>Set</h3><p>Stones are selected and set with precision, symmetry and a keen eye for detail.</p></div></li>
      <li class="timeline__item reveal" style="--delay:.24s"><span class="timeline__dot">04</span><div><h3>Polish &amp; Present</h3><p>Rigorous quality checks precede the final polish, finishing and handover.</p></div></li>
    </ol>
  </div>
</section>

<section class="quote-band">
  <div class="container quote-band__inner reveal">
    <p class="eyebrow eyebrow--light">Our Promise</p>
    <blockquote>&ldquo;Alvee Jewels — Where Design Meets Precision, and Craftsmanship Meets Trust.&rdquo;</blockquote>
    <div class="quote-band__actions">
      <a class="btn btn--gold" href="contact.html">Start a Conversation ${icon.arrow}</a>
      <a class="btn btn--ghost" href="b2b.html">Explore B2B Partnerships ${icon.arrow}</a>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section__head reveal">
      <p class="eyebrow">Social</p>
      <h2 class="section__title">From the atelier to your feed.</h2>
    </div>
    <div class="social-gallery">
      <a class="social-tile reveal" href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="View Alvee on Instagram">
        <img src="assets/images/social-banner-1.png" alt="Alvee Jewels social feature" width="1440" height="1800" loading="lazy" decoding="async">
        <span>Instagram ${icon.arrow}</span>
      </a>
      <a class="social-tile reveal" style="--delay:.12s" href="https://www.pinterest.com/" target="_blank" rel="noopener noreferrer" aria-label="View Alvee on Pinterest">
        <img src="assets/images/social-banner-2.png" alt="Alvee Jewels design inspiration" width="735" height="919" loading="lazy" decoding="async">
        <span>Pinterest ${icon.arrow}</span>
      </a>
    </div>
  </div>
</section>

<section class="newsletter">
  <div class="container newsletter__inner reveal">
    <div>
      <p class="eyebrow">Stay in the know</p>
      <h2>First access to new creations.</h2>
      <p>Subscribe for new products, surveys and events from our atelier.</p>
    </div>
    <form class="newsletter__form" data-mailto data-subject="Newsletter subscription" novalidate>
      <label class="sr-only" for="newsletter-email">Email address</label>
      <input id="newsletter-email" name="Email" type="email" autocomplete="email" placeholder="Your email address" required aria-describedby="newsletter-status">
      <button class="btn btn--gold" type="submit">Sign up</button>
      <p class="form-status" id="newsletter-status" role="status" aria-live="polite"></p>
    </form>
  </div>
</section>`;

/* ------------------------------- ABOUT --------------------------------- */
const about = `
${pageHero({ eyebrow: 'Our Company', title: 'A heritage of making.', text: 'Inside our Surat atelier, imagination becomes wearable art — one careful piece at a time.', image: 'assets/images/heritage-banner.png' })}
<section class="section">
  <div class="container split">
    <div class="split__content">
      <p class="eyebrow reveal">Who We Are</p>
      <h2 class="section__title reveal" style="--delay:.08s">Crafted where it is conceived.</h2>
      <p class="reveal" style="--delay:.14s">From the first sketch to the final polish, every step of the journey takes place within the walls of our atelier. Master artisans breathe life into raw materials, transforming them into timeless works of art with a blend of traditional techniques and contemporary innovation.</p>
      <p class="reveal" style="--delay:.2s">At Alvee Jewels Private Limited, we turn imagination into timeless elegance. As one of India&rsquo;s leading jewellery manufacturing houses, we specialise in diamond, gold and silver jewellery that celebrates beauty, precision and craftsmanship.</p>
      <p class="reveal" style="--delay:.26s">We cater to retailers, wholesalers and private labels across India and global markets through outright sale and job-work models. Each creation undergoes rigorous quality checks to ensure unmatched purity, finishing and design integrity.</p>
    </div>
    <div class="split__media reveal">
      <div class="frame frame--tall"><span class="frame__media"><img src="assets/images/social-banner-2.png" alt="A close look at Alvee Jewels design work" width="735" height="919" loading="lazy" decoding="async"></span></div>
    </div>
  </div>
</section>
<section class="section section--tint">
  <div class="container">
    <div class="section__head reveal"><p class="eyebrow">What We Value</p><h2 class="section__title">The principles behind every piece.</h2></div>
    <div class="cards cards--four">
      <article class="card reveal"><span class="card__icon">${icon.diamond}</span><h3>Precision</h3><p>Exacting standards in setting, finishing and proportion.</p></article>
      <article class="card reveal" style="--delay:.08s"><span class="card__icon">${icon.gold}</span><h3>Heritage</h3><p>Techniques passed down and refined by master hands.</p></article>
      <article class="card reveal" style="--delay:.16s"><span class="card__icon">${icon.silver}</span><h3>Innovation</h3><p>Contemporary thinking applied to timeless forms.</p></article>
      <article class="card reveal" style="--delay:.24s"><span class="card__icon">${icon.arrow}</span><h3>Trust</h3><p>Transparent partnerships with retailers and labels.</p></article>
    </div>
  </div>
</section>
<section class="cta-band">
  <div class="container cta-band__inner reveal">
    <div><p class="eyebrow eyebrow--light">Work With Us</p><h2>Let&rsquo;s create something enduring.</h2></div>
    <a class="btn btn--gold" href="contact.html">Contact the atelier ${icon.arrow}</a>
  </div>
</section>`;

/* ------------------------------ CAREERS -------------------------------- */
const careers = `
${pageHero({ eyebrow: 'Careers', title: 'Make things that last.', text: 'Join the hands and minds behind Alvee Jewels.', image: 'assets/images/social-banner-2.png' })}
<section class="section">
  <div class="container split">
    <div class="split__content">
      <p class="eyebrow reveal">Life at the Atelier</p>
      <h2 class="section__title reveal" style="--delay:.08s">Skill, patience and a shared eye for detail.</h2>
      <p class="reveal" style="--delay:.14s">Our studio brings designers, goldsmiths, setters, polishers and quality specialists together under one roof. We value steady hands, curious minds and people who care about the difference between good and exceptional.</p>
      <p class="reveal" style="--delay:.2s">If you take pride in craft and want to grow with a manufacturing house that works for India and the world, we would like to hear from you.</p>
    </div>
    <div class="split__media reveal"><div class="frame"><span class="frame__media"><img src="assets/images/heritage-banner.png" alt="Artisans working in the Alvee atelier" width="720" height="480" loading="lazy" decoding="async"></span></div></div>
  </div>
</section>
<section class="section section--tint">
  <div class="container">
    <div class="section__head reveal"><p class="eyebrow">Open Roles</p><h2 class="section__title">Where your craft can belong.</h2></div>
    <div class="role-list">
      <article class="role reveal"><div><h3>Senior Jewellery Designer</h3><p>Shape new collections from concept to CAD, with a strong sense of form and wearability.</p></div><a class="btn btn--outline" href="mailto:info@elvee.in?subject=Application%3A%20Senior%20Jewellery%20Designer">Apply now</a></article>
      <article class="role reveal" style="--delay:.08s"><div><h3>Diamond Setter</h3><p>Precision setting and stone matching across diamond and precious-metal pieces.</p></div><a class="btn btn--outline" href="mailto:info@elvee.in?subject=Application%3A%20Diamond%20Setter">Apply now</a></article>
      <article class="role reveal" style="--delay:.16s"><div><h3>Quality Assurance Specialist</h3><p>Inspect purity, finishing and design integrity before every handover.</p></div><a class="btn btn--outline" href="mailto:info@elvee.in?subject=Application%3A%20Quality%20Assurance%20Specialist">Apply now</a></article>
      <article class="role reveal" style="--delay:.24s"><div><h3>B2B Sales &amp; Client Partner</h3><p>Build lasting relationships with retailers, wholesalers and private-label partners.</p></div><a class="btn btn--outline" href="mailto:info@elvee.in?subject=Application%3A%20B2B%20Sales%20%26%20Client%20Partner">Apply now</a></article>
    </div>
    <p class="section__note reveal">Don&rsquo;t see your role? Write to <a href="mailto:info@elvee.in">info@elvee.in</a> with a short note about your craft.</p>
  </div>
</section>`;

/* ------------------------------ CONTACT -------------------------------- */
const contact = `
${pageHero({ eyebrow: 'Contact Us', title: 'Let&rsquo;s talk jewellery.', text: 'Tell us what you have in mind. Our team will get back to you.', image: 'assets/images/slider-2.webp' })}
<section class="section">
  <div class="container contact-grid">
    <div class="contact-info">
      <article class="contact-card reveal"><span class="contact-card__label">Visit the atelier</span><p>${brand.address}</p><a class="text-link" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(brand.address)}" target="_blank" rel="noopener noreferrer">Get directions ${icon.arrow}</a></article>
      <article class="contact-card reveal" style="--delay:.08s"><span class="contact-card__label">Call us</span><p><a href="tel:${brand.phoneHref}">${brand.phone}</a></p></article>
      <article class="contact-card reveal" style="--delay:.16s"><span class="contact-card__label">Email us</span><p><a href="mailto:${brand.email}">${brand.email}</a></p></article>
      <article class="contact-card reveal" style="--delay:.24s"><span class="contact-card__label">Appointments</span><p>Visits are by appointment so we can give your enquiry the attention it deserves.</p><a class="text-link" href="appointment.html">Book an appointment ${icon.arrow}</a></article>
    </div>
    <form class="form-card reveal" data-mailto data-subject="Website enquiry" novalidate>
      <p class="eyebrow">Send an enquiry</p>
      <h2 class="form-card__title">How can we help?</h2>
      <div class="form-row">
        <div class="field"><label for="c-name">Full name</label><input id="c-name" name="Name" type="text" autocomplete="name" required></div>
        <div class="field"><label for="c-email">Email address</label><input id="c-email" name="Email" type="email" autocomplete="email" required></div>
      </div>
      <div class="form-row">
        <div class="field"><label for="c-phone">Phone</label><input id="c-phone" name="Phone" type="tel" autocomplete="tel"></div>
        <div class="field"><label for="c-topic">Enquiry type</label><select id="c-topic" name="Enquiry type"><option>General enquiry</option><option>Wholesale / Retail partnership</option><option>Private label / Job work</option><option>Custom design</option><option>Careers</option></select></div>
      </div>
      <div class="field"><label for="c-message">Message</label><textarea id="c-message" name="Message" rows="5" required placeholder="Tell us a little about what you need..."></textarea></div>
      <button class="btn btn--gold" type="submit">Send enquiry ${icon.arrow}</button>
      <p class="form-status" role="status" aria-live="polite"></p>
      <p class="form-hint">Submitting opens your email app with the details filled in, ready for you to send.</p>
    </form>
  </div>
</section>`;

/* ------------------------------- TERMS --------------------------------- */
const terms = `
${pageHero({ eyebrow: 'Legal', title: 'Terms and Conditions', text: 'Please review the terms below before using this website.', image: 'assets/images/slider-3.webp' })}
<section class="section">
  <div class="container prose">
    <p class="notice"><strong>Note:</strong> This is placeholder copy for the redesigned website and should be reviewed and replaced with your approved legal terms before going live.</p>
    <h2>1. About this website</h2>
    <p>This website is operated by ${brand.legal}. Throughout these terms, &ldquo;we&rdquo;, &ldquo;us&rdquo; and &ldquo;our&rdquo; refer to Alvee Jewels. By using this website you agree to these terms.</p>
    <h2>2. Use of the site</h2>
    <p>You agree to use this website only for lawful purposes and in a way that does not infringe the rights of, or restrict or inhibit the use of this website by, any third party.</p>
    <h2>3. Intellectual property</h2>
    <p>All content, designs, imagery, trademarks and other intellectual property on this website belong to Alvee Jewels or its licensors. You may not reproduce, distribute or create derivative works from them without written permission.</p>
    <h2>4. Product information</h2>
    <p>We take care to describe our diamond, gold and silver jewellery accurately. Product details, purities and availability are indicative and may change. Nothing on this website constitutes a binding offer to sell.</p>
    <h2>5. Enquiries and orders</h2>
    <p>Submitting an enquiry or appointment request does not create a contract. All orders, custom commissions, wholesale arrangements and job-work terms are confirmed separately in writing.</p>
    <h2>6. Limitation of liability</h2>
    <p>To the fullest extent permitted by law, Alvee Jewels shall not be liable for any indirect, incidental or consequential loss arising from your use of this website.</p>
    <h2>7. Contact</h2>
    <p>If you have questions about these terms, contact us at <a href="mailto:${brand.email}">${brand.email}</a> or call <a href="tel:${brand.phoneHref}">${brand.phone}</a>.</p>
  </div>
</section>`;

/* ------------------------ CUSTOMER SERVICES ---------------------------- */
const services = `
${pageHero({ eyebrow: 'Customer Care', title: 'Care that continues after the craft.', text: 'Support for partners, retailers and anyone who needs a little help from our atelier.', image: 'assets/images/slider-4.webp' })}
<section class="section">
  <div class="container">
    <div class="section__head reveal"><p class="eyebrow">What We Offer</p><h2 class="section__title">Practical help, thoughtfully delivered.</h2></div>
    <div class="cards cards--three">
      <article class="card reveal"><span class="card__icon">${icon.diamond}</span><h3>Repairs &amp; Refinishing</h3><p>Careful restoration, cleaning and refinishing to bring cherished pieces back to their best.</p></article>
      <article class="card reveal" style="--delay:.08s"><span class="card__icon">${icon.gold}</span><h3>Quality Assurance</h3><p>Rigorous checks on purity, setting, finishing and design integrity before handover.</p></article>
      <article class="card reveal" style="--delay:.16s"><span class="card__icon">${icon.silver}</span><h3>Custom Design</h3><p>From a first sketch to a finished piece, shaped around your brief and your budget.</p></article>
      <article class="card reveal" style="--delay:.06s"><span class="card__icon">${icon.arrow}</span><h3>Private Label</h3><p>Jewellery made to your brand&rsquo;s specification, with consistent quality and finish.</p></article>
      <article class="card reveal" style="--delay:.14s"><span class="card__icon">${icon.arrow}</span><h3>Job Work</h3><p>Reliable manufacturing support for retailers and wholesalers across India and abroad.</p></article>
      <article class="card reveal" style="--delay:.22s"><span class="card__icon">${icon.arrow}</span><h3>Order Support</h3><p>Clear communication and practical updates at every stage of your order.</p></article>
    </div>
  </div>
</section>
<section class="cta-band">
  <div class="container cta-band__inner reveal"><div><p class="eyebrow eyebrow--light">Need something specific?</p><h2>Our team is one message away.</h2></div><a class="btn btn--gold" href="contact.html">Contact customer care ${icon.arrow}</a></div>
</section>`;

/* ----------------------------- APPOINTMENT ----------------------------- */
const appointment = `
${pageHero({ eyebrow: 'Book an Appointment', title: 'Come see the craft up close.', text: 'Arrange a visit to our Surat atelier or a call with our team.', image: 'assets/images/slider-5.webp' })}
<section class="section">
  <div class="container contact-grid">
    <div class="contact-info">
      <article class="contact-card reveal"><span class="contact-card__label">Where</span><p>${brand.address}</p></article>
      <article class="contact-card reveal" style="--delay:.08s"><span class="contact-card__label">Availability</span><p>Appointments are arranged by prior confirmation so we can prepare for your visit.</p></article>
      <article class="contact-card reveal" style="--delay:.16s"><span class="contact-card__label">Prefer to call?</span><p><a href="tel:${brand.phoneHref}">${brand.phone}</a><br><a href="mailto:${brand.email}">${brand.email}</a></p></article>
    </div>
    <form class="form-card reveal" data-mailto data-subject="Appointment request" novalidate>
      <p class="eyebrow">Request a time</p>
      <h2 class="form-card__title">Tell us when suits you.</h2>
      <div class="form-row">
        <div class="field"><label for="a-name">Full name</label><input id="a-name" name="Name" type="text" autocomplete="name" required></div>
        <div class="field"><label for="a-email">Email address</label><input id="a-email" name="Email" type="email" autocomplete="email" required></div>
      </div>
      <div class="form-row">
        <div class="field"><label for="a-phone">Phone</label><input id="a-phone" name="Phone" type="tel" autocomplete="tel" required></div>
        <div class="field"><label for="a-date">Preferred date</label><input id="a-date" name="Preferred date" type="date" data-min-today required></div>
      </div>
      <div class="field"><label for="a-type">Purpose of visit</label><select id="a-type" name="Purpose"><option>Private label / wholesale discussion</option><option>Custom design consultation</option><option>View our collections</option><option>Service or repair</option><option>Other</option></select></div>
      <div class="field"><label for="a-message">Anything else?</label><textarea id="a-message" name="Notes" rows="4" placeholder="Optional details..."></textarea></div>
      <button class="btn btn--gold" type="submit">Request appointment ${icon.arrow}</button>
      <p class="form-status" role="status" aria-live="polite"></p>
      <p class="form-hint">Submitting opens your email app with the details filled in, ready for you to send.</p>
    </form>
  </div>
</section>`;

/* ------------------------------ CUSTOMIZE ------------------------------ */
const customize = `
${pageHero({ eyebrow: 'Customize', title: 'A piece that is yours alone.', text: 'Bring us an idea, a sketch or simply a feeling — we will help shape it.', image: 'assets/images/slider-1.webp' })}
<section class="section">
  <div class="container">
    <div class="section__head reveal"><p class="eyebrow">Your Choices</p><h2 class="section__title">Every detail is a decision.</h2></div>
    <div class="cards cards--four">
      <article class="card reveal"><span class="card__icon">${icon.gold}</span><h3>Metal</h3><p>Choose from 14K or 18K gold, diamond settings or contemporary silver.</p></article>
      <article class="card reveal" style="--delay:.08s"><span class="card__icon">${icon.diamond}</span><h3>Stones</h3><p>Selection, matching and precision setting handled by experienced hands.</p></article>
      <article class="card reveal" style="--delay:.16s"><span class="card__icon">${icon.silver}</span><h3>Design</h3><p>Modern minimalism, heritage detail or something entirely your own.</p></article>
      <article class="card reveal" style="--delay:.24s"><span class="card__icon">${icon.arrow}</span><h3>Finish</h3><p>High polish, matte, textured or a considered combination of finishes.</p></article>
    </div>
  </div>
</section>
<section class="section section--tint">
  <div class="container">
    <div class="section__head reveal"><p class="eyebrow">The Journey</p><h2 class="section__title">From your idea to your hands.</h2></div>
    <ol class="timeline">
      <li class="timeline__item reveal"><span class="timeline__dot">01</span><div><h3>Consultation</h3><p>We listen to your brief, purpose and preferences.</p></div></li>
      <li class="timeline__item reveal" style="--delay:.08s"><span class="timeline__dot">02</span><div><h3>Sketch &amp; CAD</h3><p>Concepts are drawn and refined until the form feels right.</p></div></li>
      <li class="timeline__item reveal" style="--delay:.16s"><span class="timeline__dot">03</span><div><h3>Making</h3><p>Our artisans craft, set, check and finish the piece.</p></div></li>
      <li class="timeline__item reveal" style="--delay:.24s"><span class="timeline__dot">04</span><div><h3>Delivery</h3><p>Final quality checks, careful packing and handover.</p></div></li>
    </ol>
  </div>
</section>
<section class="section">
  <div class="container">
    <form class="form-card form-card--wide reveal" data-mailto data-subject="Custom design request" novalidate>
      <p class="eyebrow">Start a commission</p>
      <h2 class="form-card__title">Describe the piece you have in mind.</h2>
      <div class="form-row">
        <div class="field"><label for="u-name">Full name</label><input id="u-name" name="Name" type="text" autocomplete="name" required></div>
        <div class="field"><label for="u-email">Email address</label><input id="u-email" name="Email" type="email" autocomplete="email" required></div>
      </div>
      <div class="form-row">
        <div class="field"><label for="u-metal">Preferred metal</label><select id="u-metal" name="Preferred metal"><option>14K gold</option><option>18K gold</option><option>Silver</option><option>Diamond setting</option><option>Not sure yet</option></select></div>
        <div class="field"><label for="u-budget">Indicative budget</label><select id="u-budget" name="Budget"><option>Under &rsquo;1,00,000</option><option>&rsquo;1,00,000 &ndash; &rsquo;5,00,000</option><option>Above &rsquo;5,00,000</option><option>To be discussed</option></select></div>
      </div>
      <div class="field"><label for="u-idea">Your idea</label><textarea id="u-idea" name="Idea" rows="5" required placeholder="Tell us about the design, occasion or inspiration..."></textarea></div>
      <button class="btn btn--gold" type="submit">Send my brief ${icon.arrow}</button>
      <p class="form-status" role="status" aria-live="polite"></p>
      <p class="form-hint">Submitting opens your email app with the details filled in, ready for you to send.</p>
    </form>
  </div>
</section>`;

/* ---------------------------- FOR BUSINESS ------------------------------ */
const business = `
${pageHero({ eyebrow: 'For Business', title: 'Manufacturing built for your brand.', text: 'Retailers, wholesalers and private labels partner with Alvee Jewels for diamond, gold and silver jewellery — made with consistent quality and clear communication.', image: 'assets/images/slider-5.webp' })}
<section class="section">
  <div class="container">
    <div class="section__head reveal">
      <p class="eyebrow">Partnership Models</p>
      <h2 class="section__title">Choose how we work together.</h2>
      <p>From ready collections to fully branded production, we shape the arrangement around your business.</p>
    </div>
    <div class="cards cards--three">
      <article class="card reveal"><span class="card__icon">${icon.diamond}</span><h3>Outright Sale</h3><p>Select from our finished diamond, gold and silver designs for your counter or online store.</p></article>
      <article class="card reveal" style="--delay:.08s"><span class="card__icon">${icon.gold}</span><h3>Private Label</h3><p>Jewellery made to your brand&rsquo;s specification, with consistent finish and presentation.</p></article>
      <article class="card reveal" style="--delay:.16s"><span class="card__icon">${icon.silver}</span><h3>Job Work</h3><p>Manufacturing support for retailers and wholesalers who supply the design or the brief.</p></article>
    </div>
  </div>
</section>

<section class="section section--tint">
  <div class="container">
    <div class="section__head reveal">
      <p class="eyebrow">What We Can Supply</p>
      <h2 class="section__title">One atelier, many formats.</h2>
      <p>Share your requirements and we will guide you on the most practical route from design to delivery.</p>
    </div>
    <div class="cards cards--four">
      <article class="card reveal"><span class="card__icon">${icon.diamond}</span><h3>Diamond</h3><p>Precision-set pieces with carefully matched stones and considered finishing.</p></article>
      <article class="card reveal" style="--delay:.06s"><span class="card__icon">${icon.gold}</span><h3>Gold</h3><p>14K and 18K formats across classic, contemporary and private-label ranges.</p></article>
      <article class="card reveal" style="--delay:.12s"><span class="card__icon">${icon.silver}</span><h3>Silver</h3><p>Everyday and fashion-led designs with the same attention to finish.</p></article>
      <article class="card reveal" style="--delay:.18s"><span class="card__icon">${icon.arrow}</span><h3>Finishing &amp; Packing</h3><p>Surface finishes, presentation and brand-ready packing discussed as part of your brief.</p></article>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section__head reveal">
      <p class="eyebrow">The Process</p>
      <h2 class="section__title">Clear steps, no surprises.</h2>
    </div>
    <ol class="timeline">
      <li class="timeline__item reveal"><span class="timeline__dot">01</span><div><h3>Share your brief</h3><p>Categories, volumes, target price, designs and branding needs.</p></div></li>
      <li class="timeline__item reveal" style="--delay:.08s"><span class="timeline__dot">02</span><div><h3>Review &amp; guidance</h3><p>We discuss feasibility, materials and the most practical production route.</p></div></li>
      <li class="timeline__item reveal" style="--delay:.16s"><span class="timeline__dot">03</span><div><h3>Sample or design approval</h3><p>Concepts, samples and finishing choices are agreed before production.</p></div></li>
      <li class="timeline__item reveal" style="--delay:.24s"><span class="timeline__dot">04</span><div><h3>Making &amp; checks</h3><p>Our artisans craft, set, finish and inspect each piece.</p></div></li>
      <li class="timeline__item reveal" style="--delay:.32s"><span class="timeline__dot">05</span><div><h3>Packing &amp; handover</h3><p>Agreed presentation and dispatch details are confirmed in writing.</p></div></li>
    </ol>
  </div>
</section>

<section class="section section--tint" id="rfq">
  <div class="container">
    <form class="form-card form-card--wide reveal" data-mailto data-subject="B2B wholesale RFQ" novalidate>
      <p class="eyebrow">Request a Quote</p>
      <h2 class="form-card__title">Tell us what your business needs.</h2>
      <p class="form-card__intro">The more detail you share, the more useful our first response will be.</p>
      <div class="form-row">
        <div class="field"><label for="b-name">Full name</label><input id="b-name" name="Name" type="text" autocomplete="name" required></div>
        <div class="field"><label for="b-company">Company / brand</label><input id="b-company" name="Company" type="text" autocomplete="organization" required></div>
      </div>
      <div class="form-row">
        <div class="field"><label for="b-email">Work email</label><input id="b-email" name="Email" type="email" autocomplete="email" required></div>
        <div class="field"><label for="b-phone">Phone / WhatsApp</label><input id="b-phone" name="Phone" type="tel" autocomplete="tel" required></div>
      </div>
      <div class="form-row">
        <div class="field"><label for="b-type">Business type</label><select id="b-type" name="Business type"><option>Retailer</option><option>Wholesaler / Distributor</option><option>Private label</option><option>Online seller</option><option>Other</option></select></div>
        <div class="field"><label for="b-market">Market / country</label><input id="b-market" name="Market" type="text" placeholder="e.g. India, UAE, UK"></div>
      </div>
      <div class="form-row">
        <div class="field"><label for="b-category">Product category</label><select id="b-category" name="Product category"><option>Diamond jewellery</option><option>Gold jewellery</option><option>Silver jewellery</option><option>Mixed categories</option><option>Not sure yet</option></select></div>
        <div class="field"><label for="b-purity">Purity / material</label><select id="b-purity" name="Purity"><option>14K gold</option><option>18K gold</option><option>925 silver</option><option>Diamond &amp; gold</option><option>To be discussed</option></select></div>
      </div>
      <div class="form-row">
        <div class="field"><label for="b-volume">Estimated monthly volume</label><select id="b-volume" name="Volume"><option>Under 50 pieces</option><option>50 &ndash; 200 pieces</option><option>201 &ndash; 500 pieces</option><option>500+ pieces</option><option>To be discussed</option></select></div>
        <div class="field"><label for="b-budget">Target price band</label><input id="b-budget" name="Target price band" type="text" placeholder="e.g. &#8377;1,500 &ndash; &#8377;3,000 per piece"></div>
      </div>
      <div class="form-row">
        <div class="field"><label for="b-branding">Branding / packaging</label><select id="b-branding" name="Branding"><option>No branding needed</option><option>Our brand</option><option>Client brand / private label</option><option>Custom packaging required</option><option>To be discussed</option></select></div>
        <div class="field"><label for="b-timeline">Target timeline</label><select id="b-timeline" name="Timeline"><option>ASAP</option><option>Within 1 month</option><option>1 &ndash; 3 months</option><option>3+ months</option><option>Exploratory</option></select></div>
      </div>
      <div class="field"><label for="b-reference">Design reference / link</label><input id="b-reference" name="Design reference" type="text" placeholder="Optional link, style name or reference number"></div>
      <div class="field"><label for="b-notes">Additional requirements</label><textarea id="b-notes" name="Requirements" rows="5" required placeholder="Share sizes, weights, stone preferences, finishing, checks or anything else we should know..."></textarea></div>
      <button class="btn btn--gold" type="submit">Send RFQ ${icon.arrow}</button>
      <p class="form-status" role="status" aria-live="polite"></p>
      <p class="form-hint">Submitting opens your email app with the details filled in, ready for you to send. Prices and terms are confirmed separately in writing.</p>
    </form>
  </div>
</section>

<section class="section">
  <div class="container faq-layout">
    <div class="faq-intro reveal">
      <p class="eyebrow">Good to know</p>
      <h2 class="section__title">Before you send a brief.</h2>
      <p>Nothing on this site is a binding offer. All prices, quantities and delivery terms are agreed directly with our team.</p>
      <a class="btn btn--outline" href="#rfq">Request a quote ${icon.arrow}</a>
    </div>
    <div class="faq-list">
      <details class="faq-item reveal"><summary>Do you work with private labels?<span class="faq-icon" aria-hidden="true"></span></summary><div class="faq-answer"><p>Yes. We manufacture to partner specifications under private-label arrangements and also support job-work models.</p></div></details>
      <details class="faq-item reveal" style="--delay:.05s"><summary>What should I include in an RFQ?<span class="faq-icon" aria-hidden="true"></span></summary><div class="faq-answer"><p>Product category, purity, expected volume, target price band, branding needs and any design references. The form above captures all of these.</p></div></details>
      <details class="faq-item reveal" style="--delay:.1s"><summary>Can you make pieces from our designs?<span class="faq-icon" aria-hidden="true"></span></summary><div class="faq-answer"><p>Share the design, sample or a clear written brief. We will review feasibility and confirm the production route with you.</p></div></details>
      <details class="faq-item reveal" style="--delay:.15s"><summary>Do you publish a catalogue or price list?<span class="faq-icon" aria-hidden="true"></span></summary><div class="faq-answer"><p>Please request the current line sheet and commercial terms using the catalogue button below. Current ranges and pricing are shared directly after we understand your requirements.</p></div></details>
      <details class="faq-item reveal" style="--delay:.2s"><summary>When is an order confirmed?<span class="faq-icon" aria-hidden="true"></span></summary><div class="faq-answer"><p>Only after the scope, pricing, quantities and delivery terms are confirmed in writing. Submitting an RFQ does not create a contract.</p></div></details>
    </div>
  </div>
</section>

<section class="cta-band">
  <div class="container cta-band__inner reveal">
    <div><p class="eyebrow eyebrow--light">Catalogue &amp; Terms</p><h2>Need the current line sheet?</h2></div>
    <div class="cta-band__actions">
      <a class="btn btn--gold" href="mailto:${brand.email}?subject=Catalogue%20request">Request catalogue ${icon.arrow}</a>
      <a class="btn btn--ghost" href="assets/docs/who-can-use-alvee.pdf" download="alvee-b2b-partner-guide.pdf">Download partner guide ${icon.arrow}</a>
      <a class="btn btn--ghost" href="appointment.html">Book a discussion ${icon.arrow}</a>
    </div>
  </div>
</section>`;

/* -------------------------------- FAQ ---------------------------------- */
const faq = `
${pageHero({ eyebrow: 'FAQ', title: 'Good questions, clear answers.', text: 'A few things people often ask us.', image: 'assets/images/social-banner-1.png' })}
<section class="section">
  <div class="container faq-layout">
    <div class="faq-intro reveal">
      <p class="eyebrow">Helpful to know</p>
      <h2 class="section__title">Still curious?</h2>
      <p>If you don&rsquo;t see your answer here, our team is happy to help.</p>
      <a class="btn btn--outline" href="contact.html">Ask us directly ${icon.arrow}</a>
    </div>
    <div class="faq-list">
      <details class="faq-item reveal"><summary>What do you manufacture?<span class="faq-icon" aria-hidden="true"></span></summary><div class="faq-answer"><p>We craft diamond, gold and silver jewellery, including 14K and 18K gold pieces, for retailers, wholesalers and private labels.</p></div></details>
      <details class="faq-item reveal" style="--delay:.05s"><summary>Do you work with private labels?<span class="faq-icon" aria-hidden="true"></span></summary><div class="faq-answer"><p>Yes. We manufacture to partner specifications under private-label arrangements and also support job-work models.</p></div></details>
      <details class="faq-item reveal" style="--delay:.1s"><summary>Which gold purities are available?<span class="faq-icon" aria-hidden="true"></span></summary><div class="faq-answer"><p>Our gold jewellery is crafted in 14K and 18K purity, with finishing and design handled in our own atelier.</p></div></details>
      <details class="faq-item reveal" style="--delay:.15s"><summary>Can I request a custom design?<span class="faq-icon" aria-hidden="true"></span></summary><div class="faq-answer"><p>Absolutely. Share your idea through our <a href="customize.html">Customize page</a> and we will guide it from sketch to finished piece.</p></div></details>
      <details class="faq-item reveal" style="--delay:.2s"><summary>Where is your atelier?<span class="faq-icon" aria-hidden="true"></span></summary><div class="faq-answer"><p>We are based at Plot No. M1 To M6, Gujarat Hira Bourse Gem &amp; Jewellery Park, Pal-Hazira Road, Ichchhapore, Surat, Gujarat - 394510.</p></div></details>
      <details class="faq-item reveal" style="--delay:.25s"><summary>How do I book a visit?<span class="faq-icon" aria-hidden="true"></span></summary><div class="faq-answer"><p>Use our <a href="appointment.html">Book an Appointment</a> page or call us on <a href="tel:${brand.phoneHref}">${brand.phone}</a>.</p></div></details>
      <details class="faq-item reveal" style="--delay:.3s"><summary>How will I know my enquiry reached you?<span class="faq-icon" aria-hidden="true"></span></summary><div class="faq-answer"><p>Our forms open your email app with the message ready to send. You will see a copy in your sent folder once you send it.</p></div></details>
    </div>
  </div>
</section>`;

const pages = [
  ['index.html', 'Home', 'Alvee Jewels crafts diamond, gold and silver jewellery in Surat, India — blending heritage technique with contemporary design.', home],
  ['about.html', 'About Us', 'Learn about the Alvee Jewels atelier, our heritage of craftsmanship and our standards of precision.', about],
  ['careers.html', 'Careers', 'Explore careers at Alvee Jewels and join the team behind our handcrafted diamond, gold and silver jewellery.', careers],
  ['contact.html', 'Contact Us', 'Contact Alvee Jewels in Surat, India for enquiries, partnerships, custom designs and appointments.', contact],
  ['terms.html', 'Terms and Conditions', 'Review the website terms and conditions for Alvee Jewels.', terms],
  ['customer-services.html', 'Customer Services', 'Repairs, refinishing, quality assurance, private label, job work and order support from Alvee Jewels.', services],
  ['b2b.html', 'For Business', 'B2B jewellery manufacturing partnerships for retailers, wholesalers and private labels, with a structured wholesale RFQ form.', business],
  ['appointment.html', 'Book an Appointment', 'Request a visit or a call with the Alvee Jewels atelier in Surat, India.', appointment],
  ['customize.html', 'Customize', 'Design a bespoke diamond, gold or silver jewellery piece with the artisans at Alvee Jewels.', customize],
  ['faq.html', 'FAQ', 'Answers to common questions about Alvee Jewels, our jewellery, private-label work and appointments.', faq]
];

pages.forEach(([file, title, description, body]) => {
  fs.writeFileSync(path.join(ROOT, file), layout({ file, title, description, body }), 'utf8');
});

/* SEO extras */
fs.writeFileSync(path.join(ROOT, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: https://www.elveester.com/sitemap.xml\n`, 'utf8');
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.map(([file]) => `  <url><loc>https://www.elveester.com/${file}</loc></url>`).join('\n')}\n</urlset>\n`, 'utf8');

console.log(`Generated ${pages.length} pages, robots.txt and sitemap.xml.`);
