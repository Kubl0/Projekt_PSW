import React from "react";
import { loggedContext } from "../App";
import { useContext } from "react";
import { useParams } from "react-router-dom";
import swal from "sweetalert";

export default function CommentList({ comments }) {
  const logged = useContext(loggedContext);

  const { id } = useParams();
  if (!comments) return <p>Loading...</p>;
  return (
    <div key={Math.random()}>
      {comments.map((comment) => (
        <div className="border rounded-md p-3 ml-3 my-3" key={comment._id}>
          <div key={Math.random()}>
            <div className="flex gap-3 items-center">
              <h3 className="font-bold">{comment.name}</h3>
            </div>

            <p className="text-gray-600 mt-2 flex flex-row">
              {comment.comment}
            </p>
            {id === logged._id ||
            logged.type === "admin" ||
            comment.user === logged._id ? (
              <div>
                <button
                  className="bg-red-500 text-white px-3 py-0 rounded-md text-sm font-medium h-8 mt-2"
                  onClick={() => {
                    fetch(
                      `http://localhost:5000/deleteComment/${comment._id}`,
                      {
                        method: "DELETE",
                      }
                    )
                      .then((res) => res.json())
                      .then((data) => {
                        console.log(data);
                      });
                    window.location.reload();
                  }}
                >
                  Delete
                </button>
                {logged.type === "admin" || logged._id === comment.user ? (
                  <button
                    className="bg-green-500 text-white px-3 py-0 rounded-md text-sm font-medium h-8 mt-2 ml-2"
                    onClick={() => {
                      swal({
                        title: "Edit Comment",
                        content: "input",
                        button: {
                          text: "Edit",
                          closeModal: false,
                        },
                      }).then((value) => {
                        if (value === null) {
                          swal.stopLoading();
                          swal.close();
                        } else {
                          fetch(
                            `http://localhost:5000/editComment/${comment._id}`,
                            {
                              method: "POST",
                              headers: {
                                "Content-Type": "application/json",
                              },
                              body: JSON.stringify({
                                comment: value,
                              }),
                            }
                          )
                            .then((res) => res.json())
                            .then((data) => {
                              console.log(data);
                            });
                          window.location.reload();
                        }
                      });
                    }}
                  >
                    Edit
                  </button>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}
