import React from 'react'
import { View, Text, TouchableOpacity, Image } from 'react-native'
import { connect } from 'react-redux'
import firebaseApp from '../Firebase'

import RoundedButton from '../Components/Button/RoundedButton'
import Puzzle from '../Components/Puzzle'
import { ApplicationStyles, Images } from '../Themes'

// Styles
import styles from './Styles/PuzzleInfoStyles'

class PuzzleInfo extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      puzzle: {},
    }
    if(this.props.puzzleUrl) this.puzzleRef = firebaseApp.database().ref(this.props.puzzleUrl)
  }

  componentDidMount() {
    if(this.props.puzzleUrl) this.listenForChange(this.puzzleRef)
  }

  componentWillUnmount () {
    if(this.props.puzzleUrl) this.puzzleRef.off('value', this.unsubscribe)
  }

  listenForChange(ref) {
    this.unsubscribe = ref.on('value', puzzle => {
      console.log('new info', puzzle.val())
      this.setState({
        puzzle: puzzle.val()
      })
    })
  }

  render() {

    // const puzzle = {
    //   id: this.props.puzzleInfo,
    //   question: 'What goes up when rain comes down?',
    //   answer: 'An umbrella',
    //   puzzleType: 'simpleFind',
    //   maxAttempts: 3
    // }

    console.log('currentpuzzle', this.state.puzzle)
    console.log('puzzle url', this.props.puzzleUrl)
    return (
        this.props.puzzleUrl
        ? (
          <View style={styles.container}>
            <View style={styles.sectionHeader}>
              <Text style={styles.boldLabel}>Puzzle #{this.state.puzzle.id}</Text>
              <TouchableOpacity
                onPress={this.props.screenProps.toggle}
                style={styles.modalClose}>
                <Image source={Images.closeButton} />
              </TouchableOpacity>
            </View>
            <View>
              <Image source={Images.storyMain[this.props.storyKey]} style={styles.logo}/>
              <View style={styles.centeredOverlay}>
                <Image source={Images.puzzle} style={[styles.logo,{resizeMode: 'contain'}]} />
              </View>
            </View>
            <View style={styles.infoText}>
              <Text>
                (Puzzle Information Here)
                {
                  this.state.puzzle.description
                  ? this.state.puzzle.description
                  : 'Description is empty in Firebase.'
                }
              </Text>
              {/*<Text>Puzzle ID: {this.state.puzzle.id}</Text>*/}
            </View>
            <Puzzle puzzle={this.state.puzzle}/>
          </View>
        )
        : <View></View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    puzzleUrl: state.currentStory.puzzleUrl,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PuzzleInfo)

