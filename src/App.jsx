import "./App.css";
import axios from "axios";

import { useState, useRef, useEffect } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faPenToSquare,
  faCheck,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

import { Button, Modal, Form } from "react-bootstrap";

function App() {
  const [itemList, setItemList] = useState([]);
  const itemRef = useRef("");

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [categoryShow, setCategoryShow] = useState(false);
  const handleCategoryClose = () => setCategoryShow(false);
  const handleCategoryShow = () => setCategoryShow(true);

  const [editIndex, setEditIndex] = useState(-1);
  const [textChange, setTextChange] = useState("");
  const [currentCategory, setCurrentCategory] = useState();
  const newCategoryRef = useRef("");

  async function handleDelete(itemId, categoryName) {
    console.log(itemId,categoryName)
    console.log(itemList)
    let obj = { ...itemList };
    let objList = obj[categoryName];
    let arrayIndex = 0;
    for (let i = 0; i < objList.length; i++) {
      if (objList[i].id == itemId) {
        arrayIndex = i;
      }
    }
    console.log(objList,arrayIndex)
    const leftArray = objList.slice(0, arrayIndex);
    const rightArray = objList.slice(arrayIndex + 1);
    const newArray = leftArray.concat(rightArray);
    obj[categoryName] = newArray;
    //if (newArray.length == 0) {
    //  delete obj[category];
    //}
    setItemList(obj);

    let data = "";

    let config = {
      method: "delete",
      maxBodyLength: Infinity,
      url: `http://localhost:5000/deleteItem/${itemId}`,
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
  }

  const handleSubmit = async (itemName, category) => {
    let data = JSON.stringify({
      item: itemName,
      category: category,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "http://localhost:5000/additem",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        let curItem = { ...itemList };
        curItem[currentCategory].push({
          item: itemName,
          id: response.data.itemId,
          category: category,
        });
        setItemList(curItem);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  function handleEditConfirm(itemId, categoryIndex, itemIndex) {
    let data = JSON.stringify({
      newItem: textChange,
    });

    let config = {
      method: "put",
      maxBodyLength: Infinity,
      url: `http://localhost:5000/updateItem/${itemId}`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        setEditIndex(-1);
        const newList = { ...itemList };
        newList[categoryIndex][itemIndex].item = textChange;
        setItemList(newList);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function handleEditClick(index, categoryName, itemIndex) {
    console.log(itemList[categoryName])
    setEditIndex(index);
    setTextChange(itemList[categoryName][itemIndex].item);
  }

  function handleReturnDefault() {
    setEditIndex(-1);
  }

  function handleAddCategory() {
    let obj = { ...itemList };
    obj[newCategoryRef.current.value] = [];
    setItemList(obj);
  }

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
          const obj = {};
          for (let i = 0; i < response.data.length; i++) {
            const category = response.data[i].category;
            if (category in obj) {
              obj[category].push(response.data[i]);
            } else {
              obj[category] = [response.data[i]];
            }
          }
          console.log(obj);
          setItemList(obj);
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
          <Modal.Title>Add item for {currentCategory}</Modal.Title>
        </Modal.Header>
        <div className="form-modal">
          <Form autoComplete="off">
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
              handleSubmit(itemRef.current.value, currentCategory);
            }}
          >
            Add
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={categoryShow} onHide={handleCategoryClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add new category</Modal.Title>
        </Modal.Header>
        <div className="form-modal">
          <Form autoComplete="off">
            <Form.Group className="mb-3" controlId="formitem">
              <Form.Label>category name</Form.Label>
              <Form.Control
                type="text"
                ref={newCategoryRef}
                placeholder="Enter category name"
              />
            </Form.Group>
          </Form>
        </div>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleCategoryClose}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              handleCategoryClose();
              handleAddCategory();
            }}
          >
            Add
          </Button>
        </Modal.Footer>
      </Modal>

      <div className="header">
        <div style={{ fontSize: "70px" }}>Todo List</div>
        {Object.keys(itemList).length > 0 ? (
          <div>
            {Object.keys(itemList).map((categoryName, categoryIndex) => (
              <div key={categoryIndex} className="category-item">
                <div className="category-name">{categoryName}</div>

                {itemList[categoryName].map((item, itemIndex) => (
                  <div key={item.id} className="list-item">
                    {editIndex !== item.id ? (
                      <div className="d-flex justify-content-between px-5">
                        <div>{item.id}{item.item}</div>
                        <div className="d-flex">
                          <div
                            onClick={() => handleDelete(item.id, categoryName)}
                            className="trash"
                          >
                            <FontAwesomeIcon icon={faTrash} size="xs" />
                          </div>
                          <div
                            onClick={() => handleEditClick(item.id, categoryName, itemIndex)}
                            className="edit"
                          >
                            <FontAwesomeIcon icon={faPenToSquare} size="xs" />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <Form autoComplete="off">
                          <Form.Group
                            className="mb-3"
                            controlId="formBasicEmail"
                          >
                            <Form.Control
                              type="text"
                              defaultValue={textChange}
                              onChange={(e) => {
                                setTextChange(e.target.value);
                              }}
                            />
                          </Form.Group>
                        </Form>
                        <div className="d-flex justify-content-center">
                          <div onClick={() => handleEditConfirm(item.id, categoryName, itemIndex)} className="confirm">
                            {" "}
                            <FontAwesomeIcon icon={faCheck} />
                          </div>
                          <div onClick={handleReturnDefault} className="cross">
                            {" "}
                            <FontAwesomeIcon icon={faXmark} />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                <span
                  className="material-symbols-outlined plus"
                  onClick={() => {
                    handleShow();
                    setCurrentCategory(categoryName);
                  }}
                >
                  add_circle
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div>No items.. go find something to do</div>
        )}
        <div>
          <Button variant="secondary" onClick={handleCategoryShow}>
            Add Category
          </Button>{" "}
        </div>
      </div>
    </div>
  );
}

export default App;
