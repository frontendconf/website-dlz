import React, { Component } from "react";
import Parallax from "parallax-js";
import dynamic from "next/dynamic";

const CircleSection = dynamic(() => import("./CircleSection"), {
  ssr: false
});

// TODO: Distance should probably be some sort of responsive
const TRANSITION_DISTANCE = 600; // 600px
const TARGET_OPACITY = 0.2;

let throttleEnabled = true;

class Hero extends Component {
  constructor(props) {
    super(props);

    this.state = {
      opacity: 1,
      mouseX: 50,
      mouseY: 50
    };
  }

  scrollHandler = () => {
    // Create new callstack to resolve into next frame (better performance)
    setTimeout(() => {
      // Cross browser scroll position fetching
      const el = document.scrollingElement || document.documentElement;
      const scrollTop = el.scrollTop;

      if (scrollTop < TRANSITION_DISTANCE) {
        this.setState({
          opacity: 1 - (scrollTop / TRANSITION_DISTANCE) * (1 - TARGET_OPACITY)
        });
      } else if (this.state.opacity < TARGET_OPACITY) {
        this.setState({
          opacity: TARGET_OPACITY
        });
      }
    }, 0);
  };

  mouseHandler = e => {
    // if (!throttleEnabled) return;
    // // throttleEnabled = false;
    // clearTimeout(this.mouseHandlerTimeout);
    // this.mouseHandlerTimeout = setTimeout(() => {
    //   throttleEnabled = true;
    this.setState({
      mouseX: (e.clientX / window.innerWidth) * 100,
      mouseY: (e.clientY / window.innerHeight) * 100
    });
    // }, 10);
  };

  componentDidMount() {
    window.addEventListener("scroll", this.scrollHandler, {
      passive: true
    });

    window.addEventListener("mousemove", this.mouseHandler, {
      passive: true
    });

    const scene = document.querySelector(".scene");
    this.parallaxInstance = new Parallax(scene);

    // First trigger before scroll event happened
    this.scrollHandler();
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.scrollHandler);
    window.removeEventListener("mousemove", this.mouseHandler);
    this.parallaxInstance.destroy();
  }

  render() {
    return (
      <div className="hero-bg__wrapper">
        <div
          className={`hero-bg ${
            this.props.template ? `hero-bg--${this.props.template}` : ""
          }`}
        >
          <div
            className="hero-bg__overlay scene"
            style={{ opacity: this.state.opacity }}
          >
            <CircleSection
              x="5"
              y="11"
              mouseX={this.state.mouseX}
              mouseY={this.state.mouseY}
              baseRadius={30}
              color="secondary"
              depth="0.05"
            />
            <CircleSection
              x="80"
              y="20"
              mouseX={this.state.mouseX}
              mouseY={this.state.mouseY}
              baseRadius={50}
              color="primary"
              depth="1"
            />
            <CircleSection
              x="83"
              y="23"
              mouseX={this.state.mouseX}
              mouseY={this.state.mouseY}
              baseRadius={30}
              color="secondary"
              depth="0.30"
            />
            <CircleSection
              x="40"
              y="60"
              mouseX={this.state.mouseX}
              mouseY={this.state.mouseY}
              baseRadius={30}
              color="primary"
              depth="0.50"
            />
            <CircleSection
              x="8"
              y="70"
              mouseX={this.state.mouseX}
              mouseY={this.state.mouseY}
              baseRadius={30}
              color="secondary"
              depth="0.70"
            />
            <CircleSection
              x="2"
              y="80"
              mouseX={this.state.mouseX}
              mouseY={this.state.mouseY}
              baseRadius={30}
              color="primary"
              depth="0.10"
            />
            <CircleSection
              x="90"
              y="85"
              mouseX={this.state.mouseX}
              mouseY={this.state.mouseY}
              baseRadius={30}
              color="primary"
              depth="1.2"
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Hero;
