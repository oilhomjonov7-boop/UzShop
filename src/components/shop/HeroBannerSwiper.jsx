import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// Uzum Market style promotional banners: Full-bleed image + sleek promotional text & badge & CTA
const UZUM_BANNERS = [
  {
    id: 1,
    badge: "🔥 50% GACHA CHEGIRMA",
    badgeColor: "bg-red-500 text-white",
    title: "Bahoriy Katta Savdo Mavsumi",
    subtitle: "Eng xaridorgir elektronika, kiyim va maishiy texnikalarga 50% gacha chegirmalar!",
    image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1800&auto=format&fit=crop&q=85",
    link: "/products?discount=true",
    cta: "Barcha chegirmalar"
  },
  {
    id: 2,
    badge: "⚡ 0-0-12 MUDDATLI TO'LOV",
    badgeColor: "bg-emerald-500 text-white",
    title: "iPhone 16 Pro Max va MacBook Pro",
    subtitle: "Apple flagmanlari va kuchli noutbuklar — boshlang'ich to'lovsiz, rasmiy kafolat bilan!",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1800&auto=format&fit=crop&q=85",
    link: "/products?category=cat-1",
    cta: "Smartfonlarni ko'rish"
  },
  {
    id: 3,
    badge: "🎮 ULTIMATE GEYMING",
    badgeColor: "bg-indigo-600 text-white",
    title: "PlayStation 5 va Geymer Uskunalari",
    subtitle: "PS5 Slim konsollari, simsiz DualSense kontrollerlari va mashhur o'yin aksessuarlari.",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1800&auto=format&fit=crop&q=85",
    link: "/products?category=cat-14",
    cta: "Geyming tovarlari"
  },
  {
    id: 4,
    badge: "👟 ORIGINAL SPORT BRENDLAR",
    badgeColor: "bg-amber-400 text-slate-950 font-black",
    title: "Nike & New Balance: Yangi Kolleksiya",
    subtitle: "100% original zamonaviy sport krossovkalari va kiyim-kechaklar eng yaxshi narxlarda.",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1800&auto=format&fit=crop&q=85",
    link: "/products?category=cat-6",
    cta: "Poyabzallarni ko'rish"
  },
  {
    id: 5,
    badge: "✨ SHINAM VA ZAMONAVIY UY",
    badgeColor: "bg-purple-600 text-white",
    title: "Dyson & De'Longhi Oshxona Texnikasi",
    subtitle: "Lazerli simsiz changyutgichlar, avtomatik espresso qahva mashinalari va aqlli pechlar.",
    image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=1800&auto=format&fit=crop&q=85",
    link: "/products?category=cat-7",
    cta: "Uy texnikasini ko'rish"
  },
  {
    id: 6,
    badge: "🚚 1 KUNDA BEPUL YETKAZISH",
    badgeColor: "bg-blue-600 text-white",
    title: "Aqlli Gadjetlar va Aksessuarlar",
    subtitle: "Butun O'zbekiston bo'ylab topshirish punktlariga ertagayoq bepul yetkazib beramiz!",
    image: "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=1800&auto=format&fit=crop&q=85",
    link: "/products",
    cta: "Katalogga o'tish"
  }
];

export const HeroBannerSwiper = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const swiperRef = useRef(null);

  const handleBannerClick = (link) => {
    if (link) {
      navigate(link);
    }
  };

  return (
    <div className="relative w-full group/hero select-none">
      {/* Uzum Market style Large Single Banner Container */}
      <div className="relative w-full h-[240px] sm:h-[320px] md:h-[380px] lg:h-[420px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-900">
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          loop={true}
          speed={650}
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
          {UZUM_BANNERS.map((banner) => (
            <SwiperSlide key={banner.id} className="w-full h-full">
              <div
                onClick={() => handleBannerClick(banner.link)}
                className="relative w-full h-full cursor-pointer overflow-hidden group/slide flex items-center"
              >
                {/* Background Banner Image with Subtle Zoom on Hover */}
                <img
                  src={banner.image}
                  alt={banner.title}
                  loading="eager"
                  className="absolute inset-0 w-full h-full object-cover object-center group-hover/slide:scale-105 transition-transform duration-1000 ease-out"
                />

                {/* Professional Dark Vignette & Gradient Overlays for Razor-Sharp Legibility */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/65 to-black/25 sm:to-transparent z-10" />
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent z-10 pointer-events-none" />

                {/* Text and Badges Content (NO mini-cards) */}
                <div className="relative z-10 w-full px-6 sm:px-10 md:px-14 lg:px-18 flex flex-col justify-center max-w-2xl text-white space-y-2.5 sm:space-y-3.5">
                  {/* Badge */}
                  <div>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold tracking-wide shadow-md ${banner.badgeColor}`}>
                      {banner.badge}
                    </span>
                  </div>

                  {/* Headline */}
                  <h2 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight drop-shadow-md">
                    {banner.title}
                  </h2>

                  {/* Subtitle */}
                  <p className="text-xs sm:text-sm md:text-base text-slate-200/90 font-medium line-clamp-2 max-w-xl leading-relaxed drop-shadow">
                    {banner.subtitle}
                  </p>

                  {/* CTA Action Button */}
                  <div className="pt-1 sm:pt-2">
                    <span className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl bg-violet-600 group-hover/slide:bg-violet-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-violet-600/40 group-hover/slide:shadow-violet-600/60 transition-all duration-200">
                      <span>{banner.cta}</span>
                      <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5] group-hover/slide:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Previous Slide Arrow Button */}
        <button
          type="button"
          onClick={() => swiperRef.current?.slidePrev()}
          className="absolute top-1/2 -translate-y-1/2 left-3 sm:left-5 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/40 hover:bg-black/70 text-white shadow-xl backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-200 opacity-0 group-hover/hero:opacity-100 hover:scale-110 active:scale-95 cursor-pointer"
          aria-label="Oldingi banner"
        >
          <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* Next Slide Arrow Button */}
        <button
          type="button"
          onClick={() => swiperRef.current?.slideNext()}
          className="absolute top-1/2 -translate-y-1/2 right-3 sm:right-5 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/40 hover:bg-black/70 text-white shadow-xl backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-200 opacity-0 group-hover/hero:opacity-100 hover:scale-110 active:scale-95 cursor-pointer"
          aria-label="Keyingi banner"
        >
          <ChevronRight className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* Uzum Style Bottom Dots / Indicators */}
        <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/20">
          {UZUM_BANNERS.map((banner, idx) => (
            <button
              key={banner.id}
              type="button"
              onClick={() => swiperRef.current?.slideToLoop(idx)}
              className={`h-2 sm:h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                currentSlide === idx
                  ? 'w-6 sm:w-8 bg-white shadow-md'
                  : 'w-2 sm:w-2.5 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Banner ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
