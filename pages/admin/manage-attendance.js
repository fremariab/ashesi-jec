// pages/admin.js
import AdminForm from "../../components/AdminForm";
import withAuth from "../../hoc/withAuth";

const AdminPage = () => {
  return (
    <div>
      <h1
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        Manage Attendance
      </h1>
      <AdminForm />
    </div>
  );
};

export default withAuth(AdminPage, ["superadmin"]);
