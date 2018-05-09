import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Animated } from 'react-native'

export default class Tween extends Component {
  static propTypes = {
    animations: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        type: PropTypes.func,
        property: PropTypes.string.isRequired,
        from: PropTypes.number.isRequired,
        to: PropTypes.number.isRequired,
        duration: PropTypes.number,
        native: PropTypes.bool,
        autoStart: PropTypes.bool,
        onComplete: PropTypes.func,
        onReversedComplete: PropTypes.func,
      }),
    ),
    style: PropTypes.any,
  }

  state = { animatedStyles: [] }

  animations = []

  constructor(props) {
    super()

    this.animations = props.animations.map(a => ({
      name: a.name || 'default',
      type: a.type || Animated.spring,
      property: a.property,
      from: a.from,
      to: a.to,
      duration: a.duration,
      native: a.native === undefined ? true : a.native,
      autoStart: a.autoStart === undefined ? true : a.autoStart,
      onComplete: a.onComplete,
      onReversedComplete: a.onReversedComplete,
      value: new Animated.Value(a.from),
      active: false,
    }))
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState === this.state
  }

  componentWillMount() {
    this.animations.forEach(animation => {
      if (animation.autoStart) this.animate(animation.name)
    })
  }

  calculateAnimatedStyles() {
    const animatedStyles = []

    this.animations.forEach(animation => {
      if (animation.active) {
        animatedStyles.push(
          translateProperties[animation.property]
            ? { transform: [{ [animation.property]: animation.value }] }
            : { [animation.property]: animation.value },
        )
      }
    })

    this.setState({ animatedStyles })
  }

  animate({ name = 'default', reversed = false }) {
    const animation = this.animations.find(a => a.name === name)

    if (animation) {
      const {
        type,
        from,
        to,
        duration,
        native,
        value,
        onComplete,
        onReversedComplete,
      } = animation

      animation.active = true
      this.calculateAnimatedStyles()

      value.setValue(reversed ? to : from)

      type(value, {
        toValue: reversed ? from : to,
        duration,
        useNativeDriver: native,
      }).start(({ finished }) => {
        // console.log('completed tween:', animation.property, finished)
        if (finished) {
          animation.active = false
          if (reversed) {
            onReversedComplete && onReversedComplete()
          } else {
            onComplete && onComplete()
          }
        }
      })
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

const translateProperties = {
  perspective: true,
  rotate: true,
  rotateX: true,
  rotateY: true,
  rotateZ: true,
  scale: true,
  scaleX: true,
  scaleY: true,
  skewX: true,
  skewY: true,
  translateX: true,
  translateY: true,
}
