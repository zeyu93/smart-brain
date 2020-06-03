import React, { Component } from "react";
import Particles from "react-particles-js";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import Navigation from "./components/Navigation/Navigation";
import Signin from "./components/Signin/Signin";
import Register from "./components/Register/Register";
import Logo from "./components/Logo/Logo";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import Rank from "./components/Rank/Rank";
import "./App.css";
import dotenv from "dotenv";
import axios from "axios";
dotenv.config();

const particlesOptions = {
  particles: {
    number: {
      value: 30,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
};

const initialState = {
  input: "",
  imageUrl: "",
  boxes: [],
  route: "login",
  isSignedIn: false,
  user: {
    id: "",
    name: "",
    email: "",
    entries: 0,
    pet: "",
    joined: ""
  }
};

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }
  componentDidMount() {
    const token = window.sessionStorage.getItem("token");

    if (token) {
      let axiosConfig = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      axios
        .post(`${process.env.API}/signin`, axiosConfig)
        .then(res => res.json())
        .then(data => {
          if (data && data.id) {
            console.log("sucess");
          }
        })
        .catch(console.log("yoo"));
    }
  }

  loadUser = data => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined,
        pet: data.pet
      }
    });
  };

  calculateFaceLocation = data => {
    console.log("response data", data);
    const clarifaiFaceArrayData = data.outputs[0].data.regions.map(
      face => face.region_info.bounding_box
    );

    const image = document.getElementById("inputimage");
    const width = Number(image.width);
    const height = Number(image.height);

    let resultArray = clarifaiFaceArrayData.map(face => {
      return {
        leftCol: face.left_col * width,
        topRow: face.top_row * height,
        rightCol: width - face.right_col * width,
        bottomRow: height - face.bottom_row * height
      };
    });
    return resultArray;
  };

  displayFaceBox = boxes => {
    console.log(boxes);
    this.setState({ boxes: boxes });
  };

  onInputChange = event => {
    this.setState({ input: event.target.value });
  };

  onButtonSubmit = () => {
    this.setState({ imageUrl: this.state.input });
    fetch("http://localhost:3001/imageurl", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        "Authorization": window.sessionStorage.getItem("token")
      },
      body: JSON.stringify({
        input: this.state.input
      })
    })
      .then(response => response.json())
      .then(response => {
        if (response) {
          fetch("http://localhost:3001/image", {
            method: "put",
            headers: {
              "Content-Type": "application/json",
              "Authorization": window.sessionStorage.getItem("token")
            },
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
            .then(response => response.json())
            .then(count => {
              this.setState(Object.assign(this.state.user, { entries: count }));
            })
            .catch(console.log);
        }
        let faceLocations = this.calculateFaceLocation(response);
        this.displayFaceBox(faceLocations);
      })
      .catch(err => console.log(err));
  };

  onRouteChange = route => {
    if (route === "signout") {
      return this.setState(initialState);
    } else if (route === "home") {
      this.setState({ isSignedIn: true });
    }
    this.setState({ route: route });
  };

  render() {
    const { isSignedIn, imageUrl, route, boxes, user } = this.state;

    return (
      <div className="App">
        <Particles className="particles" params={particlesOptions} />
        <Navigation
          isSignedIn={isSignedIn}
          onRouteChange={this.onRouteChange}
          user={user}
          loadUser={this.loadUser}
        />
        {route === "home" ? (
          <div>
            <Logo />
            <Rank
              name={this.state.user.name}
              entries={this.state.user.entries}
            />
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onButtonSubmit={this.onButtonSubmit}
            />
            <FaceRecognition boxes={boxes} imageUrl={imageUrl} />
          </div>
        ) : route === "signin" ? (
          <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
        ) : (
          <Register
            loadUser={this.loadUser}
            onRouteChange={this.onRouteChange}
          />
        )}
      </div>
    );
  }
}

export default App;
