import React from 'react';

interface SymbolProps {
  className?: string;
  size?: number;
}

/**
 * بته‌جقه اصیل ایرانی (Boteh Jegheh / Paisley)
 * نماد سرو خمیده، جاودانگی، فروتنی و اصالت هنر ترمه‌بافی ایران
 */
export const BotehJegheh: React.FC<SymbolProps> = ({ className = "text-khansalar-gold", size = 32 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer Curved Cypress Silhouette */}
      <path
        d="M50 115 C20 115 10 90 10 65 C10 35 30 18 55 5 C62 2 68 8 65 15 C60 26 50 35 55 45 C60 52 72 45 78 50 C88 58 90 75 85 92 C80 108 68 115 50 115 Z"
        stroke="currentColor"
        strokeWidth="3"
        fill="currentColor"
        fillOpacity="0.15"
      />
      {/* Inner floral core */}
      <path
        d="M50 100 C32 100 25 82 25 65 C25 45 38 32 52 24 C50 34 45 42 50 50 C55 56 65 52 70 60 C75 68 74 85 68 95 C62 100 56 100 50 100 Z"
        stroke="#00c8b3"
        strokeWidth="2"
        strokeDasharray="2 3"
      />
      {/* Central jewel / bud */}
      <circle cx="48" cy="75" r="7" fill="currentColor" fillOpacity="0.7" />
      <circle cx="48" cy="75" r="3" fill="#00c8b3" />
      <circle cx="58" cy="30" r="3" fill="currentColor" />
    </svg>
  );
};

/**
 * گل شاه‌عباسی ختایی (Shah Abbasi Lotus Flower)
 * نماد شکوفایی، نقوش فرش‌های صفوی و کاشی‌کاری‌های اصفهان
 */
export const ShahAbbasiFlower: React.FC<SymbolProps> = ({ className = "text-khansalar-gold", size = 32 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* 5 Petals Lotus */}
      <path
        d="M50 8 C42 28 20 40 10 55 C28 55 40 68 50 92 C60 68 72 55 90 55 C80 40 58 28 50 8 Z"
        stroke="currentColor"
        strokeWidth="3"
        fill="currentColor"
        fillOpacity="0.18"
      />
      {/* Inner Lotus Bud */}
      <path
        d="M50 30 C45 45 32 52 25 60 C38 60 45 70 50 82 C55 70 62 60 75 60 C68 52 55 45 50 30 Z"
        stroke="#00c8b3"
        strokeWidth="2"
      />
      <circle cx="50" cy="58" r="6" fill="currentColor" />
    </svg>
  );
};

/**
 * انار سنتی ایرانی تذهیب (Persian Pomegranate)
 * نماد برکت، فراوانی، یلدا و پذیرایی شاهانه
 */
export const PersianPomegranate: React.FC<SymbolProps> = ({ className = "text-rose-400", size = 32 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 110"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Crown of the Pomegranate (تاج انار) */}
      <path
        d="M40 25 L45 8 L50 20 L55 8 L60 25 Z"
        stroke="#e5b869"
        strokeWidth="3"
        fill="#e5b869"
        fillOpacity="0.5"
      />
      {/* Body of Pomegranate */}
      <path
        d="M50 25 C25 25 10 45 10 70 C10 95 32 105 50 105 C68 105 90 95 90 70 C90 45 75 25 50 25 Z"
        stroke="currentColor"
        strokeWidth="3"
        fill="currentColor"
        fillOpacity="0.2"
      />
      {/* Decorative Seeds / Arils */}
      <circle cx="40" cy="60" r="4" fill="currentColor" />
      <circle cx="55" cy="58" r="4" fill="#e5b869" />
      <circle cx="50" cy="74" r="4" fill="currentColor" />
      <circle cx="36" cy="76" r="3" fill="#e5b869" />
      <circle cx="62" cy="75" r="3" fill="currentColor" />
    </svg>
  );
};

/**
 * گل زعفران ایرانی (Saffron Crocus Flower)
 * طلای سرخ ایران، نماد طعم، عطر و اصالت سفره ایرانی
 */
export const SaffronFlower: React.FC<SymbolProps> = ({ className = "text-purple-400", size = 32 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Purple Petals */}
      <ellipse cx="50" cy="40" rx="14" ry="26" stroke="currentColor" strokeWidth="2.5" fill="currentColor" fillOpacity="0.25" />
      <ellipse cx="32" cy="45" rx="12" ry="24" transform="rotate(-30 32 45)" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.2" />
      <ellipse cx="68" cy="45" rx="12" ry="24" transform="rotate(30 68 45)" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.2" />
      
      {/* Golden Red Stigmas (کلاله‌های سرخ زعفران) */}
      <path d="M50 55 Q46 35 42 22" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
      <path d="M50 55 Q50 32 50 18" stroke="#f59e0b" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M50 55 Q54 35 58 22" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
      
      {/* Stem */}
      <path d="M50 65 L50 95" stroke="#10b981" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  );
};

/**
 * مهر خاتم و تذهیب رسمی خوان‌سالار (Persian Royal Stamp & Seal)
 * برای ثبت رسمی روی فاکتورها، گزارش‌های بستن حساب و دفاتر مالی
 */
export const PersianRoyalStamp: React.FC<{ size?: number; text?: string; className?: string }> = ({ 
  size = 90, 
  text = "ممهور به مهر مالی",
  className = ""
}) => {
  return (
    <div 
      className={`inline-flex items-center justify-center relative select-none ${className}`}
      style={{ width: size, height: size }}
    >
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 120 120" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="text-amber-500/80 drop-shadow-[0_0_10px_rgba(229,184,105,0.3)] animate-in fade-in"
      >
        {/* Outer Octagram Seal Border */}
        <polygon 
          points="60,6 76,20 98,20 102,42 116,60 102,78 98,100 76,100 60,114 44,100 22,100 18,78 4,60 18,42 22,20 44,20" 
          stroke="currentColor" 
          strokeWidth="3" 
          strokeDasharray="4 2"
          fill="rgba(10, 26, 59, 0.4)"
        />
        {/* Double Circular Rings */}
        <circle cx="60" cy="60" r="44" stroke="currentColor" strokeWidth="2" />
        <circle cx="60" cy="60" r="39" stroke="#00c8b3" strokeWidth="1.5" strokeDasharray="3 3" />
        
        {/* Center Calligraphic Emblem: خ */}
        <text 
          x="60" 
          y="66" 
          textAnchor="middle" 
          fill="currentColor" 
          fontSize="28" 
          fontFamily="Vazirmatn, serif"
          fontWeight="900"
        >
          خ
        </text>

        {/* Circular Stamp Text */}
        <text 
          x="60" 
          y="84" 
          textAnchor="middle" 
          fill="#00c8b3" 
          fontSize="8.5" 
          fontFamily="Vazirmatn, sans-serif"
          fontWeight="700"
        >
          {text}
        </text>
        <text 
          x="60" 
          y="38" 
          textAnchor="middle" 
          fill="currentColor" 
          fontSize="7.5" 
          fontFamily="Vazirmatn, sans-serif"
          fontWeight="800"
          letterSpacing="1"
        >
          خوان‌سالار • KHANSALAR
        </text>
      </svg>
    </div>
  );
};

/**
 * کادر نوار اسلیمی سنتی (Eslimi Border Strip)
 */
export const EslimiBorderStrip: React.FC<{ className?: string }> = ({ className = "text-khansalar-gold/40" }) => {
  return (
    <svg
      width="100%"
      height="18"
      viewBox="0 0 400 18"
      preserveAspectRatio="none"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M0 9 Q25 0 50 9 T100 9 T150 9 T200 9 T250 9 T300 9 T350 9 T400 9"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="50" cy="9" r="2.5" fill="currentColor" />
      <circle cx="150" cy="9" r="2.5" fill="#00c8b3" />
      <circle cx="250" cy="9" r="2.5" fill="currentColor" />
      <circle cx="350" cy="9" r="2.5" fill="#00c8b3" />
    </svg>
  );
};
