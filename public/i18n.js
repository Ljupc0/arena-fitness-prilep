/* Arena Fitness Prilep — lightweight MK/EN translation layer.
   Static UI chrome is translated via data-i18n / data-i18n-html / data-i18n-placeholder
   attributes; dynamic strings (built in page <script> blocks) call I18N.t('key') directly
   and re-render on I18N.onChange(). Plan/schedule content coming from the database stays
   in Macedonian — that is member-facing operational data, not site chrome. */
var I18N = (function () {
  var STORAGE_KEY = 'arena_lang';

  var dict = {
    mk: {
      'nav.home': 'Почетна',
      'nav.plans': 'Ценовник',
      'nav.schedule': 'Распоред',
      'nav.trainers': 'Тренери',
      'nav.about': 'За нас',
      'nav.contact': 'Контакт',
      'nav.trial': 'Пробен термин',
      'nav.login': 'Најава',
      'nav.register': 'Регистрација',
      'nav.cta': 'Пријави се',
      'nav.profile': 'Мојот профил',
      'nav.logout': 'Одјава',

      'hero.eyebrow': 'Фитнес центар · Прилеп',
      'hero.title1': 'ТВОЈАТА ТРАНСФОРМАЦИЈА',
      'hero.title2': 'ПОЧНУВА ТУКА.',
      'hero.lead': 'Тегови, кардио, групни тренинзи и простор направен да те турка понатаму секој ден. Arena Fitness Prilep е местото каде почетниците стануваат редовни, а редовните стануваат посветени.',
      'hero.ctaPrimary': 'Закажи пробен термин',
      'hero.ctaSecondary': 'Види ценовник',
      'hero.stat1Value': '09–22',
      'hero.stat1Label': 'Пон–Пет работно време',
      'hero.stat2Value': '6',
      'hero.stat2Label': 'Пакети за членство',
      'hero.stat3Value': '15+',
      'hero.stat3Label': 'Групни термини неделно',
      'hero.badge': 'Отвораме секој ден · Пон–Саб',
      'hero.scrollCue': 'Скролувај',

      'features.eyebrow': 'Зошто Arena',
      'features.title': 'Сè што ти треба, на едно место.',
      'features.subtitle': 'Од првиот ден до личниот рекорд — опрема, простор и програми за секое ниво.',
      'features.f1Title': 'Целосна сала',
      'features.f1Body': 'Слободни тегови, машини и кардио зона за секој тип на тренинг.',
      'features.f2Title': 'Групни тренинзи',
      'features.f2Body': 'Функционален тренинг, HIIT, зумба, јога, спининг и пилатес — секоја недела.',
      'features.f3Title': 'Долго работно време',
      'features.f3Body': 'Отворено секој ден освен недела, до доцна навечер во текот на седмицата.',
      'features.f4Title': 'Флексибилни пакети',
      'features.f4Body': 'Од дневен влез до годишно членство — избери го она што ти одговара.',

      'pricingPreview.eyebrow': 'Ценовник',
      'pricingPreview.title': 'Пакети за членство',
      'pricingPreview.link': 'Целосен ценовник →',
      'pricingPreview.detailsBtn': 'Детали',
      'common.ribbon': 'Најбарано',
      'common.currency': 'ден',
      'common.addressLabel': 'Адреса',
      'common.phoneLabel': 'Телефон',
      'common.emailLabel': 'Email',
      'common.followUs': 'Следете нè:',

      'posts.eyebrow': 'Од салата',
      'posts.title': 'Храна, суплементи и трансформации.',
      'posts.subtitle': 'Илустративни објави во стил на нашиот Instagram — идеи за исхрана, совети за суплементи и приказни за напредок.',
      'posts.tabAll': 'Сите',
      'posts.tabFood': 'Храна',
      'posts.tabSupplements': 'Суплементи',
      'posts.tabTransformations': 'Трансформации',
      'posts.readMore': 'Прочитај повеќе →',
      'posts.p1Title': 'Оброк по тренинг',
      'posts.p1Body': 'Протеини + сложени јаглехидрати во првите 60 минути по тренингот.',
      'posts.p1Detail': 'Прозорецот од 30 до 60 минути по тренингот е кога мускулите најдобро ги примаат хранливите материи. Комбинација од 25-40г протеини (пилешко, риба, јајца или протеински прашок) и сложени јаглехидрати (ориз, компир, овошје) помага во опоравувањето на мускулното ткиво и надополнување на гликогенот. Не мора да биде совршено — важно е да не го прескокнеш оброкот целосно, особено по интензивен тренинг за сила.',
      'posts.p2Title': 'Мисирано на скара',
      'posts.p2Body': 'Лесен, богат со протеини оброк идеален за ден со тренинг за сила.',
      'posts.p2Detail': 'Мисираното месо е одличен извор на протеини со помалку заситени масти од класично говедско. На скара со малку зачини, лук и лимон, комбинирано со зелена салата и кафеав ориз — добиваш балансиран оброк што не те оптоварува пред вечерен тренинг. Идеален избор за денови кога тренираш сила и сакаш да останеш лесен.',
      'posts.p3Title': 'Овесна каша наутро',
      'posts.p3Body': 'Стабилна енергија за утринските термини на функционален тренинг.',
      'posts.p3Detail': 'Овесот ослободува енергија постепено благодарение на бавните јаглехидрати, за разлика од брзите шеќери кои носат нагол пад на енергијата. Со додаток на банана, лажица путер од јаткасти плодови и малку мед, добиваш оброк што трае низ цел утрински тренинг без чувство на тежина во стомакот.',
      'posts.p4Title': 'Протеини во прав',
      'posts.p4Body': 'Кога да користиш суплемент, а кога оброкот е доволен — прашај го тренерот.',
      'posts.p4Detail': 'Протеинскиот прав е практично решение кога немаш време за целосен оброк, но не е замена за разновидна исхрана. Ако веќе внесуваш доволно протеини преку храна (околу 1.6-2г по килограм телесна тежина), суплементот е само погодност, не неопходност. Секогаш провери со тренерот или со лекар пред да воведеш нов суплемент, особено ако имаш здравствени состојби.',
      'posts.p5Title': 'Креатин — основи',
      'posts.p5Body': 'Еден од најистражуваните суплементи за сила и издржливост.',
      'posts.p5Detail': 'Креатин моно-хидратот е меѓу најдобро истражуваните суплементи во спортската наука, со докажани придобивки за сила, експлозивност и опоравување при краткотрајни интензивни напори. Стандардна доза е околу 3-5г дневно, без потреба од „фаза на полнење". Ефектите се кумулативни — резултатите доаѓаат по неколку недели редовно користење, не преку ноќ.',
      'posts.p6Title': 'Хидратација',
      'posts.p6Body': 'Вода и електролити пред и по интензивен тренинг во салата.',
      'posts.p6Detail': 'Дехидратацијата од само 2% од телесната тежина може мерливо да ја намали физичката изведба и концентрацијата. Пиј вода редовно низ денот, не само за време на тренинг, а при подолги или поинтензивни сесии (особено во топли месеци) додади електролити за да ги надополниш минералите изгубени преку потењето.',
      'posts.p7Title': '3 месеци подоцна',
      'posts.p7Body': 'Редовност и прогресивно оптоварување — тоа е целата тајна.',
      'posts.p7Detail': 'Зад секоја видлива промена во првите 3 месеци стои едноставна формула: доследно присуство 3-4 пати неделно и постепено зголемување на оптоварувањето (тежина, повторувања или интензитет), не нагли скокови. Комбинирано со разумна исхрана и доволно сон за опоравување, резултатите доаѓаат природно — без екстремни диети или пречекорени тренинзи.',
      'posts.p8Title': 'Прв натпревар',
      'posts.p8Body': 'Од прв пробен термин до прва трка — приказна на наш член.',
      'posts.p8Detail': 'Многу членови започнуваат без никакво претходно спортско искуство, само со желба да пробаат нешто ново. Со водство од тренерите и постепено градење на кондиција преку групните тренинзи, некои стигнуваат до нивниот прв локален натпревар — не заради резултатот, туку заради довербата стекната низ месеците подготовка.',
      'posts.p9Title': 'Годишен напредок',
      'posts.p9Body': 'Пример за тоа што носи една година доследни тренинзи.',
      'posts.p9Detail': 'Една година редовни тренинзи носи повеќе од физичка промена — носи навика, дисциплина и подобра свест за сопственото тело. Комбинацијата од силови тренинзи, групни часови за кондиција и внимание на исхраната, одржувана низ целата година, дава резултати што нема брза диета да ги замени.',

      'trial.eyebrow': 'Прв чекор',
      'trial.title': 'Пробај бесплатно, без обврска.',
      'trial.body': 'Остави ги твоите податоци и нашиот тим ќе те контактира за да закажеме термин за твојата прва посета.',
      'trial.cta': 'Закажи пробен термин',

      'footer.contactTitle': 'Контакт',
      'footer.hoursTitle': 'Работно време',
      'footer.linksTitle': 'Брзи линкови',
      'footer.linkPlans': 'Ценовник',
      'footer.linkSchedule': 'Распоред на тренинзи',
      'footer.linkContact': 'Закажи пробен термин',
      'footer.linkAdmin': 'Admin',
      'footer.locationTitle': 'Локација',
      'footer.disclaimer': 'Демо/портфолио страница — не е официјална страница на Arena Fitness Prilep',

      'plans.eyebrow': 'Ценовник',
      'plans.title': 'Избери го својот пакет',
      'plans.subtitle': 'Сите пакети вклучуваат целосен пристап до салата. Цените се во денари (МКД). Немаш обврска — можеш да смениш пакет во секое време.',
      'plans.audienceAll': 'Сите',
      'plans.audienceMen': 'Мажи',
      'plans.audienceWomen': 'Жени',
      'plans.joinBtn': 'Пријави се',
      'plans.notSureEyebrow': 'Не си сигурен кој пакет?',
      'plans.notSureTitle': 'Дојди на бесплатен пробен термин.',
      'plans.notSureCta': 'Закажи пробен термин',

      'contact.eyebrow': 'Контакт',
      'contact.title': 'Закажи пробен термин',
      'contact.subtitle': 'Пополни ја формата и ќе те контактираме за да закажеме термин за твојата прва бесплатна посета.',
      'contact.formName': 'Име и презиме',
      'contact.formEmail': 'Email',
      'contact.formPhone': 'Телефон',
      'contact.formPhonePlaceholder': '070 000 000',
      'contact.formInterest': 'Пакет што те интересира',
      'contact.formInterestDefault': 'Не сум сигурен/а',
      'contact.formMessage': 'Порака (опционално)',
      'contact.formMessagePlaceholder': 'На пр. кога ти одговара термин, дали имаш искуство со тренинг...',
      'contact.formSubmit': 'Испрати барање',
      'contact.msgSuccess': 'Ви благодариме! Ќе ве контактираме наскоро за да закажеме термин.',
      'contact.msgError': 'Настана грешка. Обидете се повторно.',
      'contact.infoLocationTitle': 'Локација',
      'contact.infoPhoneTitle': 'Телефон',
      'contact.infoHoursTitle': 'Работно време',
      'contact.mapTitle': 'Каде се наоѓаме',
      'contact.mapOpenLink': 'Отвори во Google Maps',
      'contact.emailTitle': 'Email',

      'trainers.eyebrow': 'Тренери',
      'trainers.title': 'Тимот зад тренинзите.',
      'trainers.subtitle': 'Илустративен приказ на улогите во нашиот тренерски тим — за реални термини и достапност, контактирај нè директно.',
      'trainers.role1Name': 'Главен тренер',
      'trainers.role1Title': 'Функционален тренинг & Сила',
      'trainers.role1Body': 'Ги води програмите за сила и функционален тренинг и почетната проценка на нови members.',
      'trainers.role1Detail': 'Оваа улога е првиот контакт за секој нов член — прави почетна проценка на состојба, искуство и цели, па препорачува соодветен старт (групни часови, самостоен тренинг или комбинација). Фокусот е на правилна техника кај основните движења (клекнување, потскок, влечење) пред зголемување на оптоварувањето, за да се изгради база без ризик од повреда.',
      'trainers.role2Name': 'Тренер за групни програми',
      'trainers.role2Title': 'HIIT, Зумба & Спининг',
      'trainers.role2Body': 'Води енергични групни часови направени за издржливост и кардио форма.',
      'trainers.role2Detail': 'Групните часови се дизајнирани да одржат висока енергија и мотивација преку музика и групна динамика, додека тренерот ја следи изведбата на секој учесник и нуди варијанти на вежбите за различни нивоа на кондиција. Идеално за оние кои сакаат структуриран кардио тренинг без да мора сами да го планираат.',
      'trainers.role3Name': 'Тренер за мобилност',
      'trainers.role3Title': 'Јога & Пилатес',
      'trainers.role3Body': 'Фокус на баланс, флексибилност и опоравување помеѓу интензивни тренинзи.',
      'trainers.role3Detail': 'Мобилноста и опоравувањето често се занемарени во тренинг рутината, а всушност се клучни за долгорочен напредок без повреди. Часовите комбинираат контролирано дишење, растегнување и стабилизациски вежби — одличен баланс на интензивните силови и кардио тренинзи во текот на неделата.',
      'trainers.role4Name': 'Персонален тренер',
      'trainers.role4Title': 'Индивидуални програми',
      'trainers.role4Body': 'Прилагодени планови за тренинг и следење на напредокот за секој член.',
      'trainers.role4Detail': 'За членови со специфични цели — намалување тежина, градење мускулна маса, подготовка за настан или опоравување по повреда — персоналниот тренинг нуди целосно прилагодена програма со редовно следење на напредокот и приспособувања по потреба. Најдобра опција кога сакаш поинтензивно внимание и одговорност.',
      'trainers.note': 'Улогите погоре се илустративен приказ на структурата на тимот за целите на оваа демо/портфолио страница, а не листа на конкретни вработени.',

      'about.eyebrow': 'За нас',
      'about.title': 'Простор направен да те турка понатаму.',
      'about.lead': 'Arena Fitness Prilep е фитнес центар во Прилеп фокусиран на пристапен тренинг за секого — од прв чекор во салата до долгорочна посветеност.',
      'about.body1': 'Веруваме дека доброто физичко здравје почнува со едноставен, чесен пристап: правилна опрема, јасен распоред и луѓе кои ќе те поддржат на патот. Затоа комбинираме класична сала со слободни тегови и машини со разновидни групни тренинзи за секое ниво.',
      'about.body2': 'Без разлика дали доаѓаш за прв пат или веќе години тренираш редовно, целта е иста — простор каде прогресот се гледа и се чувствува.',
      'about.missionTitle': 'Нашата мисија',
      'about.missionBody': 'Да направиме фитнесот достапен, разбирлив и одржлив — со флексибилни пакети и поддршка без притисок.',
      'about.stat1Value': '6',
      'about.stat1Label': 'Пакети за членство',
      'about.stat2Value': '15+',
      'about.stat2Label': 'Групни термини неделно',
      'about.stat3Value': '7',
      'about.stat3Label': 'Дена во неделата отворено',
    },

    en: {
      'nav.home': 'Home',
      'nav.plans': 'Pricing',
      'nav.schedule': 'Schedule',
      'nav.trainers': 'Trainers',
      'nav.about': 'About',
      'nav.contact': 'Contact',
      'nav.trial': 'Trial session',
      'nav.login': 'Log in',
      'nav.register': 'Sign up',
      'nav.cta': 'Join now',
      'nav.profile': 'My account',
      'nav.logout': 'Log out',

      'hero.eyebrow': 'Fitness center · Prilep',
      'hero.title1': 'YOUR TRANSFORMATION',
      'hero.title2': 'STARTS HERE.',
      'hero.lead': 'Weights, cardio, group training and a space built to push you further every day. Arena Fitness Prilep is where beginners become regulars, and regulars become committed.',
      'hero.ctaPrimary': 'Book a trial session',
      'hero.ctaSecondary': 'See pricing',
      'hero.stat1Value': '09–22',
      'hero.stat1Label': 'Mon–Fri opening hours',
      'hero.stat2Value': '6',
      'hero.stat2Label': 'Membership plans',
      'hero.stat3Value': '15+',
      'hero.stat3Label': 'Group classes a week',
      'hero.badge': 'Open every day · Mon–Sat',
      'hero.scrollCue': 'Scroll',

      'features.eyebrow': 'Why Arena',
      'features.title': 'Everything you need, in one place.',
      'features.subtitle': 'From your first day to your personal best — equipment, space and programs for every level.',
      'features.f1Title': 'Full gym floor',
      'features.f1Body': 'Free weights, machines and a cardio zone for every kind of training.',
      'features.f2Title': 'Group classes',
      'features.f2Body': 'Functional training, HIIT, Zumba, yoga, spinning and Pilates — every week.',
      'features.f3Title': 'Long opening hours',
      'features.f3Body': 'Open every day except Sunday, late into the evening on weekdays.',
      'features.f4Title': 'Flexible plans',
      'features.f4Body': 'From a single day pass to an annual membership — pick what suits you.',

      'pricingPreview.eyebrow': 'Pricing',
      'pricingPreview.title': 'Membership plans',
      'pricingPreview.link': 'Full pricing →',
      'pricingPreview.detailsBtn': 'Details',
      'common.ribbon': 'Most popular',
      'common.currency': 'MKD',
      'common.addressLabel': 'Address',
      'common.phoneLabel': 'Phone',
      'common.emailLabel': 'Email',
      'common.followUs': 'Follow us:',

      'posts.eyebrow': 'From the gym',
      'posts.title': 'Food, supplements & transformations.',
      'posts.subtitle': 'Illustrative posts in the style of our Instagram — meal ideas, supplement notes and progress stories.',
      'posts.tabAll': 'All',
      'posts.tabFood': 'Food',
      'posts.tabSupplements': 'Supplements',
      'posts.tabTransformations': 'Transformations',
      'posts.readMore': 'Read more →',
      'posts.p1Title': 'Post-workout meal',
      'posts.p1Body': 'Protein plus complex carbs within the first 60 minutes after training.',
      'posts.p1Detail': 'The 30-60 minute window after training is when your muscles absorb nutrients best. A combination of 25-40g of protein (chicken, fish, eggs or a protein shake) and complex carbs (rice, potatoes, fruit) supports muscle repair and refills glycogen stores. It doesn\'t have to be perfect — the important part is not skipping the meal entirely, especially after a heavy strength session.',
      'posts.p2Title': 'Grilled turkey plate',
      'posts.p2Body': 'A light, protein-rich meal that fits a strength-training day.',
      'posts.p2Detail': 'Ground turkey is a great protein source with less saturated fat than classic beef. Grilled with a little seasoning, garlic and lemon, paired with a green salad and brown rice, it makes a balanced meal that won\'t weigh you down before an evening session — a solid pick on strength-training days when you want to stay light.',
      'posts.p3Title': 'Morning oats',
      'posts.p3Body': 'Steady energy for early functional-training sessions.',
      'posts.p3Detail': 'Oats release energy gradually thanks to slow-digesting carbs, unlike fast sugars that cause an energy crash. Add a banana, a spoon of nut butter and a little honey, and you get a meal that carries you through a whole morning session without that heavy, sluggish feeling.',
      'posts.p4Title': 'Whey protein',
      'posts.p4Body': 'When a supplement helps and when a meal is enough — ask your coach.',
      'posts.p4Detail': 'Protein powder is a convenient option when you don\'t have time for a full meal, but it isn\'t a substitute for a varied diet. If you\'re already hitting your protein target through food (roughly 1.6-2g per kilogram of bodyweight), a supplement is a convenience, not a necessity. Always check with your coach or doctor before adding a new supplement, especially with any health conditions.',
      'posts.p5Title': 'Creatine basics',
      'posts.p5Body': 'One of the most researched supplements for strength and endurance.',
      'posts.p5Detail': 'Creatine monohydrate is among the best-researched supplements in sports science, with proven benefits for strength, explosiveness and recovery during short, intense efforts. A standard dose is around 3-5g a day, with no need for a "loading phase." The effects are cumulative — results build up over weeks of consistent use, not overnight.',
      'posts.p6Title': 'Hydration',
      'posts.p6Body': 'Water and electrolytes before and after an intense gym session.',
      'posts.p6Detail': 'Dehydration of just 2% of body weight can measurably reduce physical performance and focus. Drink water steadily throughout the day, not only during training, and for longer or more intense sessions — especially in hot months — add electrolytes to replace what you lose through sweat.',
      'posts.p7Title': '3 months later',
      'posts.p7Body': 'Consistency and progressive overload — that is the whole secret.',
      'posts.p7Detail': 'Behind every visible change in the first 3 months is a simple formula: showing up consistently 3-4 times a week and gradually increasing the load (weight, reps, or intensity) rather than jumping too fast. Combined with sensible eating and enough sleep to recover, results come naturally — no extreme diets or overtraining required.',
      'posts.p8Title': 'First competition',
      'posts.p8Body': "From a first trial session to a first race — one member's story.",
      'posts.p8Detail': "Many members start with zero prior sports background, just a wish to try something new. With guidance from the coaches and steadily built fitness through group classes, some make it to their first local competition — not for the result, but for the confidence built over months of preparation.",
      'posts.p9Title': 'A year of progress',
      'posts.p9Body': 'What a year of consistent training can look like.',
      'posts.p9Detail': 'A year of consistent training brings more than physical change — it builds habit, discipline and a better sense of your own body. Strength training, group conditioning classes and attention to nutrition, kept up all year round, deliver results no quick diet can match.',

      'trial.eyebrow': 'First step',
      'trial.title': 'Try it free, no commitment.',
      'trial.body': 'Leave your details and our team will contact you to book your first visit.',
      'trial.cta': 'Book a trial session',

      'footer.contactTitle': 'Contact',
      'footer.hoursTitle': 'Opening hours',
      'footer.linksTitle': 'Quick links',
      'footer.linkPlans': 'Pricing',
      'footer.linkSchedule': 'Class schedule',
      'footer.linkContact': 'Book a trial session',
      'footer.linkAdmin': 'Admin',
      'footer.locationTitle': 'Location',
      'footer.disclaimer': 'Demo / portfolio page — not the official website of Arena Fitness Prilep',

      'plans.eyebrow': 'Pricing',
      'plans.title': 'Choose your plan',
      'plans.subtitle': 'Every plan includes full access to the gym floor. Prices are in Macedonian denars (MKD). No commitment — switch plans any time.',
      'plans.audienceAll': 'All',
      'plans.audienceMen': 'Men',
      'plans.audienceWomen': 'Women',
      'plans.joinBtn': 'Join now',
      'plans.notSureEyebrow': "Not sure which plan?",
      'plans.notSureTitle': 'Come in for a free trial session.',
      'plans.notSureCta': 'Book a trial session',

      'contact.eyebrow': 'Contact',
      'contact.title': 'Book a trial session',
      'contact.subtitle': "Fill in the form and we'll contact you to schedule your first free visit.",
      'contact.formName': 'Full name',
      'contact.formEmail': 'Email',
      'contact.formPhone': 'Phone',
      'contact.formPhonePlaceholder': '070 000 000',
      'contact.formInterest': 'Plan you are interested in',
      'contact.formInterestDefault': "Not sure yet",
      'contact.formMessage': 'Message (optional)',
      'contact.formMessagePlaceholder': 'E.g. what time works for you, any training experience...',
      'contact.formSubmit': 'Send request',
      'contact.msgSuccess': "Thank you! We'll be in touch soon to schedule your session.",
      'contact.msgError': 'Something went wrong. Please try again.',
      'contact.infoLocationTitle': 'Location',
      'contact.infoPhoneTitle': 'Phone',
      'contact.infoHoursTitle': 'Opening hours',
      'contact.mapTitle': 'Where to find us',
      'contact.mapOpenLink': 'Open in Google Maps',
      'contact.emailTitle': 'Email',

      'trainers.eyebrow': 'Trainers',
      'trainers.title': 'The team behind the training.',
      'trainers.subtitle': 'An illustrative look at the roles on our coaching team — for real availability, contact us directly.',
      'trainers.role1Name': 'Head coach',
      'trainers.role1Title': 'Functional training & strength',
      'trainers.role1Body': "Leads strength and functional-training programs and new members' first assessment.",
      'trainers.role1Detail': "This role is every new member's first point of contact — running an initial assessment of fitness level, experience and goals, then recommending the right starting point (group classes, solo training, or a mix). The focus is proper technique on the fundamental movements (squat, hinge, pull) before load increases, so a safe base gets built before intensity.",
      'trainers.role2Name': 'Group class coach',
      'trainers.role2Title': 'HIIT, Zumba & spinning',
      'trainers.role2Body': 'Runs high-energy group classes built for endurance and cardio fitness.',
      'trainers.role2Detail': "Group classes are designed to keep energy and motivation high through music and group dynamics, while the coach tracks each participant's form and offers variations for different fitness levels. A great fit for anyone who wants structured cardio training without having to plan it themselves.",
      'trainers.role3Name': 'Mobility coach',
      'trainers.role3Title': 'Yoga & Pilates',
      'trainers.role3Body': 'Focused on balance, flexibility and recovery between hard training sessions.',
      'trainers.role3Detail': "Mobility and recovery are often the most neglected part of a training routine, yet they're key to long-term progress without injury. Classes combine controlled breathing, stretching and stability work — a solid counterbalance to a week of intense strength and cardio sessions.",
      'trainers.role4Name': 'Personal trainer',
      'trainers.role4Title': '1-on-1 programs',
      'trainers.role4Body': 'Custom training plans and progress tracking for individual members.',
      'trainers.role4Detail': "For members with specific goals — losing weight, building muscle, preparing for an event, or recovering from an injury — personal training offers a fully tailored program with regular progress check-ins and adjustments as needed. The best option when you want closer attention and accountability.",
      'trainers.note': 'The roles above illustrate the team structure for this demo/portfolio page and are not a list of named staff.',

      'about.eyebrow': 'About us',
      'about.title': 'A space built to push you further.',
      'about.lead': 'Arena Fitness Prilep is a fitness center in Prilep focused on accessible training for everyone — from your first step in the gym to long-term commitment.',
      'about.body1': "We believe good physical health starts with a simple, honest approach: the right equipment, a clear schedule and people who'll support you along the way. That's why we pair a classic free-weights and machine floor with a wide range of group classes for every level.",
      'about.body2': "Whether it's your first visit or you've been training for years, the goal stays the same — a space where progress is visible and felt.",
      'about.missionTitle': 'Our mission',
      'about.missionBody': 'Make fitness accessible, understandable and sustainable — with flexible plans and pressure-free support.',
      'about.stat1Value': '6',
      'about.stat1Label': 'Membership plans',
      'about.stat2Value': '15+',
      'about.stat2Label': 'Group classes a week',
      'about.stat3Value': '7',
      'about.stat3Label': 'Days a week open',
    },
  };

  var lang = 'mk';
  try {
    var saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'mk' || saved === 'en') lang = saved;
  } catch (e) {}

  var listeners = [];

  function t(key) {
    var table = dict[lang] || dict.mk;
    if (table && table[key] != null) return table[key];
    if (dict.mk[key] != null) return dict.mk[key];
    return key;
  }

  function apply(root) {
    root = root || document;
    var els = root.querySelectorAll('[data-i18n]');
    for (var i = 0; i < els.length; i++) {
      els[i].textContent = t(els[i].getAttribute('data-i18n'));
    }
    var htmlEls = root.querySelectorAll('[data-i18n-html]');
    for (var j = 0; j < htmlEls.length; j++) {
      htmlEls[j].innerHTML = t(htmlEls[j].getAttribute('data-i18n-html'));
    }
    var phEls = root.querySelectorAll('[data-i18n-placeholder]');
    for (var k = 0; k < phEls.length; k++) {
      phEls[k].setAttribute('placeholder', t(phEls[k].getAttribute('data-i18n-placeholder')));
    }
    document.documentElement.setAttribute('lang', lang);
  }

  function setLang(l) {
    if (l !== 'mk' && l !== 'en') return;
    lang = l;
    try { localStorage.setItem(STORAGE_KEY, l); } catch (e) {}
    apply(document);
    for (var i = 0; i < listeners.length; i++) listeners[i](lang);
  }

  function toggle() {
    setLang(lang === 'mk' ? 'en' : 'mk');
  }

  function onChange(cb) {
    listeners.push(cb);
  }

  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  ready(function () { apply(document); });

  return {
    t: t,
    apply: apply,
    setLang: setLang,
    toggle: toggle,
    onChange: onChange,
    get lang() { return lang; },
  };
})();
