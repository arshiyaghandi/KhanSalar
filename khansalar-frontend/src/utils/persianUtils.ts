/**
 * Persian typography and financial formatting utilities
 */

const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

export function toPersianDigits(input: number | string): string {
  if (input === null || input === undefined) return '';
  return input
    .toString()
    .replace(/[0-9]/g, (char) => PERSIAN_DIGITS[parseInt(char, 10)]);
}

export function formatPrice(amount: number): string {
  if (isNaN(amount)) return '۰ تومان';
  const formattedWithCommas = Math.round(amount).toLocaleString('en-US');
  return `${toPersianDigits(formattedWithCommas)} تومان`;
}

export function formatPriceRials(amount: number): string {
  if (isNaN(amount)) return '۰ ریال';
  const rials = amount * 10;
  const formattedWithCommas = Math.round(rials).toLocaleString('en-US');
  return `${toPersianDigits(formattedWithCommas)} ریال`;
}

export function getJalaliDate(): string {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return new Intl.DateTimeFormat('fa-IR', options).format(new Date());
}

export function getJalaliTime(): string {
  return new Intl.DateTimeFormat('fa-IR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(new Date());
}
