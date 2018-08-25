import React, { Component } from 'react'
import { View } from 'react-native'

import { Tweenable } from 'react-native-tweenable'

export default class BasicExample extends Component {
  render () {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Tweenable
          style={{ marginBottom: 40, width: 200, height: 80, backgroundColor: 'tomato' }}
          tweens={[
            { name: 'opacity', property: 'opacity', from: 0, to: 1 },
            { name: 'translateY', property: 'translateY', from: -30, to: 0 },
          ]}
        />

        {Array(6).fill().map((a, i) =>
          <Tweenable
            key={i}
            style={{ marginTop: 20, width: 270, height: 50, backgroundColor: 'tomato' }}
            tweens={[
              { name: 'opacity', property: 'opacity', from: 0, to: 1, delay: 50 + i * 40 },
              { name: 'translateY', property: 'translateX', from: 100, to: 0, delay: 50 + i * 40 },
            ]}
          />
        )}
      </View>
    )
  }
}
