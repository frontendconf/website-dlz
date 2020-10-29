import React, { Component } from "react";

const minRadius = -10;
const maxRadius = 10;

const minStrokeWidth = 5;
const maxStrokeWidth = 34;

const minCircumference = 25; // %
const maxCircumference = 75; // %

const minRotationAnimation = 120; // deg
const maxRotationAnimation = 180; // deg

const directions = ["left", "right"];

const minMax = (min, max) => {
  return Math.round(Math.random() * (max - min)) + min;
};

class CircleSection extends Component {
  constructor(props) {
    super(props);

    const { baseRadius } = props;

    // 50:50 chance for direction to go left or right
    this.direction = directions[Math.floor(Math.random() * 2)];

    const rotation = minMax(0, 360);
    const strokeWidth = minMax(minStrokeWidth, maxStrokeWidth);
    const radius =
      minMax(baseRadius + minRadius, baseRadius + maxRadius) + strokeWidth;
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset =
      this.direction === "left" ? -circumference : circumference;

    this.state = {
      strokeWidth,
      radius,
      rotation,
      circumference,
      strokeDashoffset
    };
  }

  componentDidMount() {
    // After mounting with initial values, animation can be triggered
    const strokeDashoffset =
      (this.state.circumference / 100) *
      minMax(minCircumference, maxCircumference);
    const targetRotation = minMax(minRotationAnimation, maxRotationAnimation);

    requestAnimationFrame(() => {
      this.setState({
        ...this.state,
        strokeDashoffset:
          this.direction === "left" ? -strokeDashoffset : strokeDashoffset,
        rotation:
          this.direction === "left"
            ? this.state.rotation - targetRotation
            : this.state.rotation + targetRotation
      });
    });
  }

  render() {
    const { x, y, color } = this.props;
    const diameter = this.state.radius * 2 + this.state.strokeWidth * 2;
    const divStyle = {
      left: `${x}vw`,
      top: `${y}vh`,
      transform: `translate(-${diameter / 2}px, -${diameter / 2}px)`
    };
    const className = `circle-section__circle circle-section__circle--${color}`;
    return (
      <div className="circle-section" style={divStyle}>
        <svg height={diameter} width={diameter}>
          <circle
            className={className}
            stroke={color}
            fill="transparent"
            strokeWidth={this.state.strokeWidth}
            r={this.state.radius}
            strokeDasharray={
              this.state.circumference + " " + this.state.circumference
            }
            style={{
              strokeDashoffset: this.state.strokeDashoffset,
              transform: `rotate(${this.state.rotation}deg)`
            }}
            cx={this.state.radius + this.state.strokeWidth}
            cy={this.state.radius + this.state.strokeWidth}
          />
        </svg>
      </div>
    );
  }
}

CircleSection.defaultProps = {
  x: 0,
  y: 0
};

export default CircleSection;
