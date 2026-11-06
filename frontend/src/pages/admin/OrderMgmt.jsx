import ManagementPage from '../../components/admin/ManagementPage'

const OrderMgmt = () => {
  return (
    <div>
      <ManagementPage
        fetchUrl="/api/order/get"
        header="Orders"
        arrayName="orders"
        keyName="order"
        enableStatusUpdate={true}
        updateStatusUrl={"/api/order/updateOrderStatus"}
        fields={{
          titleKey: "order_id",
          subtitleKey: "user_name",
          extraKeys: [
            { label: "Total", key: "total_amount", type: "price" },
            { label: "Date", key: "created_at", type: "date" },
          ],
          statusKey: "status"
        }}
      />


    </div>
  )
}

export default OrderMgmt