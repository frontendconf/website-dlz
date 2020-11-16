const {
  IUBENDA_SITE_ID,
  IUBENDA_COOKIE_POLICY_ID
} = require("../secrets.json");

export const Script = () => (
  <>
    <script
      async
      src="//cdn.iubenda.com/cookie_solution/safemode/iubenda_cs.js"
    />
    <script
      dangerouslySetInnerHTML={{
        __html: `
          var _iub = _iub || [];
          _iub.csConfiguration = {
            cookiePolicyId: ${IUBENDA_COOKIE_POLICY_ID},
            siteId: ${IUBENDA_SITE_ID},
            lang: "en",
            banner: {
              slideDown: true,
              applyStyles: false
            }
          };
        `
      }}
    />
  </>
);
