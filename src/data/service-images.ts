/*
  Service preview illustrations shown in the homepage services list.
  Sources are src/assets/img/1.png … 9.png (in service order); these are
  WebP re-encodes of them. Explicit imports so Vite fingerprints and bundles
  them, same as data/work-images.ts.
*/
import webDevelopment from '../assets/img/services/web-development.webp'
import mobileDevelopment from '../assets/img/services/mobile-development.webp'
import uiUxDesign from '../assets/img/services/ui-ux-design.webp'
import aiDevelopment from '../assets/img/services/ai-development.webp'
import softwareDevelopment from '../assets/img/services/software-development.webp'
import branding from '../assets/img/services/branding.webp'
import ecommerce from '../assets/img/services/ecommerce.webp'
import digitalMarketing from '../assets/img/services/digital-marketing.webp'
import aiChatbotDevelopment from '../assets/img/services/ai-chatbot-development.webp'

export const serviceImages: Record<string, string> = {
  'web-development': webDevelopment,
  'mobile-development': mobileDevelopment,
  'ui-ux-design': uiUxDesign,
  'ai-development': aiDevelopment,
  'software-development': softwareDevelopment,
  branding,
  ecommerce,
  'digital-marketing': digitalMarketing,
  'ai-chatbot-development': aiChatbotDevelopment,
}
