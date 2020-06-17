import React, { Component } from "react";

class CircleSector extends Component {
  constructor(props) {
    super(props);

    this.progressTarget = Math.ceil(Math.random() * 3) * 25;

    const stroke = Math.floor(Math.random() * 15) + 5;
    const radius = Math.floor(Math.random() * 35) + 15 + 2 * stroke;
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;

    this.state = {
      progress: 0,
      stroke,
      radius,
      normalizedRadius,
      circumference
    };

    this.colorIndex = Math.floor(Math.random() * 2);
    this.rotation = Math.ceil(Math.random() * 4) * 90;
    const colors = ["primary", "secondary"];
    this.color = colors[this.colorIndex];
  }

  componentDidMount() {
    this.setState({
      ...this.state,
      progress: 0
    });

    this.interval = setInterval(() => {
      this.setState({ progress: this.state.progress + 1 });
      if (
        this.progressTarget <= this.state.progress ||
        this.state.progress > 100
      )
        clearInterval(this.interval);
    }, 1000 / this.progressTarget);

    this.timeout = setTimeout(() => {
      this.changeCircle();
    }, Math.floor(Math.random() * 15000) + 3000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
    clearTimeout(this.timeout);
  }

  changeCircle() {
    const stroke = Math.floor(Math.random() * 15) + 5;
    const radius = Math.floor(Math.random() * 35) + 15 + 2 * stroke;
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;

    this.setState({
      ...this.state,
      stroke,
      radius,
      normalizedRadius,
      circumference
    });

    this.timeout = setTimeout(() => {
      this.changeCircle();
    }, Math.floor(Math.random() * 15000) + 3000);
  }

  render() {
    const { x, y } = this.props;
    let strokeDashoffset =
      this.state.circumference -
      (this.state.progress / 100) * this.state.circumference;
    if (isNaN(strokeDashoffset)) strokeDashoffset = this.state.circumference;
    const divStyle = { left: `${x}vw`, top: `${y}vh` };
    const className = `circle-section__circle circle-section__circle--${this.color}`;
    return (
      <div className="circle-section" style={divStyle}>
        <svg height={this.state.radius * 2} width={this.state.radius * 2}>
          <filter id="f1">
            <feGaussianBlur result="blurOut" in="offOut" stdDeviation="1" />
            <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
          </filter>
          <circle
            className={className}
            stroke={this.color}
            fill="transparent"
            strokeWidth={this.state.stroke}
            r={this.state.normalizedRadius}
            strokeDasharray={
              this.state.circumference + " " + this.state.circumference
            }
            style={{
              strokeDashoffset,
              transform: `rotate(${this.rotation}deg)`
            }}
            cx={this.state.radius}
            cy={this.state.radius}
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
