import AdminCreateForm from "../../components/admin/AdminCreateForm";

const CreateArtist = () => {
  return (
    <AdminCreateForm
      title="Create Artist"
      submitUrl="/api/artist/createArtist"
      fields={[
        { label: "Name", name: "name" },
        { label: "Email", name: "email", type: "email" },
      ]}
    />
  );
};

export default CreateArtist;
