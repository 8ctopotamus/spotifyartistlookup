import React, { Component } from 'react'
import {
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  ListView,
  View
} from 'react-native'
import clrs from '../utils/clrs'
import ListItem from './ListItem'
import { searchFor } from '../utils/fetcher'
import { debounce } from 'lodash'

export default class Main extends Component {
  constructor(props) {
    super(props)

    const dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    })

    this.state = {artists: dataSource}
  }

  renderRow = (artist, sId, id) => {
    const { navigator } = this.props
    const ARTIST_STATE = {
      id: 'ARTIST_DETAIL',
      title: artist.name,
      url: artist.external_urls.spotify,
    }

    const imageUrl = artist.images[0] ? artist.images[0].url : null

    return (
      <ListItem index={ id }
         text={ artist.name }
         imageUrl={ imageUrl }
         navState={ ARTIST_STATE }
         navigator={ navigator } />
    )
  }

  render() {
    const { artists } = this.state

    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />

        <TextInput style={styles.searchBox}
          onChangeText={this.makeQuery} />

        <ListView dataSource={this.state.artists}
          style={{flex: 1, alignSelf: 'stretch'}}
          renderRow={this.renderRow} />
      </View>
    )
  }

  makeQuery = debounce(query => {
    searchFor(query)
      .then(artists => {
        this.setState({
          artists: this.state.artists.cloneWithRows(artists),
        });
      })
      .catch((error) => {
        throw error;
      });
  }, 400);
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 64,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: clrs.white,
  },
  searchBox: {
    height: 40,
    borderColor: clrs.black,
    borderWidth: 2,
    margin: 16,
    paddingLeft: 10,
    fontWeight: '800',
    alignSelf: 'stretch'
  },
})
