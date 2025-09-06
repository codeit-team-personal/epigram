import { format, register } from 'timeago.js';
import koLoccale from 'timeago.js/lib/lang/ko';

register('ko', koLoccale);

export function formatAgo(date, lang = 'en_US') {
  return format(date, lang);
}
