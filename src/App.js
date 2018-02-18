
import React, { Component } from 'react';
import logo from './img/logo.svg';
import imgPlayer1 from './img/player1.svg';
import imgPlayer2 from './img/player2.svg';
import imgPlayer1Des from './img/player1_des.svg';
import imgPlayer2Des from './img/player2_des.svg';
import people from './img/people.svg';
import planetHearth from './img/planetHearth.svg';
import './App.css';
import { Jumbotron, Container, Row, Col, Button } from 'reactstrap';



import apiCountries from "./models/ApiCountries.js";
import BonusScreen from "./components/BonusScreen.js";

import FinalScreen from "./components/FinalScreen.js";
import GameScreen from "./components/GameScreen.js";
import PlayerScreen from "./components/PlayerScreen.js";
import SplashScreen from "./components/SplashScreen.js";


// Settings
const countDownDefault = 100000;
const maxTimeGuessSeconds = 48;
const countriesIterations = 5;
const extraBonus = 2000;

class App extends Component {
  constructor() {
    super();

    this.state = {
      player1: "",
      player2: "",
      score1: 0,
      score2: 0,
      countDown: countDownDefault,
      substractCountDown: false,
      selectorCountries: [],
      countriesRawResults: [],
      currentCountry: {
        posSelecCountries: 0,
        name: "",
        capital: "",
        subRegion: "",
        population: 0.11,
        flag: "",
        latlng: [0, 0],
        alpha3Code: "DZA"
      },
      messages: "Can you get the population country?",
      subRegions: [],
      currentPage: "SplashScreen",
      focusPlayer: 1,
      nextCountry: 0,
      enableOK: false, 
      arrowsUI: 'noActive',
    };
  }

  //////////////////////////////Behaviour Button/////////////////////////////
  tryAnswer = 0


  actionButton = () => {
    //Action Button
    console.log(this.state.selectorCountries.length, this.state.currentCountry.posSelecCountries)
    if (this.state.currentCountry.posSelecCountries < (countriesIterations - 1)) {
      this.currentCountry(this.state.currentCountry.posSelecCountries + 1);

      this.setState({ countDown: countDownDefault }); //Inicialice CountDown
      //this.setState({ enableOK: false });
      this.setState({ nextCountry: 0 });
      this.setSubstractCountDown(true)

      this.setState({
        messages: "Can you get the population country?",
        arrowsUI: "noActive"
      });

      this.countDown(1); // Start CounDown
    } else if ((countriesIterations - 1) === this.state.currentCountry.posSelecCountries) { // Last Screen
      console.log ('fin')

      this.setState({ currentPage: "FinalScreen" })
      this.setState({ nextCountry: 0 });
    }

  }


  //////////////////////////////Game Play/////////////////////////////

  setSubstractCountDown = val => {
    if (val === true) {
      this.setState({ substractCountDown: true });
    } else this.setState({ substractCountDown: false });
  };


  componentWillMount() {
    setInterval(this.countDown, 250);
    if (typeof this.countriesRawResults === "undefined") {
      //Inicialization
      this.retrieveCountries();
      this.randomFocusPlayer();

    }

  }


  checkResult = (val) => {

    this.tryAnswer = Number(val)
    console.log(this.tryAnswer, this.state.currentCountry.population)
    if (
      this.state.countDown === 0
    ) {
      /// Wrong attemp
      this.setState({ nextCountry: 1 });
      this.setState({
        messages: "Ups, You don't have people to take for your planet",
        arrowsUI: "noActive"
      });
      this.changePlayer();
    }

    else if (
      this.tryAnswer === this.state.currentCountry.population 
    ) {
      /// WIN
      if (this.state.substractCountDown === true) this.addToScore(this.state.focusPlayer) 
      this.setSubstractCountDown(false);
      this.setState({ nextCountry: 1 });
      this.setState({
        messages: "You guess the population",
        arrowsUI: "right"
      });
      
      this.changePlayer();

    }

    else if (    /// Wrong attemp
      this.tryAnswer !== this.state.currentCountry.population
    ) {
      this.tryAnswer > this.state.currentCountry.population ? this.setState(
            {
              messages: "You are wrong. There are less population",
              arrowsUI: "less"
            }
          ) : this.setState({
            messages: "You are wrong. There are more population",
            arrowsUI: "more"
          });

      this.changePlayer();
    }
    //this.setState({ tryAnswer: val });
    else if (
      //this.state.tryAnswer === this.state.currentCountry.population &&
      this.tryAnswer === this.state.currentCountry.population
      
    ) {
      /// WIN
      this.setSubstractCountDown(false);
      this.setState({ nextCountry: 1 });
      this.setState({ messages: "You guess the population" });
      this.addToScore(this.state.focusPlayer);
      this.changePlayer();

    } 
    
    
    
    
    
    else if (    /// Wrong attemp
      //this.state.tryAnswer !== this.state.currentCountry.population &&
      this.tryAnswer !== this.state.currentCountry.population
      
    ) {
      console.log ('OK', val++)
      //this.state.tryAnswer > this.state.currentCountry.population ? this.setState({ messages: "You are wrong. There are less population" }) : this.setState({ messages: "You are wrong. There are less population" })
  
      this.tryAnswer > this.state.currentCountry.population ? this.setState({ messages: "You are wrong. There are less population" }) : this.setState({ messages: "You are wrong. There are more population" })
      
      this.changePlayer();
    } 

 


  }

  addToScoreBonus=player=> {
    if (player === 1) {

      const score1 = this.state.score1 + extraBonus
      this.setState({ score1 });
    } else {
      const score2 = this.state.score2 + extraBonus
      this.setState({ score2 });
    }
  }

  

  // Updating the Score.
  addToScore = (player) => {
    if (player === 1) {
      const score1 = this.state.score1 + this.state.countDown

      this.setState({ score1 });
    } else {
      const score2 = this.state.score2 + this.state.countDown
      this.setState({ score2 });

    }
  }

  extraBonus = (capital, region) => {
    if (capital === this.state.currentCountry.capital) {
      this.addToScoreBonus(this.state.focusPlayer);
      this.setState({ messages: "You are right whith the capital " });
    } else this.setState({ messages: "You are wrong whith the capital " });

    if (region === this.state.currentCountry.subRegion) {
      this.addToScoreBonus(this.state.focusPlayer);
      this.setState(prevState => {
        messages: prevState.messages + "and you know the region";
      });
    } else {
      this.setState(prevState => {
        messages: prevState.messages + "and you don't know the region";
      });
    }

    // close modal
  };

  // Field the object of country that are playing at this momment
  currentCountry(posArrRandom) {
    // start with 0, 1, 2, 3...
    let posRawData = this.state.selectorCountries[posArrRandom];

    this.setState({
      currentCountry: {
        posSelecCountries: posArrRandom,
        name: this.state.countriesRawResults[posRawData].name,
        capital: this.state.countriesRawResults[posRawData].capital,
        subRegion: this.state.countriesRawResults[posRawData].subRegion,
        population:
          Math.round(
            this.state.countriesRawResults[posRawData].population / 100000
          ) / 10,
        flag: this.state.countriesRawResults[posRawData].flag,
        latlng: this.state.countriesRawResults[posRawData].latlng,
        alpha3Code: this.state.countriesRawResults[posRawData].alpha3Code
      }
    });
  }

  changePlayer() {

    if (this.state.nextCountry === 0)
     (this.state.focusPlayer === 1) ? this.setState({ focusPlayer: 2 }):this.setState({ focusPlayer: 1 });
  }

  //////////////////////////////Count Down/////////////////////////////

  countDown = () => {
    let substractFraction = Math.round(
      countDownDefault / (maxTimeGuessSeconds * 4)
    );

    if (this.state.substractCountDown === true) {
      if (this.state.countDown-substractFraction <= 0) {
        this.setState({ substractCountDown: false });
        this.setState({ countDown: 0 });
        this.checkResult(0.0001); 
      } else {
        this.setState(prevState => {
          return { countDown: prevState.countDown - substractFraction };
        });
      }
    }
  };

  //////////////////////////////iniciatization/////////////////////////////

  randomFocusPlayer = () => {
    this.setState({ focusPlayer: Math.round(Math.random()) + 1 });
  };

  retrieveCountries() {
    apiCountries
      .searchAllCountries()
      .then(countries => this.setState({ countriesRawResults: countries }))
      .then(() =>
        this.randomArrNumber(
          countriesIterations,
          this.state.countriesRawResults.length
        )
      )
      .then(() =>
        this.currentCountry(this.state.currentCountry.posSelecCountries)
      );
  }

  // (Number of iterations, Maximun Random Number that you can modify in top settings )

  randomArrNumber(iterArr, maxRandomNum) {
    let arrResult = [];

    for (let i = 0; i <= iterArr - 1; i++) {
      let loop = 0;
      let randomNum;
      while (loop === 0) {
        randomNum = Math.floor(Math.random() * maxRandomNum);
        if (arrResult.indexOf(randomNum) < 0) loop = 1;
      }
      arrResult.push(randomNum);
    }
    this.setState({ selectorCountries: arrResult });
  }

  // Insert the name of the players.
  setPlayers = (player1, player2) => {
    this.setState({ player1: player1, player2: player2 });
  };

  // Field opcions extra points of Guess the region.
  subRegionField() {
    let arrSubRegions = [];
    this.countriesRawResults.forEach(e => {
      if (arrSubRegions.indexOf(e.subRegion) < 0)
        arrSubRegions.push(e.subRegion.sort); // Filter for no duplicate options
    });
    this.setState({ subRegions: arrSubRegions.sort() });
  }

  changePage = page => {
    this.setState({ currentPage: page });
  };

  render() {
    const { currentPage } = this.state;
    return (
      <Container fluid={true}>
        {currentPage === "SplashScreen" && (
          <SplashScreen
            changePage={this.changePage}
            callAPI={this.retrieveCountries}
          />
        )}
        {currentPage === "PlayerScreen" && (
          <PlayerScreen
            changePage={this.changePage}
            setPlayers={this.setPlayers}
            setSubstractCountDown={this.setSubstractCountDown}
          />
        )}
        {currentPage === "GameScreen" && (
          <GameScreen
            countDown={this.state.countDown}
            checkResult={this.checkResult}
            changePage={this.changePage}
            player1={this.state.player1}
            player2={this.state.player2}
            name={this.state.currentCountry.name}
            nextCountry={this.state.nextCountry}
            focusPlayer={this.state.focusPlayer}
            score1={this.state.score1}
            score2={this.state.score2}
            messages={this.state.messages}
            actionButton={this.actionButton}
            flag={this.state.currentCountry.flag}
            latlng={this.state.currentCountry.latlng}
            arrowsUI={this.state.arrowsUI}
          />
        )}

        {currentPage === "BonusScreen" && (
          <BonusScreen
          extraBonus = {this.state.extraBonus}
          />
        )}

        {currentPage === "FinalScreen" && <FinalScreen

          player1={this.state.player1}
          player2={this.state.player2}
          score1={this.state.score1}
          score2={this.state.score2}
          changePage={this.changePage}

        />}
      </Container>
    );
  }
}


export default App;
