import ManagementPage from '../../components/admin/ManagementPage'

const CustomerMgmt = () => {
  return (
    <div>
      <ManagementPage
        fetchUrl="/api/user/getUsers"
        header="Customers"
        arrayName="users"
        keyName="user"
        deleteUrl="/api/user/deleteAccount"
        fields={{
          titleKey: "name",
          subtitleKey: "email",
          extraKeys: [
            { label: "Joined", key: "created_at", type: "date" },
          ],
          statusKey: 'role'
        }}
      />

    </div>
  )
}

export default CustomerMgmt