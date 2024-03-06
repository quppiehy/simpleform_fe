import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import * as SwalMsgs from "./Utils/SwalMsgs";
import axios from "axios";

function App() {
  const [fieldValues, setFieldValues] = useState({});
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  const handleChange = (fieldName, value) => {
    setFieldValues((prevValues) => ({
      ...prevValues,
      [fieldName]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newFieldErrors = {};
    Object.keys(fieldValues).forEach((fieldName) => {
      if (typeof fieldValues[fieldName] === "string") {
        if (fieldValues[fieldName].trim() === "") {
          newFieldErrors[fieldName] = true;
        }
      }
    });

    if (newFieldErrors && newFieldErrors.length > 0) {
      Swal.fire(SwalMsgs.missingFormInfoGentle);
    } else {
      const newEntry = { fieldValues: fieldValues };

      try {
        const addedEntry = await axios.put(
          `${BACKEND_URL}/submit/`,
          newEntry
          // {
          //   headers: {
          //     Authorization: `Bearer ${currUser.accessToken}`,
          //   },
          // }
        );
        const newObject = addedEntry.data;

        console.log("Added Entry: ", newObject);

        Swal.fire(SwalMsgs.successPosting);
      } catch (error) {
        Swal.fire(SwalMsgs.errorPosting);
      }
    }
  };

  useEffect(() => {
    console.log("Name: ", fieldValues.name);
  }, [fieldValues.name]);

  useEffect(() => {
    console.log("Message :", fieldValues.message);
  }, [fieldValues.message]);

  return (
    <div className="App">
      <header className="App-header">
        <div>
          <h2>Simple Form</h2>
          <p>Please enter your name, message and submit.</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div>
            <label>
              Input Name:{" "}
              <input
                type="text"
                value={fieldValues.name}
                onChange={(e) => handleChange("name", e.target.value)}
              />
            </label>
          </div>
          <div>
            <label>
              Input Message:{" "}
              <input
                type="message"
                value={fieldValues.message}
                onChange={(e) => handleChange("message", e.target.value)}
              />
            </label>
          </div>
          <input type="submit" value="Submit" />
        </form>
      </header>
    </div>
  );
}

export default App;
