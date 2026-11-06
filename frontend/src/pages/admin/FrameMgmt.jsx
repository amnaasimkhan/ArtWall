import ManagementPage from '../../components/admin/ManagementPage'

const FrameMgmt = () => {
  return (
    <div>
      <ManagementPage
        fetchUrl="/api/frame/get"
        header="Frames"
        arrayName="frames"
        keyName="frame"
        deleteUrl="/api/frame/delete"
        fields={{
          titleKey: "name",
          subtitleKey: "material",
          imageKey: "image_URL",
          extraKeys: [
            { label: "Price", key: "price", type: "price" },
          ],
        }}
      />


    </div>
  )
}

export default FrameMgmt