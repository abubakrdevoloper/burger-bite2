// BURGER&BITE - Ma'lumotlar bazasi (20 ta fast food, har biri 3 xil variantda + 12 viloyat va tumanlar)

const FALLBACK_SVG = "data:image/svg+xml;utf8," + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1a1a24"/>
      <stop offset="100%" stop-color="#2d1b10"/>
    </linearGradient>
  </defs>
  <rect width="600" height="400" fill="url(#g)"/>
  <circle cx="300" cy="180" r="70" fill="#ff6b00" opacity="0.2"/>
  <text x="300" y="190" font-family="sans-serif" font-size="48" text-anchor="middle" fill="#ff8c00">🍔</text>
  <text x="300" y="250" font-family="sans-serif" font-weight="bold" font-size="22" text-anchor="middle" fill="#ffffff">BURGER&amp;BITE</text>
</svg>
`);

const HERO_SLIDES = [
  {
    badge: "🔥 YANGI TA'M REVOLYUTSIYASI",
    title: "Haqiqiy Olovda Pishgan Premium Burgerlar",
    desc: "100% halol mol go'shti, maxsus tutunli sous va har kuni yangi yopiladigan yumshoq bulochkalar — BURGER&BITE oshxonasidan to'g'ri eshigingizgacha!",
    price: "34 000 so'mdan",
    img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80"
  },
  {
    badge: "⚡ 25 DAQIQADA YETKAZISH",
    title: "Issiqina Pepperoni Pitsa & Qarsildoq Kartoshka",
    desc: "Cho'ziluvchan mozzarella pishlog'i va maxsus italyan ziravorlari uyg'unligi. Do'stlar davrasi uchun ideal tanlov!",
    price: "58 000 so'mdan",
    img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=900&q=80"
  },
  {
    badge: "🌯 MAXSUS RETSEPT",
    title: "Tandirda Qizargan Shohona Lavash & Twister",
    desc: "Shirali tovuq filesi, yangi sabzavotlar va firmenniy sarimsoqli sous bilan tayyorlangan mega lavashlarimizni tatib ko'ring.",
    price: "32 000 so'mdan",
    img: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=900&q=80"
  },
  {
    badge: "🍗 XIT SAVDO",
    title: "Oltinrang Qarsildoq Tovuq Qanotchalari",
    desc: "Maxsus 11 xil ziravorli panirovkada qovurilgan super qarsildoq qanotchalar va BBQ sousi.",
    price: "29 000 so'mdan",
    img: "https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=900&q=80"
  }
];

const INITIAL_PRODUCTS = [
  {
    id: "bb-1",
    name: "Classic Smash Burger",
    category: "Burgerlar",
    desc: "Olovda qovurilgan mol go'shti kotleti, cheddar pishlog'i, tuzlangan bodring va firmenniy sous.",
    img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=700&q=80",
    variants: [
      { name: "Mini (1 kotlet)", price: 32000, weight: "210g" },
      { name: "Classic (1.5 kotlet + pishloq)", price: 42000, weight: "310g" },
      { name: "Double Mega (2 kotlet + bekon)", price: 54000, weight: "430g" }
    ]
  },
  {
    id: "bb-2",
    name: "BBQ Smoky Burger",
    category: "Burgerlar",
    desc: "Tutunli barbekyu sousi, qarsildoq piyoz halqalari, mol go'shti va eritilgan pishloq.",
    img: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?auto=format&fit=crop&w=700&q=80",
    variants: [
      { name: "Standart BBQ", price: 36000, weight: "250g" },
      { name: "Cheese BBQ", price: 45000, weight: "320g" },
      { name: "King Double BBQ", price: 58000, weight: "450g" }
    ]
  },
  {
    id: "bb-3",
    name: "Crispy Chicken Burger",
    category: "Burgerlar",
    desc: "Qarsildoq tovuq filesi, aysberg salati, pomidor va mayin qaymoqli sous.",
    img: "https://images.unsplash.com/photo-1615297928064-24977384d0da?auto=format&fit=crop&w=700&q=80",
    variants: [
      { name: "Yengil (Light)", price: 28000, weight: "200g" },
      { name: "Klassik Crispy", price: 35000, weight: "270g" },
      { name: "Achchiq Jalapeno XL", price: 43000, weight: "340g" }
    ]
  },
  {
    id: "bb-4",
    name: "Cheeseburger Deluxe",
    category: "Burgerlar",
    desc: "Ikki hissa Gollandiya va Cheddar pishlog'i bilan boyitilgan shirali burger.",
    img: "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?auto=format&fit=crop&w=700&q=80",
    variants: [
      { name: "Single Cheese", price: 30000, weight: "220g" },
      { name: "Double Cheese", price: 41000, weight: "310g" },
      { name: "Triple Cheese Bomb", price: 52000, weight: "410g" }
    ]
  },
  {
    id: "bb-5",
    name: "Shohona Mol Go'shtli Lavash",
    category: "Lavashlar",
    desc: "Yupqa xamir ichida shirali mol go'shti, pomidor, bodring, fri kartoshkasi va maxsus sous.",
    img: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=700&q=80",
    variants: [
      { name: "Mini Lavash", price: 29000, weight: "260g" },
      { name: "Standart Lavash", price: 36000, weight: "360g" },
      { name: "Pishloqli Big Lavash", price: 44000, weight: "460g" }
    ]
  },
  {
    id: "bb-6",
    name: "Tovuqli Tandir Lavash",
    category: "Lavashlar",
    desc: "Grilda pishgan tovuq go'shti, sarimsoqli sous va tandirda qizartirilgan lavash.",
    img: "https://images.unsplash.com/photo-1662116765994-1e4200c43589?auto=format&fit=crop&w=700&q=80",
    variants: [
      { name: "Klassik Tovuqli", price: 27000, weight: "250g" },
      { name: "Pishloqli Tovuqli", price: 34000, weight: "330g" },
      { name: "Achchiq Meksikancha", price: 39000, weight: "380g" }
    ]
  },
  {
    id: "bb-7",
    name: "Pepperoni Pitsa",
    category: "Pitsalar",
    desc: "Klassik italyan xamiri, mol go'shtli dudlangan kolbasa, mozzarella va tomat sousi.",
    img: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=700&q=80",
    variants: [
      { name: "25 sm (Kichik)", price: 55000, weight: "450g" },
      { name: "30 sm (O'rtacha)", price: 75000, weight: "680g" },
      { name: "35 sm (Oilaviy)", price: 95000, weight: "920g" }
    ]
  },
  {
    id: "bb-8",
    name: "4 Pishloqli Pitsa",
    category: "Pitsalar",
    desc: "Mozzarella, Cheddar, Parmezan va Dorblu pishloqlarining noyob uyg'unligi.",
    img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=700&q=80",
    variants: [
      { name: "25 sm (Kichik)", price: 58000, weight: "440g" },
      { name: "30 sm (O'rtacha)", price: 79000, weight: "660g" },
      { name: "35 sm (Oilaviy)", price: 99000, weight: "900g" }
    ]
  },
  {
    id: "bb-9",
    name: "Go'shtli Assorti Pitsa",
    category: "Pitsalar",
    desc: "Mol go'shti, tovuq filesi, dudlangan kolbasa, qo'ziqorin va zaytun mevasi.",
    img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=700&q=80",
    variants: [
      { name: "25 sm (Kichik)", price: 64000, weight: "500g" },
      { name: "30 sm (O'rtacha)", price: 86000, weight: "750g" },
      { name: "35 sm (Oilaviy)", price: 108000, weight: "1020g" }
    ]
  },
  {
    id: "bb-10",
    name: "Royal Hot-Dog",
    category: "Hot-Dog & Sneklar",
    desc: "Yumshoq bulochka, grilda pishgan sosiska, xantal, ketchup va qovurilgan piyoz.",
    img: "https://images.unsplash.com/photo-1619740455993-9e612b1af08a?auto=format&fit=crop&w=700&q=80",
    variants: [
      { name: "Klassik Hot-Dog", price: 18000, weight: "180g" },
      { name: "Pishloqli Hot-Dog", price: 23000, weight: "220g" },
      { name: "Double Sosiska XL", price: 29000, weight: "290g" }
    ]
  },
  {
    id: "bb-11",
    name: "Club Sandwich",
    category: "Hot-Dog & Sneklar",
    desc: "Qovurilgan tost noni, tovuq filesi, pishloq, yangi sabzavotlar va fri kartoshkasi.",
    img: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=700&q=80",
    variants: [
      { name: "2 qavatli Tovuqli", price: 32000, weight: "280g" },
      { name: "3 qavatli Klassik", price: 39000, weight: "360g" },
      { name: "Go'shtli Mega Club", price: 46000, weight: "430g" }
    ]
  },
  {
    id: "bb-12",
    name: "Qarsildoq Kartoshka Fri",
    category: "Hot-Dog & Sneklar",
    desc: "Oltinrang qilib qovurilgan yangi kartoshka bo'laklari dengiz tuzi bilan.",
    img: "https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&w=700&q=80",
    variants: [
      { name: "Kichik (S)", price: 14000, weight: "100g" },
      { name: "O'rtacha (M)", price: 19000, weight: "150g" },
      { name: "Katta + Pishloq sousi (L)", price: 26000, weight: "220g" }
    ]
  },
  {
    id: "bb-13",
    name: "Tovuq Naggetslari",
    category: "Tovuq & Qanotchalar",
    desc: "100% tabiiy tovuq ko'krak go'shtidan tayyorlangan mayin va qarsildoq naggetslar.",
    img: "https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=700&q=80",
    variants: [
      { name: "6 dona + 1 sous", price: 22000, weight: "140g" },
      { name: "9 dona + 2 sous", price: 31000, weight: "210g" },
      { name: "15 dona + 3 sous", price: 47000, weight: "350g" }
    ]
  },
  {
    id: "bb-14",
    name: "Buffalo Qanotchalari",
    category: "Tovuq & Qanotchalar",
    desc: "Maxsus achchiq-shirin glazurda pishirilgan sersuv tovuq qanotchalari.",
    img: "https://images.unsplash.com/photo-1608039755401-742074f0548d?auto=format&fit=crop&w=700&q=80",
    variants: [
      { name: "5 dona (Start)", price: 28000, weight: "220g" },
      { name: "8 dona (Medium)", price: 42000, weight: "350g" },
      { name: "14 dona (Party Box)", price: 68000, weight: "600g" }
    ]
  },
  {
    id: "bb-15",
    name: "Chicken Strips (Tenders)",
    category: "Tovuq & Qanotchalar",
    desc: "Uzunchoq kesilgan qarsildoq tovuq bo'lakchalari maxsus ziravorlar bilan.",
    img: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=700&q=80",
    variants: [
      { name: "3 dona", price: 21000, weight: "150g" },
      { name: "5 dona", price: 33000, weight: "250g" },
      { name: "8 dona", price: 49000, weight: "400g" }
    ]
  },
  {
    id: "bb-16",
    name: "Meksikancha Taco",
    category: "Lavashlar",
    desc: "Qarsildoq makkajo'xori tortilyasi ichida qiymalangan mol go'shti, loviya va salsa sousi.",
    img: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=700&q=80",
    variants: [
      { name: "2 dona Taco", price: 30000, weight: "240g" },
      { name: "3 dona Taco", price: 42000, weight: "360g" },
      { name: "4 dona Taco + Nachos", price: 55000, weight: "480g" }
    ]
  },
  {
    id: "bb-17",
    name: "Pishloqli Tayoqchalar",
    category: "Hot-Dog & Sneklar",
    desc: "Ichidagi mozzarella pishlog'i cho'ziluvchan qarsildoq panirovkadagi tayoqchalar.",
    img: "https://images.unsplash.com/photo-1531749668029-2db88e4276c7?auto=format&fit=crop&w=700&q=80",
    variants: [
      { name: "5 dona", price: 24000, weight: "160g" },
      { name: "8 dona", price: 36000, weight: "250g" },
      { name: "12 dona", price: 49000, weight: "380g" }
    ]
  },
  {
    id: "bb-18",
    name: "BURGER&BITE Mega Combo",
    category: "Kombo Setlar",
    desc: "Classic Smash Burger + Kartoshka Fri + Muzdek Ichimlik + Firmenniy sous.",
    img: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=700&q=80",
    variants: [
      { name: "1 kishilik Solo Combo", price: 52000, weight: "650g" },
      { name: "2 kishilik Duo Combo", price: 98000, weight: "1250g" },
      { name: "4 kishilik Family Feast", price: 185000, weight: "2400g" }
    ]
  },
  {
    id: "bb-19",
    name: "Muzdek Moxito & Limonad",
    category: "Ichimliklar",
    desc: "Yangi yalpiz, laym bo'laklari va muz bilan tayyorlangan tetiklashtiruvchi ichimlik.",
    img: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=700&q=80",
    variants: [
      { name: "0.4 L (Klassik Laym)", price: 15000, weight: "400ml" },
      { name: "0.5 L (Qulupnayli)", price: 18000, weight: "500ml" },
      { name: "1.0 L (Grafin / Oilaviy)", price: 32000, weight: "1000ml" }
    ]
  },
  {
    id: "bb-20",
    name: "Shokoladli Milkshake",
    category: "Ichimliklar",
    desc: "Tabiiy muzqaymoq, sut va Belgiya shokoladidan tayyorlangan quyuq kokteyl.",
    img: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=700&q=80",
    variants: [
      { name: "Vanilli (0.35 L)", price: 20000, weight: "350ml" },
      { name: "Shokoladli (0.45 L)", price: 24000, weight: "450ml" },
      { name: "Oreo & Karamel (0.5 L)", price: 28000, weight: "500ml" }
    ]
  }
];

// O'zbekistonning 12 ta viloyati va ularning tumanlari
const UZBEKISTAN_REGIONS = {
  "Andijon viloyati": [
    "Andijon shahri", "Andijon tumani", "Asaka tumani", "Baliqchi tumani",
    "Bo'ston tumani", "Buloqboshi tumani", "Izboskan tumani", "Jalaquduq tumani",
    "Xo'jaobod tumani", "Qo'rg'ontepa tumani", "Marhamat tumani", "Oltinko'l tumani",
    "Paxtaobod tumani", "Shahrixon tumani", "Ulug'nor tumani", "Xonobod shahri"
  ],
  "Buxoro viloyati": [
    "Buxoro shahri", "Buxoro tumani", "G'ijduvon tumani", "Jondor tumani",
    "Kogon shahri", "Kogon tumani", "Olot tumani", "Peshku tumani",
    "Qorako'l tumani", "Qorovulbozor tumani", "Romitan tumani", "Shofirkon tumani", "Vobkent tumani"
  ],
  "Farg'ona viloyati": [
    "Farg'ona shahri", "Farg'ona tumani", "Marg'ilon shahri", "Qo'qon shahri",
    "Quvasoy shahri", "Bag'dod tumani", "Beshariq tumani", "Buvayda tumani",
    "Dang'ara tumani", "Furqat tumani", "Oltiariq tumani", "Qo'shtepa tumani",
    "Quva tumani", "Rishton tumani", "So'x tumani", "Toshloq tumani",
    "Uchko'prik tumani", "O'zbekiston tumani", "Yozyovon tumani"
  ],
  "Jizzax viloyati": [
    "Jizzax shahri", "Arnasoy tumani", "Baxmal tumani", "Do'stlik tumani",
    "Forish tumani", "G'allaorol tumani", "Mirzacho'l tumani", "Paxtakor tumani",
    "Sharof Rashidov tumani", "Yangiobod tumani", "Zafarobod tumani", "Zarbdor tumani", "Zomin tumani"
  ],
  "Xorazm viloyati": [
    "Urganch shahri", "Urganch tumani", "Xiva shahri", "Xiva tumani",
    "Bog'ot tumani", "Gurlan tumani", "Xonqa tumani", "Hazorasp tumani",
    "Qo'shko'pir tumani", "Shovot tumani", "Tuproqqal'a tumani", "Yangiariq tumani", "Yangibozor tumani"
  ],
  "Namangan viloyati": [
    "Namangan shahri", "Namangan tumani", "Chortoq tumani", "Chust tumani",
    "Kosonsoy tumani", "Mingbuloq tumani", "Norin tumani", "Pop tumani",
    "To'raqo'rg'on tumani", "Uchqo'rg'on tumani", "Uychi tumani", "Yangiqo'rg'on tumani"
  ],
  "Navoiy viloyati": [
    "Navoiy shahri", "Zarafshon shahri", "G'ozg'on shahri", "Karmana tumani",
    "Konimex tumani", "Navbahor tumani", "Nurota tumani", "Qiziltepa tumani",
    "Tomdi tumani", "Uchquduq tumani", "Xatirchi tumani"
  ],
  "Qashqadaryo viloyati": [
    "Qarshi shahri", "Qarshi tumani", "Shahrisabz shahri", "Shahrisabz tumani",
    "Chiroqchi tumani", "Dehqonobod tumani", "G'uzor tumani", "Kasbi tumani",
    "Kitob tumani", "Koson tumani", "Ko'kdala tumani", "Mirishkor tumani",
    "Muborak tumani", "Nishon tumani", "Qamashi tumani", "Yakkabog' tumani"
  ],
  "Samarqand viloyati": [
    "Samarqand shahri", "Samarqand tumani", "Kattaqo'rg'on shahri", "Kattaqo'rg'on tumani",
    "Bulung'ur tumani", "Ishtixon tumani", "Jomboy tumani", "Narpay tumani",
    "Nurobod tumani", "Oqdaryo tumani", "Pastdarg'om tumani", "Paxtachi tumani",
    "Payariq tumani", "Qo'shrabot tumani", "Toyloq tumani", "Urgut tumani"
  ],
  "Sirdaryo viloyati": [
    "Guliston shahri", "Guliston tumani", "Shirin shahri", "Yangiyer shahri",
    "Boyovut tumani", "Mirzaobod tumani", "Oqoltin tumani", "Sardoba tumani",
    "Sayxunobod tumani", "Sirdaryo tumani", "Xovos tumani"
  ],
  "Surxondaryo viloyati": [
    "Termiz shahri", "Termiz tumani", "Angor tumani", "Bandixon tumani",
    "Boysun tumani", "Denov tumani", "Jarqo'rg'on tumani", "Muzrabot tumani",
    "Oltinsoy tumani", "Qiziriq tumani", "Qumqo'rg'on tumani", "Sariosiyo tumani",
    "Sherobod tumani", "Sho'rchi tumani", "Uzun tumani"
  ],
  "Toshkent viloyati": [
    "Nurafshon shahri", "Angren shahri", "Bekobod shahri", "Chirchiq shahri",
    "Olmaliq shahri", "Ohangaron shahri", "Yangiyo'l shahri", "Bekobod tumani",
    "Bo'ka tumani", "Bo'stonliq tumani", "Chinoz tumani", "Ohangaron tumani",
    "Oqqo'rg'on tumani", "Parkent tumani", "Piskent tumani", "Qibray tumani",
    "Quyi Chirchiq tumani", "O'rta Chirchiq tumani", "Toshkent tumani",
    "Yangiyo'l tumani", "Yuqori Chirchiq tumani", "Zangiota tumani"
  ]
};
