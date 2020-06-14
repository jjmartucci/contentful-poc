import React, { useEffect, useState, useRef } from "react";
import Layout from "../components/layout";
import { client } from "../functions/contentful";
import { readFileAsData } from "../functions/fileupload";

const Update = (props) => {
  const [content, setContent] = useState(undefined);
  const [logoContent, setLogoContent] = useState(undefined);
  const [logoImage, setLogoImage] = useState(undefined);
  const [saving, setSaving] = useState(false);
  const fileInput = useRef(null);

  useEffect(() => {
    client.getSpace("q25xzqb0p0qy").then((space) => {
      // gets a single entry by ID
      space.getEntry("6ZG60ULmrFe4eLf980dqfv").then((content) => {
        space
          .getAsset(content.fields.logo["en-US"].sys.id)
          .then((logoContent) => {
            setLogoImage(logoContent.fields.file["en-US"].url);
            setLogoContent(logoContent);
            setContent(content);
            console.log(content);
          });
      });
    });
  }, []);

  const handleLogo = (e) => {
    setLogoImage(URL.createObjectURL(fileInput.current.files[0]));
  };

  const updateValues = async (e) => {
    setSaving(true);
    let publishedLogoId = false;
    e.preventDefault();
    const newName = document.getElementById("customerName").value;
    content.fields.customerName["en-US"] = newName;

    if (fileInput.current.files[0]) {
      // upload the logo and get the asset information
      const readFile = async (path) => {
        try {
          const fileContents = await readFileAsData(path);
          return fileContents;
        } catch (e) {
          console.warn(e.message);
        }
      };

      const file = await readFile(fileInput.current.files[0]);
      const space = await client.getSpace("q25xzqb0p0qy");

      const asset = await space.createAssetFromFiles({
        fields: {
          title: {
            "en-US": "Asset title",
          },
          description: {
            "en-US": "Asset description",
          },
          file: {
            "en-US": {
              contentType: fileInput.current.files[0].type,
              fileName: fileInput.current.files[0].name,
              file: file,
            },
          },
        },
      });

      const processedAsset = await asset.processForAllLocales();
      const publishedAsset = await processedAsset.publish();
      publishedLogoId = publishedAsset.sys.id;
    }

    const fields = content.fields;
    const customerName = document.getElementById("customerName").value;
    if (publishedLogoId) {
      content.fields.logo["en-US"].sys.id = publishedLogoId;
    }
    content.fields.customerName["en-US"] = customerName;
    const updatedContent = await content.update();
    updatedContent.publish();
    setSaving(false);
  };

  if (!content) {
    return null;
  }
  return (
    <Layout location={props.location}>
      <p>
        This is using{" "}
        <a href="https://github.com/contentful/contentful-management.js">
          Contentful's JavaScript SDK for the Management API
        </a>
      </p>
      <form
        onSubmit={(e) => {
          updateValues(e);
        }}
      >
        <input
          type="text"
          name="customerName"
          id="customerName"
          defaultValue={content.fields.customerName["en-US"]}
        ></input>

        <div>Logo </div>
        {logoContent && <img src={logoImage} style={{ width: `500px` }} />}
        <input
          type="file"
          id="logo"
          ref={fileInput}
          onChange={(e) => handleLogo(e)}
        />

        <br />
        <button>{saving ? `Saving` : `Save`}</button>
      </form>
    </Layout>
  );
};

export default Update;
