import React, { PureComponent } from 'react'
import { Animated } from 'react-native'

const translateProperties = [ // prettier-ignore
  'perspective', 'rotate', 'rotateX', 'rotateY', 'rotateZ', 'scale', 'scaleX',
  'scaleY', 'skewX', 'skewY', 'translateX', 'translateY',
]

export const SPRING = Animated.spring
export const TIMING = Animated.timing
export const DECAY = Animated.decay

interface TweenInfo {
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
  active?: boolean
}

interface Props {
  tweens: TweenInfo[]
  style?
}

interface State {
  animatedStyles: Array<{}>
}

export default class Tweenable extends PureComponent<Props, State> {
  state: State = { animatedStyles: [] }

  tweens: Array<TweenInfo> = []

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
      value: new Animated.Value(typeof t.from === 'string' ? 0 : t.from),
      interpolated: typeof t.from === 'string',
      active: false,
    }))

    const startingTweens: string[] = []

    this.tweens.forEach(({ name, autoStart }) => autoStart && startingTweens.push(name))

    if (startingTweens.length > 0) this.parallel({ names: startingTweens })
  }

  componentDidMount() {
    this.mounted = true
  }

  calculateAnimatedStyles() {
    const animatedStyles: Array<{}> = []

    this.tweens.forEach((tween: TweenInfo) => {
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

  createTween(tweenInfo: TweenInfo, reversed: boolean) {
    const { type, from, to, duration, value, delay, interpolated } = tweenInfo

    tweenInfo.active = true
    this.calculateAnimatedStyles()

    value.setValue(reversed ? (interpolated ? 1 : to) : (interpolated ? 0 : from)) // prettier-ignore

    // @ts-ignore
    const tween = type(value, {
      toValue: reversed ? (interpolated ? 0 : from) : (interpolated ? 1 : to), // prettier-ignore
      duration,
      useNativeDriver: true,
    })

    return delay ? Animated.sequence([Animated.delay(delay), tween]) : tween
  }

  createTweenComplete = (tweenInfos: TweenInfo[], onComplete: Function) => ({ finished }) => {
    if (finished) {
      tweenInfos.forEach(tweenInfo => (tweenInfo.active = false))
      onComplete && onComplete()
    }
  }

  animate({ name = 'default', reversed = false, onComplete }: any = {}) {
    const tweenInfo = this.tweens.find(t => t.name === name)

    if (tweenInfo) {
      const tween = this.createTween(tweenInfo, reversed)
      tween.start(this.createTweenComplete([tweenInfo], onComplete))
    } else {
      throw Error('Tween is not found')
    }
  }

  parallel({ names, onComplete }: { names: string[], onComplete?: Function }) {
    const tweenInfos = names.map(name => this.tweens.find(t => t.name === name))
    const tweens = tweenInfos.map(tweenInfo => this.createTween(tweenInfo, false))

    Animated.parallel(tweens).start(this.createTweenComplete(tweenInfos, onComplete))
  }

  render() {
    return (
      <Animated.View style={[this.props.style, ...this.state.animatedStyles]}>
        {this.props.children}
      </Animated.View>
    )
  }
}
