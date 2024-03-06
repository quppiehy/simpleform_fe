// App.js

import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import * as SwalMsgs from "./Utils/SwalMsgs";
import axios from "axios";

function App() {
  const [fieldValues, setFieldValues] = useState({ name: "", message: "" });
  const [databaseData, setDatabaseData] = useState();
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Function to fetch data from endpoint
  const fetchData = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/data`);
      setDatabaseData(response.data.entries);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Function to handle input change as user types
  const handleChange = (fieldName, value) => {
    setFieldValues((prevValues) => ({
      ...prevValues,
      [fieldName]: value,
    }));
  };

  // Function to submit info when submit button is clicked
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newFieldErrors = {};
    // removes empty spaces and ensures no empty field before submitting
    Object.keys(fieldValues).forEach((fieldName) => {
      if (typeof fieldValues[fieldName] === "string") {
        if (fieldValues[fieldName].trim() === "") {
          newFieldErrors[fieldName] = true;
        }
      }
    });

    if (Object.keys(newFieldErrors).length > 0) {
      Swal.fire(SwalMsgs.missingFormInfoGentle);
    } else {
      const newEntry = { fieldValues: fieldValues };
      console.log(newEntry);
      try {
        const addedEntry = await axios.put(`${BACKEND_URL}/submit`, newEntry);
        const newObject = addedEntry.data;

        console.log("Added Entry: ", newObject);
        if (newObject) {
          fetchData();
        }

        Swal.fire(SwalMsgs.successPosting);
      } catch (error) {
        Swal.fire(SwalMsgs.errorPosting);
      }
    }
  };

  return (
    <div className="App" style={{ margin: "20px" }}>
      <header className="App-header">
        <div>
          <h2>Simple Form</h2>
          <p>Please enter your name, message and submit.</p>
        </div>
        {/* Form component */}
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
        {/* Display database.txt component */}
        <div>
          {databaseData ? (
            <div>
              <h2>Database Data:</h2>
              <div>
                {databaseData.map((entry, index) => (
                  <p key={index}>{entry}</p>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <p>There is currently no information on the database.</p>
            </div>
          )}
        </div>
      </header>
    </div>
  );
}

export default App;
