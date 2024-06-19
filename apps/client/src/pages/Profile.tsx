import Header from "../components/Header";
import { useFormik } from "formik";
import { me, updateMe, updatePic } from "../services/Auth";
import { IUpdate, IUpdateImage } from "../interfaces/Auth";
import { updateSchema } from "../schemas/authSchema";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { TextField, TextareaAutosize } from "@material-ui/core";
import { Button } from "@mui/material";
import { toast } from "react-toastify";

export default function Profile() {
  const queryClient = useQueryClient();
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>();

  const { data, error, isLoading } = useQuery({
    queryKey: ["myDetails"],
    queryFn: me,
    staleTime: 1000 * 60 * 60,
  });

  const [imageURL, setImageURL] = useState(data?.image || "/default.jpg");

  useEffect(() => {
    if (selectedFile) {
      const imgLink = URL.createObjectURL(selectedFile);
      setImageURL(imgLink);
    } else {
      setImageURL(data?.image || "/default.jpg");
    }
  }, [selectedFile, data]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const file = e.target.files && e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (values: IUpdate) => {
    setIsButtonEnabled(false);
    try {
      await updateMe(values);
      queryClient.invalidateQueries({
        queryKey: ["myDetails"],
      });
      window.location.reload();
    } catch (err) {
      toast.error("Submit Failed");
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
    } catch (err) {
      toast.error("Image Delete Failed");
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
    } catch (err) {
      toast.error("Image Update Failed");
    }
  };

  const getButtons = () => {
    if (selectedFile) {
      return (
        <button onClick={handleImageEdit} className="updateBtn">
          Update Image
        </button>
      );
    } else {
      return (
        <button
          onClick={() => document.getElementById("fileInput")?.click()}
          className="editBtn"
        >
          Edit Image
        </button>
      );
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
      <Header />
      <div className="after__header">
        <div className="profile__container">
          <div className="profile__img">
            <input
              id="fileInput"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            {getButtons()}
            <div className="image__container">
              <img src={imageURL} alt="Profile Pic" />{" "}
            </div>
            <button
              onClick={() => {
                handleImageDelete(true);
              }}
              className="deleteBtn"
            >
              Delete Image
            </button>
            <div></div>
          </div>
          <form
            onSubmit={formik.handleSubmit}
            className="form__login"
            encType="multipart/form-data"
          >
            <div className="signup__formData">
              <div className="signup__element">
                <TextField
                  name="email"
                  fullWidth
                  label="Email"
                  variant="outlined"
                  value={formik.values.email}
                  onChange={(e) => {
                    formik.setFieldValue("email", e.target.value);
                  }}
                />

                {formik.touched.email && formik.errors.email && (
                  <div className="error">{formik.errors.email}</div>
                )}
              </div>
              <div className="signup__element">
                <TextField
                  name="fullName"
                  fullWidth
                  label="Full Name"
                  variant="outlined"
                  value={formik.values.fullName}
                  onChange={(e) => {
                    formik.setFieldValue("fullName", e.target.value);
                  }}
                />
                {formik.touched.fullName && formik.errors.fullName && (
                  <div className="error">{formik.errors.fullName}</div>
                )}
              </div>
            </div>

            <div className="signup__formData">
              <div className="signup__element">
                <TextField
                  name="phone"
                  fullWidth
                  label="Phone No."
                  variant="outlined"
                  value={formik.values.phone}
                  onChange={(e) => {
                    formik.setFieldValue("phone", e.target.value);
                  }}
                />
                {formik.touched.phone && formik.errors.phone && (
                  <div className="error">{formik.errors.phone}</div>
                )}
              </div>
              <div className="signup__element">
                <TextField
                  name="residence"
                  fullWidth
                  label="Residence"
                  variant="outlined"
                  value={formik.values.residence}
                  onChange={(e) => {
                    formik.setFieldValue("residence", e.target.value);
                  }}
                />
                {formik.touched.residence && formik.errors.residence && (
                  <div className="error">{formik.errors.residence}</div>
                )}
              </div>
            </div>

            <div className="signup__element">
              <TextareaAutosize
                name="bio"
                placeholder="Bio"
                onChange={(e) => {
                  formik.setFieldValue("bio", e.target.value);
                }}
                minRows={4}
                value={formik.values.bio}
                className="signup__bio"
              />
            </div>

            <div className="submit__btn">
              <Button
                disabled={!formik.dirty || !isButtonEnabled}
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                id="loginBtn"
                style={
                  isButtonEnabled
                    ? { backgroundColor: "#1976d2" }
                    : { backgroundColor: "" }
                }
              >
                Submit
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
