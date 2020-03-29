import ErrorMessage from "./ErrorMessage";
import { withRouter } from "next/router";
import Head from "next/head";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import Markdown from "markdown-to-jsx";
import NewsSummary from "./NewsSummary";
import { Container, Row, Col } from "./shared/Grid";
import VenueTeaser from "./VenueTeaser";
import Jobs from "./Jobs";
import Hero from "./Hero";
import SpeakersList from "./speaker/SpeakersList";
import Backlink from "./Backlink";
import { SpeakerImage, SpeakerSocials } from "./speaker/SpeakerLink";
import NewsList from "./NewsList";
import Sponsors from "./Sponsors";
import RestaurantsList from "./RestaurantsList";
import HotelsList from "./HotelsList";
import Workshops from "./Workshops";
import Workshop from "./Workshop";
import Talks from "./Talks";
import Schedule from "./Schedule";
import AirtableForm from "./AirtableForm";

const currentPageQuery = gql`
  query($slug: String!) {
    collection: pageCollection(where: { slug: $slug }) {
      items {
        title
        lead
        body
        slug
        menu
        menuButton
        showIntro
        showNews
        showSpeakers
        showVenue
        showSponsorshipCategories
        showSponsors
        showSponsorsDetailed
        showWorkshops
        showTeam
        showJobs
        showJobsDetailed
        showSchedule
        showHotels
        showRestaurants
        showCallForSpeakers
        showSpeakersForm
        showSpeakersFormWorkshop
        bodyClass
        menuClass
        ctaText
        specialPage
        config
        leadCtasCollection {
          items {
            ctaText
            slug
          }
        }
      }
    }
  }
`;

const currentNewsQuery = gql`
  query($slug: String!) {
    collection: newsCollection(where: { slug: $slug }) {
      items {
        title
        date
        body
        slug
        tagsCollection {
          items {
            title
          }
        }
      }
    }
  }
`;

// TODO find better way to map content fields, instead duplicating it
const currentSpeakerQuery = gql`
  query($slug: String!) {
    collection: speakerCollection(where: { slug: $slug }) {
      items {
        title: name
        lead: description
        body: bio
        name
        description
        slug
        photo {
          url(transform: { resizeStrategy: FILL })
        }
        linkedin
        twitter
        website
      }
    }
  }
`;
const currentHostQuery = gql`
  query($slug: String!) {
    collection: hostCollection(where: { slug: $slug }) {
      items {
        title: name
        lead: description
        body: bio
        name
        description
        slug
        photo {
          url(transform: { resizeStrategy: FILL })
        }
        twitter
      }
    }
  }
`;

const currentWorkshopQuery = gql`
  query($slug: String!) {
    collection: workshopCollection(where: { slug: $slug }) {
      items {
        title
        lead
        body
        from
        to
        teacher {
          name
          description
          bio
          website
          twitter
          linkedin
          photo {
            url(transform: { width: 294, height: 395, resizeStrategy: FILL })
          }
        }
        photo {
          url(transform: { width: 294, height: 395, resizeStrategy: FILL })
        }
        tagsCollection(limit: 20) {
          items {
            title
          }
        }
      }
    }
  }
`;

export default withRouter(({ router: { query } }) => {
  const slug = query.slug || "/";
  const category = query.category;
  let template = "default";
  let dataQuery;

  let wideContent = false;
  let darkContent = false;
  let isHome = slug === "/";
  let isVenue = slug === "venue";

  console.log(slug);

  // Root categories
  switch (slug) {
    case "schedule":
    case "jobs":
      darkContent = true;
    case "venue":
    case "sponsors":
    case "schedule":
      wideContent = true;
    case "terms":
    case "jobs":
    case "code-of-conduct":
    case "privacy-policy":
    case "news":
    case "about":
    case "sponsorship":
    case "tickets":
    case "workshops":
    case "live":
    case "call-for-speakers":
    case "speakers-form":
    case "speakers-form-workshop":
      template = "list";
      break;
    default:
      break;
  }

  let backLink = {};
  let isSpeaker = category === "speakers";
  let isWorkshop = category === "workshops";
  let isHost = category === "hosts";

  // Sub Categories
  switch (category) {
    case "speakers":
      template = "content";
      dataQuery = currentSpeakerQuery;
      backLink =
        query.referrer === "schedule"
          ? {
              text: "Schedule",
              link: {
                href: { pathname: "/", query: { slug: "schedule" } },
                as: "/schedule"
              }
            }
          : {
              text: "Speakers",
              link: {
                href: { pathname: "/", query: { slug: "speakers" } },
                as: "/speakers"
              }
            };
      break;
    case "hosts":
      template = "content";
      dataQuery = currentHostQuery;
      backLink = {
        text: "Speakers",
        link: {
          href: { pathname: "/", query: { slug: "speakers" } },
          as: "/speakers"
        }
      };
      break;
    case "news":
      template = "content";
      dataQuery = currentNewsQuery;
      backLink = {
        text: "News",
        link: {
          href: { pathname: "/", query: { slug: "news" } },
          as: "/news"
        }
      };
      break;
    // case "hosts":
    case "workshops":
      template = "content";
      dataQuery = currentWorkshopQuery;
      backLink = {
        text: "Workshops",
        link: {
          href: { pathname: "/", query: { slug: "workshops" } },
          as: "/workshops"
        }
      };
      break;
    default:
      dataQuery = currentPageQuery;
  }

  return (
    <Query query={dataQuery} variables={{ slug }}>
      {({ loading, error, data }) => {
        if (error)
          return (
            <Hero
              title="Error loading content."
              lead="It looks like we cannot reach our content management system. Please try again later. If you don't want to wait, feel free to contact us on info@frontconference.com"
            />
          );
        if (loading) return <Hero title="Loading..." />;

        // Destructuring needs to be done outside the arguments to prevent mapping errors
        const {
          collection: {
            items: [currentPage]
          }
        } = data;
        if (!currentPage) return <Hero title="404 Page not found" />;

        let title = category
          ? `${category.charAt(0).toUpperCase()}${category.slice(1)}`
          : currentPage.title;
        const subTitle = category ? currentPage.title : null;
        const ctas = currentPage.leadCtasCollection
          ? currentPage.leadCtasCollection.items
          : null;

        const metaTitle = `${
          isHome ? "" : `${title} – `
        }Front Conference Zurich`;
        const metaDescription = subTitle || currentPage.lead;

        const CustomHead = () => (
          <Head>
            <title>{metaTitle}</title>
            <meta name="description" content={metaDescription} />
            <meta property="og:image" content="/static/sharing.jpg" />
            <meta name="twitter:card" content="summary_large_image" />

            {currentPage.config && currentPage.config.scripts
              ? currentPage.config.scripts.map((src, i) => (
                  <script src={src} async key={i} />
                ))
              : null}
            {currentPage.config && currentPage.config.styles
              ? currentPage.config.styles.map((href, i) => (
                  <link rel="stylesheet" href={href} key={i} />
                ))
              : null}
          </Head>
        );

        switch (template) {
          case "list":
            return (
              <section
                className={loading ? "content content--loading" : "content"}
              >
                <CustomHead />
                <Hero
                  title={title}
                  subTitle={subTitle}
                  lead={currentPage.lead}
                  ctas={ctas}
                  template={template}
                />
                <div
                  className={`content__wrapper content__wrapper--${category ||
                    slug}`}
                >
                  <Container>
                    <div className="content__inner-wrapper">
                      {currentPage.body && (
                        <Row>
                          <Col
                            className={`xs-12 ${
                              !wideContent
                                ? "rg-10 offset-rg-1 lg-8 offset-lg-2"
                                : ""
                            }`}
                          >
                            <div className="markdown-wrapper markdown-wrapper--list">
                              <Markdown options={{ forceBlock: true }}>
                                {currentPage.body}
                              </Markdown>
                            </div>
                          </Col>
                        </Row>
                      )}
                      {currentPage.showVenue && (
                        <VenueTeaser isVenue={isVenue} />
                      )}
                      {currentPage.showNews && <NewsList />}
                      {currentPage.showHotels && <HotelsList />}
                      {currentPage.showRestaurants && <RestaurantsList />}
                      {currentPage.showSponsorsDetailed && (
                        <Sponsors details={true} />
                      )}
                      {currentPage.showWorkshops && <Workshops />}
                      {currentPage.showSchedule && <Schedule />}
                      {currentPage.showJobsDetailed && (
                        <Jobs isDetailed={true} />
                      )}
                      {currentPage.showCallForSpeakers && (
                        <Row>
                          <Col
                            className={`xs-12 ${
                              !wideContent
                                ? "rg-10 offset-rg-1 lg-8 offset-lg-2"
                                : ""
                            }`}
                          >
                            <AirtableForm
                              title="Submit proposal"
                              table="Call for Speakers"
                            />
                          </Col>
                        </Row>
                      )}
                      {currentPage.showSpeakersForm && (
                        <Row>
                          <Col
                            className={`xs-12 ${
                              !wideContent
                                ? "rg-10 offset-rg-1 lg-8 offset-lg-2"
                                : ""
                            }`}
                          >
                            <AirtableForm table="Invited Speakers" />
                          </Col>
                        </Row>
                      )}
                      {currentPage.showSpeakersFormWorkshop && (
                        <Row>
                          <Col
                            className={`xs-12 ${
                              !wideContent
                                ? "rg-10 offset-rg-1 lg-8 offset-lg-2"
                                : ""
                            }`}
                          >
                            <AirtableForm table="Workshops" />
                          </Col>
                        </Row>
                      )}
                    </div>
                  </Container>
                </div>

                {currentPage.showSponsors && <Sponsors />}
              </section>
            );
          case "content":
            return (
              <section
                className={loading ? "content content--loading" : "content"}
              >
                <CustomHead />
                <Hero
                  title={title}
                  subTitle={subTitle}
                  lead={currentPage.lead}
                  ctas={ctas}
                  template={template}
                />

                <div className="content__wrapper content__wrapper--white">
                  <Backlink {...backLink} />

                  {isSpeaker || isHost ? (
                    <Container>
                      <Row className="content__floating-row">
                        <Col className="content__left xs-12 md-7 lg-6 offset-lg-1">
                          <div className="content-title">
                            <h1 className="content-title__title">
                              {currentPage.title}
                              {isHost ? " (Host)" : ""}
                            </h1>
                            <p className="content-title__subtitle">
                              {currentPage.lead}
                            </p>
                          </div>
                        </Col>
                        <Col className="content__right xs-12 sm-10 rg-8 md-4 offset-right-lg-1 lg-3">
                          <Row>
                            <Col className="xs-7 offset-xs-1 md-12 offset-md-0">
                              <SpeakerImage
                                speaker={currentPage}
                                isMain={true}
                              />
                            </Col>
                            <Col className="xs-3 offset-xs-1 md-12 offset-md-0">
                              <SpeakerSocials speaker={currentPage} />
                            </Col>
                          </Row>
                        </Col>
                        <Col className="content__left xs-12 md-7 lg-6 offset-lg-1">
                          <div>
                            <Talks speakerSlug={currentPage.slug} />

                            <h2>About</h2>
                            {currentPage.body ? (
                              <div className="markdown-wrapper">
                                <Markdown options={{ forceBlock: true }}>
                                  {currentPage.body}
                                </Markdown>
                              </div>
                            ) : null}
                          </div>
                        </Col>
                      </Row>
                    </Container>
                  ) : isWorkshop ? (
                    <Workshop workshop={currentPage} />
                  ) : (
                    <Container>
                      <Row>
                        <Col className="xs-12 rg-10 offset-rg-1 lg-8 offset-lg-2">
                          <h1 className="content__title">
                            {currentPage.title}
                          </h1>
                          <p>{currentPage.lead}</p>
                          <div>
                            {currentPage.body ? (
                              <div className="markdown-wrapper">
                                <Markdown options={{ forceBlock: true }}>
                                  {currentPage.body}
                                </Markdown>
                              </div>
                            ) : null}
                          </div>
                        </Col>
                      </Row>
                    </Container>
                  )}
                </div>
              </section>
            );
          case "default":
          default:
            return (
              <section
                className={loading ? "content content--loading" : "content"}
              >
                <CustomHead />
                <Hero
                  title={title}
                  subTitle={subTitle}
                  lead={currentPage.lead}
                  ctas={ctas}
                />

                <Container>
                  {currentPage.body && (
                    <div className="markdown-wrapper">
                      <Markdown options={{ forceBlock: true }}>
                        {currentPage.body}
                      </Markdown>
                    </div>
                  )}

                  {currentPage.showNews && <NewsSummary />}
                  {(currentPage.showSpeakers || isHome) && (
                    <SpeakersList
                      limit={isHome ? 6 : undefined}
                      withHeading={isHome}
                    />
                  )}
                  {currentPage.showVenue && <VenueTeaser isVenue={isVenue} />}
                  {currentPage.showJobs && <Jobs />}
                  {currentPage.showSponsors && <Sponsors />}
                </Container>
              </section>
            );
        }
      }}
    </Query>
  );
});