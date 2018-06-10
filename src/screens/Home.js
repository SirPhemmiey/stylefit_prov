import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  AsyncStorage,
  ActivityIndicator,
  StatusBar,
  Image,
  TouchableOpacity,
} from 'react-native';
import Config from 'react-native-config';
import {
  ProgressDialog,
  Dialog,
  ConfirmDialog,
} from 'react-native-simple-dialogs';
import { Card } from 'react-native-elements';
import {
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
  Right,
  Title,
} from 'native-base';
import PTRView from 'react-native-pull-to-refresh';

export default class Home extends React.Component {
  static navigationOptions = {
    header: null,
  };
  constructor(props) {
    super(props);
    this.state = {
      showLoader: true,
      showLoading: false,
      customers: [],
      showDialog: false,
      dialogMessage: '',
      dialogVisibleAccept: false,
      dialogVisibleReject: false,
    };
  }

  loadData = () => {
    AsyncStorage.getItem('jwt').then(token => {
      fetch('http://192.168.56.1/stylefit/provapi/home', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
        .then(res => res.json())
        .then(res => {
          this.setState({
            showLoader: false,
            customers: res,
          });
        })
        .catch(err => {
          this.setState({
            showDialog: true,
            dialogMessage: err.message,
            showLoader: false,
          });
        });
    });
  };
  login = () => {
    let keys = ['jwt', 'loggedIn', 'seeWelcome', 'phone'];
    AsyncStorage.multiRemove(keys, err => {
      alert('Deleted');
      this.props.navigation.replace('loginStack');
    });
  };
  _refresh = () => {
    this.loadData();
  };
  _sendRequest = (type, schedule_id, tracking_id) => {
    this.setState({
      showLoading: true,
    });
    AsyncStorage.getItem('jwt').then(token => {
      fetch('http://192.168.56.1/stylefit/provapi/confirm_request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: type,
          schedule_id: schedule_id,
          tracking_id: tracking_id
        })
      })
        .then(res => res.json())
        .then(res => {
          this.setState({
            showLoading: false,
          });
          if (res == 'done') {
            this.setState({
              showDialog: true,
              dialogMessage: "Success! Your selection has been confirmed.",
            });
            this._refresh();
          }
          else if (res == 'error') {
            this.setState({
              showDialog: true,
              dialogMessage: "Oops! An error occured.",
            });
          }
          else {
            this.setState({
              showDialog: true,
              dialogMessage: "Oops! An error occured.",
            });
          }
        })
        .catch(err => {
          this.setState({
            showDialog: true,
            dialogMessage: err.message,
            showLoading: false,
          });
        });
    });
  }
  // _accept = () => {
  //   this._sendRequest('accept');
  //   this.setState({
  //     dialogVisibleAccept: false,
  //   });
  // };
  // _confirm = () => {
  //   // if (type == 'accept') {

  //   // }
  //   // if (type == 'reject') {

  //   // }
  //   this.setState({
  //     dialogVisibleAccept: true,
  //   });
  // };
  componentWillMount() {
    this.loadData();
  }

  render() {
    const customers = this.state.customers;
    return (
      <Container>
        <StatusBar
          barStyle="light-content"
          backgroundColor="#6c5ce7"
          networkActivityIndicatorVisible
        />
        <Header style={{ backgroundColor: '#6c5ce7' }}>
          <Left>
            <Button transparent iconLeft onPress={() => null}>
              <Icon name="menu" />
            </Button>
          </Left>
          <Body>
            <Title style={{fontFamily: 'NunitoSans-Regular'}}>Home</Title>
          </Body>
          <Right />
        </Header>

        <PTRView
          onRefresh={this._refresh}
          colors="#6c5ce7"
          progressBackgroundColor="#6c5ce7"
        >
          <Text style={styles.title}>List of your Schedules</Text>
          <Text onPress={this.login}>CLICK ME</Text>
          {!this.state.showLoader
            ? (
              this.state.customer ? (
                this.state.customers.map((customer, index) => {
                  return (
                    <Card title="Schedule + {index}" key={index}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          padding: 10,
                        }}
                      >
                        <Text style={styles.label}>Name</Text>
                        <Text style={styles.child}>
                          {customer['Customer']['full_name']}
                        </Text>
                      </View>
  
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          padding: 10,
                        }}
                      >
                        <Text style={styles.label}>Service</Text>
                        <Text style={styles.child}>
                          {customer['Service']['name']}
                        </Text>
                      </View>
  
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          padding: 10,
                        }}
                      >
                        <Text style={styles.label}>Date and Time</Text>
                        <Text style={styles.child}>
                          {customer['Schedule']['datetime']}
                        </Text>
                      </View>
  
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          padding: 10,
                        }}
                      >
                        <Text style={styles.label}>Phone</Text>
                        <Text style={styles.child}>
                          {customer['Schedule']['phone']}
                        </Text>
                      </View>
  
                      <Text style={styles.address}>Address</Text>
                      <View style={{ alignContent: 'center', padding: 10 }}>
                        <Text style={styles.child}>
                          {customer['Schedule']['address']}
                        </Text>
                      </View>
  
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-around',
                        }}
                      >
                        <Button style={{ padding: 6 }}
                        onPress={() => this._sendRequest('decline', customer['Schedule']['id'], customer['Tracking']['id'])} danger>
                          <Text style={styles.button}>Reject</Text>
                        </Button>
                        <Button
                          style={{ padding: 6 }}
                          onPress={() => this._sendRequest('accept', customer['Schedule']['id'],customer['Tracking']['id'])}
                          primary
                        >
                          <Text style={styles.button}>Accept</Text>
                        </Button>
                      </View>
                    </Card>
                  );
                })
              ): 
              <View style={{ 
              top: 0, left: 0, 
              right: 0, bottom: 0, 
              justifyContent: 'center', 
              alignItems: 'center'}}>
                <Text style={styles.title}>No Schedule yet</Text>
              </View>
            )
            : null}
          <ConfirmDialog
            title="Confirm Dialog"
            message="Are you sure about that?"
            visible={this.state.dialogVisibleAccept}
            onTouchOutside={() => this.setState({ dialogVisibleAccept: false })}
            positiveButton={{
              title: 'YES',
              onPress: () => this._accept(),
            }}
            negativeButton={{
              title: 'NO',
              onPress: () => alert('No touched!'),
            }}
          />
          <ConfirmDialog
            title="Confirm Dialog"
            message="Are you sure about that?"
            visible={this.state.dialogVisibleReject}
            onTouchOutside={() => this.setState({ dialogVisibleReject: false })}
            positiveButton={{
              title: 'YES',
              onPress: () => alert('Yes touched!'),
            }}
            negativeButton={{
              title: 'NO',
              onPress: () => alert('No touched!'),
            }}
          />
          <ProgressDialog
            visible={this.state.showLoading}
            title='Initiating'
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
             <Text style={{fontFamily: 'NunitoSans-Regular', padding: 4, color: '#fff'}}>CLOSE</Text>
            </Button>
          </Dialog>
          <ActivityIndicator
            color="#6c5ce7"
            size="small"
            animating={this.state.showLoader}
          />
        </PTRView>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    fontFamily: 'NunitoSans-Regular',
    fontSize: 18,
    color: '#6c5ce7',
    textAlign: 'center',
    marginTop: 10,
  },
  label: {
    fontWeight: 'bold',
    fontFamily: 'NunitoSans-Regular',
    fontSize: 15,
  },
  child: {
    fontFamily: 'NunitoSans-Regular',
    fontSize: 13,
  },
  address: {
    fontFamily: 'NunitoSans-Regular',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  button: {
    fontFamily: 'NunitoSans-Regular',
    padding: 3,
    color: '#fff'
  },
});
