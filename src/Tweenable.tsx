import React, { PureComponent } from 'react'
import { Animated } from 'react-native'

const translateProperties = [ // prettier-ignore
  'perspective', 'rotate', 'rotateX', 'rotateY', 'rotateZ', 'scale', 'scaleX',
  'scaleY', 'skewX', 'skewY', 'translateX', 'translateY',
]

export const SPRING = Animated.spring
export const TIMING = Animated.timing
export const DECAY = Animated.decay

interface Tween {
  property: string
  from: number | string
  to: number | string
  name?: string
  type?: typeof SPRING | typeof TIMING | typeof DECAY
  value?
  interpolated?: boolean
  duration?: number
  delay?: number
  autoStart?: boolean
  onComplete?: () => void
  onReversedComplete?: () => void
  active?: boolean
}

interface Props {
  tweens: Tween[]
  style?
}

interface State {
  animatedStyles: Array<{}>
}

export default class Tweenable extends PureComponent<Props, State> {
  state: State = { animatedStyles: [] }

  tweens: Array<Tween> = []

  mounted: boolean = false

  constructor(props) {
    super(props)

    // Animations are processed only before component mount, otherwise
    // adjusting animations props will lead to ruining current animations state
    this.tweens = props.tweens.map(t => ({
      name: t.name || 'default',
      type: t.type || Animated.spring,
      property: t.property,
      from: t.from,
      to: t.to,
      duration: t.duration,
      delay: t.delay,
      autoStart: t.autoStart === undefined ? true : t.autoStart,
      onComplete: t.onComplete,
      onReversedComplete: t.onReversedComplete,
      value: new Animated.Value(typeof t.from === 'string' ? 0 : t.from),
      interpolated: typeof t.from === 'string',
      active: false,
    }))

    const startingAnimations: string[] = []

    this.tweens.forEach(({ name, autoStart }: any) => {
      if (autoStart) startingAnimations.push(name)
    })

    startingAnimations.forEach(name => this.animate({ name }))
  }

  componentDidMount() {
    this.mounted = true
  }

  calculateAnimatedStyles() {
    const animatedStyles: Array<{}> = []

    this.tweens.forEach((tween: Tween) => {
      if (tween.active) {
        const styleValue = tween.interpolated
          ? tween.value.interpolate({
              inputRange: [0, 1],
              outputRange: [tween.from, tween.to],
            })
          : tween.value

        animatedStyles.push(
          translateProperties.includes(tween.property)
            ? { transform: [{ [tween.property]: styleValue }] }
            : { [tween.property]: styleValue },
        )
      }
    })

    if (this.mounted) {
      this.setState({ animatedStyles })
    } else {
      this.state.animatedStyles = animatedStyles
    }
  }

  animate({
    name = 'default',
    reversed = false,
  }: { name?: string; reversed?: boolean } = {}) {
    const animationInfo = this.tweens.find(t => t.name === name)

    if (animationInfo) {
      const { type, from, to, duration, value, onComplete, interpolated,
        delay, onReversedComplete } = animationInfo // prettier-ignore

      animationInfo.active = true
      this.calculateAnimatedStyles()

      value.setValue(reversed ? (interpolated ? 1 : to) : (interpolated ? 0 : from)) // prettier-ignore

      // @ts-ignore
      const mainAnimation = type(value, {
        toValue: reversed ? (interpolated ? 0 : from) : (interpolated ? 1 : to), // prettier-ignore
        duration,
        useNativeDriver: true,
      })

      const onAnimationComplete = ({ finished }) => {
        if (finished) {
          animationInfo.active = false
          if (reversed) {
            onReversedComplete && onReversedComplete()
          } else {
            onComplete && onComplete()
          }
        }
      }

      if (delay) {
        Animated.sequence([
          Animated.delay(delay),
          mainAnimation
        ]).start(onAnimationComplete)
      } else {
        mainAnimation.start(onAnimationComplete)
      }
    } else {
      throw Error('Animation is not found')
    }
  }

  render() {
    return (
      <Animated.View style={[this.props.style, ...this.state.animatedStyles]}>
        {this.props.children}
      </Animated.View>
    )
  }
}
