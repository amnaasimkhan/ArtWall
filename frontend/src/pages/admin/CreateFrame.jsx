import AdminCreateForm from "../../components/admin/AdminCreateForm";

const CreateFrame = () => {
  return (
    <AdminCreateForm
      title="Create Frame"
      submitUrl="/api/admin/createFrame"
      fields={[
        { label: "Name", name: "name" },
        { label: "Material", name: "material" },
        { label: "Image URL", name: "image_url" },
        { label: "Price", name: "price", type: "number" },
      ]}
    />
  );
};

export default CreateFrame;
