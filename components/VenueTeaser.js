import Link from "next/link";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import ErrorMessage from "./ErrorMessage";
import Markdown from "markdown-to-jsx";
import { Row, Col } from "./shared/Grid";
import FadeIn from "./FadeIn";
import Image from "./Image";
import React, { Component } from "react";

const teaserQuery = gql`
  query {
    configCollection {
      items {
        venueTeaser {
          title
          body
          photo {
            url(transform: { width: 1200, height: 1200, resizeStrategy: FILL })
          }
        }
        map
      }
    }
  }
`;

const ImageTeaser = ({ venueTeaser }) => (
  <Row>
    <Col className="xs-12">
      <FadeIn style={{ display: "block" }}>
        <div className="venue-teaser__image-wrapper">
          <Image
            className="venue-teaser__image"
            picture
            sources={[
              {
                srcset: `
                  ${venueTeaser.photo.url}&w=300&h=150 300w,
                  ${venueTeaser.photo.url}&w=400&h=200 400w,
                  ${venueTeaser.photo.url}&w=600&h=300 600w,
                  ${venueTeaser.photo.url}&w=800&h=400 800w,
                  ${venueTeaser.photo.url}&w=1000&h=500 1000w,
                  ${venueTeaser.photo.url}&w=1200&h=600 1200w,
                  ${venueTeaser.photo.url}&w=1400&h=700 1400w,
                  ${venueTeaser.photo.url}&w=1600&h=800 1600w,
                  ${venueTeaser.photo.url}&w=1800&h=900 1800w
                `,
                media: "(min-width: 768px)",
                sizes: `
                  (min-width: 1480px) 1480px,
                  100vw
                `
              },
              {
                srcset: `
                  ${venueTeaser.photo.url}&w=300&h=450 300w,
                  ${venueTeaser.photo.url}&w=400&h=600 400w,
                  ${venueTeaser.photo.url}&w=600&h=900 600w,
                  ${venueTeaser.photo.url}&w=800&h=1200 800w,
                  ${venueTeaser.photo.url}&w=1000&h=1500 1000w,
                  ${venueTeaser.photo.url}&w=1200&h=1800 1200w,
                  ${venueTeaser.photo.url}&w=1400&h=2100 1400w
                `,
                sizes: `100vw`
              }
            ]}
            src={`${venueTeaser.photo.url}&w=1480&h=740`}
          />
          <div className="venue-teaser__text">
            <div className="markdown-wrapper">
              <Markdown options={{ forceBlock: true }}>
                {venueTeaser.body}
              </Markdown>
            </div>
          </div>
        </div>
      </FadeIn>
    </Col>
  </Row>
);

export default function VenueTeaser({ isVenue = false }) {
  return (
    <Query query={teaserQuery}>
      {({ loading, error, data }) => {
        if (error) return <ErrorMessage message="Error loading venue." />;
        if (loading) return <div>Loading</div>;

        // Destructuring needs to be done outside the arguments to prevent mapping errors
        const {
          configCollection: {
            items: [{ venueTeaser: venueTeaser, map: map }]
          }
        } = data;

        return (
          <div className="venue-teaser">
            {isVenue ? (
              <>
                <ImageTeaser venueTeaser={venueTeaser} />
                <div
                  className="venue-teaser__map"
                  dangerouslySetInnerHTML={{ __html: map }}
                />
              </>
            ) : (
              <>
                <FadeIn>
                  <h2 className="venue-teaser__title">{venueTeaser.title}</h2>
                </FadeIn>
                <Link
                  href={{ pathname: "/", query: { slug: "venue" } }}
                  as={`/venue`}
                >
                  <a className="venue-teaser__link">
                    <ImageTeaser venueTeaser={venueTeaser} />
                  </a>
                </Link>
              </>
            )}
          </div>
        );
      }}
    </Query>
  );
}
