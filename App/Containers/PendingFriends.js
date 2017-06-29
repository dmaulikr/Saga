import React from 'react'
import { View, Text, Image, ListView, ScrollView } from 'react-native'
import { connect } from 'react-redux'
import ApproveFriendRow from '../Components/ApproveFriendRow'
import PendingFriendRow from '../Components/PendingFriendRow'
import styles from './Styles/JourneyFriendsStyles'
import { Colors } from '../Themes'


const ApproveFriends = ({ pending, approve }) => {
  if (!pending) pending = []
  if (!approve) approve = []
    
  let pendingFriends = new ListView
    .DataSource({rowHasChanged : (r1, r2) => r1 != r2})
    .cloneWithRows(pending)

  let approveFriends = new ListView
    .DataSource({rowHasChanged : (r1, r2) => r1 != r2})
    .cloneWithRows(approve)

  return (
    <View style={[styles.container, {paddingTop: 10}]}>
      <ScrollView style={{paddingHorizontal: 10}}>
        <View style={{borderBottomWidth: 1, borderColor: 'gray', marginHorizontal: '25%', justifyContent: 'center', marginBottom: 10}}>
          <Text style={[styles.boldLabel, {color: 'gray'}]}>
            Your Requests
          </Text>
        </View>
        <ListView
          dataSource={pendingFriends}
          removeClippedSubviews={false}
          renderRow={(user) => <PendingFriendRow user={user} />}
        />
        <View style={{borderBottomWidth: 1, borderColor: 'gray', marginHorizontal: '25%', justifyContent: 'center', marginTop: 20, marginBottom: 10}}>
          <Text style={[styles.boldLabel, {color: 'gray'}]}>
            Pending Friend Requests
          </Text>
        </View>
        <ListView
          dataSource={approveFriends}
          removeClippedSubviews={false}
          renderRow={(user) => <ApproveFriendRow user={user} />}
        />
      </ScrollView>
    </View>
  )
}


const mapState = state => ({
  pending : state.friends.myFriends.recieved,
  approve : state.friends.myFriends.sent
})
const mapDispatch = {}

export default connect(mapState, mapDispatch)(ApproveFriends)
