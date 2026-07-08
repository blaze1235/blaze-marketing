/* BlazeRent Studio — content.js
 * The template content engine: captions, carousel packs, reel concepts,
 * hashtags and ideas, in EN / RU / UZ. Works fully offline.
 * Every template has a stable id — the taste memory scores these ids.
 */
window.BR = window.BR || {};

(function () {

  /* =====================================================================
   * Niche vocabulary — templates use {thing}/{things}/{ride} placeholders
   * so the same pack adapts to cars, apartments, equipment, or anything.
   * ===================================================================== */
  const NICHE = {
    gaming: {
      en: { one: 'Prime account', many: 'Prime accounts', ride: 'account', verb: 'play' },
      ru: { one: 'Prime аккаунт', many: 'Prime аккаунты', ride: 'аккаунт', verb: 'играть' },
      uz: { one: 'Prime hisob', many: 'Prime hisoblar', ride: 'hisob', verb: "o'ynash" }
    },
    car: {
      en: { one: 'car', many: 'cars', ride: 'ride', verb: 'drive' },
      ru: { one: 'авто', many: 'автомобили', ride: 'тачку', verb: 'поехать' },
      uz: { one: 'avtomobil', many: 'avtomobillar', ride: 'mashina', verb: 'haydash' }
    },
    apartment: {
      en: { one: 'apartment', many: 'apartments', ride: 'place', verb: 'stay' },
      ru: { one: 'квартиру', many: 'квартиры', ride: 'квартиру', verb: 'заселиться' },
      uz: { one: 'kvartira', many: 'kvartiralar', ride: 'uy', verb: 'yashash' }
    },
    equipment: {
      en: { one: 'tool', many: 'equipment', ride: 'gear', verb: 'work' },
      ru: { one: 'инструмент', many: 'оборудование', ride: 'технику', verb: 'работать' },
      uz: { one: 'asbob', many: 'uskunalar', ride: 'texnika', verb: 'ishlash' }
    },
    generic: {
      en: { one: 'rental', many: 'rentals', ride: 'rental', verb: 'go' },
      ru: { one: 'аренду', many: 'варианты', ride: 'аренду', verb: 'начать' },
      uz: { one: 'ijara', many: 'ijaralar', ride: 'ijara', verb: 'boshlash' }
    }
  };

  const DEFAULT_SUBJECT = {
    en: 'your next {ride}', ru: '{ride} мечты', uz: 'keyingi {ride}'
  };

  /* =====================================================================
   * CAPTION TEMPLATES
   * types: promo | showcase | tip | engagement | announcement
   * tones: bold | friendly | luxury | playful  (empty = fits all tones)
   * ===================================================================== */
  const CAP = {
    en: {
      promo: {
        hooks: [
          { id: 'en.pr.h1', tones: ['bold'], t: '🔥 STOP scrolling. This deal won\'t wait.' },
          { id: 'en.pr.h2', tones: ['bold'], t: '⚡ {subject} — and it can be yours today.' },
          { id: 'en.pr.h3', tones: ['friendly'], t: 'Hey {city} 👋 we\'ve got something for your weekend.' },
          { id: 'en.pr.h4', tones: ['luxury'], t: 'Some things shouldn\'t be owned. They should be experienced. ✨' },
          { id: 'en.pr.h5', tones: ['playful'], t: 'POV: you just found the best deal in {city} 😏' }
        ],
        bodies: [
          { id: 'en.pr.b1', t: '{subject} is waiting at {name}. Clean, checked, and ready when you are. Book it in 2 minutes — no queues, no drama.' },
          { id: 'en.pr.b2', t: 'Why pay full price for ownership when you can {verb} whenever you want? {name} makes it simple: pick, book, enjoy.' },
          { id: 'en.pr.b3', tones: ['luxury'], t: 'At {name}, every {one} is prepared to a standard, not a deadline. Immaculate, insured, delivered to you.' },
          { id: 'en.pr.b4', t: 'Weekend plans, business trip, or just because — {name} has the right {one} at the right price. Availability is limited this week.' }
        ],
        ctas: [
          { id: 'en.pr.c1', t: '📲 DM us "BOOK" or reach {phone} — we\'ll hold it for you.' },
          { id: 'en.pr.c2', t: '👉 Tap the link in bio to reserve. Takes 2 minutes.' },
          { id: 'en.pr.c3', t: '📩 Message {handle} now — first come, first served.' },
          { id: 'en.pr.c4', tones: ['bold'], t: '⏳ Offer ends soon. DM "GO" before someone else does.' }
        ]
      },
      showcase: {
        hooks: [
          { id: 'en.sh.h1', t: '👀 Just landed in our fleet: {subject}.' },
          { id: 'en.sh.h2', tones: ['luxury'], t: 'Meet {subject}. Your weekend just got an upgrade. ✨' },
          { id: 'en.sh.h3', tones: ['bold'], t: 'This is not a stock photo. This is what you get. 📸' },
          { id: 'en.sh.h4', tones: ['playful'], t: 'Rate this one 1–10 👇 (we say 11)' }
        ],
        bodies: [
          { id: 'en.sh.b1', t: 'Freshly detailed, fully insured, zero surprises. {subject} from {name} — exactly as pictured, always.' },
          { id: 'en.sh.b2', t: 'Comfort where it matters, power when you want it. {subject} is available for daily and weekly rental in {city}.' },
          { id: 'en.sh.b3', tones: ['luxury'], t: 'Every detail checked. Every surface spotless. {subject} — because how you arrive matters.' }
        ],
        ctas: [
          { id: 'en.sh.c1', t: '📲 DM {handle} to check availability for your dates.' },
          { id: 'en.sh.c2', t: '💬 Comment "PRICE" and we\'ll send you the details.' },
          { id: 'en.sh.c3', t: '📞 {phone} — fast reply, fast booking.' }
        ]
      },
      tip: {
        hooks: [
          { id: 'en.tp.h1', t: '💡 A tip most people learn the hard way:' },
          { id: 'en.tp.h2', tones: ['bold'], t: '🚫 Don\'t rent anything before reading this.' },
          { id: 'en.tp.h3', tones: ['friendly'], t: 'Quick tip from the {name} team 👇' }
        ],
        bodies: [
          { id: 'en.tp.b1', t: 'Always check what\'s included before you pay — terms, support, everything. At {name} we put it all in writing upfront — so there are zero surprises.' },
          { id: 'en.tp.b2', t: 'Book ahead for weekends. The best {many} go first — and early birds get better rates too.' },
          { id: 'en.tp.b3', t: 'Ask exactly what you\'re getting before you commit. Honest companies (like us 😌) show it all upfront — it protects both sides.' },
          { id: 'en.tp.b4', t: '{subject}? Here\'s the short version: compare the full cost, not the headline price. Hidden terms are where budgets quietly die.' }
        ],
        ctas: [
          { id: 'en.tp.c1', t: '💾 Save this post — future you will thank you.' },
          { id: 'en.tp.c2', t: '❓ Got a question about renting? Ask in the comments — we answer everyone.' },
          { id: 'en.tp.c3', t: '📲 Follow {handle} for more no-nonsense rental tips.' }
        ]
      },
      engagement: {
        hooks: [
          { id: 'en.en.h1', tones: ['playful'], t: '🤔 Hot take: renting beats owning. Agree or disagree?' },
          { id: 'en.en.h2', t: '👇 Quick question for {city}:' },
          { id: 'en.en.h3', tones: ['playful'], t: 'You get {subject} for a whole weekend, free. Where do you go? 🗺️' }
        ],
        bodies: [
          { id: 'en.en.b1', t: 'A) Mountains 🏔️  B) Coast 🌊  C) Road trip with no plan 🛣️  D) Somewhere secret you\'re not telling us. Drop your answer below!' },
          { id: 'en.en.b2', t: 'What matters most when you rent — price, condition, or speed of service? Your answers genuinely shape what we do at {name}.' },
          { id: 'en.en.b3', t: 'Tag the friend who ALWAYS says "let\'s just take two {many}" and never books anything 😂' }
        ],
        ctas: [
          { id: 'en.en.c1', t: '💬 Comments are open — best answer gets a discount.' },
          { id: 'en.en.c2', t: '🏷️ Tag your travel buddy!' },
          { id: 'en.en.c3', t: '📲 And when you\'re ready to actually go — {handle} has you covered.' }
        ]
      },
      announcement: {
        hooks: [
          { id: 'en.an.h1', t: '📣 Big news from {name}!' },
          { id: 'en.an.h2', tones: ['bold'], t: '🚨 ANNOUNCEMENT — read this one.' },
          { id: 'en.an.h3', tones: ['friendly'], t: 'We\'ve been working on something... and it\'s finally here 🎉' }
        ],
        bodies: [
          { id: 'en.an.b1', t: '{subject} — starting now at {name}. We\'ll keep this short: it\'s live, it\'s real, and the first clients get the best of it.' },
          { id: 'en.an.b2', t: 'Say hello to {subject}! We built this because you asked for it. {name} keeps listening — keep telling us what you want next.' }
        ],
        ctas: [
          { id: 'en.an.c1', t: '📲 Details in DM — message {handle}.' },
          { id: 'en.an.c2', t: '👉 Link in bio for the full story.' },
          { id: 'en.an.c3', t: '🔔 Turn on notifications so you never miss a drop.' }
        ]
      }
    },

    ru: {
      promo: {
        hooks: [
          { id: 'ru.pr.h1', tones: ['bold'], t: '🔥 СТОП. Дальше не листай — такое бывает редко.' },
          { id: 'ru.pr.h2', t: '⚡ {subject} — уже сегодня может быть у тебя.' },
          { id: 'ru.pr.h3', tones: ['friendly'], t: '{city}, привет 👋 у нас для вас кое-что на выходные.' },
          { id: 'ru.pr.h4', tones: ['luxury'], t: 'Некоторые вещи не нужно покупать. Их нужно прожить. ✨' }
        ],
        bodies: [
          { id: 'ru.pr.b1', t: '{subject} ждёт вас в {name}. Чисто, проверено, готово к выдаче. Бронь за 2 минуты — без очередей и лишних вопросов.' },
          { id: 'ru.pr.b2', t: 'Зачем покупать, если можно взять и {verb} уже сегодня? {name} — это просто: выбрал, забронировал, поехал.' },
          { id: 'ru.pr.b3', t: 'Выходные, командировка или просто так — в {name} найдётся {one} под ваш бюджет. На этой неделе свободных мест мало.' }
        ],
        ctas: [
          { id: 'ru.pr.c1', t: '📲 Пишите «БРОНЬ» в директ или напишите {phone} — придержим для вас.' },
          { id: 'ru.pr.c2', t: '👉 Ссылка в шапке профиля. Бронь за 2 минуты.' },
          { id: 'ru.pr.c3', tones: ['bold'], t: '⏳ Предложение сгорит. Пишите {handle} прямо сейчас.' }
        ]
      },
      showcase: {
        hooks: [
          { id: 'ru.sh.h1', t: '👀 Новинка в нашем парке: {subject}.' },
          { id: 'ru.sh.h2', tones: ['luxury'], t: 'Знакомьтесь: {subject}. Ваши выходные только что стали лучше ✨' },
          { id: 'ru.sh.h3', tones: ['bold'], t: 'Это не фото из интернета. Это то, что вы получите. 📸' }
        ],
        bodies: [
          { id: 'ru.sh.b1', t: 'Свежая мойка, полная страховка, никаких сюрпризов. {subject} от {name} — всегда как на фото.' },
          { id: 'ru.sh.b2', t: 'Комфорт там, где нужно, мощность — когда хочется. {subject} доступен посуточно и на неделю в {city}.' }
        ],
        ctas: [
          { id: 'ru.sh.c1', t: '📲 Пишите {handle} — проверим свободные даты.' },
          { id: 'ru.sh.c2', t: '💬 Комментарий «ЦЕНА» — и мы пришлём все условия.' },
          { id: 'ru.sh.c3', t: '📞 {phone} — одно сообщение, и всё готово.' }
        ]
      },
      tip: {
        hooks: [
          { id: 'ru.tp.h1', t: '💡 Совет, который многие узнают слишком поздно:' },
          { id: 'ru.tp.h2', tones: ['bold'], t: '🚫 Не арендуйте ничего, пока не прочитаете это.' },
          { id: 'ru.tp.h3', tones: ['friendly'], t: 'Быстрый совет от команды {name} 👇' }
        ],
        bodies: [
          { id: 'ru.tp.b1', t: 'Всегда уточняйте, что входит в цену, до оплаты — условия, поддержка, всё. В {name} всё фиксируется письменно заранее — ноль сюрпризов.' },
          { id: 'ru.tp.b2', t: 'Бронируйте заранее на выходные. Лучшие {many} разбирают первыми — и ранняя бронь всегда дешевле.' },
          { id: 'ru.tp.b3', t: 'Уточняйте, что именно вы получаете, прежде чем платить. Честные компании (как мы 😌) показывают всё заранее — это защищает обе стороны.' }
        ],
        ctas: [
          { id: 'ru.tp.c1', t: '💾 Сохраните пост — пригодится.' },
          { id: 'ru.tp.c2', t: '❓ Есть вопрос про аренду? Пишите в комментариях — отвечаем всем.' },
          { id: 'ru.tp.c3', t: '📲 Подписывайтесь на {handle} — только честные советы.' }
        ]
      },
      engagement: {
        hooks: [
          { id: 'ru.en.h1', tones: ['playful'], t: '🤔 Спорное мнение: аренда лучше покупки. Согласны?' },
          { id: 'ru.en.h2', t: '👇 Быстрый вопрос для {city}:' },
          { id: 'ru.en.h3', tones: ['playful'], t: 'Вам дают {subject} на все выходные бесплатно. Куда едете? 🗺️' }
        ],
        bodies: [
          { id: 'ru.en.b1', t: 'А) Горы 🏔️  Б) Море 🌊  В) Роудтрип без плана 🛣️  Г) Секретное место. Пишите ответ ниже!' },
          { id: 'ru.en.b2', t: 'Что для вас важнее при аренде — цена, состояние или скорость сервиса? Ваши ответы реально влияют на то, что мы делаем в {name}.' }
        ],
        ctas: [
          { id: 'ru.en.c1', t: '💬 Комментарии открыты — за лучший ответ подарим скидку.' },
          { id: 'ru.en.c2', t: '🏷️ Отметьте друга, с которым поехали бы!' }
        ]
      },
      announcement: {
        hooks: [
          { id: 'ru.an.h1', t: '📣 Большие новости от {name}!' },
          { id: 'ru.an.h2', tones: ['bold'], t: '🚨 ВАЖНО — это стоит прочитать.' },
          { id: 'ru.an.h3', tones: ['friendly'], t: 'Мы долго готовили кое-что... и вот оно 🎉' }
        ],
        bodies: [
          { id: 'ru.an.b1', t: '{subject} — уже действует в {name}. Коротко: это работает, это реально, и первым достанется лучшее.' },
          { id: 'ru.an.b2', t: 'Встречайте: {subject}! Мы сделали это, потому что вы просили. {name} слушает — говорите, что нужно дальше.' }
        ],
        ctas: [
          { id: 'ru.an.c1', t: '📲 Подробности в директе — пишите {handle}.' },
          { id: 'ru.an.c2', t: '🔔 Включите уведомления, чтобы ничего не пропустить.' }
        ]
      }
    },

    uz: {
      promo: {
        hooks: [
          { id: 'uz.pr.h1', tones: ['bold'], t: '🔥 TO\'XTANG! Bunday taklif kamdan-kam bo\'ladi.' },
          { id: 'uz.pr.h2', t: '⚡ {subject} — bugunoq sizniki bo\'lishi mumkin.' },
          { id: 'uz.pr.h3', tones: ['friendly'], t: '{city}, salom 👋 dam olish kunlariga ajoyib taklifimiz bor.' }
        ],
        bodies: [
          { id: 'uz.pr.b1', t: '{subject} sizni {name}da kutmoqda. Toza, tekshirilgan va tayyor. 2 daqiqada band qiling — navbatsiz, ortiqcha savollarsiz.' },
          { id: 'uz.pr.b2', t: 'Sotib olish shartmi? {name} bilan xohlagan paytingizda oling va yo\'lga chiqing: tanladingiz, band qildingiz, ketdingiz.' },
          { id: 'uz.pr.b3', t: 'Dam olish, mehmon kutish yoki shunchaki sayr — {name}da budjetingizga mos {one} bor. Bu hafta joylar kam qoldi.' }
        ],
        ctas: [
          { id: 'uz.pr.c1', t: '📲 Direktga «BRON» deb yozing yoki {phone} orqali yozing.' },
          { id: 'uz.pr.c2', t: '👉 Bio\'dagi havola orqali band qiling. 2 daqiqa kifoya.' },
          { id: 'uz.pr.c3', tones: ['bold'], t: '⏳ Taklif tez tugaydi. Hoziroq {handle} ga yozing.' }
        ]
      },
      showcase: {
        hooks: [
          { id: 'uz.sh.h1', t: '👀 Parkimizdagi yangilik: {subject}.' },
          { id: 'uz.sh.h2', tones: ['luxury'], t: 'Tanishing: {subject}. Dam olishingiz yangi darajaga chiqdi ✨' },
          { id: 'uz.sh.h3', tones: ['bold'], t: 'Bu internetdagi rasm emas. Aynan shuni olasiz. 📸' }
        ],
        bodies: [
          { id: 'uz.sh.b1', t: 'Yangi yuvilgan, to\'liq sug\'urtalangan, hech qanday syurprizsiz. {name}dan {subject} — doim rasmda ko\'rganingizdek.' },
          { id: 'uz.sh.b2', t: 'Qulaylik ham, quvvat ham joyida. {subject} {city}da kunlik va haftalik ijaraga tayyor.' }
        ],
        ctas: [
          { id: 'uz.sh.c1', t: '📲 {handle} ga yozing — bo\'sh kunlarni tekshiramiz.' },
          { id: 'uz.sh.c2', t: '💬 Izohga «NARX» deb yozing — barcha shartlarni yuboramiz.' },
          { id: 'uz.sh.c3', t: '📞 {phone} — bitta xabar va hammasi tayyor.' }
        ]
      },
      tip: {
        hooks: [
          { id: 'uz.tp.h1', t: '💡 Ko\'pchilik kech biladigan maslahat:' },
          { id: 'uz.tp.h2', tones: ['bold'], t: '🚫 Buni o\'qimasdan hech narsa ijaraga olmang.' },
          { id: 'uz.tp.h3', tones: ['friendly'], t: '{name} jamoasidan qisqa maslahat 👇' }
        ],
        bodies: [
          { id: 'uz.tp.b1', t: 'To\'lovdan oldin narxga nima kirishini doim so\'rang — shartlar, qo\'llab-quvvatlash, hammasi. {name}da hammasi oldindan yozma qayd etiladi — syurprizlar yo\'q.' },
          { id: 'uz.tp.b2', t: 'Dam olish kunlariga oldindan band qiling. Eng zo\'r {many} birinchi bo\'lib ketadi — erta band qilganlar arzonroq oladi.' },
          { id: 'uz.tp.b3', t: 'To\'lovdan oldin aynan nima olayotganingizni aniqlashtiring. Halol kompaniyalar (biz kabi 😌) hammasini oldindan ko\'rsatadi — bu ikki tomonni ham himoya qiladi.' }
        ],
        ctas: [
          { id: 'uz.tp.c1', t: '💾 Postni saqlab qo\'ying — asqotadi.' },
          { id: 'uz.tp.c2', t: '❓ Ijara bo\'yicha savolingiz bormi? Izohda yozing — hammaga javob beramiz.' },
          { id: 'uz.tp.c3', t: '📲 Foydali maslahatlar uchun {handle} ni kuzating.' }
        ]
      },
      engagement: {
        hooks: [
          { id: 'uz.en.h1', tones: ['playful'], t: '🤔 Bahsli fikr: ijara sotib olishdan yaxshi. Rozimisiz?' },
          { id: 'uz.en.h2', t: '👇 {city} uchun tezkor savol:' },
          { id: 'uz.en.h3', tones: ['playful'], t: 'Sizga {subject} butun dam olishga bepul berildi. Qayerga borasiz? 🗺️' }
        ],
        bodies: [
          { id: 'uz.en.b1', t: 'A) Tog\'lar 🏔️  B) Suv bo\'yi 🌊  C) Rejasiz sayohat 🛣️  D) Sir joy. Javobingizni yozing!' },
          { id: 'uz.en.b2', t: 'Ijarada nima muhimroq — narx, holat yoki xizmat tezligi? Javoblaringiz {name} ishiga bevosita ta\'sir qiladi.' }
        ],
        ctas: [
          { id: 'uz.en.c1', t: '💬 Izohlar ochiq — eng zo\'r javobga chegirma beramiz.' },
          { id: 'uz.en.c2', t: '🏷️ Birga boradigan do\'stingizni belgilang!' }
        ]
      },
      announcement: {
        hooks: [
          { id: 'uz.an.h1', t: '📣 {name}dan katta yangilik!' },
          { id: 'uz.an.h2', tones: ['bold'], t: '🚨 MUHIM — buni o\'qib chiqing.' },
          { id: 'uz.an.h3', tones: ['friendly'], t: 'Uzoq tayyorlandik... va nihoyat tayyor 🎉' }
        ],
        bodies: [
          { id: 'uz.an.b1', t: '{subject} — {name}da ishga tushdi. Qisqasi: bu ishlaydi, bu haqiqiy va birinchilar eng zo\'rini oladi.' },
          { id: 'uz.an.b2', t: 'Kutib oling: {subject}! Buni siz so\'ragansiz — biz qildik. {name} sizni eshitadi, keyingisini ayting.' }
        ],
        ctas: [
          { id: 'uz.an.c1', t: '📲 Tafsilotlar direktda — {handle} ga yozing.' },
          { id: 'uz.an.c2', t: '🔔 Hech narsani o\'tkazib yubormaslik uchun bildirishnomani yoqing.' }
        ]
      }
    }
  };

  /* =====================================================================
   * HASHTAGS
   * ===================================================================== */
  const TAGS = {
    gaming: {
      en: ['#cs2', '#counterstrike2', '#primeaccount', '#csgo', '#gaming', '#pcgaming'],
      ru: ['#кс2', '#cs2', '#primeaccount', '#арендааккаунта', '#counterstrike', '#games'],
      uz: ['#cs2', '#hisobijara', '#gaming', '#kompyuteroyinlari']
    },
    car: {
      en: ['#carrental', '#rentacar', '#roadtrip', '#carlife', '#travel'],
      ru: ['#арендаавто', '#прокатавто', '#автопрокат', '#путешествие'],
      uz: ['#avtoijara', '#arendaavto', '#mashinaijara', '#sayohat']
    },
    apartment: {
      en: ['#apartmentrental', '#dailyrent', '#staywithus', '#travel'],
      ru: ['#арендаквартир', '#посуточно', '#квартирапосуточно'],
      uz: ['#kvartiraijara', '#kunlikijara', '#uyijara']
    },
    equipment: {
      en: ['#equipmentrental', '#toolrental', '#construction'],
      ru: ['#арендаоборудования', '#прокатинструмента'],
      uz: ['#uskunaijara', '#asbobijara']
    },
    generic: {
      en: ['#rental', '#rentnow', '#smartchoice'],
      ru: ['#аренда', '#прокат', '#выгодно'],
      uz: ['#ijara', '#qulay', '#arenda']
    }
  };

  /* =====================================================================
   * CAROUSEL PACKS — ready-made, niche-adaptive
   * ===================================================================== */
  const CAROUSELS = {
    en: [
      {
        id: 'en.gm.reasons', niche: 'gaming', title: '5 reasons to rent a Prime account instead of buying one',
        cover: { title: '5 reasons renting beats buying', badge: 'SAVE THIS' },
        slides: [
          { title: 'Way cheaper per session', body: 'A full account costs real money upfront. Rent a {one} for exactly the hours you\'ll actually play.' },
          { title: 'Zero ban risk on your money', body: 'If anything happens to the account, it\'s not your investment on the line. Play stress-free.' },
          { title: 'Try before you commit', body: 'Not sure Prime is worth it long-term? Rent a few sessions first and decide for yourself.' },
          { title: 'Instant access, no grinding', body: 'Skip the trust factor grind and rank resets. Jump straight into Prime matchmaking.' },
          { title: 'Flexible durations', body: 'Need it for an hour, a day, or a week? {name} has {many} for exactly your schedule.' }
        ],
        cta: { title: 'Ready when you are 🔥', body: 'Message {handle} on Telegram — we\'ll get you in within minutes.' },
        caption: '5 honest reasons renting a Prime account beats buying one 👆\n\nWhich one convinced you? Tell us below 👇'
      },
      {
        id: 'en.gm.steps', niche: 'gaming', title: 'How it works — rent in 3 easy steps',
        cover: { title: 'Renting with {name} in 3 easy steps', badge: 'HOW IT WORKS' },
        slides: [
          { title: 'Step 1 — Open the bot', body: 'Open {handle} on Telegram and top up your balance. Takes seconds, all payment methods supported.' },
          { title: 'Step 2 — Choose your duration', body: 'Pick an hour, a day, or a week. See exactly what rank range and trust factor you\'re getting.' },
          { title: 'Step 3 — Get instant access', body: 'Login details land in your chat immediately. Launch CS2 and queue up.' }
        ],
        cta: { title: 'That\'s literally it ✅', body: 'No waiting, no forms. Start now → {handle}' },
        caption: 'Renting a Prime account takes 3 steps and about 60 seconds ⏱️\n\nSave this for when you need it 💾'
      },
      {
        id: 'en.gm.faq', niche: 'gaming', title: 'FAQ — you asked, we answered',
        cover: { title: 'Your top questions, answered honestly', badge: 'FAQ' },
        slides: [
          { title: '"Is it safe?"', body: 'Yes — every account is monitored and rotated regularly. Your balance and chats stay private.' },
          { title: '"What if I get banned?"', body: 'Play fair and you\'re fine. Accounts are for legitimate matchmaking, not cheating or smurfing abuse.' },
          { title: '"Can I play ranked / Premier?"', body: 'Yes! All {many} come Prime-enabled with real trust factor, ready for competitive queue.' },
          { title: '"How fast is delivery?"', body: 'Instant. The bot hands you login details the second your payment clears.' }
        ],
        cta: { title: 'More questions? 💬', body: 'Message {handle} — we reply in minutes, any hour.' },
        caption: 'We collected your most-asked questions and answered honestly 👆\n\nAnything we missed? Ask below 👇'
      },
      {
        id: 'en.gm.mistakes', niche: 'gaming', title: '5 mistakes to avoid when renting an account',
        cover: { title: '5 mistakes that ruin a rental session', badge: 'AVOID THESE' },
        slides: [
          { title: 'Not checking the trust factor', body: 'Ask what rank range and trust factor you\'re getting before you pay — reputable services always show it upfront.' },
          { title: 'Ignoring the time limit', body: 'Know exactly when your session ends. Save your progress and log out cleanly before time runs out.' },
          { title: 'Using it for anything but CS2', body: 'These are Prime gaming accounts — logging other apps or changing account details gets sessions cut short.' },
          { title: 'Skipping 24/7 support', body: 'Something feels off mid-session? A real rental service answers immediately — don\'t just wait it out.' },
          { title: 'Choosing by price alone', body: 'Suspiciously cheap often means shared, unstable or already-flagged accounts. Reviews matter more than price.' }
        ],
        cta: { title: 'Rent smart 💡', body: 'At {name} everything is transparent by default. Try it: {handle}' },
        caption: 'These 5 mistakes ruin rental sessions every single day 💸\n\nNumber 2 is the one everybody forgets. Save this post 💾'
      },
      {
        id: 'en.gm.included', niche: 'gaming', title: 'What\'s included in your rental',
        cover: { title: 'What you ACTUALLY get for your money', badge: 'FULL TRANSPARENCY' },
        slides: [
          { title: 'Prime status guaranteed', body: 'Every account is Prime-enabled — full matchmaking access from the first match.' },
          { title: 'Real trust factor', body: 'Play with a healthy trust factor and a clean rank range, not a flagged smurf account.' },
          { title: '24/7 support', body: 'A real human answers in the bot. Any issue, any hour.' },
          { title: 'Secure balance system', body: 'Top up once, rent whenever. No repeated payment friction, no hidden fees.' }
        ],
        cta: { title: 'Transparent by design ✨', body: 'Questions? Message {handle} — we answer everything, fast.' },
        caption: 'The question we love most: "okay, but what do I ACTUALLY get?" 👀\n\nHere\'s everything included, slide by slide 👆'
      },
      {
        id: 'en.car.reasons', niche: 'car', title: '5 reasons to rent instead of owning',
        cover: { title: '5 reasons renting beats owning', badge: 'SAVE THIS' },
        slides: [
          { title: 'Zero maintenance headaches', body: 'Repairs, servicing, depreciation — all our problem, not yours. You just enjoy the {one}.' },
          { title: 'Pay only for what you use', body: 'Need it 5 days a month? Pay for 5 days. Ownership charges you for all 30.' },
          { title: 'Always the newest option', body: 'Upgrade any time. Our {many} are refreshed constantly — no long-term commitment to yesterday.' },
          { title: 'Insurance included', body: 'Full coverage comes standard with {name}. One price, no fine-print anxiety.' },
          { title: 'Instant availability', body: 'Book in 2 minutes, pick up today. Freedom shouldn\'t require paperwork marathons.' }
        ],
        cta: { title: 'Ready when you are 🔥', body: 'DM {handle} or call {phone} — we\'ll set you up today.' },
        caption: '5 honest reasons renting wins 👆\n\nWhich one convinced you? Tell us below 👇'
      },
      {
        id: 'en.car.steps', title: 'How it works — rent in 3 easy steps',
        cover: { title: 'Renting with {name} in 3 easy steps', badge: 'HOW IT WORKS' },
        slides: [
          { title: 'Step 1 — Choose', body: 'Browse our {many} and pick your favorite. Every listing shows real photos and the real price.' },
          { title: 'Step 2 — Book', body: 'Send a DM or call {phone}. We confirm availability in minutes and lock in your dates.' },
          { title: 'Step 3 — Enjoy', body: 'Pick up or get it delivered. Sign, go, enjoy. Return it just as easily.' }
        ],
        cta: { title: 'That\'s literally it ✅', body: 'No queues. No hidden fees. Start now → {handle}' },
        caption: 'Renting with {name} takes 3 steps and about 10 minutes of your life 👆\n\nSave this for when you need it 💾'
      },
      {
        id: 'en.car.mistakes', title: '5 mistakes to avoid when renting',
        cover: { title: '5 renting mistakes that cost people money', badge: 'AVOID THESE' },
        slides: [
          { title: 'Comparing daily rates only', body: 'The daily rate is bait. Compare the FULL cost: deposit, insurance, delivery, extras.' },
          { title: 'Not reading deposit terms', body: 'When is it returned? What can be withheld? Get it in writing before you pay.' },
          { title: 'Skipping the inspection', body: 'Walk around, photograph everything, note existing wear — together with the manager.' },
          { title: 'Booking last minute', body: 'Weekend demand is brutal. Book 2–3 days ahead for better choice AND better prices.' },
          { title: 'Choosing by price alone', body: 'Suspiciously cheap usually means suspiciously serviced. Reviews > rates.' }
        ],
        cta: { title: 'Rent smart, not sorry 💡', body: 'At {name} everything is transparent by default. DM {handle} to see for yourself.' },
        caption: 'These 5 mistakes cost renters real money every single day 💸\n\nNumber 3 is the one everybody skips. Save this post 💾'
      },
      {
        id: 'en.car.included', title: 'What\'s included in your price',
        cover: { title: 'What you ACTUALLY get for your money', badge: 'FULL TRANSPARENCY' },
        slides: [
          { title: 'Full insurance', body: 'Coverage included from minute one. You\'re protected, period.' },
          { title: 'Clean & inspected', body: 'Every {one} is cleaned and technically checked before every single handover.' },
          { title: '24/7 support', body: 'A real human answers. Any issue, any hour — we pick up the phone.' },
          { title: 'No hidden fees', body: 'The price we quote is the price you pay. Screenshot this — we mean it.' }
        ],
        cta: { title: 'Transparent by design ✨', body: 'Questions? DM {handle} — we answer everything, fast.' },
        caption: 'The question we love most: "okay, but what\'s the REAL price?" 👀\n\nHere\'s everything included, slide by slide 👆'
      },
      {
        id: 'en.car.faq', title: 'FAQ — you asked, we answered',
        cover: { title: 'Your top questions, answered honestly', badge: 'FAQ' },
        slides: [
          { title: '"What documents do I need?"', body: 'Just your ID and license (where applicable). We handle the rest in 10 minutes.' },
          { title: '"Is there a deposit?"', body: 'Yes — and it\'s returned in full when everything checks out. Terms in writing, always.' },
          { title: '"Can you deliver?"', body: 'Yes! Delivery across {city} available. Tell us where and when.' },
          { title: '"What if something breaks?"', body: 'Call us, we solve it. Insurance covers the big stuff; we cover the stress.' }
        ],
        cta: { title: 'More questions? 💬', body: 'DM {handle} — average reply time: minutes, not days.' },
        caption: 'We collected your most-asked questions and answered honestly 👆\n\nAnything we missed? Ask below 👇'
      },
      {
        id: 'en.car.choose', title: 'How to choose the right one',
        cover: { title: 'How to choose the right {one} (in 4 checks)', badge: 'GUIDE' },
        slides: [
          { title: 'Match it to the mission', body: 'City errands, mountain weekend, big group? The use case picks the {one} — not the other way around.' },
          { title: 'Check total capacity', body: 'People, luggage, needs. "It\'ll fit somehow" is how trips get ruined.' },
          { title: 'Ask about condition', body: 'Year, mileage/wear, last service. A good company answers instantly and happily.' },
          { title: 'Confirm the full price', body: 'One number, everything included. If they can\'t give it — walk away.' }
        ],
        cta: { title: 'Or just ask us 😉', body: 'Tell {handle} your plans — we\'ll match you with the perfect option.' },
        caption: 'Choosing the right {one} takes 4 checks and 5 minutes 👆\n\nOr skip the homework and just DM us your plans — we\'ll do the matching 🤝'
      },
      {
        id: 'en.car.myths', title: 'Myths about renting — busted',
        cover: { title: '4 renting myths people still believe', badge: 'MYTH BUSTERS' },
        slides: [
          { title: '"Renting is expensive"', body: 'MYTH. Count ownership honestly: purchase, insurance, maintenance, depreciation. Renting wins for most usage patterns.' },
          { title: '"The good ones are always taken"', body: 'MYTH. Book 2–3 days ahead and the whole fleet is yours to choose from.' },
          { title: '"There are always hidden fees"', body: 'MYTH (with good companies). At {name} the quoted price IS the final price.' },
          { title: '"The paperwork takes forever"', body: 'MYTH. 10 minutes, one signature, done. We timed it.' }
        ],
        cta: { title: 'Still skeptical? Test us 😎', body: 'DM {handle} — get a full transparent quote in minutes.' },
        caption: 'Myth-busting time 🔨\n\nWhich of these did YOU believe? Be honest 😄👇'
      }
    ],

    ru: [
      {
        id: 'ru.gm.reasons', niche: 'gaming', title: '5 причин арендовать Prime аккаунт, а не покупать',
        cover: { title: '5 причин: аренда выгоднее покупки аккаунта', badge: 'СОХРАНИ' },
        slides: [
          { title: 'Дешевле за сессию', body: 'Полный аккаунт стоит реальных денег сразу. Аренда {one} — это оплата ровно за те часы, что вы играете.' },
          { title: 'Ноль риска для ваших денег', body: 'Если с аккаунтом что-то случится — это не ваши вложения. Играйте спокойно.' },
          { title: 'Попробуй, прежде чем купить', body: 'Не уверены, нужен ли Prime навсегда? Возьмите пару сессий в аренду и решите сами.' },
          { title: 'Без гринда трастфактора', body: 'Пропустите набор трастфактора и сброс ранга. Сразу в Prime матчмейкинг.' },
          { title: 'Гибкие сроки', body: 'Нужно на час, день или неделю? В {name} есть {many} под любой график.' }
        ],
        cta: { title: 'Готовы? Мы тоже 🔥', body: 'Пишите {handle} в Telegram — подключим за пару минут.' },
        caption: '5 честных причин, почему аренда Prime аккаунта выгоднее покупки 👆\n\nКакая убедила вас? Пишите ниже 👇'
      },
      {
        id: 'ru.gm.steps', niche: 'gaming', title: 'Как это работает — аренда за 3 шага',
        cover: { title: 'Аренда в {name} за 3 простых шага', badge: 'ИНСТРУКЦИЯ' },
        slides: [
          { title: 'Шаг 1 — Открываете бота', body: 'Открываете {handle} в Telegram и пополняете баланс. Пара секунд, любые способы оплаты.' },
          { title: 'Шаг 2 — Выбираете срок', body: 'Час, день или неделя. Сразу видно ранг и трастфактор аккаунта.' },
          { title: 'Шаг 3 — Получаете доступ', body: 'Логин и пароль приходят в чат мгновенно. Запускайте CS2 и вставайте в очередь.' }
        ],
        cta: { title: 'Вот и всё ✅', body: 'Без ожидания и анкет. Начните → {handle}' },
        caption: 'Аренда Prime аккаунта — это 3 шага и 60 секунд ⏱️\n\nСохраните на будущее 💾'
      },
      {
        id: 'ru.gm.faq', niche: 'gaming', title: 'FAQ — вы спрашивали, мы отвечаем',
        cover: { title: 'Ваши главные вопросы — честные ответы', badge: 'FAQ' },
        slides: [
          { title: '«Это безопасно?»', body: 'Да — каждый аккаунт под контролем и регулярно проверяется. Ваш баланс и переписка остаются приватными.' },
          { title: '«А если забанят?»', body: 'Играйте честно — и всё будет в порядке. Аккаунты для обычного матчмейкинга, не для читов и смурфинга.' },
          { title: '«Можно играть рейтинг / Premier?»', body: 'Да! Все {many} с активным Prime и реальным трастфактором — готовы к рейтинговой игре.' },
          { title: '«Как быстро выдача?»', body: 'Мгновенно. Бот присылает данные для входа сразу после оплаты.' }
        ],
        cta: { title: 'Остались вопросы? 💬', body: 'Пишите {handle} — отвечаем за минуты, в любое время.' },
        caption: 'Собрали ваши самые частые вопросы и ответили честно 👆\n\nЧто-то упустили? Спрашивайте 👇'
      },
      {
        id: 'ru.gm.mistakes', niche: 'gaming', title: '5 ошибок при аренде аккаунта',
        cover: { title: '5 ошибок, которые портят сессию', badge: 'НЕ ДЕЛАЙТЕ ТАК' },
        slides: [
          { title: 'Не спросить трастфактор', body: 'Уточняйте ранг и трастфактор до оплаты — надёжный сервис всегда показывает это сразу.' },
          { title: 'Игнорировать лимит времени', body: 'Точно знайте, когда закончится сессия. Сохраняйтесь и выходите заранее.' },
          { title: 'Использовать не по назначению', body: 'Это игровые Prime аккаунты — вход в другие приложения или смена данных обрывает сессию.' },
          { title: 'Пропускать поддержку 24/7', body: 'Что-то не так во время игры? Надёжный сервис отвечает сразу — не ждите молча.' },
          { title: 'Выбирать только по цене', body: 'Подозрительно дёшево = подозрительно нестабильно. Отзывы важнее ценника.' }
        ],
        cta: { title: 'Арендуйте с умом 💡', body: 'В {name} всё прозрачно по умолчанию. Проверьте: {handle}' },
        caption: 'Эти 5 ошибок портят игровые сессии каждый день 💸\n\nПункт 2 забывают почти все. Сохраните пост 💾'
      },
      {
        id: 'ru.gm.included', niche: 'gaming', title: 'Что входит в аренду',
        cover: { title: 'За что вы НА САМОМ ДЕЛЕ платите', badge: 'ПРОЗРАЧНОСТЬ' },
        slides: [
          { title: 'Prime гарантирован', body: 'Каждый аккаунт с активным Prime — полный доступ к матчмейкингу с первой игры.' },
          { title: 'Реальный трастфактор', body: 'Играйте с здоровым трастфактором и чистым рангом, а не с зафлагованным смурфом.' },
          { title: 'Поддержка 24/7', body: 'В боте отвечает живой человек. Любой вопрос, любое время.' },
          { title: 'Безопасный баланс', body: 'Пополнили один раз — арендуйте когда угодно. Без повторных платежей и скрытых комиссий.' }
        ],
        cta: { title: 'Прозрачно по умолчанию ✨', body: 'Вопросы? Пишите {handle} — отвечаем быстро.' },
        caption: 'Любимый вопрос клиентов: «а что я РЕАЛЬНО получаю?» 👀\n\nВот всё, что включено — слайд за слайдом 👆'
      },
      {
        id: 'ru.car.reasons', niche: 'car', title: '5 причин арендовать, а не покупать',
        cover: { title: '5 причин: аренда выгоднее покупки', badge: 'СОХРАНИ' },
        slides: [
          { title: 'Ноль забот об обслуживании', body: 'Ремонт, ТО, амортизация — это наши проблемы, не ваши. Вы просто пользуетесь.' },
          { title: 'Платите только за использование', body: 'Нужно 5 дней в месяц? Платите за 5 дней. Владение берёт деньги за все 30.' },
          { title: 'Всегда свежий вариант', body: 'Меняйте когда угодно. Наш парк постоянно обновляется.' },
          { title: 'Страховка включена', body: 'Полное покрытие уже в цене {name}. Одна цифра, без мелкого шрифта.' },
          { title: 'Доступно прямо сейчас', body: 'Бронь за 2 минуты, выдача сегодня. Свобода не требует бюрократии.' }
        ],
        cta: { title: 'Готовы? Мы тоже 🔥', body: 'Пишите {handle} или звоните {phone} — оформим сегодня.' },
        caption: '5 честных причин, почему аренда выигрывает 👆\n\nКакая убедила вас? Пишите ниже 👇'
      },
      {
        id: 'ru.car.steps', title: 'Как это работает — аренда за 3 шага',
        cover: { title: 'Аренда в {name} за 3 простых шага', badge: 'ИНСТРУКЦИЯ' },
        slides: [
          { title: 'Шаг 1 — Выбираете', body: 'Смотрите наш парк и выбираете. Везде реальные фото и реальные цены.' },
          { title: 'Шаг 2 — Бронируете', body: 'Директ или звонок {phone}. Подтверждаем за минуты и фиксируем даты.' },
          { title: 'Шаг 3 — Пользуетесь', body: 'Забираете сами или привезём. Подпись — и вперёд. Возврат такой же простой.' }
        ],
        cta: { title: 'Вот и всё ✅', body: 'Без очередей и скрытых платежей. Начните → {handle}' },
        caption: 'Аренда в {name} — это 3 шага и 10 минут вашего времени 👆\n\nСохраните на будущее 💾'
      },
      {
        id: 'ru.car.mistakes', title: '5 ошибок при аренде',
        cover: { title: '5 ошибок аренды, которые стоят денег', badge: 'НЕ ДЕЛАЙТЕ ТАК' },
        slides: [
          { title: 'Сравнивать только цену за день', body: 'Цена за день — приманка. Сравнивайте ПОЛНУЮ стоимость: депозит, страховка, доставка.' },
          { title: 'Не читать условия депозита', body: 'Когда вернут? Что могут удержать? Только письменно и до оплаты.' },
          { title: 'Пропускать осмотр', body: 'Обойдите, сфотографируйте всё, зафиксируйте нюансы — вместе с менеджером.' },
          { title: 'Бронировать в последний момент', body: 'На выходные спрос бешеный. Бронь за 2–3 дня = выбор лучше, цена ниже.' },
          { title: 'Выбирать только по цене', body: 'Подозрительно дёшево = подозрительно обслужено. Отзывы важнее ценника.' }
        ],
        cta: { title: 'Арендуйте с умом 💡', body: 'В {name} всё прозрачно по умолчанию. Убедитесь: {handle}' },
        caption: 'Эти 5 ошибок ежедневно стоят людям реальных денег 💸\n\nПункт 3 пропускают почти все. Сохраните пост 💾'
      },
      {
        id: 'ru.car.included', title: 'Что входит в цену',
        cover: { title: 'За что вы НА САМОМ ДЕЛЕ платите', badge: 'ПРОЗРАЧНОСТЬ' },
        slides: [
          { title: 'Полная страховка', body: 'Покрытие с первой минуты. Вы защищены — точка.' },
          { title: 'Чистота и проверка', body: 'Перед каждой выдачей — мойка и техническая проверка. Каждый раз.' },
          { title: 'Поддержка 24/7', body: 'Отвечает живой человек. Любой вопрос, любое время.' },
          { title: 'Ноль скрытых платежей', body: 'Названная цена = финальная цена. Заскриньте — мы серьёзно.' }
        ],
        cta: { title: 'Прозрачно по умолчанию ✨', body: 'Вопросы? Пишите {handle} — отвечаем быстро.' },
        caption: 'Любимый вопрос клиентов: «а какая РЕАЛЬНАЯ цена?» 👀\n\nВот всё, что включено — слайд за слайдом 👆'
      },
      {
        id: 'ru.car.faq', title: 'FAQ — вы спрашивали, мы отвечаем',
        cover: { title: 'Ваши главные вопросы — честные ответы', badge: 'FAQ' },
        slides: [
          { title: '«Какие нужны документы?»', body: 'Паспорт и права (если нужны). Остальное оформим за 10 минут.' },
          { title: '«Есть ли депозит?»', body: 'Да — и он возвращается полностью, если всё в порядке. Условия письменно.' },
          { title: '«Есть доставка?»', body: 'Да! Доставим по {city}. Скажите куда и когда.' },
          { title: '«А если что-то сломается?»', body: 'Звоните — решаем. Страховка покрывает серьёзное, мы берём на себя стресс.' }
        ],
        cta: { title: 'Остались вопросы? 💬', body: 'Директ {handle} — отвечаем за минуты, не дни.' },
        caption: 'Собрали ваши самые частые вопросы и ответили честно 👆\n\nЧто-то упустили? Спрашивайте 👇'
      }
    ],

    uz: [
      {
        id: 'uz.gm.reasons', niche: 'gaming', title: 'Sotib olish emas, ijara — Prime hisob uchun 5 sabab',
        cover: { title: 'Ijara sotib olishdan yaxshi: 5 sabab', badge: 'SAQLAB QO\'YING' },
        slides: [
          { title: 'Har sessiya uchun arzon', body: 'To\'liq hisob darhol katta pul talab qiladi. {one} ijarasida faqat o\'ynagan soatlaringiz uchun to\'laysiz.' },
          { title: 'Pulingizga xavf yo\'q', body: 'Hisobga biror narsa bo\'lsa — bu sizning investitsiyangiz emas. Xotirjam o\'ynang.' },
          { title: 'Sinab ko\'ring, keyin qaror qiling', body: 'Prime kerakmi-yo\'qmi bilmayapsizmi? Bir necha marta ijaraga oling va o\'zingiz hal qiling.' },
          { title: 'Trast-faktor yig\'ishsiz', body: 'Trast-faktor yig\'ish va rank tushishini o\'tkazib yuboring. To\'g\'ridan-to\'g\'ri Prime matchmaking.' },
          { title: 'Moslashuvchan muddat', body: 'Bir soat, bir kun yoki bir hafta kerakmi? {name}da jadvalingizga mos {many} bor.' }
        ],
        cta: { title: 'Tayyormisiz? Biz ham 🔥', body: 'Telegramda {handle} ga yozing — bir necha daqiqada ulaymiz.' },
        caption: 'Prime hisobni ijaraga olish sotib olishdan nega yaxshi — 5 halol sabab 👆\n\nQaysi biri sizni ishontirdi? Pastda yozing 👇'
      },
      {
        id: 'uz.gm.faq', niche: 'gaming', title: 'FAQ — siz so\'radingiz, biz javob berdik',
        cover: { title: 'Eng ko\'p so\'raladigan savollar', badge: 'FAQ' },
        slides: [
          { title: '«Bu xavfsizmi?»', body: 'Ha — har bir hisob nazorat qilinadi va muntazam tekshiriladi. Balansingiz va yozishmalaringiz maxfiy qoladi.' },
          { title: '«Ban bo\'lsa-chi?»', body: 'Halol o\'ynasangiz muammo yo\'q. Hisoblar oddiy matchmaking uchun, cheat yoki smurf uchun emas.' },
          { title: '«Reyting/Premier o\'ynasa bo\'ladimi?»', body: 'Ha! Barcha {many} faol Prime va haqiqiy trast-faktor bilan — reyting o\'yiniga tayyor.' },
          { title: '«Qancha tezlikda beriladi?»', body: 'Darhol. To\'lov o\'tishi bilan bot kirish ma\'lumotlarini yuboradi.' }
        ],
        cta: { title: 'Yana savol bormi? 💬', body: '{handle} ga yozing — daqiqalarda javob beramiz.' },
        caption: 'Eng ko\'p so\'raladigan savollaringizga halol javob berdik 👆\n\nNimadir qoldimi? So\'rang 👇'
      },
      {
        id: 'uz.gm.included', niche: 'gaming', title: 'Ijaraga nima kiradi',
        cover: { title: 'Pulingizga ASLIDA nima olasiz', badge: 'OSHKORALIK' },
        slides: [
          { title: 'Prime kafolatlangan', body: 'Har bir hisobda faol Prime — birinchi o\'yindan to\'liq matchmaking huquqi.' },
          { title: 'Haqiqiy trast-faktor', body: 'Sog\'lom trast-faktor va toza rank bilan o\'ynang, bayroqlangan smurf bilan emas.' },
          { title: '24/7 qo\'llab-quvvatlash', body: 'Botda jonli odam javob beradi. Istalgan savol, istalgan vaqt.' },
          { title: 'Xavfsiz balans tizimi', body: 'Bir marta to\'ldiring — istalgan vaqt ijaraga oling. Qayta to\'lovsiz, yashirin komissiyasiz.' }
        ],
        cta: { title: 'Standart bo\'yicha shaffof ✨', body: 'Savollar? {handle} ga yozing — tez javob beramiz.' },
        caption: 'Mijozlarning sevimli savoli: «xo\'sh, ASLIDA nima olaman?» 👀\n\nMana narxga kiradigan hamma narsa 👆'
      },
      {
        id: 'uz.car.reasons', niche: 'car', title: 'Nega sotib olish emas, ijara — 5 sabab',
        cover: { title: 'Ijara sotib olishdan yaxshi: 5 sabab', badge: 'SAQLAB QO\'YING' },
        slides: [
          { title: 'Xizmat ko\'rsatish tashvishi yo\'q', body: 'Ta\'mir, texnik ko\'rik, eskirish — bularning bari bizning muammomiz. Siz faqat foydalanasiz.' },
          { title: 'Faqat foydalanganingizga to\'laysiz', body: 'Oyiga 5 kun kerakmi? 5 kun uchun to\'lang. Egalik esa barcha 30 kun uchun pul oladi.' },
          { title: 'Doim yangi variant', body: 'Xohlagan payt almashtiring. Parkimiz doimiy yangilanib turadi.' },
          { title: 'Sug\'urta narxga kiritilgan', body: 'To\'liq qamrov {name} narxida. Bitta raqam, mayda shriftsiz.' },
          { title: 'Hoziroq mavjud', body: '2 daqiqada bron, bugunoq olib ketasiz. Erkinlik byurokratiya talab qilmaydi.' }
        ],
        cta: { title: 'Tayyormisiz? Biz ham 🔥', body: '{handle} ga yozing yoki {phone} ga qo\'ng\'iroq qiling.' },
        caption: 'Ijara yutadigan 5 halol sabab 👆\n\nQaysi biri sizni ishontirdi? Pastda yozing 👇'
      },
      {
        id: 'uz.car.steps', title: 'Qanday ishlaydi — 3 qadamda ijara',
        cover: { title: '{name}da ijara — 3 oson qadam', badge: 'QO\'LLANMA' },
        slides: [
          { title: '1-qadam — Tanlaysiz', body: 'Parkimizni ko\'ring va yoqqanini tanlang. Hamma joyda haqiqiy rasm va haqiqiy narx.' },
          { title: '2-qadam — Band qilasiz', body: 'Direkt yoki {phone} ga qo\'ng\'iroq. Daqiqalar ichida tasdiqlaymiz.' },
          { title: '3-qadam — Foydalanasiz', body: 'O\'zingiz olib keting yoki yetkazamiz. Imzo — va yo\'lga! Qaytarish ham shunchalik oson.' }
        ],
        cta: { title: 'Hammasi shu ✅', body: 'Navbatsiz, yashirin to\'lovsiz. Boshlang → {handle}' },
        caption: '{name}da ijara — 3 qadam va 10 daqiqa vaqtingiz 👆\n\nKerak bo\'lganda topish uchun saqlab qo\'ying 💾'
      },
      {
        id: 'uz.car.mistakes', title: 'Ijaradagi 5 xato',
        cover: { title: 'Pulga tushadigan 5 ta ijara xatosi', badge: 'BUNDAY QILMANG' },
        slides: [
          { title: 'Faqat kunlik narxni solishtirish', body: 'Kunlik narx — qarmoq. TO\'LIQ narxni solishtiring: depozit, sug\'urta, yetkazish.' },
          { title: 'Depozit shartlarini o\'qimaslik', body: 'Qachon qaytariladi? Nima ushlab qolinishi mumkin? Faqat yozma ravishda, to\'lovdan oldin.' },
          { title: 'Ko\'rikdan o\'tkazmaslik', body: 'Aylanib chiqing, hammasini suratga oling — menejer bilan birga.' },
          { title: 'Oxirgi daqiqada band qilish', body: 'Dam olish kunlariga talab katta. 2–3 kun oldin band qiling — tanlov ko\'p, narx arzon.' },
          { title: 'Faqat narxga qarab tanlash', body: 'Shubhali arzon = shubhali xizmat. Sharhlar narxdan muhimroq.' }
        ],
        cta: { title: 'Aqlli ijara qiling 💡', body: '{name}da hammasi ochiq-oydin. Ishonch hosil qiling: {handle}' },
        caption: 'Bu 5 xato odamlarga har kuni pulga tushadi 💸\n\n3-bandini deyarli hamma o\'tkazib yuboradi. Saqlab qo\'ying 💾'
      },
      {
        id: 'uz.car.included', title: 'Narxga nima kiradi',
        cover: { title: 'Pulingizga ASLIDA nima olasiz', badge: 'OSHKORALIK' },
        slides: [
          { title: 'To\'liq sug\'urta', body: 'Birinchi daqiqadan qamrov. Siz himoyadasiz — nuqta.' },
          { title: 'Tozalik va tekshiruv', body: 'Har topshirishdan oldin — yuvish va texnik tekshiruv. Har safar.' },
          { title: '24/7 qo\'llab-quvvatlash', body: 'Jonli odam javob beradi. Istalgan savol, istalgan vaqt.' },
          { title: 'Yashirin to\'lovlar yo\'q', body: 'Aytilgan narx = yakuniy narx. Skrinshot qiling — jiddiy aytyapmiz.' }
        ],
        cta: { title: 'Standart bo\'yicha shaffof ✨', body: 'Savollar? {handle} ga yozing — tez javob beramiz.' },
        caption: 'Mijozlarning sevimli savoli: «xo\'sh, HAQIQIY narx qancha?» 👀\n\nMana narxga kiradigan hamma narsa 👆'
      },
      {
        id: 'uz.car.faq', title: 'FAQ — siz so\'radingiz, biz javob berdik',
        cover: { title: 'Eng ko\'p so\'raladigan savollar', badge: 'FAQ' },
        slides: [
          { title: '«Qanday hujjat kerak?»', body: 'Pasport va (kerak bo\'lsa) haydovchilik guvohnomasi. Qolganini 10 daqiqada rasmiylashtiramiz.' },
          { title: '«Depozit bormi?»', body: 'Ha — hammasi joyida bo\'lsa, to\'liq qaytariladi. Shartlar yozma ravishda.' },
          { title: '«Yetkazib berasizmi?»', body: 'Ha! {city} bo\'ylab yetkazamiz. Qayerga va qachonligini ayting.' },
          { title: '«Biror narsa buzilsa-chi?»', body: 'Qo\'ng\'iroq qiling — hal qilamiz. Sug\'urta kattasini qoplaydi, stressni biz olamiz.' }
        ],
        cta: { title: 'Yana savol bormi? 💬', body: '{handle} direktiga yozing — daqiqalarda javob beramiz.' },
        caption: 'Eng ko\'p so\'raladigan savollaringizga halol javob berdik 👆\n\nNimadir qoldimi? So\'rang 👇'
      }
    ]
  };

  /* =====================================================================
   * REEL CONCEPTS
   * scenes: { shot: filming direction, onscreen: text overlay, voice: voiceover }
   * ===================================================================== */
  const REELS = {
    en: [
      {
        id: 'en.reel.gm.pov', niche: 'gaming', title: 'POV: renting your first Prime account', format: 'POV / lifestyle',
        audio: 'Trending gaming phonk or hype build-up (check IG trending audio this week)',
        scenes: [
          { shot: 'Phone screen: opening the Telegram bot, close-up', onscreen: 'POV: your friends are queuing without you', voice: 'You could keep grinding trust factor...' },
          { shot: 'Screen recording: picking a duration in the bot', onscreen: 'so you rented a Prime account instead', voice: '...or you could skip straight to Prime.' },
          { shot: 'Screen recording: balance payment confirming', onscreen: 'paid from balance. no card typing.', voice: 'One tap. Balance already topped up.' },
          { shot: 'Login details arriving in chat, zoom on screen', onscreen: 'login delivered in seconds', voice: 'Instant delivery. No waiting around.' },
          { shot: 'Gameplay clip / queue pop, excited reaction', onscreen: '{handle} — get in 🔥', voice: 'BlazeRent. Get in.' }
        ],
        caption: 'From "let me grind trust factor" to queued up in under a minute 🔥\n\nRented, not owned. That\'s the whole story.'
      },
      {
        id: 'en.reel.gm.3things', niche: 'gaming', title: '3 things nobody tells you about account rental', format: 'Talking tips / value',
        audio: 'Calm lo-fi beat, voice-forward',
        scenes: [
          { shot: 'You to camera, confident, mid-shot', onscreen: '3 things rental services DON\'T tell you', voice: 'Three things most account rental services hope you never ask.' },
          { shot: 'B-roll: bot screen showing account details', onscreen: '1. Always check the trust factor first', voice: 'One: trust factor means everything. A good service shows it before you pay.' },
          { shot: 'B-roll: countdown timer on screen', onscreen: '2. Know your exact time limit', voice: 'Two: know exactly when your session ends — and log out clean before it does.' },
          { shot: 'B-roll: support chat replying instantly', onscreen: '3. Real support answers in minutes', voice: 'Three: if support goes quiet for hours, that\'s your red flag.' },
          { shot: 'Back to camera, logo overlay', onscreen: 'We tell you everything upfront. {handle}', voice: 'At {name}, we just tell you all of it upfront. That\'s the difference.' }
        ],
        caption: 'The 3 checks that save you a ruined session — every time 💡\n\nSave this before you rent anything 💾'
      },
      {
        id: 'en.reel.gm.speedrun', niche: 'gaming', title: 'Rental speedrun — under 60 seconds', format: 'Process / fast-cut',
        audio: 'Fast-paced electronic / speedrun-style audio',
        scenes: [
          { shot: 'Stopwatch starting on phone screen', onscreen: 'rental speedrun. timer starts NOW ⏱️', voice: '' },
          { shot: 'Screen recording: opening {handle} bot', onscreen: 'step 1: open the bot', voice: '' },
          { shot: 'Screen recording: choosing duration + paying', onscreen: 'step 2: pick duration, pay from balance', voice: '' },
          { shot: 'Login details land in chat instantly', onscreen: 'step 3: get login instantly ✓', voice: '' },
          { shot: 'Stopwatch stops, gameplay starts', onscreen: '0:41. queued up. that\'s the process.', voice: '' }
        ],
        caption: 'We timed it: 41 seconds from opening the bot to queuing up ⏱️🔥\n\nTry to beat it. Open {handle} 👇'
      },
      {
        id: 'en.reel.gm.mythbust', niche: 'gaming', title: '"Renting is a waste of money" — let\'s do the math', format: 'Myth-bust / hook + payoff',
        audio: 'Dramatic pause into upbeat drop',
        scenes: [
          { shot: 'You to camera, skeptical face', onscreen: '"renting is a waste of money" — okay, let\'s do the math', voice: 'Everyone says renting is a waste. Let\'s actually count.' },
          { shot: 'Numbers appearing on screen (text overlays)', onscreen: 'buying: full price + ban risk + no refunds 📉', voice: 'Buying: you pay full price upfront, and if it gets flagged, that money is just gone.' },
          { shot: 'Cut to clean shot of the bot screen', onscreen: 'renting: pay only for hours played', voice: 'Renting: one transparent price, only for the hours you actually play.' },
          { shot: 'You to camera, shrug + smile', onscreen: 'use it when you need it. skip the risk.', voice: 'Play when you want. Skip the risk entirely.' },
          { shot: 'Logo card', onscreen: 'the math says {handle} 🧮', voice: 'The math says {name}.' }
        ],
        caption: 'We did the math so you don\'t have to 🧮\n\nSpoiler: renting wins for anyone who isn\'t playing 8 hours a day. DM us for the real numbers.'
      },
      {
        id: 'en.reel.gm.top3', niche: 'gaming', title: 'Top 3 most-rented durations this month', format: 'Listicle / showcase',
        audio: 'Upbeat trending countdown audio',
        scenes: [
          { shot: 'Fast zoom-in title card', onscreen: 'TOP 3 most-rented durations 🏆', voice: 'These three got booked more than everything else combined.' },
          { shot: 'Bot screen showing the 1-hour option', onscreen: '#3 — the quick session', voice: 'Number three: perfect for a fast match with friends.' },
          { shot: 'Bot screen showing the 1-day option', onscreen: '#2 — the weekend grinder', voice: 'Number two: a full day of uninterrupted Prime queue.' },
          { shot: 'Bot screen showing the 1-week option', onscreen: '#1 — the tournament prep 👑', voice: 'And number one... a full week for serious ranked grinding.' },
          { shot: 'Logo card', onscreen: 'pick yours → {handle}', voice: 'Pick your duration before the weekend does.' }
        ],
        caption: 'The people have voted with their bookings 🏆\n\nWhich duration would YOU pick? 1, 2 or 3 👇'
      },
      {
        id: 'en.reel.pov', niche: 'car', title: 'POV: your weekend upgrade', format: 'POV / lifestyle',
        audio: 'Trending upbeat phonk or feel-good pop (check IG trending audio this week)',
        scenes: [
          { shot: 'Hand reaching for keys / door handle, slow-mo', onscreen: 'POV: you decided your weekend deserves better', voice: 'You could stay home...' },
          { shot: 'Door opens, reveal the {one}, low angle', onscreen: 'so you did something about it', voice: '...or you could do this.' },
          { shot: 'Driving / using shot, golden hour, window down', onscreen: 'no loans. no maintenance. just the good part', voice: 'All of the experience, none of the ownership headache.' },
          { shot: 'Arrival at scenic spot, wide shot', onscreen: 'rented in 10 minutes from {name}', voice: 'Booked in minutes. Delivered ready.' },
          { shot: 'Logo close + smile to camera', onscreen: '{handle} — your move 🔥', voice: 'BlazeRent. Your move.' }
        ],
        caption: 'Weekends are too short for "maybe next time" 🔥\n\nBooked in 10 min → picked up same day. That\'s the whole story.'
      },
      {
        id: 'en.reel.3things', title: '3 things nobody tells you about renting', format: 'Talking tips / value',
        audio: 'Calm lo-fi beat, voice-forward',
        scenes: [
          { shot: 'You to camera, confident, mid-shot', onscreen: '3 things rental companies DON\'T tell you', voice: 'Three things most rental companies hope you never ask.' },
          { shot: 'B-roll: paperwork / price list close-up', onscreen: '1. The daily rate is not the real price', voice: 'One: the daily rate means nothing. Ask for the full, final number.' },
          { shot: 'B-roll: walking around the {one}, inspecting', onscreen: '2. Always photograph BEFORE you take it', voice: 'Two: photograph everything at pickup — honest companies insist on it.' },
          { shot: 'B-roll: phone with booking confirmation', onscreen: '3. Booking early = better price', voice: 'Three: book two or three days early. Better choice, better rate.' },
          { shot: 'Back to camera, logo overlay', onscreen: 'We tell you everything upfront. {handle}', voice: 'At {name}, we just tell you all of it upfront. That\'s the difference.' }
        ],
        caption: 'The 3 questions that save renters money — every single time 💡\n\nSave this before you book anything 💾'
      },
      {
        id: 'en.reel.beforeafter', title: 'Handover standard — before your booking', format: 'Process / trust-builder',
        audio: 'Satisfying / ASMR-style sound or trending "clean" audio',
        scenes: [
          { shot: 'Timelapse: cleaning / preparing the {one}', onscreen: 'what happens before YOUR booking', voice: '' },
          { shot: 'Close-ups: details being wiped, checked', onscreen: 'every. single. time.', voice: '' },
          { shot: 'Checklist on clipboard / tablet, ticks appearing', onscreen: 'inspected ✓ insured ✓ spotless ✓', voice: '' },
          { shot: 'Final reveal, hero shot with keys held to camera', onscreen: 'this is the standard at {name}', voice: '' },
          { shot: 'Logo card', onscreen: 'book yours → {handle}', voice: '' }
        ],
        caption: 'POV: what your {one} goes through before you ever touch it 🧼✨\n\nThe standard is the standard. {handle}'
      },
      {
        id: 'en.reel.mythbust', title: '"Renting is expensive" — let\'s do the math', format: 'Myth-bust / hook + payoff',
        audio: 'Dramatic pause into upbeat drop',
        scenes: [
          { shot: 'You to camera, skeptical face', onscreen: '"renting is expensive" — okay, let\'s do the math', voice: 'Everyone says renting is expensive. Let\'s actually count.' },
          { shot: 'Numbers appearing on screen (text overlays)', onscreen: 'ownership: purchase + insurance + service + depreciation 📉', voice: 'Ownership: the purchase, insurance, servicing, parking, and it loses value every day.' },
          { shot: 'Cut to clean shot of the {one}', onscreen: 'renting: one number. everything included.', voice: 'Renting: one transparent number, everything included.' },
          { shot: 'You to camera, shrug + smile', onscreen: 'use it when you need it. skip the rest.', voice: 'Pay for the days you actually use. Skip everything else.' },
          { shot: 'Logo card', onscreen: 'the math says {handle} 🧮', voice: 'The math says {name}.' }
        ],
        caption: 'We did the math so you don\'t have to 🧮\n\nSpoiler: the spreadsheet picks renting. DM us for real numbers for your case.'
      },
      {
        id: 'en.reel.day', title: 'A day with us — behind the scenes', format: 'Behind the scenes / personality',
        audio: 'Warm acoustic or trending storytelling audio',
        scenes: [
          { shot: 'Morning: opening up, lights on', onscreen: '7:30 — we open before you wake up', voice: '' },
          { shot: 'Prepping {many}, quick cuts', onscreen: 'every {one} prepped like it\'s the first one', voice: '' },
          { shot: 'Client handover moment, handshake, smile', onscreen: 'the best part of the job', voice: '' },
          { shot: 'Phone ringing, team answering', onscreen: 'yes, we really answer 24/7', voice: '' },
          { shot: 'Evening wide shot, logo overlay', onscreen: 'this is {name}. see you tomorrow 🔥', voice: '' }
        ],
        caption: 'A regular day at {name} — no filters, just the work 🔧🔥\n\nWho should we film next: the manager or the cleaning crew? 😄'
      },
      {
        id: 'en.reel.top3', title: 'Top 3 picks this month', format: 'Listicle / showcase',
        audio: 'Upbeat trending countdown audio',
        scenes: [
          { shot: 'Fast zoom-in title card', onscreen: 'TOP 3 most-booked this month 🏆', voice: 'These three got booked more than everything else combined.' },
          { shot: 'Hero shot of pick #3, slow pan', onscreen: '#3 — the smart choice', voice: 'Number three: the value king. Maximum result, minimum budget.' },
          { shot: 'Hero shot of pick #2, slow pan', onscreen: '#2 — the crowd favorite', voice: 'Number two: the one everyone asks for by name.' },
          { shot: 'Hero shot of pick #1, dramatic reveal', onscreen: '#1 — the legend 👑', voice: 'And number one... books out days in advance. You know why.' },
          { shot: 'Logo card', onscreen: 'reserve yours → {handle}', voice: 'Reserve yours before the weekend does.' }
        ],
        caption: 'The people have voted with their bookings 🏆\n\nWhich one would YOU take? 1, 2 or 3 👇'
      },
      {
        id: 'en.reel.speedrun', title: 'Booking speedrun — under 60 seconds', format: 'Process / fast-cut',
        audio: 'Fast-paced electronic / speedrun-style audio',
        scenes: [
          { shot: 'Stopwatch starting on phone screen', onscreen: 'booking speedrun. timer starts NOW ⏱️', voice: '' },
          { shot: 'Screen recording: opening IG profile', onscreen: 'step 1: open {handle}', voice: '' },
          { shot: 'Screen recording: typing DM "BOOK"', onscreen: 'step 2: DM us "BOOK"', voice: '' },
          { shot: 'Reply arriving instantly, dates confirmed', onscreen: 'step 3: pick your dates ✓', voice: '' },
          { shot: 'Stopwatch stops, keys in hand', onscreen: '0:47. that\'s it. that\'s the process.', voice: '' }
        ],
        caption: 'We timed it: 47 seconds from DM to confirmed booking ⏱️🔥\n\nTry to beat it. DM "BOOK" 👇'
      }
    ],

    ru: [
      {
        id: 'ru.reel.gm.pov', niche: 'gaming', title: 'POV: арендуешь первый Prime аккаунт', format: 'POV / лайфстайл',
        audio: 'Трендовый гейминг-фонк или хайповый бит (проверьте тренды IG на этой неделе)',
        scenes: [
          { shot: 'Экран телефона: открывается Telegram-бот, крупно', onscreen: 'POV: друзья уже в очереди без тебя', voice: 'Можно продолжать копить трастфактор...' },
          { shot: 'Запись экрана: выбор срока в боте', onscreen: 'а можно сразу взять Prime в аренду', voice: '...а можно сразу в Prime.' },
          { shot: 'Запись экрана: оплата с баланса', onscreen: 'оплата с баланса. без ввода карты.', voice: 'Один тап. Баланс уже пополнен.' },
          { shot: 'Данные для входа приходят в чат, зум на экран', onscreen: 'логин выдан за секунды', voice: 'Мгновенная выдача. Никакого ожидания.' },
          { shot: 'Клип геймплея / вход в очередь, эмоция', onscreen: '{handle} — заходи 🔥', voice: '{name}. Заходи.' }
        ],
        caption: 'От «надо копить трастфактор» до очереди за минуту 🔥\n\nАренда, а не покупка. Вот и вся история.'
      },
      {
        id: 'ru.reel.gm.3things', niche: 'gaming', title: '3 вещи, о которых молчат сервисы аренды', format: 'Советы / польза',
        audio: 'Спокойный lo-fi, голос на первом плане',
        scenes: [
          { shot: 'Вы в камеру, уверенно', onscreen: '3 вещи, о которых сервисы аренды МОЛЧАТ', voice: 'Три вещи, о которых большинство сервисов надеется, что вы не спросите.' },
          { shot: 'B-roll: экран бота с данными аккаунта', onscreen: '1. Сначала проверяйте трастфактор', voice: 'Первое: трастфактор решает всё. Надёжный сервис показывает его до оплаты.' },
          { shot: 'B-roll: таймер обратного отсчёта на экране', onscreen: '2. Знайте точный лимит времени', voice: 'Второе: точно знайте, когда сессия закончится — и выходите заранее.' },
          { shot: 'B-roll: поддержка отвечает мгновенно в чате', onscreen: '3. Реальная поддержка отвечает за минуты', voice: 'Третье: если поддержка молчит часами — это тревожный знак.' },
          { shot: 'Снова в камеру, логотип', onscreen: 'Мы говорим всё сразу. {handle}', voice: 'В {name} мы просто говорим всё сразу. В этом разница.' }
        ],
        caption: '3 проверки, которые спасают вашу сессию — каждый раз 💡\n\nСохраните перед арендой 💾'
      },
      {
        id: 'ru.reel.gm.speedrun', niche: 'gaming', title: 'Спидран аренды — меньше 60 секунд', format: 'Процесс / быстрый монтаж',
        audio: 'Динамичный электронный / speedrun-звук',
        scenes: [
          { shot: 'Секундомер стартует на экране телефона', onscreen: 'спидран аренды. таймер СТАРТ ⏱️', voice: '' },
          { shot: 'Запись экрана: открытие бота {handle}', onscreen: 'шаг 1: открыть бота', voice: '' },
          { shot: 'Запись экрана: выбор срока и оплата', onscreen: 'шаг 2: выбрать срок, оплатить с баланса', voice: '' },
          { shot: 'Данные для входа приходят мгновенно', onscreen: 'шаг 3: получить логин сразу ✓', voice: '' },
          { shot: 'Секундомер останавливается, начинается игра', onscreen: '0:41. в очереди. вот и весь процесс.', voice: '' }
        ],
        caption: 'Засекли: 41 секунда от открытия бота до очереди ⏱️🔥\n\nПопробуйте побить рекорд. Открывайте {handle} 👇'
      },
      {
        id: 'ru.reel.gm.mythbust', niche: 'gaming', title: '«Аренда — трата денег» — посчитаем?', format: 'Разрушение мифа',
        audio: 'Драматичная пауза → бодрый дроп',
        scenes: [
          { shot: 'Вы в камеру, скептичное лицо', onscreen: '«аренда — трата денег». окей, посчитаем', voice: 'Все говорят, что аренда — это трата денег. Давайте честно посчитаем.' },
          { shot: 'Цифры появляются на экране', onscreen: 'покупка: полная цена + риск бана + без возврата 📉', voice: 'Покупка: вы платите всю сумму сразу, и если аккаунт зафлагают — деньги просто пропали.' },
          { shot: 'Чистый кадр экрана бота', onscreen: 'аренда: платите только за часы игры', voice: 'Аренда: одна прозрачная цена, только за те часы, что вы реально играете.' },
          { shot: 'Вы в камеру, пожимаете плечами', onscreen: 'играйте когда хотите. без риска.', voice: 'Играйте, когда хотите. Риск исключён полностью.' },
          { shot: 'Карточка с логотипом', onscreen: 'математика за {handle} 🧮', voice: 'Математика — за {name}.' }
        ],
        caption: 'Мы посчитали за вас 🧮\n\nСпойлер: аренда выигрывает у всех, кто не играет по 8 часов в день. Пишите в директ за точными цифрами.'
      },
      {
        id: 'ru.reel.pov', niche: 'car', title: 'POV: апгрейд твоих выходных', format: 'POV / лайфстайл',
        audio: 'Трендовый фонк или лёгкий поп (проверьте тренды IG на этой неделе)',
        scenes: [
          { shot: 'Рука тянется к ключам, слоу-мо', onscreen: 'POV: ты решил, что выходные заслуживают большего', voice: 'Можно остаться дома...' },
          { shot: 'Открывается дверь, ревил, нижний ракурс', onscreen: 'и сделал ход', voice: '...а можно вот так.' },
          { shot: 'В движении, золотой час', onscreen: 'без кредитов. без обслуживания. только кайф', voice: 'Все эмоции — без головной боли владения.' },
          { shot: 'Прибытие в красивое место', onscreen: 'аренда за 10 минут в {name}', voice: 'Бронь за минуты. Выдача — готово.' },
          { shot: 'Логотип + улыбка в камеру', onscreen: '{handle} — твой ход 🔥', voice: '{name}. Твой ход.' }
        ],
        caption: 'Выходные слишком короткие для «может, в следующий раз» 🔥\n\nБронь за 10 минут → выдача в тот же день.'
      },
      {
        id: 'ru.reel.3things', title: '3 вещи, о которых молчат прокаты', format: 'Советы / польза',
        audio: 'Спокойный lo-fi, голос на первом плане',
        scenes: [
          { shot: 'Вы в камеру, уверенно', onscreen: '3 вещи, о которых прокаты МОЛЧАТ', voice: 'Три вещи, о которых большинство прокатов надеется, что вы не спросите.' },
          { shot: 'B-roll: документы, прайс крупно', onscreen: '1. Цена за день — не настоящая цена', voice: 'Первое: цена за сутки ничего не значит. Спрашивайте полную финальную сумму.' },
          { shot: 'B-roll: осмотр, обход вокруг', onscreen: '2. Фотографируйте ДО получения', voice: 'Второе: фотографируйте всё при получении — честные компании сами настаивают.' },
          { shot: 'B-roll: телефон с подтверждением', onscreen: '3. Ранняя бронь = лучшая цена', voice: 'Третье: бронируйте за два-три дня. Выбор лучше, цена ниже.' },
          { shot: 'Снова в камеру, логотип', onscreen: 'Мы говорим всё сразу. {handle}', voice: 'В {name} мы просто говорим всё сразу. В этом разница.' }
        ],
        caption: '3 вопроса, которые экономят деньги при аренде — каждый раз 💡\n\nСохраните, пригодится 💾'
      },
      {
        id: 'ru.reel.beforeafter', title: 'Стандарт подготовки — до вашей брони', format: 'Процесс / доверие',
        audio: 'Satisfying / ASMR-звук или трендовый «clean» звук',
        scenes: [
          { shot: 'Таймлапс: мойка и подготовка', onscreen: 'что происходит ДО вашей брони', voice: '' },
          { shot: 'Крупные планы: детали, протирка', onscreen: 'каждый. раз.', voice: '' },
          { shot: 'Чек-лист, галочки появляются', onscreen: 'проверено ✓ застраховано ✓ идеально ✓', voice: '' },
          { shot: 'Финальный ревил, ключи в камеру', onscreen: 'это стандарт {name}', voice: '' },
          { shot: 'Карточка с логотипом', onscreen: 'бронируйте → {handle}', voice: '' }
        ],
        caption: 'POV: что проходит ваш {one}, прежде чем вы его коснётесь 🧼✨\n\nСтандарт есть стандарт. {handle}'
      },
      {
        id: 'ru.reel.mythbust', title: '«Аренда — это дорого» — посчитаем?', format: 'Разрушение мифа',
        audio: 'Драматичная пауза → бодрый дроп',
        scenes: [
          { shot: 'Вы в камеру, скептичное лицо', onscreen: '«аренда — это дорого». окей, посчитаем', voice: 'Все говорят, что аренда — это дорого. Давайте честно посчитаем.' },
          { shot: 'Цифры появляются на экране', onscreen: 'владение: покупка + страховка + ТО + амортизация 📉', voice: 'Владение: покупка, страховка, обслуживание, парковка — и каждый день оно дешевеет.' },
          { shot: 'Чистый кадр {one}', onscreen: 'аренда: одна цифра. всё включено.', voice: 'Аренда: одна прозрачная цифра, всё включено.' },
          { shot: 'Вы в камеру, пожимаете плечами', onscreen: 'платите за дни, когда пользуетесь', voice: 'Платите за дни, которыми реально пользуетесь. Остальное — мимо.' },
          { shot: 'Карточка с логотипом', onscreen: 'математика за {handle} 🧮', voice: 'Математика — за {name}.' }
        ],
        caption: 'Мы посчитали за вас 🧮\n\nСпойлер: таблица выбирает аренду. Напишите в директ — посчитаем ваш случай.'
      }
    ],

    uz: [
      {
        id: 'uz.reel.gm.pov', niche: 'gaming', title: 'POV: birinchi Prime hisobingizni ijaraga olyapsiz', format: 'POV / lifestyle',
        audio: 'Trenddagi gaming-fonk yoki hype musiqa (shu haftadagi IG trendlarini tekshiring)',
        scenes: [
          { shot: 'Telefon ekrani: Telegram bot ochilmoqda, yaqindan', onscreen: 'POV: do\'stlaring sensiz navbatda', voice: 'Trast-faktor yig\'ishda davom etish mumkin edi...' },
          { shot: 'Ekran yozuvi: botda muddat tanlanmoqda', onscreen: 'yoki Prime hisobni ijaraga olish mumkin', voice: '...yoki to\'g\'ridan-to\'g\'ri Prime.' },
          { shot: 'Ekran yozuvi: balansdan to\'lov tasdiqlanmoqda', onscreen: 'balansdan to\'lov. karta kiritmasdan.', voice: 'Bir bosish. Balans allaqachon to\'ldirilgan.' },
          { shot: 'Kirish ma\'lumotlari chatga keladi, ekranga zoom', onscreen: 'login soniyalarda yetkazildi', voice: 'Darhol yetkazish. Kutish yo\'q.' },
          { shot: 'O\'yin video / navbatga kirish, hayajon', onscreen: '{handle} — kir 🔥', voice: '{name}. Kir.' }
        ],
        caption: '«Trast-faktor yig\'ishim kerak»dan bir daqiqada navbatgacha 🔥\n\nSotib olish emas, ijara. Butun tarix shu.'
      },
      {
        id: 'uz.reel.gm.speedrun', niche: 'gaming', title: 'Ijara speedrun — 60 soniyadan kam', format: 'Jarayon / tezkor',
        audio: 'Tezkor elektron / speedrun uslubidagi ovoz',
        scenes: [
          { shot: 'Telefon ekranida sekundomer boshlanadi', onscreen: 'ijara speedrun. taymer START ⏱️', voice: '' },
          { shot: 'Ekran yozuvi: {handle} boti ochilmoqda', onscreen: '1-qadam: botni oching', voice: '' },
          { shot: 'Ekran yozuvi: muddat tanlash va to\'lov', onscreen: '2-qadam: muddatni tanlang, balansdan to\'lang', voice: '' },
          { shot: 'Kirish ma\'lumotlari darhol keladi', onscreen: '3-qadam: loginni darhol oling ✓', voice: '' },
          { shot: 'Sekundomer to\'xtaydi, o\'yin boshlanadi', onscreen: '0:41. navbatdasiz. jarayon shu.', voice: '' }
        ],
        caption: 'Vaqtni o\'lchadik: botni ochishdan navbatgacha 41 soniya ⏱️🔥\n\nRekordni urishga harakat qiling. {handle} ni oching 👇'
      },
      {
        id: 'uz.reel.pov', niche: 'car', title: 'POV: dam olish kunlaringiz yangi darajada', format: 'POV / lifestyle',
        audio: 'Trenddagi quvnoq musiqa (shu haftadagi IG trendlarini tekshiring)',
        scenes: [
          { shot: 'Qo\'l kalitga uzanadi, slow-mo', onscreen: 'POV: dam olishing yaxshisiga loyiq deb qaror qilding', voice: 'Uyda qolish mumkin edi...' },
          { shot: 'Eshik ochiladi, {one} ko\'rinadi, past rakurs', onscreen: 'va harakat qilding', voice: '...yoki mana bunday qilish mumkin.' },
          { shot: 'Harakatda, oltin soat', onscreen: 'kreditsiz. ta\'mirsiz. faqat zavq', voice: 'Barcha his-tuyg\'ular — egalik tashvishisiz.' },
          { shot: 'Chiroyli manzilga yetib kelish', onscreen: '{name}da 10 daqiqada ijara', voice: 'Daqiqalarda bron. Tayyor holda topshiramiz.' },
          { shot: 'Logo + kameraga tabassum', onscreen: '{handle} — navbat sizda 🔥', voice: '{name}. Navbat sizda.' }
        ],
        caption: 'Dam olish kunlari «keyinroq» uchun juda qisqa 🔥\n\n10 daqiqada bron → o\'sha kuni olib ketasiz.'
      },
      {
        id: 'uz.reel.3things', title: 'Ijara haqida aytilmaydigan 3 narsa', format: 'Maslahat / foyda',
        audio: 'Sokin lo-fi, ovoz birinchi o\'rinda',
        scenes: [
          { shot: 'Kameraga qarab, ishonch bilan', onscreen: 'Ijara firmalari AYTMAYDIGAN 3 narsa', voice: 'Ko\'pchilik ijara firmalari siz so\'ramasligingizga umid qiladigan uch narsa.' },
          { shot: 'B-roll: hujjatlar, narxlar yaqindan', onscreen: '1. Kunlik narx — haqiqiy narx emas', voice: 'Birinchi: kunlik narx hech narsani anglatmaydi. To\'liq yakuniy summani so\'rang.' },
          { shot: 'B-roll: ko\'rik, aylanib chiqish', onscreen: '2. Olishdan OLDIN suratga oling', voice: 'Ikkinchi: olayotganda hammasini suratga oling — halol kompaniyalar buni o\'zi taklif qiladi.' },
          { shot: 'B-roll: telefonda tasdiq', onscreen: '3. Erta bron = yaxshi narx', voice: 'Uchinchi: 2–3 kun oldin band qiling. Tanlov ko\'p, narx arzon.' },
          { shot: 'Yana kameraga, logo', onscreen: 'Biz hammasini oldindan aytamiz. {handle}', voice: '{name}da hammasini boshidanoq aytamiz. Farq shunda.' }
        ],
        caption: 'Ijarada pulni tejaydigan 3 savol 💡\n\nBand qilishdan oldin saqlab qo\'ying 💾'
      },
      {
        id: 'uz.reel.beforeafter', title: 'Topshirish standarti — bronigizdan oldin', format: 'Jarayon / ishonch',
        audio: 'Satisfying / ASMR uslubidagi ovoz',
        scenes: [
          { shot: 'Timelapse: yuvish va tayyorlash', onscreen: 'SIZNING bronigizdan oldin nima bo\'ladi', voice: '' },
          { shot: 'Yaqin planlar: detallar artiladi', onscreen: 'har. safar.', voice: '' },
          { shot: 'Cheklist, belgilar qo\'yiladi', onscreen: 'tekshirildi ✓ sug\'urtalandi ✓ toza ✓', voice: '' },
          { shot: 'Final: kalitlar kameraga', onscreen: 'bu — {name} standarti', voice: '' },
          { shot: 'Logo kartochkasi', onscreen: 'band qiling → {handle}', voice: '' }
        ],
        caption: 'POV: siz tegishingizdan oldin {one} nimalardan o\'tadi 🧼✨\n\nStandart — bu standart. {handle}'
      },
      {
        id: 'uz.reel.mythbust', title: '«Ijara qimmat» — hisoblaymizmi?', format: 'Mifni buzish',
        audio: 'Dramatik pauza → quvnoq drop',
        scenes: [
          { shot: 'Kameraga, shubhali qiyofa', onscreen: '«ijara qimmat». mayli, hisoblaymiz', voice: 'Hamma ijara qimmat deydi. Keling, halol hisoblaymiz.' },
          { shot: 'Ekranda raqamlar paydo bo\'ladi', onscreen: 'egalik: xarid + sug\'urta + ta\'mir + eskirish 📉', voice: 'Egalik: xarid, sug\'urta, ta\'mirlash — va u har kuni arzonlashib boradi.' },
          { shot: '{one}ning toza kadri', onscreen: 'ijara: bitta raqam. hammasi ichida.', voice: 'Ijara: bitta shaffof raqam, hammasi narx ichida.' },
          { shot: 'Kameraga, yelka qisish + tabassum', onscreen: 'faqat foydalangan kunlarga to\'lang', voice: 'Faqat haqiqatda foydalangan kunlaringizga to\'lang.' },
          { shot: 'Logo kartochkasi', onscreen: 'matematika {handle} tomonda 🧮', voice: 'Matematika {name} tomonda.' }
        ],
        caption: 'Biz siz uchun hisoblab chiqdik 🧮\n\nSpoyler: jadval ijarani tanlaydi. Direktga yozing — sizning holatingizni hisoblaymiz.'
      }
    ]
  };

  /* =====================================================================
   * IDEA BANK (dashboard + planner, UI language = EN)
   * ===================================================================== */
  const IDEAS = [
    { type: 'post', text: 'Showcase a rental duration with a clear price — instant-delivery angle sells' },
    { type: 'post', text: 'A "did you know" tip about trust factor — builds trust fast' },
    { type: 'post', text: 'Weekend promo: limited accounts free right now — create urgency honestly' },
    { type: 'carousel', text: '"5 mistakes to avoid when renting an account" — the highest-saving format' },
    { type: 'carousel', text: '"What\'s included in the price" — kills the #1 customer objection' },
    { type: 'carousel', text: 'FAQ carousel — answer the 4 questions your DMs keep getting' },
    { type: 'reel', text: 'POV reel: the moment login details land in the chat 🔑' },
    { type: 'reel', text: 'Rental speedrun — show how fast your process really is' },
    { type: 'reel', text: 'Behind the scenes: how support actually responds 24/7' },
    { type: 'post', text: 'Customer story: one sentence review + the duration they rented' },
    { type: 'reel', text: '"Let\'s do the math" — renting vs buying cost breakdown' },
    { type: 'carousel', text: '"How it works in 3 steps" — pin this one to your profile' },
    { type: 'post', text: 'Poll your audience: ranked grind or casual this weekend?' },
    { type: 'reel', text: 'Top 3 most-rented durations this month — countdown format' }
  ];

  const WEEK_TEMPLATE = [
    { day: 'Monday', type: 'post', title: 'Tip post — teach one thing about renting' },
    { day: 'Tuesday', type: 'reel', title: 'POV / lifestyle reel with your best item' },
    { day: 'Wednesday', type: 'carousel', title: 'Value carousel (mistakes / FAQ / how-it-works)' },
    { day: 'Thursday', type: 'post', title: 'Showcase post — one item, real photos, real price' },
    { day: 'Friday', type: 'reel', title: 'Weekend promo reel — urgency + offer' },
    { day: 'Saturday', type: 'post', title: 'Engagement post — question or poll' },
    { day: 'Sunday', type: 'post', title: 'Behind the scenes / team / customer story' }
  ];

  /* =====================================================================
   * GENERATOR FUNCTIONS
   * ===================================================================== */

  function nicheWords(lang) {
    const b = BR.store.brand;
    const n = NICHE[b.niche] || NICHE.generic;
    return n[lang] || n.en;
  }

  // Replace {placeholders} with brand values + params
  function fill(text, lang, extra = {}) {
    const b = BR.store.brand;
    const nw = nicheWords(lang);
    const map = {
      name: b.name || 'BlazeRent',
      city: b.city || (lang === 'ru' ? 'вашем городе' : lang === 'uz' ? 'shahringiz' : 'your city'),
      handle: b.handle || '@blazerent',
      phone: b.phone || (lang === 'ru' ? 'в Telegram' : lang === 'uz' ? 'Telegram' : 'our Telegram'),
      one: nw.one, many: nw.many, ride: nw.ride, verb: nw.verb,
      subject: extra.subject || fillSubject(lang, nw),
      offer: extra.offer || ''
    };
    return text.replace(/\{(\w+)\}/g, (m, k) => (map[k] !== undefined ? map[k] : m));
  }

  function fillSubject(lang, nw) {
    return (DEFAULT_SUBJECT[lang] || DEFAULT_SUBJECT.en).replace('{ride}', nw.ride);
  }

  function byTone(items, tone) {
    const fits = items.filter(i => !i.tones || i.tones.includes(tone));
    return fits.length ? fits : items;
  }

  const EMOJI_RE = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{200D}]/gu;
  function applyEmojiLevel(text, level) {
    if (level === 0) return text.replace(EMOJI_RE, '').replace(/  +/g, ' ').replace(/ \n/g, '\n').trim();
    return text; // levels 1-3 keep template emoji; 3 adds flair at caption build time
  }

  function buildHashtags(lang) {
    const b = BR.store.brand;
    const bank = (TAGS[b.niche] || TAGS.generic)[lang] || TAGS.generic.en;
    const set = new Set(bank);
    if (b.city) set.add('#' + b.city.toLowerCase().replace(/[^a-zа-яёЀ-ӿ']/gi, ''));
    if (b.name) set.add('#' + b.name.toLowerCase().replace(/\s+/g, ''));
    (b.hashtags || '').split(/[\s,]+/).filter(t => t.startsWith('#')).forEach(t => set.add(t.toLowerCase()));
    return [...set].slice(0, 18).join(' ');
  }

  /** Generate a full caption. Returns {text, ids} — ids feed the taste memory. */
  function generateCaption({ type, tone, lang, subject, offer }) {
    const pool = (CAP[lang] || CAP.en)[type] || (CAP[lang] || CAP.en).promo;
    const pick = BR.store.pickWeighted;
    const hook = pick(byTone(pool.hooks, tone), i => i.id);
    const body = pick(byTone(pool.bodies, tone), i => i.id);
    const cta = pick(byTone(pool.ctas, tone), i => i.id);
    const b = BR.store.brand;

    let parts = [
      fill(hook.t, lang, { subject, offer }),
      '',
      fill(body.t, lang, { subject, offer })
    ];
    if (offer) parts.push('', (b.emoji > 0 ? '📌 ' : '') + offer);
    parts.push('', fill(cta.t, lang, { subject, offer }), '', buildHashtags(lang));

    let text = parts.join('\n');
    text = applyEmojiLevel(text, b.emoji);
    if (b.emoji >= 3) text = '🔥 ' + text;
    return { text, ids: [hook.id, body.id, cta.id] };
  }

  /** Ready-made carousel packs for a language, sorted by taste score. */
  function nichePool(packs) {
    const niche = BR.store.brand.niche;
    const matched = packs.filter(p => (p.niche || 'car') === niche);
    if (matched.length) return matched;
    const carFallback = packs.filter(p => (p.niche || 'car') === 'car');
    return carFallback.length ? carFallback : packs;
  }

  function getCarouselPacks(lang) {
    const packs = nichePool(CAROUSELS[lang] || CAROUSELS.en);
    return [...packs].sort((a, b) => BR.store.tasteScore(b.id) - BR.store.tasteScore(a.id));
  }

  /** Expand a pack into render-ready slides + caption. */
  function buildCarouselFromPack(pack, lang) {
    const slides = [];
    slides.push({
      layout: 'cover',
      badge: fill(pack.cover.badge || '', lang),
      title: fill(pack.cover.title, lang),
      body: ''
    });
    pack.slides.forEach((s, i) => slides.push({
      layout: 'point',
      badge: String(i + 1).padStart(2, '0'),
      title: fill(s.title, lang),
      body: fill(s.body, lang)
    }));
    slides.push({
      layout: 'cta',
      badge: '',
      title: fill(pack.cta.title, lang),
      body: fill(pack.cta.body, lang)
    });
    const caption = fill(pack.caption, lang) + '\n\n' + buildHashtags(lang);
    return { slides, caption, ids: [pack.id], title: fill(pack.title, lang) };
  }

  /** Build a carousel from user-provided points ("Title | body" lines). */
  function buildCarouselFromPoints(title, lines, lang) {
    const slides = [{ layout: 'cover', badge: '', title: title || 'Untitled', body: '' }];
    lines.forEach((line, i) => {
      const [t, ...rest] = line.split('|');
      slides.push({
        layout: 'point',
        badge: String(i + 1).padStart(2, '0'),
        title: t.trim(),
        body: rest.join('|').trim()
      });
    });
    const b = BR.store.brand;
    const ctaText = {
      en: { title: 'Ready to book? 🔥', body: `DM ${b.handle}${b.phone ? ' or call ' + b.phone : ''} — we'll set you up.` },
      ru: { title: 'Готовы забронировать? 🔥', body: `Пишите ${b.handle}${b.phone ? ' или звоните ' + b.phone : ''} — всё оформим.` },
      uz: { title: 'Band qilishga tayyormisiz? 🔥', body: `${b.handle} ga yozing${b.phone ? ' yoki ' + b.phone + ' ga qo\'ng\'iroq qiling' : ''}.` }
    }[lang] || null;
    if (ctaText) slides.push({ layout: 'cta', badge: '', title: ctaText.title, body: ctaText.body });
    const caption = (title || '') + ' 👆\n\n' + buildHashtags(lang);
    return { slides, caption, ids: [], title: title || 'Custom carousel' };
  }

  /** Reel packs for a language, taste-sorted. */
  function getReelPacks(lang) {
    const packs = nichePool(REELS[lang] || REELS.en);
    return [...packs].sort((a, b) => BR.store.tasteScore(b.id) - BR.store.tasteScore(a.id));
  }

  /** Expand a reel pack into a render-ready script. */
  function buildReel(pack, lang) {
    return {
      id: pack.id,
      title: fill(pack.title, lang),
      format: pack.format,
      audio: pack.audio,
      scenes: pack.scenes.map(s => ({
        shot: fill(s.shot, lang),
        onscreen: fill(s.onscreen, lang),
        voice: fill(s.voice, lang),
        photo: null
      })),
      caption: fill(pack.caption, lang) + '\n\n' + buildHashtags(lang),
      ids: [pack.id]
    };
  }

  function randomIdea() {
    return IDEAS[Math.floor(Math.random() * IDEAS.length)];
  }

  function weekPlan() {
    return WEEK_TEMPLATE.map(d => ({
      id: 'plan_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
      day: d.day, type: d.type, title: d.title, status: 'idea'
    }));
  }

  BR.content = {
    generateCaption, buildHashtags,
    getCarouselPacks, buildCarouselFromPack, buildCarouselFromPoints,
    getReelPacks, buildReel,
    randomIdea, weekPlan,
    fill,
    TYPES: ['promo', 'showcase', 'tip', 'engagement', 'announcement'],
    TYPE_LABELS: { promo: '🔥 Promo', showcase: '✨ Showcase', tip: '💡 Tip', engagement: '💬 Engagement', announcement: '📣 News' },
    TONES: ['bold', 'friendly', 'luxury', 'playful'],
    TONE_LABELS: { bold: '⚡ Bold', friendly: '🤝 Friendly', luxury: '💎 Luxury', playful: '😄 Playful' },
    LANGS: ['en', 'ru', 'uz'],
    LANG_LABELS: { en: 'EN', ru: 'RU', uz: 'UZ' }
  };
})();
