/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FestivalItem, HistoricalEvent, DynastyRuler, CulinaryItem, AttractionItem, TriviaQuestion, PostcardTemplate, MuseumArtifact } from '../types';

export const FESTIVALS: FestivalItem[] = [
  {
    id: 'egbelegbe',
    name: 'Egbelegbe Festival',
    nativeName: 'Oru Egbelegbe',
    season: 'Periodic (typically every 7 to 10 years)',
    description: 'The premier cultural festival of the Okpoama Kingdom. It is a legendary, multi-day spectacle of purification, historical remembrance, and spiritual re-dedication. The festival honors the ancestral guardians of the realm and celebrates the unity and resilience of the Okpoama clan.',
    significance: 'It marks the ultimate cultural homecoming, serving as a spiritual reconciliation and boundary cleansing for all sons and daughters of Okpoama across the globe.',
    activities: [
      'The Grand Boat Regatta: Magnificently decorated traditional war canoes showcasing synchronized paddling, drumming, and acrobatics.',
      'Oru Dance: High-energy traditional masquerade dances performed by initiated guilds wearing towering hand-carved wooden headpieces.',
      'Ancestral Chant and Libations: Sacred prayers led by the Chief Priest and the Amanyanabo at the royal shrine.',
      'The Ceremonial Sea Bathing: A communal ritual at the Okpoama Beach to wash away misfortune and usher in fertility, abundance, and peace.'
    ],
    imagePrompt: 'A vibrant Nigerian traditional boat regatta with highly decorated war canoes, synchronized paddlers in colorful attire, and drums on the water',
    imageFallback: '/src/assets/images/egbelegbe_regatta_1783092810330.jpg'
  },
  {
    id: 'fishing_festival',
    name: 'Coastal Fishing Festival',
    nativeName: 'Omoni Oge',
    season: 'Annual (Late Dry Season, around April)',
    description: 'A celebration of Okpoama\'s foundational relationship with the sea. As a coastal kingdom, the bounty of the Atlantic and the Brass River estuary is celebrated with high-stakes fishing tournaments, cast-net displays, and seafood feasts.',
    significance: 'Honors the fishing gods, promotes ecological conservation of the mangrove nurseries, and passes down ancient seafaring techniques to younger generations.',
    activities: [
      'The Great Cast-Net Competition: Fishermen compete in speed, accuracy, and net coverage.',
      'Periwinkle and Snail Picking Race: A traditional race along the muddy mangrove estuaries, typically led by the women.',
      'The Giant Catch Award: Crowning the fisherman who catches the largest barracuda or snapper.',
      'Community Beach Bonfire and Fish Roast: A massive feast where the catches of the day are prepared with fresh local spices.'
    ],
    imagePrompt: 'Traditional African fishermen casting large circular nets into the golden ocean at sunset from small wooden canoes',
    imageFallback: '/src/assets/images/okpoama_beach_1783092788317.jpg'
  },
  {
    id: 'iria',
    name: 'Iria Festival',
    nativeName: 'Iri-Awo',
    season: 'Annual (December)',
    description: 'The beautiful and colorful maidenhood initiation ceremony, common to the coastal Ijaw kingdoms. It celebrates the transition of young girls into womanhood with elegance, modesty, and pride.',
    significance: 'Preserves family honor, reinforces traditional values of chastity, self-esteem, and prepares young women for leadership and marital roles in society.',
    activities: [
      'The Fattening Room Period: Maidens are taught folklore, traditional cooking, and maternal wisdom by clan matriarchs.',
      'Body Painting (Inye): Intricate aesthetic designs painted on the body using natural plant extracts like indigo (Uli) and camwood (Osun).',
      'The Egbe Dance: Choreographed waist-rhythm dances performed at the market square before the elders and the community.',
      'Royal Presentation: The maidens are presented to the Amanyanabo and blessed with copper bracelets and traditional coral beads.'
    ],
    imagePrompt: 'Traditional African celebration with women wearing beautiful red coral beads, elaborate head ties, and traditional body paintings dancing joyfully',
    imageFallback: '/src/assets/images/iria_maidenhood_1783092823190.jpg'
  }
];

export const HISTORY: HistoricalEvent[] = [
  {
    id: 'akassa_raid',
    year: '1895',
    title: 'The Great Akassa Raid',
    description: 'A historic military confrontation where the combined forces of the Brass-Ijaw (including Okpoama warriors under the coalition led by King Koko of Brass) launched a daring raid against the Royal Niger Company’s heavily fortified depot in Akassa. The raid was a response to the British company\'s crushing monopoly and blockade of trade, which starved the coastal kingdoms of their livelihoods.',
    impact: 'The raid demonstrated the fierce economic and territorial sovereignty of the Ijaw people. It forced the British Crown to revoke the Royal Niger Company\'s charter in 1899, leading to direct colonial administration but forever immortalizing the bravery of the Brass-Okpoama coalition in the face of economic oppression.',
    visualIcon: 'Shield'
  },
  {
    id: 'palm_oil_treaty',
    year: '1886',
    title: 'The Palm Oil & Sovereign Treaties',
    description: 'Okpoama and Brass leaders engaged in complex diplomatic treaties with European traders. Okpoama was a crucial trading hub, converting its seafaring capacity into control of the palm oil rivers. The Amanyanabo and chiefs negotiated terms to protect internal markets and sovereign customs.',
    impact: 'Established Okpoama as a major player in the global trade network, bringing wealth, maritime technologies, and written educational contacts, while simultaneously introducing colonial pressures.',
    visualIcon: 'FileText'
  },
  {
    id: 'modern_reign',
    year: '2002',
    title: 'Ascension of HRM King Ebitimi Banigo',
    description: 'His Royal Majesty, King Ebitimi Banigo, a highly respected former banking executive and visionary economist, ascended the throne as the Amanyanabo of Okpoama Kingdom (Okpo XXI). He introduced modern governance structures, advocating for digital literacy, educational scholarships, and eco-tourism.',
    impact: 'Bridged the gap between ancient monarchical traditions and 21st-century economic development, putting Okpoama on the global tourism and investment map.',
    visualIcon: 'Crown'
  }
];

export const DYNASTY: DynastyRuler[] = [
  {
    id: 'king_okpo',
    title: 'King Okpo I',
    name: 'Founder of the Lineage',
    reign: '17th Century',
    description: 'The legendary warrior-ancestor who consolidated the Okpoama settlements on Brass Island. He established the royal dynasty and is revered for his strategic vision in positioning the kingdom along major maritime channels.',
    contribution: 'Consolidated the defensive clans, created the first royal council, and codified the foundational spiritual rules of the kingdom.'
  },
  {
    id: 'king_koko',
    title: 'King Koko of Brass',
    name: 'Defender of the Rivers',
    reign: '1889 - 1898',
    description: 'Though specifically ruling the wider Brass confederation, King Koko was a joint commander of the military forces that included Okpoama warriors. He is remembered as an unyielding defender of free trade and native rights against British imperialism.',
    contribution: 'Led the legendary 1895 resistance, sacrificed his kingdom to protect his people\'s economic independence, and became an enduring icon of anti-colonial resistance.'
  },
  {
    id: 'king_banigo',
    title: 'HRM King Ebitimi Banigo',
    name: 'Okpo XXI',
    reign: '2002 - Present',
    description: 'The current traditional ruler of Okpoama Kingdom. A highly educated corporate leader, he holds degrees in economics and has used his background to build schools, advocate for environmental cleaning of the Niger Delta, and document Ijaw history.',
    contribution: 'Established the Okpoama Kingdom Trust Fund, digitized ancient treaties, and promoted sustainable beach tourism and mangrove eco-tourism.'
  }
];

export const CULINARY: CulinaryItem[] = [
  {
    id: 'keke_fieye',
    name: 'Keke Fieye',
    translation: 'Unripe Plantain & Seafood Medley',
    description: 'The undisputed national dish of the Okpoama and Brass people. It is a slow-cooked, rich, thick stew made from diced unripe plantains, fresh water snails, unshelled periwinkles, dried fish, and local herbs. It is cooked without oil initially, letting the natural starches of the plantain thicken the savory seafood broth, before a final drizzle of red palm oil is added.',
    ingredients: [
      { name: 'Unripe Plantains (Diced)', required: true, icon: '🍌', description: 'The starch base. Must be fully green and firm, chopped into bite-sized cubes.' },
      { name: 'Fresh Water Snails', required: true, icon: '🐌', description: 'De-shelled and washed thoroughly with alum and lime to remove slime.' },
      { name: 'Unshelled Periwinkles', required: true, icon: '🐚', description: 'The absolute signature. The shells are clipped at the tail so diners can suck the savory meat directly out.' },
      { name: 'Dry Smoked Fish', required: true, icon: '🐟', description: 'Provides a rich, deep, smoky flavor profile to the underlying broth.' },
      { name: 'Local Scent Leaf (Effirin)', required: true, icon: '🌿', description: 'A highly aromatic herb that gives the dish its distinct, medicinal, and fresh aroma.' },
      { name: 'Red Palm Oil', required: true, icon: '🏺', description: 'Pure squeezed palm extract that binds the starches and seafood flavors at the final stage.' }
    ],
    steps: [
      'Chop the raw unripe plantains into clean cubical pieces and place them in a deep clay or iron pot.',
      'Add the prepared fresh snails, smoked fish, and ground crayfish directly on top of the plantains.',
      'Pour in seasoned stock or fresh water, just enough to barely cover the ingredients. Boil on medium heat.',
      'Allow the starch from the unripe plantains to naturally dissolve into the water, creating a thick, creamy broth (about 15-20 minutes).',
      'Add the clipped, unshelled periwinkles and fresh sliced chili peppers. Stir gently to avoid mashing the plantains.',
      'Drizzle a generous amount of pure red palm oil over the bubbling mixture. Let it simmer for another 5 minutes.',
      'Strew the finely sliced fresh Scent Leaves over the pot, cover immediately, and turn off the flame to lock in the aromatic oils.'
    ],
    funFact: 'Traditionally, Keke Fieye is eaten with your fingers or a special wooden scoop, and sucking the periwinkles out of their shells with a loud, satisfying sound is considered a compliment to the chef!',
    imagePrompt: 'A steaming hot bowl of African Keke Fieye soup with green plantains, rich red palm oil, snails, periwinkles in shells, and green scent leaves',
    imageFallback: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'ono_soup',
    name: 'Ono Pepper Soup',
    translation: 'Spicy Estuary Fresh Fish Soup',
    description: 'A light, fiery, and deeply comforting broth made with freshly caught snapper, barracuda, or catfish, infused with local medicinal pepper-soup spices, ginger, alligator pepper, and scent leaves.',
    ingredients: [
      { name: 'Fresh Snapper or Catfish', required: true, icon: '🐟', description: 'Caught fresh from the Atlantic coast, sliced into steaks.' },
      { name: 'Pepper Soup Spice Blend', required: true, icon: '🌶️', description: 'A dry-ground mix of calabash nutmeg, uda pods, and uziza seeds.' },
      { name: 'Scent Leaves', required: true, icon: '🌿', description: 'Provides a sweet, aromatic counter-balance to the sharp heat.' },
      { name: 'Local Chili & Onions', required: false, icon: '🧅', description: 'Grated to add a sweet base and explosive heat.' }
    ],
    steps: [
      'Clean the fish steaks thoroughly and season with salt, chopped onions, and a touch of chili.',
      'Boil water with the ground pepper-soup spice mix (calabash nutmeg, uda, uziza) to release the essential oils.',
      'Gently drop the delicate fish steaks into the boiling spice-bath.',
      'Simmer on low heat for 10 minutes until the fish is tender and has absorbed the spices.',
      'Finish with a handful of fresh scent leaves, simmering for 2 minutes before serving hot.'
    ],
    funFact: 'Ono Pepper Soup is the ultimate welcome dish in Okpoama; it is served to guests arriving from long sea journeys to instantly warm up their spirits and bodies.',
    imagePrompt: 'A steaming bowl of clear, spicy African fresh fish pepper soup with herbs and a whole fish steak',
    imageFallback: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80'
  }
];

export const ATTRACTIONS: AttractionItem[] = [
  {
    id: 'okpoama_beach',
    name: 'Okpoama Beach (Brass Beach)',
    type: 'beach',
    description: 'A breathtakingly vast stretch of white sandy beach overlooking the roaring Atlantic Ocean. It is famous for its powerful surf waves, pristine coastal wind, and beautiful coconut palm fringes. The beach serves as the grand arena for the purification rituals of the Egbelegbe festival.',
    whyVisit: 'It is one of the last undeveloped, serene coastal frontiers in Nigeria. Perfect for absolute relaxation, beach soccer, watching traditional fishermen launch their craft, and catching spectacular golden sunsets.',
    etiquette: [
      'The ocean currents are extremely powerful; swim only in designated shallow zones and never alone.',
      'Respect the local community fishermen and their nets laid out on the sand.',
      'Do not litter; keep this natural sanctuary pristine.'
    ],
    imagePrompt: 'A vast, undeveloped tropical white sand beach in Nigeria with roaring Atlantic waves, palm trees, and a golden sunset sky',
    imageFallback: '/src/assets/images/okpoama_beach_1783092788317.jpg'
  },
  {
    id: 'royal_palace',
    name: 'The Palace of the Amanyanabo',
    type: 'heritage',
    description: 'The physical and spiritual heart of the Okpoama Kingdom. Located in the center of the town, this royal complex is not just the home of the King but also acts as a living history museum. It preserves ancient war drums (Ikoro), centuries-old royal scepters, hand-carved throne chairs, and bronze cannons.',
    whyVisit: 'See original 19th-century trade agreements and treaties hand-signed by the early Kings of Okpoama and British trade consuls. If you are lucky, you might receive a royal audience and blessing.',
    etiquette: [
      'Remove your footwear when entering the inner reception chambers if instructed.',
      'Always address the King as "Your Royal Majesty" or "Amanyanabo".',
      'Ask for permission before taking photographs of royal artifacts.'
    ],
    imagePrompt: 'An elegant African royal palace entrance decorated with traditional carved pillars, bronze artifacts, and royal emblems',
    imageFallback: '/src/assets/images/royal_palace_1783092799123.jpg'
  },
  {
    id: 'mangrove_estuary',
    name: 'Brass River Mangrove Canopy',
    type: 'nature',
    description: 'An intricate, labyrinthine network of towering mangrove trees forming a lush green canopy over calm, dark saltwater creeks. This ecosystem is a crucial nursery for coastal marine life, including crabs, shrimp, mudskippers, and rare birds.',
    whyVisit: 'Take a quiet, guided canoe ride through the whispering tunnels of red and black mangroves. It is an eco-tourist’s paradise, offering unparalleled bird-watching and a look at traditional periwinkle harvesting.',
    etiquette: [
      'Always wear a life jacket during boat tours.',
      'Keep your voice low to avoid disturbing the nesting birds and wildlife.',
      'Support local economy by hiring a native Okpoama boatman.'
    ],
    imagePrompt: 'A serene mangrove forest with clear dark water and a small wooden canoe paddling through a green canopy of roots',
    imageFallback: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'salt_wells',
    name: 'The Ancient Salt Wells',
    type: 'landmark',
    description: 'Historical geo-thermal salt water springs located deep in the coastal forest. For centuries before industrial salt reached West Africa, Okpoama women extracted pure sea salt from these wells using an elaborate process of boiling and sun-evaporation in specialized clay pots (Ono-Aba).',
    whyVisit: 'Witness a demonstration of the ancient craft of salt-making, which was a vital trading currency across the Niger Delta for hundreds of years.',
    etiquette: [
      'Do not throw coins or waste into the salt wells, as they are considered sacred.',
      'It is customary to thank the local women curators with a small token of appreciation.'
    ],
    imagePrompt: 'Ancient traditional clay pots boiling over fire wood inside a rustic hut for making salt',
    imageFallback: '/src/assets/images/ancient_salt_boiling_1783094067002.jpg'
  }
];

export const TRIVIA: TriviaQuestion[] = [
  {
    id: 'q1',
    question: 'What is the title of the traditional ruler of Okpoama Kingdom?',
    options: [
      'Obi',
      'Amanyanabo',
      'Obong',
      'Olu'
    ],
    correctAnswerIndex: 1,
    explanation: 'The traditional ruler of Okpoama (and other major coastal Ijaw kingdoms) holds the revered title of Amanyanabo, meaning "owner of the land" or "sovereign of the town".'
  },
  {
    id: 'q2',
    question: 'Which epic historical event of 1895 saw Okpoama warriors participate in a coalition against the Royal Niger Company\'s trade monopoly?',
    options: [
      'The Benin Expedition',
      'The Akassa Raid',
      'The Jaja of Opobo Exile',
      'The Brass-Lagos Treaty'
    ],
    correctAnswerIndex: 1,
    explanation: 'The Great Akassa Raid of 1895 was a brave defensive military campaign launched by the Brass-Ijaw coalition (including Okpoama) to destroy the Royal Niger Company\'s trade depot in Akassa and resist their devastating blockade.'
  },
  {
    id: 'q3',
    question: 'What is the key ingredient in "Keke Fieye", the legendary traditional dish of Okpoama, that is served with its shell clipped?',
    options: [
      'Freshwater Lobster',
      'Periwinkle',
      'Crab Claws',
      'Smoked Barracuda'
    ],
    correctAnswerIndex: 1,
    explanation: 'Unshelled periwinkles, with their shells clipped at the tail end, are the signature ingredient of Keke Fieye. You suck the meat directly out of the shell while eating, which is a traditional art!'
  },
  {
    id: 'q4',
    question: 'How often is the famous, grand "Egbelegbe Festival" typically celebrated?',
    options: [
      'Every Year',
      'Every 2 Years',
      'Every 7 to 10 Years',
      'Only during a new King\'s coronation'
    ],
    correctAnswerIndex: 2,
    explanation: 'The Egbelegbe Festival is a grand, multi-year periodic event, typically occurring every 7 to 10 years, making it an extremely rare, sacred, and highly anticipated homecoming event.'
  },
  {
    id: 'q5',
    question: 'What is the primary traditional occupation of the Okpoama people due to their geographic location on Brass Island?',
    options: [
      'Yam Farming',
      'Bronze Casting',
      'Fishing and Maritime Trade',
      'Weaving and Pottery'
    ],
    correctAnswerIndex: 2,
    explanation: 'Situated on Brass Island between the Atlantic Ocean and the Brass River estuary, the Okpoama people are historically renowned as expert fishermen, canoe builders, and maritime traders.'
  }
];

export const POSTCARDS: PostcardTemplate[] = [
  {
    id: 'beach_sunset',
    name: 'Atlantic Beach Sunset',
    themeClass: 'bg-gradient-to-br from-amber-50 to-orange-100 border-orange-200 text-orange-950',
    bgGradient: 'from-amber-500/10 via-orange-500/5 to-transparent',
    imageUrl: '/src/assets/images/okpoama_beach_1783092788317.jpg',
    cardTitle: 'Greetings from Okpoama Beach!',
    tagline: 'Where the Atlantic waves sing to the golden shore.'
  },
  {
    id: 'royal_regalia',
    name: 'Imperial Palace Gold',
    themeClass: 'bg-gradient-to-br from-yellow-50 to-amber-100 border-amber-200 text-amber-950',
    bgGradient: 'from-yellow-500/10 via-amber-500/5 to-transparent',
    imageUrl: '/src/assets/images/royal_palace_1783092799123.jpg',
    cardTitle: 'Royal Blessings from Okpoama',
    tagline: 'Preserving centuries of coastal majesty and sovereignty.'
  },
  {
    id: 'mangrove_spirit',
    name: 'Estuary Mangrove Green',
    themeClass: 'bg-gradient-to-br from-emerald-50 to-teal-100 border-teal-200 text-teal-950',
    bgGradient: 'from-emerald-500/10 via-teal-500/5 to-transparent',
    imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80',
    cardTitle: 'Echoes of the Mangrove Canopies',
    tagline: 'Sailing through the whispering secrets of the Brass delta.'
  }
];

export const MUSEUM_ARTIFACTS: MuseumArtifact[] = [
  {
    id: 'golden_scepter',
    name: "The Amanyanabo's Golden Scepter",
    era: 'Early 19th Century',
    material: 'Cast Brass & Heavy Gold Leaf Plating',
    description: 'A majestic and highly ornate royal scepter held by successive Amanyanabos during sacred coronations, major peace treaties, and Egbelegbe festival assemblies.',
    history: 'Sourced from legendary lost-wax metallurgy, this scepter is decorated with carvings representing the python (the earthly guardian), the shark of the Atlantic, and royal stars indicating celestial favor.',
    dimensions: '112 cm x 8 cm',
    imagePrompt: 'An ornate ancient African golden scepter with delicate tribal reptile and star carvings resting on dark velvet',
    imageFallback: '/src/assets/images/golden_scepter_1783092842610.jpg',
    audioGuideText: 'You are looking at the Royal Scepter of the Amanyanabo of Okpoama Kingdom. Passed down across generations, it stands as a visual anchor of traditional administrative authority, legal peace treaties, and royal judicial decree.'
  },
  {
    id: 'koko_cannon',
    name: "King Koko's Battle Cannon",
    era: 'Late 19th Century (c. 1895)',
    material: 'Cast Iron & Coastal Bronze Alloy',
    description: 'A critical piece of defensive artillery utilized by the Brass-Okpoama coalition forces during the famous 1895 Akassa Raid to protest trade blockades.',
    history: 'Acquired through trade exchanges and then skillfully modified by native metalsmiths to fit into the bows of standard war canoes, this cannon gave the local warriors an equalizer against the Royal Niger Company gunboats.',
    dimensions: '185 cm x 45 cm',
    imagePrompt: 'A centuries-old weathered bronze cannon on a coastal defensive fort overlooking the ocean',
    imageFallback: '/src/assets/images/koko_cannon_1783092856164.jpg',
    audioGuideText: "This bronze coastal cannon represents the fierce, unyielding defense of Okpoama's economic and political sovereignty. Reconditioned for maritime battles, it helped turn the tide during the historical Akassa Raid."
  },
  {
    id: 'sacred_mask',
    name: 'Sacred Oru Masquerade Headpiece',
    era: 'Pre-Colonial Ancestral Epoch',
    material: 'Carved Iroko Wood, White Kaolin Clay, Natural Dyes',
    description: 'A striking, hand-carved ritual mask representing the guardian spirits of the saltwater estuaries, featuring sharp fish-like fin structures.',
    history: 'Kept inside the central shrine under the guardianship of high priests, this sacred mask is brought into light only once every 7 to 10 years during the cleansing dances of the Egbelegbe Festival.',
    dimensions: '65 cm x 40 cm',
    imagePrompt: 'An ancient hand-carved wooden African ritual mask decorated with tribal markings and white clay paint',
    imageFallback: '/src/assets/images/sacred_mask_1783092868392.jpg',
    audioGuideText: 'This Oru Masquerade Mask represents the deep spiritual bond between the Okpoama clan and the water deities. It is worn during spectacular, rhythmic waterfront dances to cleanse the realm of bad fortune.'
  },
  {
    id: 'salt_vessel',
    name: 'Ancient Salt Evaporation Vessel',
    era: '18th Century or Earlier',
    material: 'Hand-coiled Clay & Coastal Shell Tempering',
    description: 'A robust, wide-mouthed clay vessel used by ancient Okpoama women to extract pure sea-salt crystals from deep forest geothermal saltwater wells.',
    history: 'Long before colonial trade imported standard industrial salt, salt harvested from Okpoama geothermal wells served as a primary trade currency across the Niger Delta. Women boiled seawater for days, forming salt cakes.',
    dimensions: '38 cm Diameter',
    imagePrompt: 'A rustic hand-made dark clay pot with textured markings sitting on dry sandy soil',
    imageFallback: '/src/assets/images/ancient_salt_boiling_1783094067002.jpg',
    audioGuideText: 'This clay vessel was central to Okpoama’s ancient salt industry. Harvested by brave clan women, salt was boiled in these vessels, forming the foundational economy of the early kingdom.'
  },
  {
    id: 'war_paddle',
    name: 'The Commander’s War Canoe Paddle',
    era: 'Late 18th Century',
    material: 'Carved Mahogany Wood & Ochre Pigments',
    description: 'A long, heavy-duty broad paddle used to steer the grand, multi-oared war canoes (Omu-Aru) that protected Okpoama’s delta borders.',
    history: 'Constructed from a single piece of dense mahogany, this paddle’s handle features elaborate relief carvings representing sea eagles and crashing waves, symbolizing speed, foresight, and balance.',
    dimensions: '160 cm x 22 cm',
    imagePrompt: 'An ancient carved wooden tribal paddle leaning against a weathered wooden wall',
    imageFallback: '/src/assets/images/war_paddle_1783092882341.jpg',
    audioGuideText: 'A steering paddle of an Okpoama war canoe captain. It required high strength and seamanship to direct war vessels through turbulent estuaries and Atlantic high tides.'
  }
];

