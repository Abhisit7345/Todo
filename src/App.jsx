import "./App.css";
import axios from "axios";

import { useState, useRef, useEffect } from "react";

import { Button, Modal, Form } from "react-bootstrap";

function App() {
  const [itemList, setItemList] = useState([1]);
  const itemRef = useRef("");

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  function handleAdd() {
    let curItem = [...itemList];
    curItem.push(itemRef.current.value);
    setItemList(curItem);
  }

  function handleDelete(index) {
    console.log(index);
    const leftArray = itemList.slice(0, index);
    const rightArray = itemList.slice(index + 1);
    const newArray = leftArray.concat(rightArray);
    setItemList(newArray);
  }

  const handleSubmit = async () => {
    try {
      await axios.post("/additem", { item: "homework" });
      console.log("Data inserted successfully");
    } catch (error) {
      console.error("Error inserting data:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      let data = "";

      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: "http://localhost:5000/getAllItems",
        headers: {},
        data: data,
      };

      axios
        .request(config)
        .then((response) => {
          console.log(JSON.stringify(response.data));
        })
        .catch((error) => {
          console.log(error);
        });
    };

    fetchData();
  }, []);

  return (
    <div className="main">
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add item</Modal.Title>
        </Modal.Header>
        <div className="form-modal">
          <Form>
            <Form.Group className="mb-3" controlId="formitem">
              <Form.Label>item name</Form.Label>
              <Form.Control
                type="text"
                ref={itemRef}
                placeholder="Enter item name"
              />
            </Form.Group>
          </Form>
        </div>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              handleClose();
              handleAdd();
            }}
          >
            Add
          </Button>
        </Modal.Footer>
      </Modal>

      <div className="header">
        <div>Todo</div>
        {itemList ? (
          // Render content when itemList exists
          <div>
            {itemList.map((item, index) => (
              <div key={index} className="list-item">
                <span>
                  {index} {item}
                </span>{" "}
                <span
                  onClick={() => handleDelete(index)}
                  className="material-symbols-outlined remove"
                >
                  remove
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div></div>
        )}
      </div>
      <div>
        <span
          className="material-symbols-outlined plus"
          onClick={() => {
            handleShow();
            handleSubmit();
          }}
        >
          add_circle
        </span>
      </div>
    </div>
  );
}

export default App;
