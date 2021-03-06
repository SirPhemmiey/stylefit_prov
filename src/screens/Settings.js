import { Body, Button, Container, Content, Header, Icon, Title, Left, Right, Thumbnail } from 'native-base'
import React from 'react'
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from 'react-native'
import Config from 'react-native-config'
import { Avatar, Card, Divider } from 'react-native-elements'

export default class Settings extends React.Component {
  static navigationOptions = {
    header: null
  }
  constructor (props) {
    super(props)
    this.state = {
      profile: '',
      showLoader: true,
      showDialog: '',
      dialogMessage: ''
    }
    this.logout = this.logout.bind(this)
    this.editProfile = this.editProfile.bind(this);
  }
  onChangeText = () => {
    const { services } = this.state
  }
  logout(){
    let keys = ['jwt', 'loggedIn', 'seeWelcome'];
    AsyncStorage.multiRemove(keys, err => {
      this.props.navigation.replace('loginStack');
    });
  };
  editProfile = (customer_id) => () =>  {
    this.props.navigation.navigate("editProfile", {
      customer_id: customer_id
    })
  }
  loadData = () => {
    AsyncStorage.getItem('jwt').then(token => {
      fetch('http://www.playspread.com/stylefit/ProvApi/profile', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then(res => {
          this.setState({
            showLoader: false
          })
          this.setState({
            profile: res
          })
        })
        .catch(err => {
          this.setState({
            showDialog: true,
            dialogMessage: err.message,
            showLoader: false
          })
        })
    })
  }
  componentWillMount () {
    this.loadData()
  }

  render () {
    const profile = this.state.profile
    return (
      <Container>
        <Header style={{ backgroundColor: '#6c5ce7' }}>
          <Left>
          <Button transparent iconLeft onPress={() => null}>
            <Icon name='menu' />
          </Button>
          </Left>
          <Body>
            <Title style={styles.heading}>Profile</Title>
          </Body>
          <Right />

        </Header>
        <StatusBar
          barStyle='light-content'
          backgroundColor='#6c5ce7'
          networkActivityIndicatorVisible
        />
        <Content>

          <Card>
            <View style={{
                  flex: 1,
                  alignContent: 'center',
                  alignSelf: 'center',
                  justifyContent: 'center'
                }}>
              <Thumbnail
               large
                source={{
                  uri: 'http://www.playspread.com/stylefit/app/webroot/customer_pic/IMG_20171018_103905_661.jpg'
                }}
               resizeMode="cover"
              />
              <Text style={styles.title}>{profile.full_name}</Text>
            </View>
          </Card>
          <Card>
            <View>
              <TouchableOpacity onPress={this.editProfile(profile.id)}>
              <Text style={styles.account}>Edit Profile</Text>
              </TouchableOpacity>
              <Divider style={{ marginTop: 10 }} />
              <TouchableOpacity onPress={this.logout}>
              <Text style={styles.logout}>Logout</Text>
              </TouchableOpacity>
            </View>
          </Card>

          <ActivityIndicator
            color='#6c5ce7'
            size='small'
            animating={this.state.showLoader}
          />
        </Content>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  searchInput: {
    fontFamily: 'NunitoSans-Regular',
    fontSize: 16
  },
  title: {
    fontFamily: 'NunitoSans-Regular',
    fontSize: 18,
    color: '#6c5ce7',
    textAlign: 'center',
    marginTop: 10
  },
  heading: {
    fontFamily: 'NunitoSans-Regular',
    //fontSize: 20,
    //color: '#fff'
  },
  account: {
    justifyContent: 'flex-end',
    alignSelf: 'flex-start',
    fontFamily: 'NunitoSans-Regular',
    color: '#6c5ce7',
    fontSize: 16
  },
  logout: {
    marginTop: 10,
    justifyContent: 'flex-end',
    alignSelf: 'flex-start',
    fontFamily: 'NunitoSans-Regular',
    color: '#6c5ce7',
    fontSize: 16
  }
})
