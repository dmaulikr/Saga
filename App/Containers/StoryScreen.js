import React from 'react'
import { ListView, View, Text } from 'react-native'
import firebaseApp from '../Firebase'
import * as firebase from 'firebase'
import { connect } from 'react-redux'
import StoryListItem from '../Components/StoryListItem'
import SearchBar from '../Components/SearchBar'
import styles from './Styles/StoryScreenStyles'

class StoryScreen extends React.Component {
  constructor() {
    super()
    this.state = {
      ds: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 }),
      text: '',
    }
    
    this.uid = firebaseApp.auth().currentUser.uid
    this.unsubscribeJourneyRef = null;
    this.onSearch = this.onSearch.bind(this)
    this.createJourney = this.createJourney.bind(this)
  }

  onSearch (searchTerm) { this.setState({ text: searchTerm }) }

  checkMatch (searchTerm, story) {
    return story.title.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1;
  }

  createJourney (story) {    
    const uid = this.uid;
    const { navigate } = this.props.navigation
    const { fetchJourney } = this.props
    
    // increment index
    // NOTE: transactions are really weird
    // I definitely don't know why BUT
    // transactions get called twice, once with i = null
    // CODEREVIEW TODO: should I call off()?
    //
    
    const indexRef = firebaseApp.database().ref('/indexes/journey')
    const currentTime = firebase.database.ServerValue.TIMESTAMP
    indexRef.transaction(i => {
      if (i) {
        const jid = uid + i
        
        // new journey
        const newJourneyRef = firebaseApp.database().ref('/journey/' + jid)
        // no points {}, solved {}
        const newJourney = {
          "hintsLeft": 10,
          "failedAttempts": 0,
          "status": { 
            "text": "current", 
            "timestamp" : currentTime
          },
          "team": { "list": {[uid] : true} },
          "story": story,
          "times": { "start": currentTime }
        }
        newJourneyRef.set(newJourney)
        
        // user
        firebaseApp.database()
          .ref('/users/' + uid + '/journeys/current/' + jid)
          .set(story.name)
      }
      return i+1
    })
    
    navigate('JourneyFriends')
  }
  
  componentWillUnmount () {
    if (this.unsubscribeJourneyRef) this.unsubscribeJourneyRef()
  }

  render () {
    const { text } = this.state
    const { stories } = this.props
    const { navigate } = this.props.navigation

    const filteredStories = text.length
      ? stories.filter(story => this.checkMatch(text, story))
      : stories;
    const storyList = this.state.ds.cloneWithRows(filteredStories)

    return (
      <View style={styles.container}>
        <View style={styles.sectionHeader}>
          <Text style={styles.boldLabel}>Stories</Text>
        </View>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'center',
        }}>
          <SearchBar
            onSearch={this.onSearch} value={text}
            /*onCancel={this.onCancelSearchBar}*/
          />
        </View>
        <ListView
          dataSource={storyList}
          removeClippedSubviews={false}
          enableEmptySections={true}
          renderRow={(item) => <
            StoryListItem
            item={item}
            navigate={navigate}
            createJourney={this.createJourney}
          />}
        />
      </View>
    )
  }
}


const mapState = state => ({
  stories : state.stories.stories
})
export default connect(mapState)(StoryScreen)