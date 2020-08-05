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

    const step = percentage => {
      const offset = (strokeDashoffset * percentage) / 100;
      const rotation = (targetRotation * percentage) / 100;

      this.setState({
        ...this.state,
        strokeDashoffset: this.direction === "left" ? -offset : offset,
        rotation: this.direction === "left" ? -rotation : rotation
      });

      if (percentage < 100) {
        setTimeout(() => {
          step(percentage + 1);
        }, 1);
      }
    };

    step(0);
  }

  render() {
    const { x, y, mouseX, mouseY, color, depth } = this.props;
    const diameter = this.state.radius * 2 + this.state.strokeWidth * 2;
    const mouseDistance = (Math.abs(mouseX - x) + Math.abs(mouseY - y)) / 100;

    const distance = (30 / 100) * mouseDistance;

    const divStyle = {
      left: `${x - ((x - mouseX) * Math.abs(x - mouseX)) / 800}vw`,
      top: `${y - ((y - mouseX) * Math.abs(y - mouseY)) / 800}vh`,
      transform: `translate(-${diameter / 2}px, -${diameter}px) scale(${0.2 +
        distance})`
    };

    const circleStyleFiltered = {
      strokeDashoffset:
        this.state.circumference -
        this.state.strokeDashoffset * (0.5 + distance),
      transform: `rotate(${this.state.rotation}deg)`,
      filter: "url(#dropshadow)"
    };
    const className = `circle-section__circle circle-section__circle--${color}`;
    return (
      <div className="circle-section" style={divStyle} data-depth={depth}>
        <svg height={diameter} width={diameter}>
          <defs>
            <filter
              id="dropshadow"
              x="0"
              y="0"
              width="180%"
              height="180%"
              filterUnits="userSpaceOnUse"
            >
              <feGaussianBlur in="SourceGraphic" stdDeviation="4" />
              <feOffset dx="5" dy="5" result="offsetblur" />
              <feOffset dx="-5" dy="-5" result="offsetblur" />
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <circle
            className={className}
            stroke={color}
            fill="transparent"
            strokeWidth={this.state.strokeWidth}
            r={this.state.radius}
            strokeDasharray={
              this.state.circumference + " " + this.state.circumference
            }
            style={circleStyleFiltered}
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
