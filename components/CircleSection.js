import React, { Component } from "react";

class CircleSector extends Component {
  constructor(props) {
    super(props);

    this.state = {
      progress: 0
    };
    this.stroke = Math.floor(Math.random() * 15) + 5; // border size between 5 - 20
    this.radius = Math.floor(Math.random() * 35) + 15 + 2 * this.stroke; // radius between 10 - 40
    this.progressTarget = Math.ceil(Math.random() * 3) * 25; // Progress either 25, 50 or 75
    this.colorIndex = Math.floor(Math.random() * 2);
    this.rotation = Math.ceil(Math.random() * 4) * 90;
    const colors = ["#67FFD1", "#7C67FF"];
    this.color = colors[this.colorIndex];
    this.normalizedRadius = this.radius - this.stroke * 2;
    this.circumference = this.normalizedRadius * 2 * Math.PI;
  }

  componentDidMount() {
    this.setState({ progress: 0 });

    const interval = setInterval(() => {
      this.setState({ progress: this.state.progress + 1 });
      if (
        this.progressTarget <= this.state.progress ||
        this.state.progress > 100
      )
        clearInterval(interval);
    }, 1000 / this.progressTarget);
  }

  render() {
    const { x, y } = this.props;
    let strokeDashoffset =
      this.circumference - (this.state.progress / 100) * this.circumference;
    if (isNaN(strokeDashoffset)) strokeDashoffset = this.circumference;
    const divStyle = { left: `${x}vw`, top: `${y}vh` };
    return (
      <div className="circle-section" style={divStyle}>
        <svg height={this.radius * 2} width={this.radius * 2}>
          <circle
            className="circle-section__circle"
            stroke={this.color}
            fill="transparent"
            strokeWidth={this.stroke}
            r={this.normalizedRadius}
            strokeDasharray={this.circumference + " " + this.circumference}
            style={{
              strokeDashoffset,
              transform: `rotate(${this.rotation}deg)`
            }}
            cx={this.radius}
            cy={this.radius}
          />
        </svg>
      </div>
    );
  }
}

CircleSector.defaultProps = {
  x: 0,
  y: 0
};

export default CircleSector;
