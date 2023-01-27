import React from "react";
import { loggedContext } from "../App";
import { useContext } from "react";
import { useParams } from "react-router-dom";
import { useFormik } from "formik";
import swal from "sweetalert";
import { useNavigate } from "react-router-dom";

export default function UserEdit({ logout }) {
  const navigate = useNavigate();

  const logged = useContext(loggedContext);
  const { id } = useParams();
  const [editMsg, setEditMsg] = React.useState("");
  const [userData, setUserData] = React.useState({});
  const [profileDesc, setProfileDesc] = React.useState("");

  React.useEffect(() => {
    fetch(`http://localhost:5000/getuser/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setUserData(data);
      });
  }, [id]);

  //eslint-disable-next-line
  const formik = useFormik({
    initialValues: {
      image: "",
      username: "",
      email: "",
      password: "",
      profileDesc: profileDesc,
    },
    onSubmit: (values) => {
      if (
        (values.username.length > 0 &&
          values.username.match(/^ *$/) !== null) ||
        (values.email.length > 0 && values.email.match(/^ *$/) !== null) ||
        (values.password.length > 0 &&
          values.password.match(/^ *$/) !== null) ||
        (values.image.length > 0 && values.image.match(/^ *$/) !== null) ||
        (values.profileDesc.length > 0 &&
          values.profileDesc.match(/^ *$/) !== null)
      ) {
        swal({ icon: "error", text: "You can't use only spaces" });
      } else {
        fetch(`http://localhost:5000/updateuser/${id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username:
              values.username === "" ||
              values.username.replace(/\s/g, "").length === 0
                ? userData.username
                : values.username,
            email:
              values.email === "" ||
              values.email.replace(/\s/g, "").length === 0
                ? userData.email
                : values.email,
            password:
              values.password === "" ||
              values.password.replace(/\s/g, "").length === 0
                ? userData.password
                : values.password,
            image:
              values.image === "" ||
              values.image.replace(/\s/g, "").length === 0
                ? userData.image
                : values.image,
            profileDesc:
              profileDesc === "" ? userData.profileDesc : profileDesc,
          }),
        }).then((res) => {
          if (res.status === 200) {
            swal({ icon: "success", text: "User edited" });
            navigate(`/users/${id}/details`);
          } else {
            setEditMsg("User edit failed");
          }
        });
        formik.resetForm();
      }
    },
  });

  if (logged && (logged._id === id || logged.type === "admin")) {
    return (
      <div>
        <form onSubmit={formik.handleSubmit}>
          <div className="px-6 mt-10">
            <div className="flex flex-wrap justify-center">
              <div className="relative max-w-md mx-auto md:max-w-2xl mt-6 min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded-xl mt-16">
                <div className="w-full flex justify-center">
                  <div className="relative -ml-3">
                    <img
                      alt="..."
                      src={userData.image}
                      className="shadow-xl rounded-full align-middle border-none absolute -m-16 lg:-ml-16 max-w-[150px]"
                    />
                  </div>
                </div>
                <div className="w-full text-center mt-24">
                  <div className="text-center mt-2">
                    <h3 className="text-2xl text-slate-700 font-bold leading-normal mb-1 ml-2">
                      <input
                        className="text-center mt-2 border-2 border-gray-300 bg-white h-10 px-5 rounded-lg text-sm focus:outline-none"
                        type="text"
                        name="image"
                        onChange={formik.handleChange}
                        value={formik.values.image}
                        placeholder={userData.image}
                      />
                    </h3>
                  </div>
                  <div className="text-center mt-2">
                    <h3 className="text-2xl text-slate-700 font-bold leading-normal mb-1 ml-2">
                      <input
                        className="text-center mt-2 border-2 border-gray-300 bg-white h-10 px-5 rounded-lg text-sm focus:outline-none"
                        type="text"
                        name="username"
                        onChange={formik.handleChange}
                        value={formik.values.username}
                        placeholder={userData.username}
                      />
                    </h3>
                  </div>
                  <div className="text-center mt-2">
                    <h3 className="text-2xl text-slate-700 font-bold leading-normal mb-1 ml-2">
                      <input
                        className="text-center mt-2 border-2 border-gray-300 bg-white h-10 px-5 rounded-lg text-sm focus:outline-none"
                        type="email"
                        name="email"
                        onChange={formik.handleChange}
                        value={formik.values.email}
                        placeholder={userData.email}
                      />
                    </h3>
                  </div>
                  <div className="mt-6 py-6 border-t border-slate-200 text-center">
                    <div className="flex flex-wrap justify-center">
                      <div className="w-full px-4">
                        <p className="font-light leading-relaxed text-slate-600">
                          <textarea
                            className="text-center w-[500px]  h-[90px] ml-2 mt-2 border-2 border-gray-300 bg-white h-10 px-5 rounded-lg text-sm focus:outline-none"
                            type="text"
                            name="profileDesc"
                            onChange={(e) => {
                              setProfileDesc(e.target.value);
                            }}
                            value={profileDesc}
                            maxLength="200"
                            placeholder={userData.profileDesc}
                          />
                        </p>
                      </div>
                    </div>
                    <div>
                      <button
                        className="bg-indigo-500 mt-5 hover:bg-red-700 text-white mt-2 font-bold py-2 px-4 rounded"
                        type="submit"
                      >
                        Edit
                      </button>
                    </div>
                  </div>

                  <br />
                  <h3>{editMsg}</h3>
                </div>
              </div>
            </div>
          </div>
        </form>
        <div className="flex justify-center">
          <button
            className="bg-red-500 hover:bg-red-700 text-white mb-2 font-bold py-2 px-4 rounded"
            onClick={() => {
              swal("Are you sure you want to delete this account?", {
                buttons: {
                  cancel: "No",
                  catch: {
                    text: "Yes",
                    value: "Yes",
                  },
                },
              }).then((value) => {
                console.log(value);
                switch (value) {
                  case "Yes":
                    fetch(`http://localhost:5000/deleteuser/${id}`, {
                      method: "DELETE",
                    }).then((res) => {
                      if (res.status === 200) {
                        swal({ icon: "success", text: "User deleted" });
                        if (logged._id === id) {
                          logout();
                          navigate(`/`);
                        }
                        navigate(`/users`);
                      } else {
                        setEditMsg("User delete failed");
                      }
                    });
                    break;
                  default:
                    break;
                }
              });
            }}
          >
            Delete account
          </button>
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <h1>You are not authorized to edit this user.</h1>
      </div>
    );
  }
}
