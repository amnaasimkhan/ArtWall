import React from 'react'
import ManagementPage from '../../components/admin/ManagementPage'

const ArtistMgmt = ({ mode }) => {
  return (
    <div>
      <ManagementPage
        fetchUrl="/api/artist/getArtists"
        header="Artists"
        arrayName="artists"
        keyName="artist"
        deleteUrl="/api/artist/deleteArtist"
        fields={{
          titleKey: "name",
          subtitleKey: "email",
          extraKeys: [
            { label: "Joined", key: "created_at", type: "date" },
          ],
        }}
      />

    </div>
  )
}

export default ArtistMgmt