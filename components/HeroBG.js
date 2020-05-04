import React, { Component } from "react";
import Parallax from "parallax-js";
import dynamic from "next/dynamic";
const CircleSector = dynamic(() => import("./CircleSection"), {
  ssr: false
});

// TODO: Distance should probably be some sort of responsive
const TRANSITION_DISTANCE = 600; // 600px
const TARGET_OPACITY = 0.2;

class Hero extends Component {
  constructor(props) {
    super(props);

    this.state = {
      opacity: 1
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

  componentDidMount() {
    window.addEventListener("scroll", this.scrollHandler, {
      passive: true
    });

    const scene = document.querySelector(".scene");
    this.parallaxInstance = new Parallax(scene);

    // First trigger before scroll event happened
    this.scrollHandler();
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.scrollHandler);
    this.parallaxInstance.destroy();
  }

  render() {
    return (
      <div className="scene hero-bg__wrapper">
        <div
          data-depth="0.2"
          className={`hero-bg ${
            this.props.template ? `hero-bg--${this.props.template}` : ""
          }`}
        >
          <div
            className="hero-bg__overlay"
            style={{ opacity: this.state.opacity }}
          >
            <CircleSector x="5" y="20" />
            <CircleSector x="80" y="35" />
            <CircleSector x="85" y="40" />
            <CircleSector x="40" y="70" />
            <CircleSector x="8" y="80" />
            <CircleSector x="2" y="90" />
            <CircleSector x="90" y="95" />
          </div>
        </div>
      </div>
    );
  }
}

export default Hero;
