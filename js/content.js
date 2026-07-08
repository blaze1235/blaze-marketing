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
    en: 'your next {ride}', ru: 'вашу следующую {ride}', uz: 'keyingi {ride}'
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
          { id: 'en.pr.c1', t: '📲 DM us "BOOK" or call {phone} — we\'ll hold it for you.' },
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
          { id: 'en.sh.c3', t: '📞 {phone} — quick call, quick booking.' }
        ]
      },
      tip: {
        hooks: [
          { id: 'en.tp.h1', t: '💡 A tip most people learn the hard way:' },
          { id: 'en.tp.h2', tones: ['bold'], t: '🚫 Don\'t rent anything before reading this.' },
          { id: 'en.tp.h3', tones: ['friendly'], t: 'Quick tip from the {name} team 👇' }
        ],
        bodies: [
          { id: 'en.tp.b1', t: 'Always check what\'s included in the price: insurance, mileage, deposit terms. At {name} we put it all in writing before you pay — so there are zero surprises.' },
          { id: 'en.tp.b2', t: 'Book 2–3 days ahead for weekends. The best {many} go first — and early birds get better rates too.' },
          { id: 'en.tp.b3', t: 'Photograph the {one} together with the manager at pickup. Honest companies (like us 😌) insist on it — it protects both sides.' },
          { id: 'en.tp.b4', t: '{subject}? Here\'s the short version: compare the full cost, not the daily rate. Delivery, insurance and deposit terms are where budgets quietly die.' }
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
          { id: 'ru.pr.c1', t: '📲 Пишите «БРОНЬ» в директ или звоните {phone} — придержим для вас.' },
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
          { id: 'ru.sh.c3', t: '📞 {phone} — один звонок, и всё готово.' }
        ]
      },
      tip: {
        hooks: [
          { id: 'ru.tp.h1', t: '💡 Совет, который многие узнают слишком поздно:' },
          { id: 'ru.tp.h2', tones: ['bold'], t: '🚫 Не арендуйте ничего, пока не прочитаете это.' },
          { id: 'ru.tp.h3', tones: ['friendly'], t: 'Быстрый совет от команды {name} 👇' }
        ],
        bodies: [
          { id: 'ru.tp.b1', t: 'Всегда уточняйте, что входит в цену: страховка, лимит пробега, условия депозита. В {name} всё фиксируется письменно до оплаты — ноль сюрпризов.' },
          { id: 'ru.tp.b2', t: 'Бронируйте за 2–3 дня до выходных. Лучшие {many} разбирают первыми — и ранняя бронь всегда дешевле.' },
          { id: 'ru.tp.b3', t: 'Фотографируйте {one} вместе с менеджером при получении. Честные компании (как мы 😌) сами на этом настаивают.' }
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
          { id: 'uz.pr.c1', t: '📲 Direktga «BRON» deb yozing yoki {phone} ga qo\'ng\'iroq qiling.' },
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
          { id: 'uz.sh.c3', t: '📞 {phone} — bir qo\'ng\'iroq va hammasi tayyor.' }
        ]
      },
      tip: {
        hooks: [
          { id: 'uz.tp.h1', t: '💡 Ko\'pchilik kech biladigan maslahat:' },
          { id: 'uz.tp.h2', tones: ['bold'], t: '🚫 Buni o\'qimasdan hech narsa ijaraga olmang.' },
          { id: 'uz.tp.h3', tones: ['friendly'], t: '{name} jamoasidan qisqa maslahat 👇' }
        ],
        bodies: [
          { id: 'uz.tp.b1', t: 'Narxga nima kirishini doim so\'rang: sug\'urta, limit, depozit shartlari. {name}da hammasi to\'lovdan oldin yozma qayd etiladi — syurprizlar yo\'q.' },
          { id: 'uz.tp.b2', t: 'Dam olish kunlariga 2–3 kun oldin band qiling. Eng zo\'r {many} birinchi bo\'lib ketadi — erta band qilganlar arzonroq oladi.' },
          { id: 'uz.tp.b3', t: 'Olayotganda {one}ni menejer bilan birga suratga oling. Halol kompaniyalar (biz kabi 😌) buni o\'zi taklif qiladi.' }
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
        id: 'en.car.reasons', title: '5 reasons to rent instead of owning',
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
        id: 'ru.car.reasons', title: '5 причин арендовать, а не покупать',
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
        id: 'uz.car.reasons', title: 'Nega sotib olish emas, ijara — 5 sabab',
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
        id: 'en.reel.pov', title: 'POV: your weekend upgrade', format: 'POV / lifestyle',
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
        id: 'ru.reel.pov', title: 'POV: апгрейд твоих выходных', format: 'POV / лайфстайл',
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
        id: 'uz.reel.pov', title: 'POV: dam olish kunlaringiz yangi darajada', format: 'POV / lifestyle',
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
    { type: 'post', text: 'Showcase your most popular item with real photos and this week\'s price' },
    { type: 'post', text: 'A "did you know" tip about deposits — builds trust fast' },
    { type: 'post', text: 'Weekend promo: limited slots left — create urgency honestly' },
    { type: 'carousel', text: '"5 mistakes to avoid when renting" — the highest-saving format' },
    { type: 'carousel', text: '"What\'s included in the price" — kills the #1 customer objection' },
    { type: 'carousel', text: 'FAQ carousel — answer the 4 questions your DMs keep getting' },
    { type: 'reel', text: 'POV reel: the moment a customer gets the keys 🔑' },
    { type: 'reel', text: 'Booking speedrun — show how fast your process really is' },
    { type: 'reel', text: 'Behind the scenes: how you prep before every handover' },
    { type: 'post', text: 'Customer story: one sentence review + the item they rented' },
    { type: 'reel', text: '"Let\'s do the math" — renting vs owning cost breakdown' },
    { type: 'carousel', text: '"How it works in 3 steps" — pin this one to your profile' },
    { type: 'post', text: 'Poll your audience: mountains or coast this weekend?' },
    { type: 'reel', text: 'Top 3 most-booked items this month — countdown format' }
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
      phone: b.phone || (lang === 'ru' ? 'нам' : lang === 'uz' ? 'bizga' : 'us'),
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
  function getCarouselPacks(lang) {
    const packs = CAROUSELS[lang] || CAROUSELS.en;
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
    const packs = REELS[lang] || REELS.en;
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
