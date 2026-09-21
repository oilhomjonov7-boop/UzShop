import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { Sparkles, ArrowRight, ChevronLeft, ChevronRight, Zap, ShoppingBag } from 'lucide-react';
import { useTranslation } from '../../utils/useTranslation';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const BANNER_SLIDES = [
  {
    id: 1,
    badge: {
      uz: "🔥 CHEKLANGAN MUDDATLI AKSIYA",
      ru: "🔥 АКЦИЯ С ОГРАНИЧЕННЫМ СРОКОМ",
      en: "🔥 LIMITED TIME OFFER"
    },
    title: {
      uz: "Bahoriy Mega Chegirmalar",
      ru: "Весенние Мега Скидки",
      en: "Spring Mega Discounts"
    },
    subtitle: {
      uz: "Flagman smartfonlar, noutbuklar va eng so'nggi gadjetlarga 40% gacha haqiqiy chegirmalar!",
      ru: "Реальные скидки до 40% на флагманские смартфоны, ноутбуки и новейшие гаджеты!",
      en: "Real discounts up to 40% on flagship smartphones, laptops, and the latest gadgets!"
    },
    ctaText: {
      uz: "Aksiyalarni ko'rish",
      ru: "Смотреть акции",
      en: "View Special Deals"
    },
    highlight: {
      uz: "40% gacha chegirma",
      ru: "Скидки до 40%",
      en: "Up to 40% off"
    },
    floatingBadge: {
      uz: "🔥 Qaynoq Chegirmalar",
      ru: "🔥 Горячие скидки",
      en: "🔥 Hot Deals"
    },
    link: "/products?discount=true",
    bgGradient: "from-emerald-950 via-teal-900 to-slate-950",
    glowColor: "rgba(16, 185, 129, 0.25)",
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=900&auto=format&fit=crop&q=80"
  },
  {
    id: 2,
    badge: {
      uz: "💳 0% FOIZ • 0% BOSHLANG'ICH TO'LOV",
      ru: "💳 0% ПЕРЕПЛАТ • 0% ПЕРВЫЙ ВЗНОС",
      en: "💳 0% DOWN • 0% INTEREST"
    },
    title: {
      uz: "12 Oygacha Qulay Muddatli To'lov",
      ru: "Рассрочка до 12 месяцев",
      en: "Installment Plans Up to 12 Months"
    },
    subtitle: {
      uz: "Ortiqcha foizlar va qog'ozbozliklarsiz orzuingizdagi texnikani bugunoq xarid qiling!",
      ru: "Покупайте технику вашей мечты уже сегодня без лишних переплат и справок!",
      en: "Get your dream technology today with zero interest and zero paperwork hassle!"
    },
    ctaText: {
      uz: "Barcha mahsulotlar",
      ru: "Все товары",
      en: "Browse All Products"
    },
    highlight: {
      uz: "0-0-12 Uzum Nasiya",
      ru: "0-0-12 Узум Насия",
      en: "0-0-12 Split Payment"
    },
    floatingBadge: {
      uz: "0% Boshlang'ich to'lov",
      ru: "0% Первый взнос",
      en: "0% Down Payment"
    },
    link: "/products",
    bgGradient: "from-indigo-950 via-blue-950 to-slate-950",
    glowColor: "rgba(99, 102, 241, 0.25)",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=900&auto=format&fit=crop&q=80"
  },
  {
    id: 3,
    badge: {
      uz: "⚡ 1 KUNDA YETKAZISH • 100% BEPUL",
      ru: "⚡ ДОСТАВКА ЗА 1 ДЕНЬ • БЕСПЛАТНО",
      en: "⚡ 1-DAY DELIVERY • 100% FREE"
    },
    title: {
      uz: "O'zbekiston Bo'ylab 24 Soatda",
      ru: "Доставка по Узбекистану за 24 часа",
      en: "Across Uzbekistan in 24 Hours"
    },
    subtitle: {
      uz: "Bugun xarid qiling — ertaga ostonangizda qabul qiling. Toshkent va barcha viloyatlarga!",
      ru: "Закажите сегодня — получите завтра у порога. В Ташкент и во все регионы!",
      en: "Order today — receive it at your doorstep tomorrow. Fast express delivery everywhere!"
    },
    ctaText: {
      uz: "Xaridni boshlash",
      ru: "Начать покупки",
      en: "Start Shopping"
    },
    highlight: {
      uz: "Kuryer xizmati",
      ru: "Курьерская доставка",
      en: "Door-to-door courier"
    },
    floatingBadge: {
      uz: "⚡ 24 Soatda Ostonangizda",
      ru: "⚡ За 24 часа у порога",
      en: "⚡ At Your Door in 24h"
    },
    link: "/products",
    bgGradient: "from-amber-950 via-orange-950 to-slate-950",
    glowColor: "rgba(245, 158, 11, 0.25)",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=900&auto=format&fit=crop&q=80"
  },
  {
    id: 4,
    badge: {
      uz: "✨ YANGI MAVSUM KOLLEKSIYASI",
      ru: "✨ НОВАЯ СЕЗОННАЯ КОЛЛЕКЦИЯ",
      en: "✨ NEW SEASON COLLECTION"
    },
    title: {
      uz: "Zamonaviy Kiyim & Poyabzallar",
      ru: "Стильная одежда и обувь",
      en: "Trendy Apparel & Footwear"
    },
    subtitle: {
      uz: "Nike, New Balance va boshqa jahon brendlaridan 100% original krossovka va kiyimlar!",
      ru: "100% оригинальные кроссовки и одежда от брендов Nike, New Balance и других мировых марок!",
      en: "100% genuine sneakers and fashion wear from top world brands Nike, New Balance and more!"
    },
    ctaText: {
      uz: "Kolleksiyani ko'rish",
      ru: "Смотреть коллекцию",
      en: "Explore Collection"
    },
    highlight: {
      uz: "100% Original kafolati",
      ru: "100% Гарантия оригинала",
      en: "100% Genuine Guaranteed"
    },
    floatingBadge: {
      uz: "👟 Yangi Kolleksiya",
      ru: "👟 Новинки сезона",
      en: "👟 New Arrivals"
    },
    link: "/products?category=cat-6",
    bgGradient: "from-rose-950 via-purple-950 to-slate-950",
    glowColor: "rgba(244, 63, 94, 0.25)",
    image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=900&auto=format&fit=crop&q=80"
  },
  {
    id: 5,
    badge: {
      uz: "🏠 SHINAM VA ZAMONAVIY UY",
      ru: "🏠 УЮТНЫЙ И УМНЫЙ ДОМ",
      en: "🏠 SMART & COZY HOME"
    },
    title: {
      uz: "Aqlli Uy & Oshxona Texnikalari",
      ru: "Умная техника для кухни и дома",
      en: "Smart Home & Kitchen Appliances"
    },
    subtitle: {
      uz: "Xiaomi robot changyutgichlar, Philips airfryer va DeLonghi qahva mashinalari maxsus taklifda!",
      ru: "Роботы-пылесосы Xiaomi, аэрогрили Philips и кофемашины DeLonghi по специальным ценам!",
      en: "Xiaomi robot vacuums, Philips airfryers, and DeLonghi coffee makers on special offers!"
    },
    ctaText: {
      uz: "Texnikani tanlash",
      ru: "Выбрать технику",
      en: "Explore Appliances"
    },
    highlight: {
      uz: "Rasmiy servis kafolati",
      ru: "Официальная гарантия",
      en: "Official Warranty"
    },
    floatingBadge: {
      uz: "✨ Smart Home 2026",
      ru: "✨ Умный дом 2026",
      en: "✨ Smart Home 2026"
    },
    link: "/products?category=cat-7",
    bgGradient: "from-slate-950 via-cyan-950 to-emerald-950",
    glowColor: "rgba(20, 184, 166, 0.25)",
    image: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=900&auto=format&fit=crop&q=80"
  },
  {
    id: 6,
    badge: {
      uz: "📚 JAHON BESTSELLERLARI",
      ru: "📚 МИРОВЫЕ БЕСТСЕЛЛЕРЫ",
      en: "📚 WORLD BESTSELLERS"
    },
    title: {
      uz: "Muvaffaqiyat va Biznes Kitoblari",
      ru: "Книги по бизнесу и саморазвитию",
      en: "Business & Self-Growth Books"
    },
    subtitle: {
      uz: "\"Atom Odatlari\", \"Boy Ota, Kambag'al Ota\" va eng sara motivatsion asarlar maxsus to'plami!",
      ru: "«Атомные привычки», «Богатый папа, бедный папа» и лучшие мотивационные издания!",
      en: "\"Atomic Habits\", \"Rich Dad Poor Dad\" and bestselling motivational masterpieces!"
    },
    ctaText: {
      uz: "Kitoblarni ko'rish",
      ru: "Смотреть книги",
      en: "Explore Books"
    },
    highlight: {
      uz: "Eng ko'p o'qilganlar",
      ru: "Хиты продаж",
      en: "Top Bestsellers"
    },
    floatingBadge: {
      uz: "📖 Bestsellerlar",
      ru: "📖 Бестселлеры",
      en: "📖 Bestsellers"
    },
    link: "/products?category=cat-9",
    bgGradient: "from-stone-950 via-amber-950 to-slate-950",
    glowColor: "rgba(217, 119, 6, 0.25)",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=900&auto=format&fit=crop&q=80"
  },
  {
    id: 7,
    badge: {
      uz: "🎮 GEYMING VA KONSOLLAR DUNYOSI",
      ru: "🎮 МИР ГЕЙМИНГА И КОНСОЛЕЙ",
      en: "🎮 GAMING & CONSOLES UNIVERSE"
    },
    title: {
      uz: "PlayStation 5, Xbox va Pro Aksessuarlar",
      ru: "PlayStation 5, Xbox и Pro Аксессуары",
      en: "PlayStation 5, Xbox and Pro Gear"
    },
    subtitle: {
      uz: "PS5 Slim, Nintendo Switch OLED, mexanik klaviaturalar va professional geymerlar uskunasi!",
      ru: "PS5 Slim, Nintendo Switch OLED, механические клавиатуры и экипировка для профессиональных геймеров!",
      en: "PS5 Slim, Nintendo Switch OLED, mechanical keyboards and professional gamer gear!"
    },
    ctaText: {
      uz: "Geyming to'plamini ko'rish",
      ru: "Смотреть гeyминг товары",
      en: "Explore Gaming Gear"
    },
    highlight: {
      uz: "PlayStation & Xbox",
      ru: "PlayStation и Xbox",
      en: "PlayStation & Xbox"
    },
    floatingBadge: {
      uz: "🎮 Pro Gaming 2026",
      ru: "🎮 Про Гейминг 2026",
      en: "🎮 Pro Gaming 2026"
    },
    link: "/products?category=cat-14",
    bgGradient: "from-purple-950 via-indigo-950 to-slate-950",
    glowColor: "rgba(147, 51, 234, 0.25)",
    image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=900&auto=format&fit=crop&q=80"
  }
];

export const HeroBannerSwiper = () => {
  const navigate = useNavigate();
  const { currentLanguage } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const swiperRef = useRef(null);

  const lang = currentLanguage || 'uz';

  const handleSlideClick = (slide) => {
    if (slide.link) {
      navigate(slide.link);
    }
  };

  return (
    <div className="relative w-full group/swiper select-none">
      {/* Main Swiper Container */}
      <div className="rounded-3xl overflow-hidden shadow-xl border border-slate-200/80 bg-slate-950">
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          loop={true}
          speed={700}
          autoplay={{
            delay: 4500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true
          }}
          onBeforeInit={(swiper) => {
            swiperRef.current = swiper;
          }}
          onSlideChange={(swiper) => {
            setCurrentSlide(swiper.realIndex);
          }}
          className="w-full h-full"
        >
          {BANNER_SLIDES.map((slide) => {
            const badgeText = slide.badge[lang] || slide.badge.uz;
            const titleText = slide.title[lang] || slide.title.uz;
            const subtitleText = slide.subtitle[lang] || slide.subtitle.uz;
            const ctaText = slide.ctaText[lang] || slide.ctaText.uz;
            const highlightText = slide.highlight[lang] || slide.highlight.uz;
            const floatingText = slide.floatingBadge[lang] || slide.floatingBadge.uz;

            return (
              <SwiperSlide key={slide.id}>
                <div
                  onClick={() => handleSlideClick(slide)}
                  className={`relative w-full min-h-[360px] sm:min-h-[420px] md:min-h-[450px] lg:min-h-[480px] bg-gradient-to-r ${slide.bgGradient} flex flex-col justify-between overflow-hidden cursor-pointer`}
                >
                  {/* Atmospheric background glows and dot pattern */}
                  <div
                    className="absolute -top-24 -right-24 w-96 h-96 rounded-full blur-3xl pointer-events-none transition-opacity duration-1000"
                    style={{ backgroundColor: slide.glowColor }}
                  />
                  <div
                    className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-50 transition-opacity duration-1000"
                    style={{ backgroundColor: slide.glowColor }}
                  />
                  <div className="absolute inset-0 bg-[radial-gradient(#ffffff_0.7px,transparent_0.7px)] [background-size:20px_20px] opacity-10 pointer-events-none" />

                  {/* Top bar inside banner: Badge + Slide index */}
                  <div className="relative z-10 px-5 sm:px-8 lg:px-12 pt-5 sm:pt-7 flex items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white text-[11px] sm:text-xs font-black tracking-wide shadow-xs">
                      <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                      <span>{badgeText}</span>
                    </span>

                    <span className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-md text-white/90 text-[11px] sm:text-xs font-bold border border-white/10 tracking-wider">
                      {slide.id} / {BANNER_SLIDES.length}
                    </span>
                  </div>

                  {/* Slide Content: Grid on larger screens */}
                  <div className="relative z-10 px-5 sm:px-8 lg:px-12 py-6 sm:py-8 my-auto grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-center">
                    {/* Left Column: Heading, Subtitle, CTA */}
                    <div className="md:col-span-7 lg:col-span-8 max-w-2xl">
                      <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.15] drop-shadow-sm">
                        {titleText}
                      </h2>
                      <p className="mt-3 sm:mt-4 text-xs sm:text-sm lg:text-base text-slate-200/90 leading-relaxed font-normal max-w-xl">
                        {subtitleText}
                      </p>

                      {/* Action Row */}
                      <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-6 sm:mt-8">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSlideClick(slide);
                          }}
                          className="px-6 sm:px-7 py-3 sm:py-3.5 rounded-2xl bg-white text-slate-950 hover:bg-slate-100 font-extrabold text-xs sm:text-sm shadow-xl shadow-black/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 group/btn cursor-pointer"
                        >
                          <ShoppingBag className="w-4 h-4 text-emerald-600" />
                          <span>{ctaText}</span>
                          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform text-emerald-600" />
                        </button>

                        <span className="px-4 py-3 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 text-white text-xs sm:text-sm font-bold shadow-xs flex items-center gap-1.5">
                          <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                          <span>{highlightText}</span>
                        </span>
                      </div>
                    </div>

                    {/* Right Column: Hero Visual Product Showcase */}
                    <div className="hidden md:flex md:col-span-5 lg:col-span-4 justify-center items-center relative">
                      <div className="relative w-full max-w-[320px] aspect-[4/3] sm:aspect-square rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 group-hover/swiper:scale-[1.02] transition-transform duration-700 bg-slate-900/50 backdrop-blur-xs">
                        <img
                          src={slide.image}
                          alt={titleText}
                          className="w-full h-full object-cover group-hover/swiper:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                        {/* Floating Pill on image */}
                        <div className="absolute bottom-3 left-3 right-3 px-3 py-1.5 rounded-xl bg-white/90 backdrop-blur-md border border-white/60 text-slate-900 text-xs font-black flex items-center justify-between shadow-lg">
                          <span>{floatingText}</span>
                          <span className="text-[10px] text-emerald-600 font-extrabold uppercase">UzShop</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Bar: Indicators / Spacing */}
                  <div className="relative z-10 px-5 sm:px-8 lg:px-12 pb-5 sm:pb-6 flex items-center justify-between">
                    <div className="text-[11px] text-white/50 font-medium hidden sm:block">
                      ★ UzShop Rasmiy Kafolatlangan Do'kon
                    </div>
                    <div className="text-[11px] text-white/50 font-medium">
                      O'zbekiston bo'ylab bepul yetkazish
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>

        {/* Custom Navigation Left Arrow */}
        <button
          type="button"
          onClick={() => swiperRef.current?.slidePrev()}
          className="absolute top-1/2 -translate-y-1/2 left-3 sm:left-5 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 hover:bg-white/90 text-white hover:text-slate-900 backdrop-blur-md border border-white/30 flex items-center justify-center transition-all duration-200 shadow-xl opacity-0 group-hover/swiper:opacity-100 hover:scale-110 active:scale-90 cursor-pointer"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
        </button>

        {/* Custom Navigation Right Arrow */}
        <button
          type="button"
          onClick={() => swiperRef.current?.slideNext()}
          className="absolute top-1/2 -translate-y-1/2 right-3 sm:right-5 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 hover:bg-white/90 text-white hover:text-slate-900 backdrop-blur-md border border-white/30 flex items-center justify-center transition-all duration-200 shadow-xl opacity-0 group-hover/swiper:opacity-100 hover:scale-110 active:scale-90 cursor-pointer"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
        </button>

        {/* Custom Pagination Pills at bottom */}
        <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
          {BANNER_SLIDES.map((slide, idx) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => swiperRef.current?.slideToLoop(idx)}
              className={`h-2 sm:h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                currentSlide === idx
                  ? 'w-7 sm:w-9 bg-white shadow-md'
                  : 'w-2 sm:w-2.5 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
