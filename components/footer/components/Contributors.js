import { Query } from "react-apollo";
import gql from "graphql-tag";
import ErrorMessage from "../../ErrorMessage";
import { Row, Col } from "../../shared/Grid";
import Sponsor from "../../Sponsor";
import FadeIn from "../../FadeIn";

const contributorsQuery = gql`
  query {
    sponsorCollection {
      items {
        title
        link
        logo {
          url
        }
        logoSvg
        body
        twitter
        linkedin
        facebook
        instagram
        order
        category {
          title
          color
        }
        tagCollection(limit: 20) {
          items {
            title
          }
        }
      }
    }
  }
`;

export default function Contributors({
  category = "CONTRIBUTING",
  title,
  filterTag = "FRONT20",
  details = false
}) {
  return (
    <Query query={contributorsQuery}>
      {({ loading, error, data }) => {
        if (error) return <ErrorMessage message="Error loading sponsors" />;
        if (loading) return <div>Loading</div>;

        // Destructuring needs to be done outside the arguments to prevent mapping errors
        const {
          sponsorCollection: { items: allSponsors }
        } = data;

        let sponsors = allSponsors.filter(
          item => item.category.title === category
        );

        // Filter by tag
        if (filterTag) {
          sponsors = sponsors.filter(item =>
            item.tagCollection.items.find(tag => tag.title === filterTag)
          );
        }

        // Sort by `order` property
        if (sponsors[0].order) {
          sponsors = sponsors.sort((a, b) => a.order - b.order);
        }

        // Default title
        if (!title && sponsors.length) {
          title = sponsors.find(item => item.category.title).category.title;
        }

        // Columns
        const columnClasses = "xs-3 rg-2 lg-1";

        return (
          <div
            className={`contributors ${details ? "contributors--detail" : ""}`}
          >
            <FadeIn>
              <h3>{title}</h3>
            </FadeIn>

            {details ? (
              sponsors.map((item, key) => (
                <Sponsor key={key} item={item} details={true} />
              ))
            ) : (
              <Row hGutter={true}>
                {sponsors.map((item, key) => (
                  <Col
                    className={`contributors__item ${columnClasses}`}
                    key={key}
                  >
                    <FadeIn key={key} delay={100 * key}>
                      <Sponsor item={item} />
                    </FadeIn>
                  </Col>
                ))}
              </Row>
            )}
          </div>
        );
      }}
    </Query>
  );
}
