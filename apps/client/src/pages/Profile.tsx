import Header from "../components/Header";
import { useFormik } from "formik";
import { me, updateMe, updatePic } from "../services/Auth";
import { IUpdate, IUpdateImage } from "../interfaces/Auth";
import { updateSchema } from "../schemas/authSchema";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export default function Profile() {
  const queryClient = useQueryClient();
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>();

  const { data, error, isLoading } = useQuery({
    queryKey: ["myDetails"],
    queryFn: me,
    staleTime: 1000 * 60 * 60,
  });

  const handleSubmit = async (values: IUpdate) => {
    setIsButtonEnabled(false);
    try {
      await updateMe(values);
      queryClient.invalidateQueries({
        queryKey: ["myDetails"],
      });
      window.location.reload();
    } catch (error) {
      console.log(error);
      setIsButtonEnabled(true);
    }
  };

  const formik = useFormik<IUpdate>({
    initialValues: {
      email: data?.email,
      fullName: data?.fullName,
      residence: data?.residence,
      phone: data?.phone,
      bio: data?.bio,
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
      await updatePic({ isDelete });
      queryClient.invalidateQueries({
        queryKey: ["myDetails"],
      });
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

    try {
      await updatePic(updateImage);
      queryClient.invalidateQueries({
        queryKey: ["myDetails"],
      });
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading data</div>;
  }

  return (
    <>
      <div>
        <Header />
        <h3>This is profile page</h3>
      </div>
      <div>
        <div>
          <img
            src={data?.image ? data.image : "/default.jpg"}
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
