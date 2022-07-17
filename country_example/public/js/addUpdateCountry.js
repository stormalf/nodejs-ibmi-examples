/* eslint-disable no-loop-func */
/* eslint-disable no-undef */

const self = this;

document.addEventListener("DOMContentLoaded", () => {
  //   const submitBtn = document.getElementsById('form-submit-btn');
  const form = document.getElementById("country-form");
  const method = form.attributes.method.textContent;

  function submitHandler(event) {
    event.preventDefault();

    if (!method) {
      throw new Error("Unable to determine method");
    }

    const COUNID = document.getElementById("COUNID").value;
    const COUNDE = document.getElementById("COUNDE").value;

    const data = {
      COUNID,
      COUNDE,
    };

    if (method === "PUT") {
      axios
        .put("/api/countries/update", data)
        .then(() => {
          // passing true forces reload from the server rather than cache
          self.location = "/";
        })
        .catch((error) => {
          console.log("axios error with PUT request");
          console.error(error);
        });
    } else if (method === "POST") {
      axios
        .post("/api/countries/create", data)
        .then(() => {
          // passing true forces reload from the server rather than cache
          self.location = "/";
        })
        .catch((error) => {
          console.log("axios error with POST request");
          console.error(error);
        });
    }
  }

  form.addEventListener("submit", submitHandler);
});
