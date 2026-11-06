import ManagementPage from '../../components/admin/ManagementPage'

const ArtworkMgmt = () => {
  return (
    <div>
      <ManagementPage
        fetchUrl="/api/artwork/getArtworks"
        header="Artworks"
        arrayName="artworks"
        keyName="artwork"
        deleteUrl="/api/artwork/admin/deleteArtwork"
        editUrl="/api/artwork/admin/updateArtwork"
        fields={{
          titleKey: "title",
          subtitleKey: "artist_name",
          imageKey: "first_image_URL",
          extraKeys: [
            { label: "Price", key: "price", type: "price" },
            { label: "Style", key: "style_name" },
          ],
        }}
      />

    </div>
  )
}

export default ArtworkMgmt