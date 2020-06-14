import { createClient } from "contentful-management";

export const client = createClient({
  // This is the access token for this space. Normally you get the token in the Contentful web app
  accessToken: "CFPAT-9jBse7fQENnHoqCg1uqRHPflEG8j0Xm9fg3WawTvBvM",
});
