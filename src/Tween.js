import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'

export default class Tween extends Component {
  render() {
    return (
      <View style={styles.container} />
    )
  }
}

const styles = StyleSheet.create({
  container: { width: 100, height: 100, backgroundColor: 'pink' },
})
