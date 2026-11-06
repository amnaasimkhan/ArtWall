import { useState, useEffect } from "react";
import axios from "axios";
import AdminCreateForm from "../../components/admin/AdminCreateForm";

const CreateArtwork = () => {
  const [sizes, setSizes] = useState([]);
  const [frames, setFrames] = useState([]);
  const [artists, setArtists] = useState([]);
  const [styles, setStyles] = useState([]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const sizesRes = await axios.get("/api/size/get");
        setSizes(sizesRes.data.sizes || []);

        const framesRes = await axios.get("/api/frame/get");
        setFrames(framesRes.data.frames || []);

        const artistsRes = await axios.get("/api/artist/getArtists");
        setArtists((artistsRes.data.artists || []).map(a => ({
          value: String(a.artist_id),
          label: a.name
        })));

        const stylesRes = await axios.get("/api/style/getStyles");
        setStyles((stylesRes.data.styles || []).map(s => ({
          value: String(s.style_id),
          label: s.name
        })));
      } catch (err) {
        console.error("Failed to fetch dropdown options:", err);
      }
    };

    fetchOptions();
  }, []);

  return (
    <AdminCreateForm
      title="Create Artwork"
      submitUrl="/api/artwork/admin/createArtwork"
      showVariantCreator={true}
      sizeOptions={sizes}
      frameOptions={frames}
      fields={[
        { label: "Title", name: "title" },
        { label: "Artist", name: "artist_id", select: true, options: artists },
        { label: "Style", name: "style_id", select: true, options: styles },
        { label: "Detail", name: "detail" },
        { label: "Base Price", name: "price", type: "number" },
        { label: "First Image URL", name: "first_image_url" },
        { label: "Second Image URL", name: "second_image_url" },
      ]}
    />
  );
};

export default CreateArtwork;
