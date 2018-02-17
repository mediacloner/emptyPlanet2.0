import React, { Component } from "react";
import { Jumbotron, Container, Row, Col, Button } from "reactstrap";
import people from "./../img/people.svg";
import planetHearth from "./../img/planetHearth.svg";
import imgPlayer1 from "./../img/player1.svg";
import imgPlayer2 from "./../img/player2.svg";
import imgPlayer1Des from "./../img/player1_des.svg";
import imgPlayer2Des from "./../img/player2_des.svg";
import Counter from "./Counter.js";
import mapboxgl from "mapbox-gl";
import ReactDOM from "react-dom";

mapboxgl.accessToken =
  "pk.eyJ1IjoibWVkaWFjbG9uZXIiLCJhIjoiY2pkcWtvaHd0MDgyNzJ4cGN2ZDB1MG1tZCJ9.BBUqXdokpN2MbxKg6RZqcQ";


class GameScreen extends Component {
  constructor() {
   

    super();
    this.state = {
      lng: -2, 
      lat: 54,
      zoom: 6
    };
  }

updateMap () {
  this.setState({ lng: this.props.latlng[1], lat: this.props.latlng[0] });
     const { lng, lat, zoom } = this.state;

     const map = new mapboxgl.Map({
       container: this.mapContainer,
       style: "mapbox://styles/mediacloner/cjdryrifd2ur32sscwh74tush",
       center: [lng, lat],
       zoom
     });

  

}

  componentDidMount() {

    const { lng, lat, zoom } = this.state;

    const map = new mapboxgl.Map({
      container: this.mapContainer,
      style: "mapbox://styles/mediacloner/cjdryrifd2ur32sscwh74tush",
      center: [lng, lat],
      zoom
    });

    map.on("move", () => {
      const { lng, lat } = map.getCenter();
      this.setState({
        lng: lng.toFixed(4),
        lat: lat.toFixed(4),
        zoom: map.getZoom().toFixed(2)
      });
    });


    
  }

  state = {
    input: ""
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.checkResult(this.state.input);
    this.setState({ input: "" });

  };

  handleChange = e => {
    this.setState({ input: e.target.value });
    this.updateMap(); 
  };

  render() {
    const { lng, lat, zoom } = this.state;


    return <Container>
        <div>
          <div className="inline-block absolute top left mt12 ml12 bg-darken75 color-white z1 py6 px12 round-full txt-s txt-bold">
            <div>{`Longitude: ${lng} Latitude: ${lat} Zoom: ${zoom}`}</div>
          </div>
          <div ref={el => (this.mapContainer = el)} className="absolute top right left bottom" />
        </div>

        <Jumbotron>
          <div className="boxCounter">
            <Counter peopleCounter={this.props.countDown} />
          </div>
          <form onSubmit={this.handleSubmit}>
            <Container>
              <Row>
                <Col>
                  {this.props.focusPlayer === 1 ? <img src={imgPlayer1} className="img-fluid justify-content-center" alt="Responsive" /> : <img src={imgPlayer1Des} className="img-fluid justify-content-center" alt="Responsive" />}
                  <div className="score1">{this.props.score1}</div>
                  <div className="player">{this.props.player1}</div>
                </Col>
                <Col>
                  <div className="card-body">
                    <p className="card-text">{this.props.messages}</p>
                  </div>
                </Col>
                <Col>
                  {this.props.focusPlayer === 2 ? <img src={imgPlayer2} className="img-fluid justify-content-center" alt="Responsive" /> : <img src={imgPlayer2Des} className="img-fluid justify-content-center" alt="Responsive" />}
                  <div className="score2">{this.props.score2}</div>
                  <div className="player">{this.props.player2}</div>
                </Col>
              </Row>
              <Row>
                <Col>
                  <input type="text" name="tries" placeholder="Try to guess" autoFocus={true} value={this.state.input} onChange={this.handleChange} required />&nbsp;{this.props.nextCountry !== 0 ? <Button
                      onClick={this.props.actionButton}
                    >
                      Next
                    </Button> : undefined}
                  <div className="card-header">
                    <h1>{this.props.name}</h1>
                    <img src={this.props.flag} className="img-fluid justify-content-center flag" alt="Responsive" />
                  </div>
                </Col>
              </Row>
            </Container>
          </form>
        </Jumbotron>
      </Container>;
  }
}

export default GameScreen;
