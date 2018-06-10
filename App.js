import React, { Component } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { StackNavigator, TabNavigator, DrawerNavigator } from 'react-navigation'
import Login from './src/screens/Login'
import Signup from './src/screens/Signup'
import Welcome from './src/screens/Welcome'
import Settings from './src/screens/Settings'
import Home from './src/screens/Home'
import { Icon } from 'native-base'
import Sidebar from './src/components/Sidebar'
import ProviderDetails from './src/screens/ProviderDetails';
import ChangePassword from './src/screens/ChangePassword';
import ForgotPassword from './src/screens/ForgotPassword';
import Schedules from './src/screens/Schedules';
import Mapping from './src/screens/Mapping';



const tabStack = TabNavigator(
  {
    Home: {
      screen: Home
    },
    //Track: { screen: Mapping },
    Schedules: { screen: Schedules},
    Settings: { screen: Settings },
  },
  {
    navigationOptions: ({ navigation }) => {
      const { routeName, routes } = navigation.state
      return {
        tabBarIcon: ({ focused, tintColor }) => {
          switch (routeName) {
            case 'Home':
              return <Icon name={focused ? 'ios-home' : 'ios-home-outline'} />
              break
            case 'Schedules':
              return (
                <Icon
                  name={focused ? 'ios-briefcase' : 'ios-briefcase-outline'}
                />
              )
              break
              case 'Track':
              return (
                <Icon
                  name={focused ? 'ios-locate' : 'ios-locate-outline'}
                />
              )
              break
            case 'Settings':
              return (
                <Icon
                  name={focused ? 'ios-settings' : 'ios-settings-outline'}
                />
              )
              break
          }
        }
      }
    },
    tabBarPosition: 'bottom',
    swipeEnabled: true,
    animationEnabled: true,
    tabBarOptions: {
      showIcon: true,
      showLabel: true,
      activeTintColor: '#dfe6e9',
      inactiveTintColor: '#000',
      activeBackgroundColor: '#000',
      style: {
        height: 60,
        //paddingVertical: 5,
        backgroundColor: '#6c5ce7'
      },
      labelStyle: {
        fontSize: 9,
        //padding: 12,
        fontFamily: 'NunitoSans-Regular'
      },
      // indicatorStyle: {
      //   backgroundColor: 'red',
      //   height: 2
      // }
    },
    headerMode: 'none',
    initialRouteName: 'Home'
  }
)

const drawerStack = DrawerNavigator(
  {
    Home: { screen: tabStack },
    login: { screen: Login}
  },
  {
    contentComponent: Sidebar,
    drawerWidth: 250
  },
)

const loginStack = StackNavigator(
  {
    Login: { screen: Login },
    Signup: { screen: Signup },
    drawerStack: { screen: drawerStack }
  },
  {
    headerMode: 'none',
    initialRouteName: 'Login'
  }
)

const welcomeStack = StackNavigator(
  {
    welcome: { screen: Welcome },
    loginStack: { screen: loginStack}
    
  },
  {
    headerMode: 'none'
  }
)

const Application = StackNavigator(
  {
    loginStack: { screen: loginStack },
    welcomeStack: { screen: welcomeStack },
    drawerStack: { screen: drawerStack },
    providerDetails : { screen: ProviderDetails },
    changePassword: { screen: ChangePassword},
    forgotPassword: { screen: ForgotPassword},
    schedules : { screen: Schedules},
    settings: { screen: Settings }
  },
  {
    headerMode: 'none',
     //initialRouteName: 'loginStack'
     //initialRouteName: 'welcomeStack'
   initialRouteName: 'drawerStack'
     //initialRouteName: 'forgotPassword'
     //initialRouteName: 'schedules'
  }
)

export default class App extends React.Component {
  render () {
    return <Application />
  }
}
