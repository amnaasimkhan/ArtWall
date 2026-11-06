import { Button } from '@mui/material'
import { Link } from 'react-router-dom'
import React from 'react'
import ManagementPage from '../../components/admin/ManagementPage'

const GalleryMgmt = () => {
  return (
    <div>
      <ManagementPage
        fetchUrl="/api/gallery/get"
        header="Gallery Rooms"
        arrayName="backgrounds"
        keyName="room"
        deleteUrl="/api/gallery/delete"
        fields={{
          titleKey: "title",
          subtitleKey: "dominant_color",
          imageKey: "image_URL"
        }}
      />
    </div>
  )
}

export default GalleryMgmt