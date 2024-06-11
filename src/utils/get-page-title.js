import defaultSettings from '@/settings'

const title = defaultSettings.title || 'Hệ thống Luồng Xanh'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
