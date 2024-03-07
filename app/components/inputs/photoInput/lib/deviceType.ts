export default function identifyDevice(innerWidth: number) {
  let device = { isMobile: false, isTablet: false, isDesktop: false }
  if (innerWidth <= 500) {
    device.isMobile = true
  } else if (innerWidth <= 768 && innerWidth > 500) {
    device.isTablet = true
  } else {
    device.isDesktop = true
  }
  return device
}
