import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import firebaseApp from '../../Firebase'
import { Images, Fonts } from '../../Themes'
import FillBlank from './FillBlank'
// import SimpleFin from './FillBlank'

class Puzzle extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      status: 'Pending',
      attempts: 0,
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    if(this.props.puzzleUrl) this.puzzleRef = firebaseApp.database().ref(this.props.puzzleUrl)
  }

  handleSubmit(answer) {
    console.log('handleSubmit called', answer, this.state.attempts)
    if(this.state.status === 'Pending') {
      let newAttempts = this.state.attempts + 1;
      console.log('newAttempts', newAttempts)
      if(answer.toLowerCase() === this.props.puzzle.answer.toLowerCase()) {
        this.setState({
          attempts: newAttempts,
          status: 'Complete',
        })
      } else if (newAttempts === this.props.puzzle.maxAttempts) {
        this.setState({
          attempts: newAttempts,
          status: 'Failure',
        })
      } else {
        this.setState({
          attempts: newAttempts,
        })
      }
    }
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

  getPuzzleObj(puzzle) {
    switch(puzzle.puzzleType) {
      case 'fillBlank':
        return <FillBlank
          puzzle={puzzle}
          handleSubmit={this.handleSubmit}
          disabled={ !(this.state.attempts < this.props.puzzle.maxAttempts) }
        />
        break;
      case 'simpleFind':
        return (
          <View>
            <TouchableOpacity
              onPress={() => {}}
              style={{}}>
              <Text>Click to launch camera</Text>
            </TouchableOpacity>
          </View>
        )
        break;
      default:
      return (<View></View>)
        // throw new Error('Puzzle type not recognized.')
    }
  }
  render() {
    console.log('Puzzle props, ', this.props)
    return (
      <View style={{backgroundColor: 'green'}}>
        <Text>Status: {this.state.status}</Text>
        <Text>Attempts Allowed: {this.props.puzzle.maxAttempts}</Text>
        <Text>Attempts: {this.state.attempts}</Text>
        {this.getPuzzleObj(this.props.puzzle)}
      </View>
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

export default connect(mapStateToProps, mapDispatchToProps)(Puzzle)
