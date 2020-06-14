import React, { useEffect, useState } from "react";
import { graphql } from "gatsby";
import Layout from "../components/layout";
import { createClient } from "contentful";

const RootIndex = (props) => {
  const [content, setContent] = useState(undefined);
  const customer = props.data.allContentfulCustomer.edges[0].node;

  useEffect(() => {
    const client = createClient({
      space: "q25xzqb0p0qy",
      accessToken: "iLrZ9st6zG5BxT8ksc8KmRM_LDsoVDMUI9Kgn-EduvE",
    });

    client.getEntry("6ZG60ULmrFe4eLf980dqfv").then((content) => {
      console.log(content);
      setContent(content);
    });
  }, []);

  return (
    <Layout location={props.location}>
      <h4>Dynamic (via SDK)</h4>
      {content && (
        <>
          <h1>{content.fields.customerName}</h1>
          <img
            src={content.fields.logo.fields.file.url}
            style={{ width: `500px` }}
          />
        </>
      )}
      <h4>Static (Gatsby GraphQL)</h4>
      <h1>{customer.customerName}</h1>
    </Layout>
  );
};

export default RootIndex;

export const pageQuery = graphql`
  query MyQuery {
    allContentfulCustomer(
      filter: { id: {}, contentful_id: { eq: "6ZG60ULmrFe4eLf980dqfv" } }
    ) {
      edges {
        node {
          id
          customerName
        }
      }
    }
  }
`;
