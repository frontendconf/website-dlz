import Link from "next/link";
import FadeIn from "./FadeIn";
import { Container, Row, Col } from "./shared/Grid";
import React, { Component } from "react";

// Get index of the node within parent
const getNodeindex = elm => {
  const c = elm.parentNode.children;
  for (let i = 0; i < c.length; i++) if (c[i] == elm) return i;
};

// Check whether the title comes before the old title in the nav
const isReverseAnimation = (title, oldTitle) => {
  const navInfo = {};
  const navList = document.body.querySelector(".nav__list");
  if (!navList) {
    return false;
  }
  const navElements = navList.childNodes;
  navElements.forEach(navEl => {
    navInfo[navEl.childNodes[0].text] = getNodeindex(navEl);
  });
  const titleIndex = title in navInfo ? navInfo[title] : 999;
  const oldTitleIndex = oldTitle in navInfo ? navInfo[oldTitle] : -1;
  return titleIndex < oldTitleIndex;
};

const createNewTitle = (title, current, isReverse = false) => {
  const newEl = document.createElement("h1");
  newEl.className = "hero__title";
  newEl.innerHTML = title;
  current.appendChild(newEl);

  const fontSize = window.getComputedStyle(newEl).getPropertyValue("font-size");
  const characterToFontSize = 0.702083333;
  const spaceToFontSize = 0.3;
  const spaceWidth = parseInt(fontSize, 10) * spaceToFontSize;
  const availableWidth = parseInt(
    window.getComputedStyle(newEl).getPropertyValue("width"),
    10
  );

  const lines = [];
  let currentLine = [];
  let lineCount = 0;

  title.split(" ").map(item => {
    const word = item.length * characterToFontSize * parseInt(fontSize, 10);
    if (lineCount + word > availableWidth) {
      lines.push(currentLine.join(" "));
      currentLine = [];
      lineCount = 0;
    }

    if (lineCount > 0) {
      lineCount += spaceWidth;
    }

    lineCount += word;
    currentLine.push(item);
  });

  lines.push(currentLine.join(" "));
  const html = lines.join('</span></div><div><span class="hero__title-item">');
  const fullHtml = `<div><span class="hero__title-item">${html}</span></div>`;

  newEl.innerHTML = fullHtml;
  current.appendChild(newEl);
  current.querySelectorAll(".hero__title-item").forEach(function(el, i) {
    setTimeout(function() {
      if (isReverse) {
        el.classList.add("hero__title-item--in-reverse");
      } else {
        el.classList.add("hero__title-item--in");
      }
    }, 100 * i);
  });
};

class Hero extends Component {
  constructor(props) {
    super(props);

    this.state = {
      opacity: 0,
      title: props.title
    };

    this.myRef = React.createRef();
  }

  componentDidMount() {
    this.myRef.current.querySelectorAll("h1").forEach(item => {
      item.remove();
    });
    createNewTitle(this.props.title, this.myRef.current);
  }

  componentWillReceiveProps(nextProps) {
    // You don't have to do this check first, but it can help prevent an unneeded render
    if (nextProps.title !== this.state.title) {
      const isReverse = isReverseAnimation(nextProps.title, this.state.title);

      // Store title for comparison to detect navigation to the current page
      this.setState({ title: nextProps.title });

      // Flag old title to move out
      const currentTitle = this.myRef.current.querySelector("h1");
      currentTitle.classList.add("hero__title--out");
      const currentTitleItem = currentTitle.querySelectorAll(
        "h1 .hero__title-item"
      );
      currentTitleItem.forEach(item => {
        item.classList.add("hero__title-item--out");
        if (isReverse) {
          item.classList.add("hero__title-item--out-reverse");
        }
      });

      // In some situations an additional element is rendered, remove all but the old one
      this.myRef.current
        .querySelectorAll("h1:not(.hero__title--out)")
        .forEach(item => {
          item.remove();
        });

      // Add the new title
      createNewTitle(nextProps.title, this.myRef.current, isReverse);

      // Remove old title
      setTimeout(() => {
        if (currentTitle.parentNode) {
          currentTitle.parentNode.removeChild(currentTitle);
        }
      }, 500);
    }
  }

  render() {
    return (
      <div
        className={
          this.props.template ? `hero hero--${this.props.template}` : "hero"
        }
      >
        <Container className="hero__container">
          <Row className="hero__container">
            <Col className="hero__col xs-12 offset-lg-1 lg-10 offset-xl-2 xl-8">
              <div className="hero__inner">
                {this.props.lead ? (
                  <FadeIn style={{ display: "block" }} delay={150}>
                    <p className="hero__lead">{this.props.lead}</p>
                  </FadeIn>
                ) : null}
                <div className="hero__title-wrapper" ref={this.myRef}>
                  <noscript>
                    <h1 className="hero__title">{this.props.title}</h1>
                  </noscript>
                </div>
                {this.props.subTitle ? (
                  <FadeIn style={{ display: "block" }}>
                    <h2 className="hero__subtitle">{this.props.subTitle}</h2>
                  </FadeIn>
                ) : null}
              </div>

              {this.props.ctas && (
                <div className="hero__ctas-wrapper">
                  <FadeIn style={{ display: "block" }} delay={300}>
                    <div className="hero__ctas">
                      {this.props.ctas.map((cta, i) => {
                        return (
                          <Link
                            href={{ pathname: "/", query: { slug: cta.slug } }}
                            as={`/${cta.slug}`}
                            key={i}
                          >
                            <a className="hero__cta">{cta.ctaText}</a>
                          </Link>
                        );
                      })}
                    </div>
                  </FadeIn>
                </div>
              )}
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Hero;
