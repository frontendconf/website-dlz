import Link from "next/link";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import ErrorMessage from "./ErrorMessage";
import Markdown from "markdown-to-jsx";
import { Row, Col } from "./shared/Grid";
import FadeIn from "./FadeIn";
import Image from "./Image";

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
    <Col className="xs-12 rg-6">
      <FadeIn style={{ display: "block" }}>
        <div className="venue-teaser__image-wrapper">
          <Image
            className="venue-teaser__image"
            src={`${venueTeaser.photo.url}&w=1000&h=1000`}
            srcSet={`
              ${venueTeaser.photo.url}&w=300&h=300 300w,
              ${venueTeaser.photo.url}&w=400&h=400 400w,
              ${venueTeaser.photo.url}&w=600&h=600 600w,
              ${venueTeaser.photo.url}&w=800&h=800 800w,
              ${venueTeaser.photo.url}&w=1000&h=1000 1000w,
              ${venueTeaser.photo.url}&w=1200&h=1200 1200w
            `}
            sizes={`
              (min-width: 1680px) 625px,
              (min-width: 600px) 45vw,
              95vw
            `}
          />
        </div>
      </FadeIn>
    </Col>
    <Col className="xs-12 rg-5 offset-rg-1">
      <FadeIn delay={150} style={{ alignItems: "center", height: "100%" }}>
        <div className="markdown-wrapper">
          <Markdown options={{ forceBlock: true }}>{venueTeaser.body}</Markdown>
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
          <div
            className={`venue-teaser ${
              isVenue ? "venue-teaser--is-venue" : ""
            }`}
          >
            <Row>
              <Col className="xs-12">
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
                      <h2 className="venue-teaser__title">
                        {venueTeaser.title}
                      </h2>
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
              </Col>
            </Row>
          </div>
        );
      }}
    </Query>
  );
}
