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
  Picker,
  Dimensions
} from 'react-native'
import Config from 'react-native-config'
import DateTimePicker from 'react-native-modal-datetime-picker'
import {
  Title,
  Container,
  Content,
  Header,
  Left,
  Button,
  Icon,
  Body,
  Input,
  Right,
  Footer
} from 'native-base'
import { Dialog } from 'react-native-simple-dialogs'
const { width, height } = Dimensions.get('window')
export default class RequestService extends React.Component {
  static navigationOptions = {
    header: null
  }
  constructor (props) {
    super(props)
    this.state = {
      dateText: 'Choose Date',
      date: '',
      phone: '',
      isDateTimePickerVisible: false,
      selectedService: 1,
      services: [],
      disableButton: false,
      showLoader: true
    }
  }
  _handleDatePicked = date => {
    var slice = date.toString().split(' ')
    var date_ = slice[0]
    var date2_ = slice[1]
    var time_ = slice[2]
    var time2 = slice[3]
    var time3 = slice[4]
    this.setState({
      date: date_ + ' ' + date2_ + ' ' + time_ + ' ' + time2 + ' ' + time3,
      dateText: 'Date Choosen'
    })
    this._hideDateTimePicker()
  }
  _showDatePicker = () => {
    this.setState({
      isDateTimePickerVisible: true
    })
  }
  _hideDateTimePicker = () => {
    this.setState({
      isDateTimePickerVisible: false
    })
  }
  _getServices = () => {
    this.setState({
      showLoader: true,
      disableButton: true
    })
    AsyncStorage.getItem('jwt').then(token => {
      fetch(Config.API_URL + '/api/home', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then(res => {
          this.setState({
            showLoader: false,
            services: res,
            disableButton: false
          })
        })
        .catch(err => {
          this.setState({
            disableButton: true,
            showDialog: true,
            dialogMessage: err.message + "Go back to the previous page",
            showLoader: false
          })
        })
    })
    AsyncStorage.getItem('phone').then((phone) => {
      this.setState({
        phone: phone
      })
    })
  }
  _gotoProviderSearch = () => {
    const { date, selectedService } = this.state
    if (date == '') {
      this.setState({
        showDialog: true,
        dialogMessage: "Please choose a date",
      })
    } else {
      const { navigation } = this.props
      this.props.navigation.navigate('providerSearch', {
        address: navigation.getParam('address', null),
        destLat: navigation.getParam('destLat', null),
        destLong: navigation.getParam('destLong', null),
        date: this.state.date,
        selectedService: this.state.selectedService,
        phone: this.state.phone
      })
      // alert(this.state.selectedService + "service");
      // alert(this.state.phone + "phone"); 
      // alert(this.state.date + "date"); 
      // alert(navigation.getParam('address', null) + "address"); 
      // alert(navigation.getParam('destLat', null) + "Lat"); 
      // alert(navigation.getParam('destLong', null) + "Long") 
    }
  }
  _updatePicker = value => {
    this.setState({
      selectedService: value
    })
  }
  componentDidMount () {
    this._getServices()
  }

  render () {
    const { navigation } = this.props;
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
            <Text
              style={{
                color: '#fff',
                fontFamily: 'NunitoSans-Regular',
                fontSize: 16
              }}
            >
              Request Service
            </Text>
          </Body>
          <Right />
        </Header>
        <StatusBar
          barStyle='light-content'
          backgroundColor='#6c5ce7'
          networkActivityIndicatorVisible
        />
        <Content>
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Title
              style={{
                fontFamily: 'NunitoSans-Regular',
                marginTop: 10,
                color: '#6c5ce7'
              }}
            >
              When do you need this service ?
            </Title>
            <View style={styles.buttonView}>
              <Button
                onPress={this._showDatePicker}
                style={{
                  backgroundColor: '#6c5ce7',
                  padding: 5,
                  marginTop: 10
                }}
                small
              >
                <Text style={{ color: '#fff', fontFamily: 'NunitoSans-Regular' }}>{this.state.dateText}</Text>
              </Button>
              <Input
              multiline={true}
                underlineColorAndroid='#6c5ce7'
                editable={false}
                value={this.state.date}
                style={styles.input}
              />
            </View>
            <View>
              <Picker
                itemStyle={{ fontFamily: 'NunitoSans-Regular' }}
                selectedValue={this.state.selectedService}
                style={{
                  height: 50,
                  width: 360,
                  marginLeft: 15,
                  marginTop: 30
                }}
                onValueChange={this._updatePicker}
              >
                {!this.state.showLoader
                  ? this.state.services.map((service, index) => {
                    return (
                      <Picker.Item
                        key={index}
                        label={service['Service']['name']}
                        value={service['Service']['id']}
                        />
                    )
                  })
                  : null}
              </Picker>
            </View>
            <Input
                underlineColorAndroid='#6c5ce7'
                editable={false}
                value={this.state.phone}
                style={{width: '90%', fontFamily: 'NunitoSans-Regular'}}
              />
          </View>
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
                backgroundColor: '#6c5ce7',
                padding: 3
              }}
            >
              <Text style={{fontFamily: 'NunitoSans-Regular', color: '#fff', padding: 4}}>CLOSE</Text>
            </Button>
          </Dialog>
        </Content>
        <DateTimePicker
          mode='datetime'
          isVisible={this.state.isDateTimePickerVisible}
          onConfirm={this._handleDatePicked}
          onCancel={this._hideDateTimePicker}
        />
        <ActivityIndicator
          color='#6c5ce7'
          size='small'
          animating={this.state.showLoader}
        />
        <Footer style={{ backgroundColor: '#6c5ce7' }}>
          <TouchableOpacity disabled = {this.state.disableButton}
            onPress={this._gotoProviderSearch}
          >
            <Text style={styles.next}>NEXT</Text>
          </TouchableOpacity>
        </Footer>

      </Container>
    )
  }
}

const styles = StyleSheet.create({
  input: {
    fontFamily: 'NunitoSans-Regular'
    // marginTop: 60
  },
  buttonView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginLeft: 15,
    marginTop: 20
  },
  next: {
    fontFamily: 'NunitoSans-SemiBold',
    marginTop: 6,
    fontSize: 18,
    letterSpacing: 0.5,
    color: '#fff'
  },
  button: {
    borderRadius: 8,
    marginTop: 35,
    marginLeft: 10,
    padding: 2
  }
})
