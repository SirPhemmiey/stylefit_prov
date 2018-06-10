import React from 'react'
import {
  StyleSheet,
  Text,
  View,
  AsyncStorage,
  ActivityIndicator,
  StatusBar,
  Image,
  TouchableOpacity,
  ToastAndroid
} from 'react-native'
import Config from 'react-native-config'
import { Card, Avatar } from 'react-native-elements'
import {
  Title,
  Container,
  Content,
  Header,
  Left,
  Button,
  Icon,
  Body,
  Item,
  Input,
  InputGroup,
  Right
} from 'native-base'
import { ProgressDialog, Dialog } from 'react-native-simple-dialogs'
export default class ProviderSearch extends React.Component {
  static navigationOptions = {
    header: null
  }
  constructor (props) {
    super(props)
    this.state = {
      showLoader: true,
      providers: [],
      showDialog: false,
      dialogMessage: '',
      showLoading: true
    }
  }
  loadData = () => {
    const { navigation } = this.props
    let selectedService = navigation.getParam('selectedService', null)
    let destLat = navigation.getParam('destLat', null)
    let destLong = navigation.getParam('destLong', null)
    AsyncStorage.getItem('jwt').then(token => {
      fetch(Config.API_URL + '/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          selectedService: selectedService,
          destLat: destLat,
          destLong: destLong
        })
      })
        .then(res => res.json())
        .then(res => {
          this.setState({
            showLoading: false
          })
          if (res == 'empty') {
            this.setState({
              showLoader: false,
              dialogMessage: 'No provider found'
            })
          } else {
            this.setState({
              showLoader: false,
              providers: res
            })
          }
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
  _showMessage = () => {
    ToastAndroid.showWithGravity(
      'No Provider found',
      ToastAndroid.LONG,
      ToastAndroid.CENTER
    )
  }
  _gotoProviderDetails = (provider_id, provider_name) => {
    const { navigation } = this.props
    let selectedService = navigation.getParam('selectedService', null)
    let destLat = navigation.getParam('destLat', null)
    let destLong = navigation.getParam('destLong', null)
    let date = navigation.getParam('date', null)
    let address = navigation.getParam('address', null)
    let phone = navigation.getParam('phone', null)

    this.props.navigation.navigate('providerDetails', {
      selectedService: selectedService,
      destLat: destLat,
      destLong: destLong,
      provider_id: provider_id,
      provider_name: provider_name,
      address: address,
      date: date,
      phone: phone
    })
  }
  componentDidMount () {
    this.loadData()
  }
  render () {
    const { navigation } = this.props
    return (
      <Container>
        <Header style={{ backgroundColor: '#6c5ce7' }}>

          <Left>
            <Button transparent>
              <Icon
                onPress={() => navigation.goBack()}
                ios='ios-arrow-dropleft-circle'
                android='md-arrow-dropleft-circle'
                style={{ color: 'white', fontSize: 25 }}
              />
            </Button>
          </Left>
          <Body>
            <Title style={{ fontFamily: 'NunitoSans-Regular' }}>
              Search Results
            </Title>
          </Body>
          <Right />
        </Header>
        <StatusBar
          barStyle='light-content'
          backgroundColor='#6c5ce7'
          networkActivityIndicatorVisible
        />
        <Content>
          <Title
            style={{
              fontFamily: 'NunitoSans-Regular',
              color: '#6c5ce7',
              marginTop: 10
            }}
          >
            Found {this.state.providers.length} provider(s)
          </Title>
          {!this.state.showLoader
            ? this.state.providers.length != 0
                ? this.state.providers.map((rev, index) => {
                  return (
                    <TouchableOpacity
                      key={index}
                      onPress={() => this._gotoProviderDetails(
                          rev['Provider']['id'], rev['Provider']['name']
                        )}
                      >
                      <Card>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-around'
                          }}
                          >
                          <Avatar
                            size='xlarge'
                            source={{
                              uri: Config.PROVIDER_PIC +
                                  rev['Provider']['pic']
                            }}
                            activeOpacity={0.7}
                            />
                          <View
                            style={{
                              flexDirection: 'column',
                              justifyContent: 'space-between',
                              width: 0,
                              flexGrow: 1
                            }}
                            >
                            <Text
                              style={{
                                marginLeft: 10,
                                fontFamily: 'NunitoSans-Regular'
                              }}
                              >
                              {rev['Provider']['name']}
                            </Text>

                            <Text
                              style={{
                                marginLeft: 8,
                                marginTop: 15,
                                fontFamily: 'NunitoSans-Regular',
                                fontSize: 12
                              }}
                              >
                              {rev['Provider']['profession']}
                            </Text>
                          </View>

                          <View style={{ marginTop: 30 }} />

                        </View>
                      </Card>
                    </TouchableOpacity>
                  )
                })
                : this._showMessage()
            : null}
          <View>
            <Button
              small
              block
              light
              onPress={() => navigation.goBack()}
              style={{
                justifyContent: 'center',
                alignSelf: 'center',
                marginTop: 20,
                backgroundColor: '#6c5ce7',
                padding: 5
              }}
            >
              <Text style={{ fontFamily: 'NunitoSans-Regular', color: '#fff' }}>
                Search Again
              </Text>
            </Button>
          </View>
          <ProgressDialog
            visible={this.state.showLoading}
            title='Searching for providers'
            message='Please wait...'
          />
          <Dialog
            visible={this.state.showDialog}
            onTouchOutside={() => this.setState({ showDialog: false })}
            contentStyle={{ justifyContent: 'center', alignItems: 'center' }}
            animationType='fade'
          >
            <View>
              <Text>
                {this.state.dialogMessage}
              </Text>
            </View>
            <Button
              small
              light
              onPress={() => this.setState({ showDialog: false })}
              style={{
                justifyContent: 'center',
                alignSelf: 'center',
                marginTop: 20,
                backgroundColor: '#6c5ce7'
              }}
            >
              <Text style={{ fontFamily: 'NunitoSans-Regular', color: '#fff' }}>
                CLOSE
              </Text>
            </Button>
          </Dialog>
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
  }
})
