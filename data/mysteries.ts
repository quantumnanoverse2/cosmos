export interface InstrumentObservation {
  id: string;
  name: string;
  instrumentType: "spectroscopy" | "thermal" | "magnetometer" | "isotope";
  description: string;
  targetMetric: string;
  initialValue: number;
  expectedRange: [number, number]; // target alignment
  unit: string;
  revealedClue: string;
  scientificContext: string;
}

export interface Hypothesis {
  id: string;
  title: string;
  summary: string;
  scientificStatus: "Supported by Observation" | "Under Active Debate" | "Contradicted by Data" | "Theoretical Scenario";
  isBestSupported: boolean;
  requiredClueIds: string[];
  explanation: string;
  unresolvedQuestions: string;
}

export interface CosmicMystery {
  id: string;
  title: string;
  subtitle: string;
  sector: "Solar System" | "Exoplanets" | "Galactic Core & Deep Space";
  frequencyBand: "Radio (1420 MHz)" | "Infrared (3.6 - 4.5 μm)" | "Ultraviolet (121 - 130 nm)" | "X-Ray / Gamma";
  frequencyGhz: number;
  statusBadge: "ESTABLISHED ASTRONOMICAL OBSERVATION" | "ACTIVE SCIENTIFIC DEBATE" | "EMPIRICAL ANOMALY";
  celestialObjectId?: string; // Links to Solar System or Exoplanet route
  celestialObjectRoute?: string;
  celestialObjectName: string;
  coordinates: string;
  discoveryBrief: string;
  historicalContext: string;
  anomalyData: {
    primarySignal: string;
    anomalyMetric: string;
    baselineComparison: string;
  };
  instruments: InstrumentObservation[];
  hypotheses: Hypothesis[];
  conclusionSummary: {
    confirmedFindings: string;
    remainingMysteries: string;
    futureMissions: string;
    significance: string;
  };
  connectedLeads: {
    leadId: string;
    leadTitle: string;
    leadDescription: string;
    targetRoute: string;
    targetObjectName: string;
  }[];
}

export const COSMIC_MYSTERIES: CosmicMystery[] = [
  {
    id: "europa-plumes",
    title: "The Cryo-Plumes of Europa",
    subtitle: "Episodic Water Vapor Eruptions Over an Alien Ocean",
    sector: "Solar System",
    frequencyBand: "Ultraviolet (121 - 130 nm)",
    frequencyGhz: 2450000,
    statusBadge: "ESTABLISHED ASTRONOMICAL OBSERVATION",
    celestialObjectId: "europa",
    celestialObjectRoute: "/explore/objects/europa",
    celestialObjectName: "Europa (Jovian Satellite)",
    coordinates: "RA 05h 42m | Dec -23° 27' (Jovian System)",
    discoveryBrief:
      "Hubble Space Telescope UV spectrographs and re-analyzed Galileo magnetometer data detected intermittent 200-kilometer-high plumes of hydrogen and oxygen erupting from Europa's fractured south polar terrain. Below its 20 km ice shell churns a global saltwater ocean containing more water than all of Earth combined.",
    historicalContext:
      "In 2012 and 2016, the Space Telescope Imaging Spectrograph observed localized Lyman-alpha auroral emissions near Europa's southern limb, matching the dissociation signature of water vapor (H₂O -> H + OH) escaping into vacuum.",
    anomalyData: {
      primarySignal: "Lyman-Alpha Auroral Emission (121.6 nm)",
      anomalyMetric: "7,000 kg/sec water vapor mass ejection rate",
      baselineComparison: "Quiet magnetospheric background without plumes",
    },
    instruments: [
      {
        id: "europa-uv-spec",
        name: "Lyman-Alpha UV Spectrogram",
        instrumentType: "spectroscopy",
        description: "Scrub the ultraviolet wavelength band to isolate hydrogen Lyman-alpha emission from solar reflection noise.",
        targetMetric: "Wavelength Alignment",
        initialValue: 110,
        expectedRange: [121, 122],
        unit: "nm",
        revealedClue: "Intense emission spike verified at 121.6 nm corresponding to dissociating H₂O molecules under electron impact.",
        scientificContext: "Electrons trapped in Jupiter's immense magnetic field collide with neutral water molecules, causing radiative decay at 121.6 nm.",
      },
      {
        id: "europa-mag-bend",
        name: "Galileo Magnetometer Field Inversion",
        instrumentType: "magnetometer",
        description: "Calibrate magnetic field rotation angle during Galileo E12 flyby to detect induced current from conductive subsurface brine.",
        targetMetric: "Field Rotation Angle",
        initialValue: 12,
        expectedRange: [78, 85],
        unit: "degrees",
        revealedClue: "Perturbation matches an induced magnetic dipole in an electrically conductive global saline liquid layer.",
        scientificContext: "A changing Jovian magnetic field induces electric currents in Europa's salty ocean, generating a secondary opposing magnetic field.",
      },
    ],
    hypotheses: [
      {
        id: "hyp-europa-ocean-plume",
        title: "Direct Hydrothermal Ocean Breach",
        summary: "Tidal flexing generates seafloor hydrothermal convection that fractures the ice shell, expelling warm brine directly into space.",
        scientificStatus: "Supported by Observation",
        isBestSupported: true,
        requiredClueIds: ["europa-uv-spec", "europa-mag-bend"],
        explanation:
          "The combination of induced magnetic field signatures (confirming a global conductive ocean) and localized high-velocity H₂O vapor vents strongly supports episodic tidal venting from deep sub-ice fractures.",
        unresolvedQuestions:
          "Whether plumes originate directly from the deep ocean floor or from shallow, perched brine pockets within the icy crust remains to be confirmed by NASA's Europa Clipper.",
      },
      {
        id: "hyp-europa-sputter",
        title: "Jovian Charged-Particle Sputtering",
        summary: "Magnetospheric plasma radiation simply erodes surface ice frost rather than erupting from an internal ocean.",
        scientificStatus: "Contradicted by Data",
        isBestSupported: false,
        requiredClueIds: ["europa-uv-spec"],
        explanation:
          "Sputtering produces a continuous, globally uniform exosphere. It cannot account for the observed localized, episodic 200 km high concentrated geysers restricted to the southern hemisphere.",
        unresolvedQuestions:
          "While sputtering accounts for Europa's thin steady-state exosphere, it fails to match the transient kilometric plume columns.",
      },
      {
        id: "hyp-europa-crust-pocket",
        title: "Pressurized Crustal Brine Reservoirs",
        summary: "Plumes originate from isolated brine pockets trapped inside the upper 5 km of the ice shell during freezing cycles.",
        scientificStatus: "Under Active Debate",
        isBestSupported: false,
        requiredClueIds: ["europa-mag-bend"],
        explanation:
          "As liquid pockets within the ice freeze and expand, internal pressure could explosively rupture the brittle surface ice without requiring a direct channel to the bottom of the 20 km ice shell.",
        unresolvedQuestions:
          "Radar sounding by the Europa Clipper mission (arriving 2030) will map internal ice reflections to definitively resolve the conduit depth.",
      },
    ],
    conclusionSummary: {
      confirmedFindings:
        "Europa possesses an internal liquid saltwater ocean verified by induced magnetic dipole fields, with localized cryovolcanic water vapor venting into space.",
      remainingMysteries:
        "The exact depth of plume sources (shallow brine lakes vs. deep ocean vents) and whether organic prebiotic molecules are carried in the spray.",
      futureMissions:
        "NASA's Europa Clipper (launched 2024, arriving 2030) carries the SUDA dust analyzer and MASPEX spectrometer to fly directly through the plumes.",
      significance:
        "Europa represents our solar system's premier candidate for an extraterrestrial habitable biosphere sustained by hydrothermal chemical energy rather than sunlight.",
    },
    connectedLeads: [
      {
        leadId: "wasp76-iron-rain",
        leadTitle: "Exoplanetary Condensation Extremes (WASP-76b)",
        leadDescription: "If Europa exhibits extreme cold-temperature cryo-condensation, investigate how atmospheric phase changes behave at 2,400°C on ultra-hot exoplanets.",
        targetRoute: "/explore/exoplanets",
        targetObjectName: "WASP-76b",
      },
      {
        leadId: "mars-methane-surge",
        leadTitle: "Active Volatile Outgassing on Mars & Titan",
        leadDescription: "Compare Europa's cryo-volatiles to the seasonal atmospheric methane surges detected at Gale Crater on Mars.",
        targetRoute: "/explore/objects/mars",
        targetObjectName: "Mars",
      },
    ],
  },
  {
    id: "wasp76-iron-rain",
    title: "The Iron Rain of WASP-76b",
    subtitle: "Vaporized Metallic Clouds and Asymmetric Atmospheric Condensation",
    sector: "Exoplanets",
    frequencyBand: "Infrared (3.6 - 4.5 μm)",
    frequencyGhz: 75000,
    statusBadge: "ESTABLISHED ASTRONOMICAL OBSERVATION",
    celestialObjectId: "wasp-76b",
    celestialObjectRoute: "/explore/exoplanets",
    celestialObjectName: "WASP-76b (Ultra-Hot Jupiter)",
    coordinates: "RA 01h 46m | Dec +02° 42' (Pisces)",
    discoveryBrief:
      "High-resolution ESPRESSO transmission spectrograph observations on ESO's Very Large Telescope revealed a dramatic atmospheric asymmetry: neutral iron vapor (Fe I) is overwhelmingly present along the evening terminator, but completely absent from the morning terminator.",
    historicalContext:
      "WASP-76b is tidally locked to its F-type host star. Its permanent day-side reaches 2,400°C—hot enough to vaporize elemental metals. Global thermal winds exceed 18,000 km/h, sweeping vaporized iron toward the cooler 1,500°C night-side.",
    anomalyData: {
      primarySignal: "Neutral Atomic Iron (Fe I) 372.0 - 516.7 nm absorption lines",
      anomalyMetric: "100% morning/evening terminator line depth deficit",
      baselineComparison: "Symmetric transit chord model of uniform atmospheric composition",
    },
    instruments: [
      {
        id: "wasp-spec-iron",
        name: "ESPRESSO High-Resolution Iron Spectrogram",
        instrumentType: "spectroscopy",
        description: "Align the high-dispersion optical cross-correlation template to neutral atomic iron absorption transitions.",
        targetMetric: "Doppler Velocity Shift",
        initialValue: -45,
        expectedRange: [-11, -9],
        unit: "km/s",
        revealedClue: "Blue-shifted absorption of -10 km/s on the trailing limb confirms atmospheric winds blowing iron vapor from day to night.",
        scientificContext: "Ultra-fast atmospheric jet streams carry vaporized heavy metals across the day-night boundary with detectable Doppler blueshift.",
      },
      {
        id: "wasp-thermal-gradient",
        name: "Day-to-Night Thermal Boundary Calibrator",
        instrumentType: "thermal",
        description: "Scrub temperature profile at the substellar boundary to identify the liquid-gas condensation threshold for iron.",
        targetMetric: "Condensation Temperature",
        initialValue: 2200,
        expectedRange: [1500, 1600],
        unit: "°C",
        revealedClue: "Atmospheric temperatures drop below 1,550°C at the nightside boundary, triggering instantaneous metallic phase transition into liquid droplets.",
        scientificContext: "Below 1,800 K (1,527°C), iron vapor condenses into liquid iron droplets and precipitation clouds.",
      },
    ],
    hypotheses: [
      {
        id: "hyp-wasp-iron-condensation",
        title: "Atmospheric Metallic Rainout",
        summary: "Iron vaporizes on the 2,400°C day-side, gets blown eastward across the evening terminator, and condenses into liquid iron rain on the night-side.",
        scientificStatus: "Supported by Observation",
        isBestSupported: true,
        requiredClueIds: ["wasp-spec-iron", "wasp-thermal-gradient"],
        explanation:
          "The Doppler blueshift confirming eastward wind transport combined with the steep thermal drop past the 1,550°C iron condensation point provides conclusive evidence that iron gas condenses and precipitates out on the dark hemisphere.",
        unresolvedQuestions:
          "Whether convective updrafts on the nightside can re-evaporate or recycle the fallen iron back into the upper atmosphere over long planetary timescales.",
      },
      {
        id: "hyp-wasp-photodissociation",
        title: "Morning Ionization Shadowing",
        summary: "Iron is still present on the morning limb but is invisible because stellar UV has converted all neutral Fe I into ionized Fe II.",
        scientificStatus: "Contradicted by Data",
        isBestSupported: false,
        requiredClueIds: ["wasp-spec-iron"],
        explanation:
          "Recent follow-up surveys with Gemini North specifically searched for ionized Fe II transitions on the morning terminator and failed to find compensatory ion signatures, confirming true elemental depletion.",
        unresolvedQuestions:
          "Ionization models alone cannot explain the simultaneous absence of both neutral and low-ionization state iron.",
      },
      {
        id: "hyp-wasp-silicate-clouds",
        title: "Silicate Cloud Masking",
        summary: "High-altitude refractory silicate clouds simply obscure the morning limb, physically blocking transmission light.",
        scientificStatus: "Under Active Debate",
        isBestSupported: false,
        requiredClueIds: ["wasp-thermal-gradient"],
        explanation:
          "While silicate clouds (enstatite/forsterite) do form on the cooler limb, they would produce a broad gray continuum rather than selectively erasing sharp metallic lines while preserving other molecular features.",
        unresolvedQuestions:
          "James Webb Space Telescope transmission spectra are analyzing cloud deck opacity to separate cloud masking from chemical condensation.",
      },
    ],
    conclusionSummary: {
      confirmedFindings:
        "WASP-76b undergoes genuine meteorological metal cycles where vaporized iron precipitates as liquid raindrops across its tidally locked dark hemisphere.",
      remainingMysteries:
        "Whether other heavy refractory elements like titanium, calcium, and vanadium follow identical condensation cycles, and how deep the iron rain sinks.",
      futureMissions:
        "Ongoing James Webb Space Telescope Cycle 3 phase curve observations and upcoming European Ariel atmospheric surveyor (launching 2029).",
      significance:
        "Demonstrates that exoplanet atmospheres operate under exotic thermodynamic regimes completely unlike any planet in our Solar System.",
    },
    connectedLeads: [
      {
        leadId: "psr-methuselah-pulse",
        leadTitle: "Relativistic Compact Objects & Pulsar Planets (PSR B1620-26 b)",
        leadDescription: "Investigate how planets survive in extreme stellar environments, such as ancient gas worlds orbiting dead neutron stars.",
        targetRoute: "/explore/exoplanets",
        targetObjectName: "PSR B1620-26 b",
      },
      {
        leadId: "mars-methane-surge",
        leadTitle: "Atmospheric Chemical Puzzles Closer to Home",
        leadDescription: "Transition from exoplanetary iron rain to the mysterious seasonal methane peaks measured on Mars by Curiosity.",
        targetRoute: "/explore/objects/mars",
        targetObjectName: "Mars",
      },
    ],
  },
  {
    id: "psr-methuselah-pulse",
    title: "The Methuselah Pulsar Clock Anomaly",
    subtitle: "A 12.7-Billion-Year-Old Planet Orbiting a Dead Star",
    sector: "Galactic Core & Deep Space",
    frequencyBand: "Radio (1420 MHz)",
    frequencyGhz: 1.42,
    statusBadge: "ESTABLISHED ASTRONOMICAL OBSERVATION",
    celestialObjectId: "psr-b1620-26b",
    celestialObjectRoute: "/explore/exoplanets",
    celestialObjectName: "PSR B1620-26 b (Methuselah)",
    coordinates: "RA 16h 23m 38s | Dec -26° 31' 54'' (Globular Cluster M4)",
    discoveryBrief:
      "Millisecond pulsar PSR B1620-26 rotates 90 times per second with atomic-clock precision. Radio astronomers at Jodrell Bank and Parkes detected periodic timing delays that revealed not one, but two orbiting companions: a white dwarf star and a massive gas giant planet formed 12.7 billion years ago.",
    historicalContext:
      "Formed just 1 billion years after the Big Bang, Methuselah survived the supernova death of its original host star, subsequent capture by a neutron star in the crowded core of globular cluster Messier 4, and billions of years of stellar gravitational interactions.",
    anomalyData: {
      primarySignal: "Pulsar Pulse Time-of-Arrival (TOA) Residuals",
      anomalyMetric: "Multi-decade sinusoidal timing shift with ~100-year orbital period",
      baselineComparison: "Constant spin-down curve of isolated millisecond pulsar",
    },
    instruments: [
      {
        id: "psr-timing-drift",
        name: "Pulsar Timing Array TOA Demodulator",
        instrumentType: "magnetometer",
        description: "Filter out pulsar rotational spin-down to isolate gravitational tugs from sub-stellar companions.",
        targetMetric: "Pulse Period Precision",
        initialValue: 15,
        expectedRange: [11.0, 11.2],
        unit: "ms",
        revealedClue: "Pulse period of exactly 11.075 milliseconds fluctuates cyclically due to barycentric reflex motion.",
        scientificContext: "Planetary mass causes the pulsar to wobble along the line of sight, shortening or lengthening the travel time of radio pulses.",
      },
      {
        id: "psr-orbital-drift",
        name: "Decadal Timing Residual Residual Filter",
        instrumentType: "spectroscopy",
        description: "Scrub through 30 years of radio timing residuals to confirm the planetary second derivative of spin frequency.",
        targetMetric: "Residual Curvature",
        initialValue: 120,
        expectedRange: [98, 104],
        unit: "yr cycle",
        revealedClue: "Confirmed ~100-year orbital period of a companion with approximately 2.5 Jupiter masses.",
        scientificContext: "Long-baseline radio timing spanning decades reveals outer planetary acceleration that cannot be mimicked by stellar flares.",
      },
    ],
    hypotheses: [
      {
        id: "hyp-psr-hierarchical-triple",
        title: "Hierarchical Stellar-Planetary Triple",
        summary: "The planet originally orbited a main-sequence star, which was gravitationally captured by the neutron star, swapping partners and leaving the planet in a circumbinary orbit.",
        scientificStatus: "Supported by Observation",
        isBestSupported: true,
        requiredClueIds: ["psr-timing-drift", "psr-orbital-drift"],
        explanation:
          "Hubble Space Telescope observations confirmed the white dwarf companion's mass, leaving the residual gravitational wobble precisely explained by a 2.5 Jupiter-mass planet formed in the universe's primordial era.",
        unresolvedQuestions:
          "How planetary accretion occurred so rapidly in an ancient stellar environment with less than 5% of our Sun's heavy metal abundance (metallicity).",
      },
      {
        id: "hyp-psr-spin-noise",
        title: "Internal Neutron Star Glitch Noise",
        summary: "The timing residual is not a planet, but internal superfluid vortex unpinning (pulsar timing noise) inside the neutron star crust.",
        scientificStatus: "Contradicted by Data",
        isBestSupported: false,
        requiredClueIds: ["psr-timing-drift"],
        explanation:
          "Internal neutron star glitches cause abrupt spin-up events followed by quasi-exponential recovery, totally inconsistent with the smooth, coherent 30-year sinusoidal reflex oscillation observed.",
        unresolvedQuestions:
          "Millisecond pulsars are exceptionally stable rotators and rarely exhibit substantial glitch noise.",
      },
      {
        id: "hyp-psr-free-floater",
        title: "Dynamical Cluster Rogue Capture",
        summary: "The planet was a free-floating rogue planet captured from the dense core of globular cluster M4 during a recent close stellar passage.",
        scientificStatus: "Under Active Debate",
        isBestSupported: false,
        requiredClueIds: ["psr-orbital-drift"],
        explanation:
          "While dynamically possible in dense clusters, the probability of capturing a rogue planet into a nearly circular circumbinary orbit without ejecting the white dwarf is less than 0.1%.",
        unresolvedQuestions:
          "N-body simulations indicate exchange interactions during binary-single encounters are vastly more probable than rogue capture.",
      },
    ],
    conclusionSummary: {
      confirmedFindings:
        "PSR B1620-26 b is the oldest verified exoplanet in the known universe, demonstrating that planet formation began within the first billion years of cosmic history.",
      remainingMysteries:
        "The mechanisms that allowed giant gas planets to form in extremely low-metallicity primordial environments.",
      futureMissions:
        "Next-generation radio observatories like the Square Kilometre Array (SKA) will detect dozens of additional pulsar planets across galactic globular clusters.",
      significance:
        "Proves that planets are not exclusive to recent metal-rich star generations, and that worlds have existed across almost the entire history of the cosmos.",
    },
    connectedLeads: [
      {
        leadId: "europa-plumes",
        leadTitle: "Ocean Habitability in the Local Solar System (Europa)",
        leadDescription: "Explore how life-sustaining environments compare between primordial deep-space worlds and our local Jovian moons.",
        targetRoute: "/explore/objects/europa",
        targetObjectName: "Europa",
      },
      {
        leadId: "mars-methane-surge",
        leadTitle: "The Mystery of Martian Atmospheric Spikes",
        leadDescription: "Investigate unexplained seasonal atmospheric methane spikes measured by NASA rovers on Mars.",
        targetRoute: "/explore/objects/mars",
        targetObjectName: "Mars",
      },
    ],
  },
  {
    id: "mars-methane-surge",
    title: "The Ephemeral Methane Spikes of Mars",
    subtitle: "Curiosity Rover's Unexplained Atmospheric Surges",
    sector: "Solar System",
    frequencyBand: "Infrared (3.6 - 4.5 μm)",
    frequencyGhz: 90000,
    statusBadge: "ACTIVE SCIENTIFIC DEBATE",
    celestialObjectId: "mars",
    celestialObjectRoute: "/explore/objects/mars",
    celestialObjectName: "Mars (Gale Crater)",
    coordinates: "RA 04h 35m | Dec +16° 30' (Martian Surface: Gale Crater)",
    discoveryBrief:
      "NASA's Curiosity rover's Tunable Laser Spectrometer (TLS) measured background atmospheric methane at 0.4 parts per billion (ppb), but detected episodic tenfold surges reaching 21 ppb that peak during Martian summer nights. Paradoxically, the ExoMars Trace Gas Orbiter in orbit above detects virtually zero methane in the upper atmosphere.",
    historicalContext:
      "Because methane is photochemically broken down by solar ultraviolet radiation over roughly 300 years, any methane present in the Martian atmosphere today must have been released recently. Whether the source is biological (methanogenic microbes) or geological (serpentinization) remains one of planetary science's greatest puzzles.",
    anomalyData: {
      primarySignal: "Methane (CH₄) 3.27 μm absorption band surge",
      anomalyMetric: "Peak abundance of 21.0 ppb vs 0.4 ppb seasonal baseline",
      baselineComparison: "Trace Gas Orbiter orbital detection limit (< 0.05 ppb)",
    },
    instruments: [
      {
        id: "mars-tls-ch4",
        name: "Curiosity SAM/TLS Infrared Laser Spectrometer",
        instrumentType: "spectroscopy",
        description: "Tune the infrared laser cavity to the ro-vibrational absorption line of methane at 3,270 nm.",
        targetMetric: "Absorption Laser Tuner",
        initialValue: 3220,
        expectedRange: [3268, 3272],
        unit: "nm",
        revealedClue: "Clear absorption dip confirms genuine presence of methane gas plumes directly above the crater regolith.",
        scientificContext: "SAM's Herriott cell laser bounces light over 16.8 meters to detect trace atmospheric gases down to parts per trillion.",
      },
      {
        id: "mars-diurnal-boundary",
        name: "Planetary Boundary Layer Thermal Sensor",
        instrumentType: "thermal",
        description: "Analyze the diurnal atmospheric boundary layer collapse during Martian night vs daytime thermal convection.",
        targetMetric: "Boundary Layer Height",
        initialValue: 800,
        expectedRange: [180, 250],
        unit: "meters",
        revealedClue: "Nighttime atmospheric boundary layer shrinks to ~200m, trapping micro-seepages near the ground before daytime convection dilutes it below orbital detection limits.",
        scientificContext: "Explains the paradox between surface rover spikes (measured at night) and orbital non-detections (measured during sunlit day).",
      },
    ],
    hypotheses: [
      {
        id: "hyp-mars-serpentinization",
        title: "Subsurface Serpentinization & Clathrate Release",
        summary: "Liquid water reacts with olivine-rich mantle rocks deep below ground, producing hydrogen and methane that becomes trapped in ice clathrates and vents when warmed.",
        scientificStatus: "Supported by Observation",
        isBestSupported: true,
        requiredClueIds: ["mars-tls-ch4", "mars-diurnal-boundary"],
        explanation:
          "Geochemical reactions (serpentinization) in warm hydrothermal zones miles beneath the surface can continuously generate methane without requiring active biology. Seasonal soil warming allows trapped gas to seep through faults in Gale Crater.",
        unresolvedQuestions:
          "Why methane disappears from the atmosphere 1,000 times faster than known photochemical loss rates can account for.",
      },
      {
        id: "hyp-mars-microbial",
        title: "Subsurface Methanogenic Biosphere",
        summary: "Extremophilic microorganisms living in deep subterranean water aquifers metabolize hydrogen and produce seasonal bursts of biogenic methane.",
        scientificStatus: "Under Active Debate",
        isBestSupported: false,
        requiredClueIds: ["mars-tls-ch4"],
        explanation:
          "On Earth, over 95% of atmospheric methane is produced by microbial life. Deep underground aquifers on Mars could theoretically harbor chemolithoautotrophic methanogens shielded from cosmic radiation.",
        unresolvedQuestions:
          "Requires carbon-12 / carbon-13 isotopic ratio verification or direct biomarker detection (which future sample return missions aim to measure).",
      },
      {
        id: "hyp-mars-instrument-artifact",
        title: "Rover Outgassing Artifact",
        summary: "The detected methane is merely terrestrial contamination outgassing from Curiosity's onboard seals and motors.",
        scientificStatus: "Contradicted by Data",
        isBestSupported: false,
        requiredClueIds: ["mars-tls-ch4"],
        explanation:
          "Curiosity scientists performed extensive blank chamber tests and verified that the methane spikes correlate strictly with seasonal atmospheric pressure cycles and wind direction, disproving terrestrial contamination.",
        unresolvedQuestions:
          "Stringent positive-control and evacuated-cell experiments confirmed the methane is ambient Martian gas.",
      },
    ],
    conclusionSummary: {
      confirmedFindings:
        "Methane is genuinely present in Gale Crater with dramatic nocturnal spikes, reconciled with orbital non-detections via diurnal boundary layer trapping.",
      remainingMysteries:
        "The fast destruction mechanism that cleanses methane from the atmosphere, and whether the primary source is abiotic water-rock chemistry or living subterranean microbes.",
      futureMissions:
        "NASA-ESA Mars Sample Return and future specialized surface trace-gas isotopic mass spectrometers.",
      significance:
        "Whether biological or geological, active methane confirms that Mars is not a dead world, but remains geochemically or astrobiologically dynamic today.",
    },
    connectedLeads: [
      {
        leadId: "europa-plumes",
        leadTitle: "Deep Saline Oceans of Europa",
        leadDescription: "If water-rock reactions occur on Mars, examine whether similar serpentinization happens at the rocky floor of Europa's ocean.",
        targetRoute: "/explore/objects/europa",
        targetObjectName: "Europa",
      },
      {
        leadId: "wasp76-iron-rain",
        leadTitle: "Atmospheric Mysteries of Alien Exoworlds (WASP-76b)",
        leadDescription: "Contrast Mars' thin trace atmosphere with the crushing, iron-raining skies of ultra-hot exoplanets.",
        targetRoute: "/explore/exoplanets",
        targetObjectName: "WASP-76b",
      },
    ],
  },
];
