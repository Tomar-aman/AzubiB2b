import { SVG } from "@/assets/svg";
import TextInput from "@/components/labelInput";
import MainLayout from "@/components/layout";
import StylesStyled from "@/pages/dashboard/add-new-company/stylesStyled";
import { Box, Button } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import { SubSuperAdminApi } from "@/pages/api/subSuperAdmin/SubSuperAdminApi";

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (val: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        width: "44px",
        height: "24px",
        borderRadius: "9999px",
        border: "none",
        cursor: "pointer",
        padding: "2px",
        backgroundColor: checked ? "#3b82f6" : "#d1d5db",
        transition: "background-color 0.2s ease",
        flexShrink: 0,
        outline: "none",
        boxShadow: checked ? "0 0 0 3px rgba(59,130,246,0.15)" : "none",
      }}
    >
      <span
        style={{
          display: "block",
          width: "20px",
          height: "20px",
          borderRadius: "50%",
          backgroundColor: "#ffffff",
          boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
          transform: checked ? "translateX(20px)" : "translateX(0px)",
          transition: "transform 0.2s ease",
        }}
      />
    </button>
  );
}

function PermissionCard({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (val: boolean) => void;
}) {
  return (
    <Box
      onClick={() => onChange(!checked)}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "13px 16px",
        borderRadius: "10px",
        border: `1px solid ${checked ? "#bfdbfe" : "#e5e7eb"}`,
        backgroundColor: checked ? "#eff6ff" : "#fafafa",
        transition: "background-color 0.2s ease, border-color 0.2s ease",
        cursor: "pointer",
        userSelect: "none",
      }}
    >
      <span
        style={{
          fontSize: "14px",
          fontWeight: 500,
          color: checked ? "#1d4ed8" : "#374151",
          transition: "color 0.2s ease",
          letterSpacing: "-0.01em",
        }}
      >
        {label}
      </span>
      <Toggle checked={checked} onChange={onChange} />
    </Box>
  );
}

export default function AddNewSubSuperAdmin() {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(false);

  const handleGoBack = () => {
    router.back();
  };

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      role: "Sub-SuperAdmin",
      oldPassword: "",
      password: "",
      confirmPassword: "",
      managePolicy: false,
      manageImpressum: false,
      manageMeineDaten: false,
      manageJobAlarmContent: false,
      manageJobFormContent: false,
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("First name is required"),
      lastName: Yup.string().required("Last name is required"),
      email: Yup.string()
        .email("Invalid email")
        .required("Email is required"),

      password: Yup.string().when([], {
        is: () => !id,
        then: (schema) => schema.required("Password is required"),
        otherwise: (schema) => schema.notRequired(),
      }),

      oldPassword: Yup.string().when("password", {
        is: (val: string) => id && val && val.length > 0,
        then: (schema) => schema.required("Old password is required"),
        otherwise: (schema) => schema.notRequired(),
      }),

      confirmPassword: Yup.string().when("password", {
        is: (val: string) => val && val.length > 0,
        then: (schema) =>
          schema
            .required("Confirm password is required")
            .oneOf([Yup.ref("password")], "Passwords must match"),
        otherwise: (schema) => schema.notRequired(),
      }),
    }),
    onSubmit: (data) => {
      handleSubmit(data);
    },
  });

  const handleSubmit = async (data: any) => {
    setLoading(true);
    try {
      const payload: any = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        managePolicy: data.managePolicy,
        manageImpressum: data.manageImpressum,
        manageMeineDaten: data.manageMeineDaten,
        manageJobAlarmContent: data.manageJobAlarmContent,
        manageJobFormContent: data.manageJobFormContent,
      };

      if (data.password) {
        payload.newPassword = data.password;
      }

      let response;

      if (id) {
        response = await SubSuperAdminApi.updateUserById(id as string, payload);
      } else {
        response = await SubSuperAdminApi.createUser({
          ...payload,
          password: data.password,
          role: "Sub-SuperAdmin",
        });
      }

      if (response.remote === "success") {
        toast.success(response.data.message);
        router.push("/sub-superadmin");
      } else {
        toast.error("Failed to create user");
      }
    } catch (error) {
      console.error("Error Creating user:", error);
      toast.error("An error occurred while creating user.");
    } finally {
      setLoading(false);
    }
  };

  const handleFetchData = async (id: string) => {
    try {
      setLoading(true);
      const response = await SubSuperAdminApi.getUserById(id);

      if (response.remote === "success") {
        const data = response.data.data;
        formik.setFieldValue("firstName", data.firstName);
        formik.setFieldValue("lastName", data.lastName);
        formik.setFieldValue("email", data.email);
        formik.setFieldValue("managePolicy", data.managePolicy);
        formik.setFieldValue("manageImpressum", data.manageImpressum);
        formik.setFieldValue("manageMeineDaten", data.manageMeineDaten);
        formik.setFieldValue("manageJobAlarmContent", data.manageJobAlarmContent);
        formik.setFieldValue("manageJobFormContent", data.manageJobFormContent);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id && typeof id === "string") {
      handleFetchData(id);
    }
  }, [id]);

  const permissionFields = [
    { field: "managePolicy", label: "Manage Policy" },
    { field: "manageImpressum", label: "Manage Impressum"},
    { field: "manageMeineDaten", label: "Manage Meine Daten" },
    { field: "manageJobAlarmContent", label: "Manage Job Alarm Content" },
    { field: "manageJobFormContent", label: "Manage Job Form Content" },
  ];

  return (
    <StylesStyled>
      <ToastContainer />
      <MainLayout>
        <Box sx={{ paddingLeft: "260px" }} className="addNew">
          <Box p={3}>
            <Box className="headerCompany">
              <SVG.Arrow onClick={handleGoBack} style={{ cursor: "pointer" }} />
              <h3>{id ? "Edit Sub-Super Admin" : "Add New Sub-Super Admin"}</h3>
            </Box>

            <form onSubmit={formik.handleSubmit}>
              <Box className="companyBox">
                <Box className="customLabel">
                  <label>First Name</label>
                  <TextInput
                    type="text"
                    name="firstName"
                    placeholder="Enter first name"
                    value={formik.values.firstName}
                    onChange={formik.handleChange}
                  />
                  {formik.touched.firstName && formik.errors.firstName && (
                    <p className="error">{formik.errors.firstName}</p>
                  )}
                </Box>

                <Box className="customLabel">
                  <label>Last Name</label>
                  <TextInput
                    type="text"
                    name="lastName"
                    placeholder="Enter last name"
                    value={formik.values.lastName}
                    onChange={formik.handleChange}
                  />
                  {formik.touched.lastName && formik.errors.lastName && (
                    <p className="error">{formik.errors.lastName}</p>
                  )}
                </Box>

                <Box className="customLabel">
                  <label>Email</label>
                  <TextInput
                    type="text"
                    name="email"
                    placeholder="Enter email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                  />
                  {formik.touched.email && formik.errors.email && (
                    <p className="error">{formik.errors.email}</p>
                  )}
                </Box>

                {id && (
                  <Box className="customLabel">
                    <label>Old Password</label>
                    <TextInput
                      type="password"
                      name="oldPassword"
                      placeholder="************"
                      value={formik.values.oldPassword}
                      onChange={formik.handleChange}
                    />
                    {formik.touched.oldPassword && formik.errors.oldPassword && (
                      <p className="error">{formik.errors.oldPassword}</p>
                    )}
                  </Box>
                )}

                <Box className="customLabel">
                  <label>Password</label>
                  <TextInput
                    type="password"
                    name="password"
                    placeholder="************"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                  />
                  {formik.touched.password && formik.errors.password && (
                    <p className="error">{formik.errors.password}</p>
                  )}
                </Box>

                <Box className="customLabel">
                  <label>Confirm Password</label>
                  <TextInput
                    type="password"
                    name="confirmPassword"
                    placeholder="************"
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                  />
                  {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                    <p className="error">{formik.errors.confirmPassword}</p>
                  )}
                </Box>

                <Box mt={2}>
                  <h4 style={{ margin: "0 0 12px 0" }}>Permissions</h4>
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2, 1fr)",
                      gap: "10px",
                      mt: 1,
                    }}
                  >
                    {permissionFields.map(({ field, label }) => (
                      <PermissionCard
                        key={field}
                        label={label}
                        checked={
                          !!formik.values[field as keyof typeof formik.values]
                        }
                        onChange={(val) => formik.setFieldValue(field, val)}
                      />
                    ))}
                  </Box>
                </Box>

                <Box
                  sx={{
                    textAlign: "end",
                    paddingBottom: "22px",
                    marginTop: "24px",
                  }}
                >
                  <Button
                    type="submit"
                    className="btnSubmit"
                    disabled={loading}
                  >
                    <SVG.Vector /> {loading ? "Submitting..." : "Submit"}
                  </Button>
                </Box>
              </Box>
            </form>
          </Box>
        </Box>
      </MainLayout>
    </StylesStyled>
  );
}