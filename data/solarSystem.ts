export interface SolarSystemObject {
  id: string;
  name: string;
  tagline: string;
  heroImage: string;
  textureUrl: string;
  quickFacts: {
    type: string;
    radius: string;
    mass: string;
    gravity: string;
    temperature: string;
    orbitalPeriod: string;
    dayLength: string;
  };
  overview: string;
  formation: string;
  structure: string;
  surface: string;
  atmosphere?: string;
  moons?: string;
  missions: string[];
  interestingFacts: string[];
}

export const solarSystemObjects: Record<string, SolarSystemObject> = {
  "sun": {
    id: "sun",
    name: "The Sun",
    tagline: "The heart of our solar system",
    heroImage: "/solar-system/sun.jpg",
    textureUrl: "/textures/sun.jpg",
    quickFacts: {
      type: "Yellow Dwarf Star (G2V)",
      radius: "696,340 km",
      mass: "1.989 × 10^30 kg (333,000 Earths)",
      gravity: "274 m/s²",
      temperature: "5,500 °C (Surface) / 15M °C (Core)",
      orbitalPeriod: "230 million years (around Milky Way)",
      dayLength: "27 Earth days (at equator)",
    },
    overview: "The Sun is a yellow dwarf star at the center of our solar system. Its gravity holds the solar system together, keeping everything from the biggest planets to the smallest particles of debris in its orbit.",
    formation: "Formed approximately 4.6 billion years ago from the gravitational collapse of matter within a region of a large molecular cloud. Most of this matter gathered in the center, whereas the rest flattened into an orbiting disk that became the solar system.",
    structure: "The Sun has a core, radiative zone, and convective zone. It generates energy via nuclear fusion of hydrogen nuclei into helium in its core, releasing immense amounts of energy.",
    surface: "The Sun doesn't have a solid surface. The part we can see is the photosphere, which constantly erupts with sunspots, solar flares, and coronal mass ejections.",
    atmosphere: "The solar atmosphere consists of the chromosphere, transition region, and the corona, which extends millions of kilometers into space.",
    missions: ["Parker Solar Probe (NASA)", "Solar Orbiter (ESA)", "SOHO (ESA/NASA)"],
    interestingFacts: [
      "The Sun accounts for 99.86% of the mass in the solar system.",
      "One million Earths could fit inside the Sun.",
      "Light from the Sun takes 8 minutes and 20 seconds to reach Earth."
    ]
  },
  "earth": {
    id: "earth",
    name: "Earth",
    tagline: "Our home planet",
    heroImage: "/objects/earth.jpg",
    textureUrl: "/textures/earth.jpg",
    quickFacts: {
      type: "Terrestrial Planet",
      radius: "6,371 km",
      mass: "5.97 × 10^24 kg",
      gravity: "9.8 m/s²",
      temperature: "15 °C (Average)",
      orbitalPeriod: "365.25 days",
      dayLength: "24 hours",
    },
    overview: "Earth is the third planet from the Sun and the only astronomical object known to harbor life. It is an ocean planet, with water covering 71% of its surface.",
    formation: "Earth formed over 4.5 billion years ago from the solar nebula. Gravity pulled swirling gas and dust in to become the third planet from the Sun.",
    structure: "Earth consists of a solid iron inner core, a liquid iron outer core, a thick rocky mantle, and a thin rocky crust.",
    surface: "The surface is dynamic, characterized by shifting tectonic plates, massive oceans, mountain ranges, and diverse ecosystems.",
    atmosphere: "Earth's atmosphere is 78% nitrogen, 21% oxygen, and 1% other ingredients—the perfect balance to breathe and live.",
    moons: "Earth has one natural satellite, The Moon, which stabilizes our planet's wobble and drives the tides.",
    missions: ["Thousands of satellites", "International Space Station", "Artemis (upcoming)"],
    interestingFacts: [
      "Earth is the only planet not named after a mythological god or goddess.",
      "Earth is the densest planet in the Solar System.",
      "The planet's rotation is gradually slowing down."
    ]
  },
  "jupiter": {
    id: "jupiter",
    name: "Jupiter",
    tagline: "The King of the Planets",
    heroImage: "/objects/jupiter.jpg",
    textureUrl: "/textures/jupiter.jpg",
    quickFacts: {
      type: "Gas Giant",
      radius: "69,911 km",
      mass: "1.898 × 10^27 kg (318 Earths)",
      gravity: "24.79 m/s²",
      temperature: "-110 °C (Cloud top)",
      orbitalPeriod: "11.86 Earth years",
      dayLength: "9.93 hours",
    },
    overview: "Jupiter is the fifth planet from the Sun and the largest in the Solar System. It is a gas giant with a mass more than two and a half times that of all the other planets in the Solar System combined.",
    formation: "Jupiter took shape when the rest of the solar system formed about 4.5 billion years ago, when gravity pulled swirling gas and dust in to become this gas giant.",
    structure: "Jupiter is made mostly of hydrogen and helium. Under the atmosphere, there is a vast ocean of liquid metallic hydrogen, and it may have a central core of solid material.",
    surface: "As a gas giant, Jupiter doesn't have a true solid surface. The planet is mostly swirling gases and liquids.",
    atmosphere: "Jupiter's atmosphere is famous for its Great Red Spot, a giant storm that has raged for hundreds of years. The atmosphere features deep bands of clouds driven by powerful winds.",
    moons: "Jupiter has 95 recognized moons, including the four large Galilean moons: Io, Europa, Ganymede, and Callisto.",
    missions: ["Juno (NASA)", "Galileo (NASA)", "Voyager 1 & 2 (NASA)", "JUICE (ESA - en route)"],
    interestingFacts: [
      "Jupiter has the shortest day in the solar system.",
      "The Great Red Spot is big enough to swallow Earth completely.",
      "Jupiter actually has very faint rings made of dust."
    ]
  },
  "mercury": {
    id: "mercury",
    name: "Mercury",
    tagline: "The swiftest planet",
    heroImage: "/objects/mercury.jpg",
    textureUrl: "/textures/mercury.jpg",
    quickFacts: { type: "Terrestrial Planet", radius: "2,439 km", mass: "3.30 × 10^23 kg", gravity: "3.7 m/s²", temperature: "430 °C to -180 °C", orbitalPeriod: "88 days", dayLength: "59 Earth days" },
    overview: "Mercury is the smallest planet in our solar system and nearest to the Sun.",
    formation: "Formed about 4.5 billion years ago when gravity pulled swirling gas and dust together.",
    structure: "Mercury has a large metallic core with a radius of about 2,074 kilometers, surrounded by a rocky mantle and solid crust.",
    surface: "Resembles Earth's Moon, scarred by many impact craters resulting from collisions with meteoroids and comets.",
    atmosphere: "Mercury has a thin exosphere made up of atoms blasted off the surface by the solar wind and striking micrometeoroids.",
    missions: ["Mariner 10 (NASA)", "MESSENGER (NASA)", "BepiColombo (ESA/JAXA)"],
    interestingFacts: ["Your weight on Mercury would be 38% of your weight on Earth.", "A day on the surface of Mercury lasts 176 Earth days."]
  },
  "venus": {
    id: "venus",
    name: "Venus",
    tagline: "Earth's toxic twin",
    heroImage: "/objects/venus.jpg",
    textureUrl: "/textures/venus.jpg",
    quickFacts: { type: "Terrestrial Planet", radius: "6,051 km", mass: "4.86 × 10^24 kg", gravity: "8.87 m/s²", temperature: "475 °C", orbitalPeriod: "225 days", dayLength: "243 Earth days" },
    overview: "Venus is the second planet from the Sun and is Earth's closest planetary neighbor. It's one of the four inner, terrestrial planets, and it's often called Earth's twin.",
    formation: "Formed approximately 4.5 billion years ago. It shares a similar size, mass, proximity to the Sun, and bulk composition as Earth.",
    structure: "Venus is made up of a central iron core, a rocky mantle, and a silicate crust.",
    surface: "The surface is a rusty color and it's peppered with intensely crunched mountains and thousands of large volcanoes.",
    atmosphere: "Its thick atmosphere is full of the greenhouse gas carbon dioxide, and it has clouds of sulfuric acid.",
    missions: ["Magellan (NASA)", "Venus Express (ESA)", "Akatsuki (JAXA)"],
    interestingFacts: ["Venus spins backward compared to most other planets.", "It is the hottest planet in our solar system."]
  },
  "mars": {
    id: "mars",
    name: "Mars",
    tagline: "The Red Planet",
    heroImage: "/textures/mars.jpg",
    textureUrl: "/textures/mars.jpg",
    quickFacts: { type: "Terrestrial Planet", radius: "3,389 km", mass: "6.41 × 10^23 kg", gravity: "3.72 m/s²", temperature: "-60 °C (Average)", orbitalPeriod: "687 days", dayLength: "24.6 hours" },
    overview: "Mars is the fourth planet from the Sun, a dusty, cold, desert world with a very thin atmosphere.",
    formation: "Formed about 4.5 billion years ago. Early in its history, Mars was much warmer and wetter.",
    structure: "Mars has a dense core, surrounded by a rocky mantle and a solid crust.",
    surface: "Characterized by its red color (due to iron oxide), massive volcanoes like Olympus Mons, and deep canyons like Valles Marineris.",
    atmosphere: "A thin atmosphere made mostly of carbon dioxide, argon, and nitrogen.",
    moons: "Mars has two small, irregularly shaped moons: Phobos and Deimos.",
    missions: ["Curiosity (NASA)", "Perseverance (NASA)", "Mars Express (ESA)"],
    interestingFacts: ["Mars is home to the highest mountain in the solar system, Olympus Mons.", "Sunsets on Mars are blue."]
  },
  "saturn": {
    id: "saturn",
    name: "Saturn",
    tagline: "The jewel of the solar system",
    heroImage: "/objects/saturn.jpg",
    textureUrl: "/textures/saturn.jpg",
    quickFacts: { type: "Gas Giant", radius: "58,232 km", mass: "5.68 × 10^26 kg", gravity: "10.44 m/s²", temperature: "-140 °C", orbitalPeriod: "29.4 Earth years", dayLength: "10.7 hours" },
    overview: "Saturn is the sixth planet from the Sun and the second-largest in the Solar System. Adorned with a dazzling, complex system of icy rings.",
    formation: "Took shape about 4.5 billion years ago, grabbing the majority of the leftover mass after the Sun's creation.",
    structure: "Like Jupiter, Saturn is made mostly of hydrogen and helium.",
    surface: "As a gas giant, Saturn doesn't have a true surface. The planet is mostly swirling gases and liquids.",
    atmosphere: "The atmosphere is layered, with fierce winds moving at 1,800 km/h in the upper atmosphere.",
    moons: "Saturn has 146 recognized moons, including the four large Galilean moons: Titan, which has its own thick atmosphere.",
    missions: ["Cassini-Huygens (NASA/ESA)", "Voyager 1 & 2 (NASA)"],
    interestingFacts: ["Saturn is the only planet less dense than water. If you could find a bathtub big enough, Saturn would float.", "Saturn's rings are made of chunks of ice and rock."]
  },
  "uranus": {
    id: "uranus",
    name: "Uranus",
    tagline: "The sideways planet",
    heroImage: "/objects/uranus.jpg",
    textureUrl: "/textures/uranus.jpg",
    quickFacts: { type: "Ice Giant", radius: "25,362 km", mass: "8.68 × 10^25 kg", gravity: "8.69 m/s²", temperature: "-195 °C", orbitalPeriod: "84 Earth years", dayLength: "17 hours" },
    overview: "Uranus is the seventh planet from the Sun, featuring the third-largest planetary radius and fourth-largest planetary mass.",
    formation: "Formed 4.5 billion years ago. An Earth-sized core is surrounded by an icy fluid of water, methane, and ammonia.",
    structure: "An ice giant, meaning its mass is mostly made up of a hot, dense fluid of 'icy' materials above a small rocky core.",
    surface: "No true solid surface.",
    atmosphere: "Its atmosphere is mostly hydrogen and helium, with a small amount of methane (which makes it blue).",
    moons: "Uranus has 27 known moons.",
    missions: ["Voyager 2 (NASA)"],
    interestingFacts: ["Uranus rotates on its side, an anomaly likely caused by a massive collision in its past.", "It is the coldest planetary atmosphere in the Solar System."]
  },
  "neptune": {
    id: "neptune",
    name: "Neptune",
    tagline: "The windy, blue world",
    heroImage: "/objects/neptune.jpg",
    textureUrl: "/textures/neptune.jpg",
    quickFacts: { type: "Ice Giant", radius: "24,622 km", mass: "1.02 × 10^26 kg", gravity: "11.15 m/s²", temperature: "-200 °C", orbitalPeriod: "165 Earth years", dayLength: "16 hours" },
    overview: "Dark, cold, and whipped by supersonic winds, ice giant Neptune is the eighth and most distant planet in our solar system.",
    formation: "Formed near the sun and migrated outward to its present position over billions of years.",
    structure: "Most of its mass is a hot, dense fluid of 'icy' materials over a small, rocky core.",
    surface: "No solid surface.",
    atmosphere: "Hydrogen, helium, and methane, which gives the planet its brilliant blue color.",
    moons: "Neptune has 14 known moons, the largest being Triton.",
    missions: ["Voyager 2 (NASA)"],
    interestingFacts: ["Neptune has the strongest winds in the Solar System, up to 2,100 km/h.", "Triton orbits Neptune backward (retrograde)."]
  },
  "pluto": {
    id: "pluto",
    name: "Pluto",
    tagline: "The King of the Kuiper Belt",
    heroImage: "/objects/pluto.jpg",
    textureUrl: "/textures/pluto.jpg",
    quickFacts: { type: "Dwarf Planet", radius: "1,188 km", mass: "1.30 × 10^22 kg", gravity: "0.62 m/s²", temperature: "-230 °C", orbitalPeriod: "248 Earth years", dayLength: "153 hours" },
    overview: "Pluto is a complex and mysterious world with mountains, valleys, plains, and craters. Long considered the ninth planet.",
    formation: "Formed 4.5 billion years ago, it is the largest known member of the Kuiper Belt.",
    structure: "Likely has a rocky core surrounded by a mantle of water ice.",
    surface: "Features mountains made of water ice and a heart-shaped glacier of nitrogen ice.",
    atmosphere: "A thin, temporary atmosphere of nitrogen, methane, and carbon monoxide.",
    moons: "Pluto has 5 moons, the largest being Charon.",
    missions: ["New Horizons (NASA)"],
    interestingFacts: ["Pluto was reclassified as a dwarf planet in 2006.", "Charon is so large that Pluto and Charon orbit each other like a double planet system."]
  },
  "moon": {
    id: "moon",
    name: "The Moon",
    tagline: "Earth's constant companion",
    heroImage: "/objects/moon.jpg",
    textureUrl: "/textures/moon.jpg",
    quickFacts: { type: "Natural Satellite", radius: "1,737 km", mass: "7.34 × 10^22 kg", gravity: "1.62 m/s²", temperature: "120 °C to -130 °C", orbitalPeriod: "27.3 days", dayLength: "27.3 Earth days" },
    overview: "The Moon is Earth's only natural satellite. It is the fifth largest satellite in the Solar System.",
    formation: "The leading theory is the giant-impact hypothesis: it formed from debris after a Mars-sized body collided with Earth.",
    structure: "It has a solid iron-rich core, a semi-solid mantle, and a rigid crust.",
    surface: "The surface is dead, covered in impact craters and vast lava plains called maria.",
    atmosphere: "The Moon has an extremely thin and tenuous exosphere.",
    missions: ["Apollo Program (NASA)", "Artemis (NASA)", "Chang'e (CNSA)", "Chandrayaan (ISRO)"],
    interestingFacts: ["We always see the same side of the Moon from Earth.", "The Moon is drifting away from Earth at a rate of 3.8 cm per year."]
  },
  "europa": {
    id: "europa",
    name: "Europa",
    tagline: "The ocean moon",
    heroImage: "/objects/europa.jpg",
    quickFacts: { type: "Natural Satellite", radius: "1,560 km", mass: "4.8 × 10^22 kg", gravity: "1.31 m/s²", temperature: "-160 °C", orbitalPeriod: "3.55 days", dayLength: "3.55 Earth days" },
    overview: "Europa is one of Jupiter's Galilean moons. It is believed to have a massive subsurface ocean of liquid water beneath its icy shell, making it one of the most promising places to look for life in our solar system.",
    formation: "Formed from the circumplanetary disk of gas and dust surrounding Jupiter after its formation.",
    structure: "It has an iron core, a rocky mantle, and an ocean of salty water covered by a thick crust of ice.",
    surface: "The surface is a remarkably smooth icy crust covered in long, dark, crisscrossing fractures and cracks.",
    atmosphere: "It has a very tenuous atmosphere composed primarily of oxygen.",
    missions: ["Galileo (NASA)", "Europa Clipper (NASA - Upcoming)", "JUICE (ESA)"],
    interestingFacts: ["Europa's subsurface ocean may contain more than twice the amount of water found on all of Earth.", "It is the smoothest known solid object in the Solar System."]
  },
  "titan": {
    id: "titan",
    name: "Titan",
    tagline: "A world of liquid methane",
    heroImage: "/objects/titan.jpg",
    quickFacts: { type: "Natural Satellite", radius: "2,574 km", mass: "1.34 × 10^23 kg", gravity: "1.35 m/s²", temperature: "-179 °C", orbitalPeriod: "15.9 days", dayLength: "15.9 Earth days" },
    overview: "Titan is Saturn's largest moon and the second-largest moon in the solar system. It is the only moon known to have a dense atmosphere and the only known body in space, other than Earth, where clear evidence of stable bodies of surface liquid has been found.",
    formation: "Formed in the sub-nebula of gas and dust that surrounded Saturn shortly after its formation.",
    structure: "Titan is composed of a rocky core surrounded by a deep subsurface ocean of liquid water, topped by a thick icy crust.",
    surface: "The surface features lakes, rivers, and seas of liquid methane and ethane, as well as vast dunes of organic material.",
    atmosphere: "Its thick, hazy atmosphere is primarily nitrogen, similar to Earth's, but with a high concentration of methane and organic smog.",
    missions: ["Cassini-Huygens (NASA/ESA)", "Dragonfly (NASA - Upcoming)"],
    interestingFacts: ["Titan is larger than the planet Mercury.", "It is the only place in the solar system besides Earth to have a liquid cycle (like Earth's water cycle) on its surface."]
  },
  "ganymede": {
    id: "ganymede",
    name: "Ganymede",
    tagline: "The giant moon",
    heroImage: "/objects/ganymede.jpg",
    quickFacts: { type: "Natural Satellite", radius: "2,634 km", mass: "1.48 × 10^23 kg", gravity: "1.42 m/s²", temperature: "-163 °C", orbitalPeriod: "7.15 days", dayLength: "7.15 Earth days" },
    overview: "Ganymede is the largest and most massive moon of Jupiter and in the Solar System. It is the only moon in our solar system known to have its own magnetic field.",
    formation: "Formed by accretion from the nebula of gas and dust that surrounded Jupiter after its formation.",
    structure: "It has a metallic iron core, a rocky mantle, and a thick shell of ice and liquid water.",
    surface: "The surface is a mix of two types of terrain: highly cratered dark regions and younger, lighter regions with extensive arrays of grooves and ridges.",
    atmosphere: "It has a very thin oxygen atmosphere.",
    missions: ["Galileo (NASA)", "Juno (NASA)", "JUICE (ESA)"],
    interestingFacts: ["Ganymede is larger than the planet Mercury and the dwarf planet Pluto.", "It is the only moon known to generate its own internal magnetic field."]
  },
  "enceladus": {
    id: "enceladus",
    name: "Enceladus",
    tagline: "The icy geyser world",
    heroImage: "/objects/enceladus.jpg",
    quickFacts: { type: "Natural Satellite", radius: "252 km", mass: "1.08 × 10^20 kg", gravity: "0.11 m/s²", temperature: "-201 °C", orbitalPeriod: "1.37 days", dayLength: "1.37 Earth days" },
    overview: "Enceladus is a small, icy moon of Saturn that has become one of the most exciting scientific targets in the solar system due to the discovery of water-ice geysers erupting from its south pole.",
    formation: "Formed in the early Saturnian system from the surrounding disk of gas and dust.",
    structure: "It has a rocky core surrounded by a global subsurface ocean of liquid water, covered by an icy crust.",
    surface: "The surface is covered in clean, uncratered ice, making it one of the most reflective bodies in the solar system. The south pole is scarred by 'tiger stripes' where geysers erupt.",
    atmosphere: "It has a tenuous, geologically generated atmosphere primarily made of water vapor from its geysers.",
    missions: ["Cassini (NASA/ESA)"],
    interestingFacts: ["Enceladus reflects almost 100% of the sunlight that strikes it.", "The geysers on Enceladus continuously feed Saturn's E ring with icy material."]
  }
};
