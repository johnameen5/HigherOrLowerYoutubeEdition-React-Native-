import React, { Component } from "react";
import {
  ImageBackground,
  StyleSheet,
  View,
  Dimensions,
  Image,
  TouchableOpacity,
  Text,
  Modal,
} from "react-native";
import * as ScreenOrientation from "expo-screen-orientation";
import colors from "../constants/colors";
import { Icon } from "react-native-elements";

class StartGameScreen extends Component {
  state = {
    screenWidth: 0,
    screenHeight: 0,
    backgroundImage: require("../assets/large.jpg"),
    logo: require("../assets/Higher_Or_Lower_logo.png"),
    modalVisible: false,
  };

  
 

  render() {
    //console.log(this.props.route.params);
    return (
      <View style={styles.screen}>
        <ImageBackground
          source={this.state.backgroundImage}
          style={styles.image}
        >
          <View style={{ alignItems: "center" }}>
            <Image source={this.state.logo} style={{ marginBottom: -50,height:"80%", resizeMode:'contain'}} />

            <TouchableOpacity
              style={styles.button}
              onPress={this.startButtonClicked}
            >
              <Text style={{ fontSize: 25, color: "white" }}>Start</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.onInfoPressed}>
              <Icon type="font-awesome" name="info-circle" color="white" />
            </TouchableOpacity>
          </View>
        </ImageBackground>

        <Modal
          animationType="slide"
          visible={this.state.modalVisible}
          style={{ opacity: 1 }}
        >
          <ImageBackground
            source={this.state.backgroundImage}
            style={styles.image}
          >
            <Image
              source={this.state.logo}
              style={{ resizeMode: "contain", height: "50%", marginBottom: -50 }}
            />
            <Text
              style={{
                color: colors.primary,
                fontSize: 40,
                fontFamily: "notoserif",
                fontWeight: "bold",
              }}
            >
              How To Play
            </Text>
            <Text
              style={{
                color: "white",
                padding: 30,
                textAlign: "center",
                fontSize: 20,
              }}
            >
              This game will prompt you with 2 Youtube channels and you have to guess if the second channel has 'Higher' or 'Lower' Subscriber Count, Video Count or View Count
            </Text>
            <TouchableOpacity
              style={styles.button2}
              onPress={this.onBackPressed}
            >
              <Text style={{ fontSize: 25, color: "white" }}>Back</Text>
            </TouchableOpacity>
          </ImageBackground>
        </Modal>
      </View>
    );
  }

  componentDidMount() {
    ScreenOrientation.addOrientationChangeListener((sub) => {
      //console.log(sub);
      this.getScreenSize();
      if (this.state.screenWidth >= 1000) {
        this.setState({ backgroundImage: require("../assets/large.jpg") });
      } else if (this.state.screenWidth >= 500) {
        this.setState({ backgroundImage: require("../assets/medium.jpg") });
      } else {
        this.setState({ backgroundImage: require("../assets/small.jpg") });
      }
    });
    this.getScreenSize();
  }

  getScreenSize = () => {
    const screenWidth = Math.round(Dimensions.get("window").width);
    const screenHeight = Math.round(Dimensions.get("window").height);
    this.setState({ screenWidth, screenHeight });
  };

  startButtonClicked = () => {
    this.props.navigation.navigate("Game");
    //this.manipulatex();
  };

  onInfoPressed = () => {
    this.setState({ modalVisible: true });
  };
  onBackPressed = () => {
    this.setState({ modalVisible: false });
  };
}

export default StartGameScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    width: "100%",
  },
  modulBackGround: {
    flex: 1,
    width: "100%",
    // alignItems: "center",
    justifyContent: "center",
  },
  image: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },

  button2: {
    backgroundColor: colors.accent,
    alignItems: "center",
    width: 200,
    height: 60,
    justifyContent: "center",
    borderRadius: 30,
    marginBottom: 50,
  },

  button: {
    backgroundColor: colors.primary,
    alignItems: "center",
    width: 200,
    height: 60,
    justifyContent: "center",
    borderRadius: 30,
    marginBottom: 50,
  },
});
