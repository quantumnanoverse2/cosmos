import Link from "next/link";
import "./cosmos.css";

export default function Home() {
  return (
    <div className="cosmos-page-root">
      {/* ================= 1. FLOATING NAVIGATION ================= */}
      <header className="page-col nav-wrap">
        <nav className="glass nav-bar" aria-label="Main Navigation">
          <Link href="/" className="nav-brand" aria-label="COSMOS Homepage">
            <svg className="nav-logo-icon" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="9" />
              <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(-30 12 12)" />
            </svg>
            <span>COSMOS</span>
          </Link>

          <div className="nav-links">
            <Link href="/explore" className="nav-link">Explore</Link>
            <Link href="/explore/solar-system" className="nav-link">Solar System</Link>
            <Link href="/explore/exoplanets" className="nav-link">Exoplanets</Link>
            <Link href="/scanner" className="nav-link">Scanner</Link>
            <Link href="/gallery" className="nav-link">Gallery</Link>
            <Link href="/news" className="nav-link">News</Link>
            <Link href="/sandbox" className="nav-link">Sandbox</Link>
          </div>

          <Link href="/explore" className="nav-pill-action">
            Open Catalog
          </Link>
        </nav>
      </header>

      {/* ================= 2. HERO ================= */}
      <main>
        <section className="page-col hero-section">
          <div className="aura-container" aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/explore/galaxies.jpg" alt="" className="aura-image aura-hero" />
          </div>

          <span className="glass hero-pill">
            ASTRONOMICAL REPOSITORY
          </span>

          <h1 className="hero-headline">
            Explore The Observable Universe
          </h1>

          <p className="hero-subtitle">
            Journey across planetary systems, deep-space exoplanets, and astrophysical anomalies in one verified index.
          </p>

          <div className="hero-actions">
            <Link href="/explore" className="btn-primary">
              Explore Catalog
            </Link>
            <Link href="/scanner" className="btn-secondary glass">
              <span>Investigate Anomalies</span>
              <svg className="icon-chevron" viewBox="0 0 24 24" aria-hidden="true">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>
          </div>
        </section>

        {/* ================= 3. SHOWCASE ================= */}
        <section className="page-col section-spacer">
          <div className="showcase-panel">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/explore/galaxies.jpg"
              alt="High-resolution deep-space galaxy showcase exhibit"
              className="showcase-media"
            />

            <div className="glass-dark showcase-caption">
              <span className="kicker showcase-kicker">OBSERVATIONAL ASTROPHYSICS</span>
              <h2 className="showcase-title">Messier 31 &amp; Andromeda Horizon</h2>
              <p className="showcase-desc">
                A high-resolution index of celestial bodies, spectroscopic measurements, and planetary orbital parameters gathered across NASA, ESA, and international astronomical survey archives.
              </p>
              <div className="showcase-code">
                <code>v = &radic;(G &middot; M / r) &asymp; 250 km/s</code>
              </div>
            </div>
          </div>
        </section>

        {/* ================= 4. STATISTICS STRIP ================= */}
        <section className="stats-strip section-spacer" aria-label="Key Astronomical Metrics">
          <div className="page-col">
            <dl className="stats-grid">
              <div className="stat-item">
                <dd className="stat-number">5,500+</dd>
                <dt className="stat-label">Confirmed Exoplanets</dt>
              </div>
              <div className="stat-item">
                <dd className="stat-number">26</dd>
                <dt className="stat-label">Solar System Bodies</dt>
              </div>
              <div className="stat-item">
                <dd className="stat-number">6,800+</dd>
                <dt className="stat-label">NASA Mission Dispatches</dt>
              </div>
              <div className="stat-item">
                <dd className="stat-number">12.7B</dd>
                <dt className="stat-label">Years Oldest Known Planet</dt>
              </div>
            </dl>
          </div>
        </section>

        {/* ================= 5. GALLERY ================= */}
        <section className="page-col section-spacer">
          <div className="gallery-header">
            <h2 className="section-headline">Planetary &amp; Deep Space Exhibits</h2>
            <p className="section-lede">
              Curated high-resolution imagery and physical parameters from planetary exploration missions and orbital space telescopes.
            </p>
          </div>

          <div className="gallery-grid">
            {/* Tile 1: Wide */}
            <figure className="figure-tile wide">
              <div className="image-frame">
                <div className="image-wrap">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/explore/solar-system.jpg" alt="Panoramic view of the solar system planetary orbital planes" />
                  <span className="glass chip-overlay">SYS.SOLAR</span>
                </div>
              </div>
              <figcaption className="tile-body">
                <h3 className="tile-title">The Solar System Architecture</h3>
                <p className="tile-desc">Planetary structures, atmospheres, and orbital dynamics from the Sun to the Kuiper Belt.</p>
              </figcaption>
            </figure>

            {/* Tile 2 */}
            <figure className="figure-tile">
              <div className="image-frame">
                <div className="image-wrap">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/objects/earth.jpg" alt="Orbital capture of planet Earth showing continental masses and oceans" />
                  <span className="glass chip-overlay">OBJ.399</span>
                </div>
              </div>
              <figcaption className="tile-body">
                <h3 className="tile-title">Terra (Earth)</h3>
                <p className="tile-desc">The only confirmed astronomical object harboring active surface liquid water oceans.</p>
              </figcaption>
            </figure>

            {/* Tile 3 */}
            <figure className="figure-tile">
              <div className="image-frame">
                <div className="image-wrap">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/objects/jupiter.jpg" alt="Atmospheric bands and storm systems of Jupiter" />
                  <span className="glass chip-overlay">OBJ.599</span>
                </div>
              </div>
              <figcaption className="tile-body">
                <h3 className="tile-title">Jupiter System</h3>
                <p className="tile-desc">Gas giant with a mass greater than all other solar system planets combined.</p>
              </figcaption>
            </figure>

            {/* Tile 4 */}
            <figure className="figure-tile">
              <div className="image-frame">
                <div className="image-wrap">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/objects/europa.jpg" alt="Fractured ice shell of Jovian moon Europa" />
                  <span className="glass chip-overlay">SAT.502</span>
                </div>
              </div>
              <figcaption className="tile-body">
                <h3 className="tile-title">Europa Ocean World</h3>
                <p className="tile-desc">Subsurface saline ocean shielded beneath a fractured twenty-kilometer ice crust.</p>
              </figcaption>
            </figure>

            {/* Tile 5: Wide */}
            <figure className="figure-tile wide">
              <div className="image-frame">
                <div className="image-wrap">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/explore/exoplanets.jpg" alt="Artist rendering of distant extrasolar planetary system" />
                  <span className="glass chip-overlay">EXO.ARCHIVE</span>
                </div>
              </div>
              <figcaption className="tile-body">
                <h3 className="tile-title">Exoplanetary Extremes</h3>
                <p className="tile-desc">Over five thousand verified extrasolar worlds cataloged across the Milky Way.</p>
              </figcaption>
            </figure>

            {/* Tile 6 */}
            <figure className="figure-tile">
              <div className="image-frame">
                <div className="image-wrap">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/objects/mars.jpg" alt="Red terrain and polar caps of planet Mars" />
                  <span className="glass chip-overlay">OBJ.499</span>
                </div>
              </div>
              <figcaption className="tile-body">
                <h3 className="tile-title">Mars (Gale Crater)</h3>
                <p className="tile-desc">Volcanic and sedimentary terrain exhibiting episodic nocturnal methane venting.</p>
              </figcaption>
            </figure>
          </div>
        </section>

        {/* ================= 6. FEATURE ROW ================= */}
        <section className="page-col section-spacer">
          <div className="feature-card">
            <div className="feature-copy">
              <span className="kicker">ASTROPHYSICAL SIMULATION</span>
              <h2 className="section-headline">Real-Time Gravitational Mechanics</h2>
              <p className="section-lede">
                Model orbital resonance, relativistic black hole accretion discs, and galactic collisions with live N-body physics directly in your browser.
              </p>
              <div>
                <Link href="/sandbox" className="btn-primary">
                  Launch Sandbox
                </Link>
              </div>
            </div>
            <div className="feature-media-frame">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/explore/sandbox.jpg" alt="Interactive celestial gravitational particle simulation exhibit" />
            </div>
          </div>
        </section>

        {/* ================= 7. PROOF BAND ================= */}
        <section className="proof-section section-spacer">
          <div className="aura-container" aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/solar-system/sun.jpg" alt="" className="aura-image aura-proof" />
          </div>

          <div className="page-col">
            <div className="proof-header">
              <span className="small-label kicker">EMPIRICAL BENCHMARKS</span>
              <h2 className="section-headline">Scientific Grounding &amp; Precision</h2>
              <p className="section-lede">
                Every observation is anchored to peer-reviewed datasets from NASA, ESA, and international astronomical consortia.
              </p>
            </div>

            <div className="proof-grid">
              <div className="glass-dark proof-card">
                <div className="proof-figure">4.24 ly</div>
                <div className="proof-label">Proxima Centauri b</div>
                <p className="proof-sentence">
                  Humanity&apos;s closest confirmed extrasolar planet candidate located in the habitable zone of our neighboring star.
                </p>
              </div>

              <div className="glass-dark proof-card">
                <div className="proof-figure">2,400&deg;C</div>
                <div className="proof-label">Atmospheric Phase Shift</div>
                <p className="proof-sentence">
                  WASP-76b demonstrates gaseous iron vaporization on its dayside and liquid metallic condensation on its nightside.
                </p>
              </div>

              <div className="glass-dark proof-card">
                <div className="proof-figure">121.6 nm</div>
                <div className="proof-label">Lyman-Alpha Detection</div>
                <p className="proof-sentence">
                  Space telescope ultraviolet imaging confirmed episodic 200-kilometer water vapor plumes venting from Europa&apos;s fractured ice shell.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= 8. CLOSING CALL TO ACTION ================= */}
        <section className="page-col section-spacer">
          <div className="closing-wrap">
            <div className="aura-container" aria-hidden="true">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/objects/earth.jpg" alt="" className="aura-image aura-cta" />
            </div>

            <div className="glass closing-panel">
              <h2 className="section-headline">Begin Your Cosmic Survey</h2>
              <p className="closing-sentence">
                Inspect 3D planetary models, query five thousand exoplanets, and investigate real astronomical enigmas.
              </p>
              <Link href="/explore" className="btn-primary">
                Open Exploration Hub
              </Link>
            </div>
          </div>
        </section>

        {/* ================= 9. NUMBERED CARDS ================= */}
        <section className="page-col section-spacer">
          <div className="numbered-header">
            <h2 className="section-headline">Systematic Catalog Directory</h2>
            <span className="numbered-note">Structured scientific sectors</span>
          </div>

          <ol className="numbered-grid">
            <li className="numbered-card">
              <span className="card-num">01</span>
              <Link href="/explore/solar-system" className="card-title">Solar System Directory</Link>
              <p className="card-desc">
                Interactive 3D representations and physical parameters for the Sun, 8 planets, Pluto, and major moons.
              </p>
              <Link href="/explore/solar-system" className="card-link">
                <span>Explore Solar System</span>
                <svg viewBox="0 0 24 24" aria-hidden="true"><polyline points="9 18 15 12 9 6" /></svg>
              </Link>
            </li>

            <li className="numbered-card">
              <span className="card-num">02</span>
              <Link href="/explore/exoplanets" className="card-title">NASA Exoplanet Archive</Link>
              <p className="card-desc">
                Comprehensive database of over 5,500 alien worlds streamed live from the NASA Caltech TAP astronomical API.
              </p>
              <Link href="/explore/exoplanets" className="card-link">
                <span>Search Exoplanets</span>
                <svg viewBox="0 0 24 24" aria-hidden="true"><polyline points="9 18 15 12 9 6" /></svg>
              </Link>
            </li>

            <li className="numbered-card">
              <span className="card-num">03</span>
              <Link href="/scanner" className="card-title">Cosmic Mystery Scanner</Link>
              <p className="card-desc">
                Interactive scientific instrumentation array to inspect anomalies, decode evidence, and test hypotheses.
              </p>
              <Link href="/scanner" className="card-link">
                <span>Launch Scanner</span>
                <svg viewBox="0 0 24 24" aria-hidden="true"><polyline points="9 18 15 12 9 6" /></svg>
              </Link>
            </li>

            <li className="numbered-card">
              <span className="card-num">04</span>
              <Link href="/sandbox" className="card-title">Astrophysical Sandbox</Link>
              <p className="card-desc">
                Multi-mode gravitational simulator featuring supernova detonations, black holes, and galaxy mergers.
              </p>
              <Link href="/sandbox" className="card-link">
                <span>Start Simulation</span>
                <svg viewBox="0 0 24 24" aria-hidden="true"><polyline points="9 18 15 12 9 6" /></svg>
              </Link>
            </li>
          </ol>
        </section>

        {/* ================= 10. GETTING STARTED ================= */}
        <section className="page-col section-spacer">
          <div className="getting-started-band">
            <div className="getting-started-copy">
              <h2 className="section-headline">Direct Catalog Access</h2>
              <p className="section-lede">
                Access observational telemetry and catalog data directly via local CLI commands or standard REST endpoints.
              </p>
            </div>

            <div className="glass-dark terminal-block">
              <code className="terminal-line"><span className="terminal-prompt">$ </span><span className="terminal-cmd">curl -s https://cosmos-flax-gamma.vercel.app/api/exoplanets</span></code>
              <code className="terminal-line"><span className="terminal-prompt">$ </span><span className="terminal-cmd">npx cosmos inspect --object=europa --spectroscopy=uv</span></code>
              <code className="terminal-line"><span className="terminal-prompt">$ </span><span className="terminal-cmd">git clone https://github.com/quantumnanoverse2/cosmos.git</span></code>
            </div>
          </div>
        </section>
      </main>

      {/* ================= 11. FOOTER ================= */}
      <footer className="footer-section">
        <div className="page-col footer-content">
          <div>COSMOS v2.4 &bull; Open Astronomical Index &bull; MIT Licence</div>
          <nav className="footer-links" aria-label="Footer Navigation">
            <Link href="/explore" className="footer-link">Explore</Link>
            <Link href="/explore/exoplanets" className="footer-link">Exoplanets</Link>
            <Link href="/scanner" className="footer-link">Scanner</Link>
            <Link href="/gallery" className="footer-link">Gallery</Link>
            <Link href="/news" className="footer-link">News</Link>
            <Link href="/sandbox" className="footer-link">Sandbox</Link>
            <a href="https://github.com/quantumnanoverse2/cosmos" target="_blank" rel="noopener noreferrer" className="footer-link">
              GitHub
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
