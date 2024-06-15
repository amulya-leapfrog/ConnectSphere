import Header from "../components/Header";
import { useFormik } from "formik";
import { me, updateMe, updatePic } from "../services/Auth";
import { IUpdate, IUpdateImage } from "../interfaces/Auth";
import { updateSchema } from "../schemas/authSchema";
import { useEffect, useState } from "react";
import { UserData } from "./Explore";

export default function Profile() {
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const [users, setUsers] = useState<UserData>();
  const [selectedFile, setSelectedFile] = useState<File | null>();

  useEffect(() => {
    const getInfo = async () => {
      try {
        const data = await me();
        setUsers(data);
      } catch (error) {
        console.log(error);
      }
    };

    getInfo();
  }, []);

  const handleSubmit = async (values: IUpdate) => {
    setIsButtonEnabled(false);
    try {
      console.log(values);
      const response = await updateMe(values);
      console.log("Update success: ", response);
      window.location.reload();
    } catch (error) {
      console.log(error);
      setIsButtonEnabled(true);
    }
  };

  const formik = useFormik<IUpdate>({
    initialValues: {
      email: users?.email,
      fullName: users?.fullName,
      residence: users?.residence,
      phone: users?.phone,
      bio: users?.bio,
    },

    validationSchema: updateSchema,
    onSubmit: async (values) => {
      handleSubmit(values);
    },
    validateOnChange: true,
    enableReinitialize: true,
    validate: (values) => {
      if (
        !values.email ||
        !values.fullName ||
        !values.phone ||
        !values.residence
      ) {
        setIsButtonEnabled(false);
      } else {
        setIsButtonEnabled(true);
      }
    },
  });

  const handleImageDelete = async (isDelete: boolean) => {
    try {
      const response = await updatePic({ isDelete });
      console.log("Update success: ", response);
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  const handleImageEdit = async () => {
    const updateImage: IUpdateImage = {
      image: selectedFile,
      isDelete: false,
    };
    console.log(updateImage);
    try {
      const response = await updatePic(updateImage);
      console.log("Update success: ", response);
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div>
        <Header />
        <h3>This is profile page</h3>
      </div>
      <div>
        <div>
          <img
            src={users?.image ? users.image : "/default.jpg"}
            alt="Profile Pic"
            style={{ width: "200px", height: "auto" }}
          />{" "}
          <button
            onClick={() => {
              handleImageDelete(true);
            }}
          >
            Delete Image
          </button>
          <div>
            <input
              id="fileInput"
              type="file"
              style={{ display: "none" }}
              onChange={(e) => {
                const file = e.target.files && e.target.files[0];
                setSelectedFile(file);
              }}
            />
            <button
              onClick={() => document.getElementById("fileInput")?.click()}
            >
              Edit Image
            </button>
            <button
              style={selectedFile ? { display: "block" } : { display: "none" }}
              onClick={handleImageEdit}
            >
              Update
            </button>
          </div>
        </div>
        <form
          onSubmit={formik.handleSubmit}
          className="form__login"
          encType="multipart/form-data"
        >
          <div className="form-login__inputs">
            <label htmlFor="email">Email</label>
            <input
              type="text"
              name="email"
              readOnly
              onChange={(e) => {
                formik.setFieldValue("email", e.target.value);
              }}
              value={formik.values.email}
            />
            {formik.touched.email && formik.errors.email && (
              <div style={{ color: "red" }}>{formik.errors.email}</div>
            )}
          </div>

          <div className="form-login__inputs">
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              name="fullName"
              onChange={(e) => {
                formik.setFieldValue("fullName", e.target.value);
              }}
              value={formik.values.fullName}
            />
            {formik.touched.fullName && formik.errors.fullName && (
              <div style={{ color: "red" }}>{formik.errors.fullName}</div>
            )}
          </div>

          <div className="form-login__inputs">
            <label htmlFor="residence">Residence</label>
            <input
              type="text"
              name="residence"
              onChange={(e) => {
                formik.setFieldValue("residence", e.target.value);
              }}
              value={formik.values.residence}
            />
            {formik.touched.residence && formik.errors.residence && (
              <div style={{ color: "red" }}>{formik.errors.residence}</div>
            )}
          </div>

          <div className="form-login__inputs">
            <label htmlFor="phone">Phone No.</label>
            <input
              type="text"
              name="phone"
              onChange={(e) => {
                formik.setFieldValue("phone", e.target.value);
              }}
              value={formik.values.phone}
            />
            {formik.touched.phone && formik.errors.phone && (
              <div style={{ color: "red" }}>{formik.errors.phone}</div>
            )}
          </div>

          <div className="form-login__inputs">
            <label htmlFor="bio">Bio</label>
            <textarea
              name="bio"
              onChange={(e) => {
                formik.setFieldValue("bio", e.target.value);
              }}
              value={formik.values.bio}
            />
          </div>

          <div className="form__submit-button">
            <button type="submit" disabled={!formik.dirty || !isButtonEnabled}>
              {" "}
              Submit
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
