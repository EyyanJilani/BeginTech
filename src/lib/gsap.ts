import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { CustomEase } from 'gsap/CustomEase'

gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase)

/** Signature BeginTech easing — long, cinematic settle. */
CustomEase.create('bt', '0.16, 1, 0.3, 1')
CustomEase.create('bt-inout', '0.76, 0, 0.24, 1')

gsap.defaults({ ease: 'bt', duration: 1 })

ScrollTrigger.config({ ignoreMobileResize: true })

export { gsap, ScrollTrigger, SplitText, CustomEase }
