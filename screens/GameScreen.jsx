import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Modal,
} from "react-native";
import { Icon } from "react-native-elements";
import data from "../data";
import random from "../randoms";
import colors from "../constants/colors";

const { apikey, channels, users, categories } = data;
class GameScreen extends Component {
  state = {
    round: null,
    img1: {
      uri: "",
    },
    img2: {
      uri: "",
    },
    value1: 0,
    value2: 0,
    currentState: "vs",
    score: 0,
    modalVisible: false,
    backgroundImage: require("../assets/large.jpg"),
  };

  sleep = async (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  higherClicked = async () => {
    if (parseInt(this.state.value2) > parseInt(this.state.value1)) {
      //console.log("Right Answer")
      console.log("2 Higher than 1");
      console.log("value 1: ", this.state.value1);
      console.log("value 2: ", this.state.value2);
      const score = this.state.score + 1;
      this.setState({ score });
      await this.answerCorrect();
    } else this.answerWrong();
  };

  lowerClicked = async () => {
    if (parseInt(this.state.value2) < parseInt(this.state.value1)) {
      console.log("2 lower than 1");
      console.log("value 1: ", this.state.value1);
      console.log("value 2: ", this.state.value2);
      //console.log("Right Answer")
      const score = this.state.score + 1;
      this.setState({ score });
      await this.answerCorrect();
    } else this.answerWrong();
  };

  setupRound = async (x) => {
    let round = null;
    if (x === 1) {
      round = await random.getRound(true, "");
    } else {
      round = await random.getRound(
        false,
        this.state.round.account2.channelInfo.ID
      );
    }
    //console.log(round.account1.channelInfo.imgurl)
    const img1 = { uri: round.account1.channelInfo.imgurl };
    const img2 = { uri: round.account2.channelInfo.imgurl };
    let value1 = 0;
    let value2 = 0;
    switch (round.category) {
      case "viewCount":
        value1 = round.account1.statistics.viewCount;
        value2 = round.account2.statistics.viewCount;
        break;
      case "subscriberCount":
        value1 = round.account1.statistics.subscriberCount;
        value2 = round.account2.statistics.subscriberCount;
        break;
      case "videoCount":
        value1 = round.account1.statistics.videoCount;
        value2 = round.account2.statistics.videoCount;
        break;
    }
    //console.log(round);
    this.setState({ round, img1, img2, value1, value2 });
  };

  componentDidMount() {
    this.setupRound(1);
  }

  componentDidUpdate() {
    //console.log(this.state.img1);
  }

  whatCategory = () => {
    switch (this.state.round.category) {
      case "viewCount":
        return "Views";
        break;
      case "subscriberCount":
        return "Subscribers";
        break;
      case "videoCount":
        return "Videos";
        break;
    }
  };

  numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  centerCircle = () => {
    switch (this.state.currentState) {
      case "vs":
        return this.displayVS();
      case "x":
        return this.displayx();
      case "check":
        return this.displayCheck();
    }
  };
  displayVS = () => {
    return (
      <View style={styles.centerVSCircle}>
        <Text style={{ color: "black", fontWeight: "bold", fontSize: 30 }}>
          VS
        </Text>
      </View>
    );
  };
  displayx = () => {
    return (
      <View
        style={{ ...styles.centerVSCircle, backgroundColor: colors.accent }}
      >
        <Text style={{ color: "white", fontWeight: "bold", fontSize: 30 }}>
          X
        </Text>
      </View>
    );
  };
  displayCheck = () => {
    return (
      <View
        style={{ ...styles.centerVSCircle, backgroundColor: colors.primary }}
      >
        <Icon type="font-awesome" name="check" color="white" />
      </View>
    );
  };
  answerCorrect = async () => {
    let currentState = "check";
    this.setState({ currentState });
    await this.sleep(1000);
    await this.setupRound(2);
    currentState = "vs";
    this.setState({ currentState });
  };
  displayButtonsOrNumber = () => {
    if (
      this.state.currentState === "check" ||
      this.state.currentState === "x"
    ) {
      return (
        <View>
          <Text style={styles.number}>
            {this.numberWithCommas(this.state.value2)}
          </Text>
          <Text style={styles.smallText}>{this.whatCategory()}</Text>
        </View>
      );
    } else {
      return (
        <View style={{ justifyContent: "center" }}>
          <TouchableOpacity style={styles.button} onPress={this.higherClicked}>
            <Text
              style={{ fontSize: 25, color: "yellow", marginRight: 15 }}
              onPress={this.higherClicked}
            >
              Higher
            </Text>
            <Icon type="font-awesome" name="caret-up" color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={{ ...styles.button, marginBottom: 10 }}
            onPress={this.lowerClicked}
          >
            <Text style={{ fontSize: 25, color: "yellow", marginRight: 15 }}>
              Lower
            </Text>
            <Icon type="font-awesome" name="caret-down" color="white" />
          </TouchableOpacity>
          <Text style={styles.smallText}>
            {this.whatCategory()} than{" "}
            {this.state.round.account1.channelInfo.channelName}
          </Text>
        </View>
      );
    }
  };

  restartRound=()=>{
    this.setState({score:0});
    this.setupRound(1);
    this.setState({modalVisible:false})
  }

  answerWrong = async () => {
    this.setState({modalVisible:true});
  };

  render() {
    if (this.state.round != null) {
      console.log();
      return (
        <View style={styles.container}>
          <View style={{ height: "50%" }}>
            <ImageBackground
              source={this.state.img1}
              style={styles.accountImage}
            >
              <View style={styles.imageView}>
                <View
                  style={{
                    flexDirection: "row",
                    alignSelf: "flex-start",
                    marginTop: -40,
                    marginBottom: 40,
                    marginLeft: 10,
                  }}
                >
                  <Text
                    style={{
                      ...styles.title,
                      fontSize: 25,
                      marginRight: 10,
                    }}
                  >
                    Score:
                  </Text>
                  <Text
                    style={{
                      color: "yellow",
                      fontWeight: "bold",
                      fontSize: 25,
                    }}
                  >
                    {this.state.score}
                  </Text>
                </View>

                <Text style={styles.title}>
                  {this.state.round.account1.channelInfo.channelName}
                </Text>
                <Text style={styles.smallText}>has</Text>
                <Text style={styles.number}>
                  {this.numberWithCommas(this.state.value1)}
                </Text>
                <Text style={styles.smallText}>{this.whatCategory()}</Text>
              </View>
            </ImageBackground>
          </View>
          {this.centerCircle()}
          <View
            style={{
              height: "50%",
              borderTopColor: "yellow",
              borderTopWidth: 3,
            }}
          >
            <ImageBackground
              source={this.state.img2}
              style={styles.accountImage}
            >
              <View style={styles.imageView}>
                <Text style={styles.title}>
                  {this.state.round.account2.channelInfo.channelName}
                </Text>
                <Text style={styles.smallText}>has</Text>
                {this.displayButtonsOrNumber()}
              </View>
            </ImageBackground>
          </View>

          <Modal
            animationType="slide"
            visible={this.state.modalVisible}
            style={{ opacity: 1 }}
          >
            <ImageBackground
              source={this.state.backgroundImage}
              style={styles.image}
            >
              <Text style={{color:colors.accent,fontSize:40}}>Game Over</Text>
              <Text style={styles.title}>Final Score</Text>
              <Text style={styles.number}>{this.state.score}</Text>
              <View>
                <TouchableOpacity style={{... styles.button2,backgroundColor:colors.primary}} onPress={this.restartRound}>
                  <Text style={{ fontSize: 25, color: "white" }}>
                    Play Again
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={{...styles.button2, marginTop:5}} onPress={()=>{this.props.navigation.navigate('Home')}}>
                  <Text style={{ fontSize: 25, color: "white" }}>Main Menu</Text>
                </TouchableOpacity>
              </View>
            </ImageBackground>
          </Modal>
        </View>
      );
    } else {
      return <View style={{ backgroundColor: "black", flex: 1 }}></View>;
    }
  }
}

const styles = StyleSheet.create({
  button2: {
    backgroundColor: colors.accent,
    alignItems: "center",
    width: 200,
    height: 60,
    justifyContent: "center",
    borderRadius: 30,
    marginBottom: 20,
    marginTop:30
  },
  image: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },

  centerVSCircle: {
    backgroundColor: "white",
    zIndex: 1000,
    width: 70,
    borderRadius: 40,
    height: 70,
    marginTop: -35,
    marginBottom: -35,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  centerXCircle: {
    backgroundColor: "red",
    zIndex: 1000,
    width: 70,
    borderRadius: 40,
    height: 70,
    marginTop: -35,
    marginBottom: -35,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  button: {
    backgroundColor: "transparent",
    alignItems: "center",
    width: 150,
    height: 50,
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "white",
    borderRadius: 30,
    marginTop: 10,
    flexDirection: "row",
    alignSelf: "center",
  },
  number: {
    color: "yellow",
    fontWeight: "bold",
    fontSize: 35,
    textAlign: "center",
  },
  smallText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
  },
  title: {
    color: "white",
    fontWeight: "bold",
    fontSize: 35,
    textAlign: "center",
  },
  imageView: {
    flex: 1,
    backgroundColor: "rgba(52, 52, 52, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  accountImage: {
    flex: 1,
    resizeMode: "contain",
    justifyContent: "center",
    tintColor: "black",
  },
  mainView: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignContent: "center",
  },
  text: {
    color: "grey",
    fontSize: 30,
    fontWeight: "bold",
  },
});

export default GameScreen;
