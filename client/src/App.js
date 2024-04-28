import React, { useState, useEffect } from "react";
import Table from "./Components/Table";
import { Button, ButtonGroup, TextField } from "@mui/material";

const App = () => {
  const [data, setData] = useState([]);
  const [count, setCount] = useState({ add: 0, update: 0 });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    fetch("/api/users/")
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error("Error fetching data:", error));
    fetch("/api/count")
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        setCount({ ...count, add: data.add, update: data.update });
      });
  };

  const handleAdd = () => {
    if (!document.getElementById("userdata").value) {
      alert("Please enter data");
      return;
    }

    fetch("/api/users/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: document.getElementById("userdata").value,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        fetchData();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleUpdate = () => {
    if (
      !document.getElementById("id").value ||
      !document.getElementById("userdata").value
    ) {
      return;
    }
    fetch(`/api/users/${document.getElementById("id").value}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: document.getElementById("userdata").value,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        fetchData();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    setCount({ ...count, update: count.update + 1 });
  };

  return (
    <div style={{ marginLeft: 40 }}>
      <div style={Styles.container}>
        <TextField
          id="userdata"
          label="Input..."
          variant="outlined"
          style={{ marginRight: 20 }}
        />
        <Button
          variant="contained"
          onClick={handleAdd}
          style={{ marginRight: 20 }}
        >
          Add
        </Button>
        <TextField
          id="id"
          label="Id to update"
          variant="outlined"
          style={{ marginRight: 20 }}
        />
        <Button variant="contained" onClick={handleUpdate}>
          Update
        </Button>
      </div>
      <Button variant="contained" style={{ marginRight: 20 }}>
        Add count : {count.add}
      </Button>
      <Button variant="contained">Update count : {count.update}</Button>
      <br />
      <br />
      <Table data={data} />
    </div>
  );
};

const Styles = {
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 20,
    paddingRight: 20,
  },
};

export default App;
