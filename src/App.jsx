import logo from './logo.svg';
import './App.css';

import { useState,useRef } from 'react';

import { Button, Modal, Form } from 'react-bootstrap'

function App() {
  const [itemList, setItemList] = useState([1]);
  const itemRef = useRef("")

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  function handleAdd() {
    let curItem = [...itemList];
    curItem.push(itemRef.current.value);
    setItemList(curItem)
  }

  function handleDelete(index) {
    console.log(index)
    const leftArray = itemList.slice(0, index)
    const rightArray = itemList.slice(index + 1)
    const newArray = leftArray.concat(rightArray)
    setItemList(newArray)
  }

  return (
    <div className='main'>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add item</Modal.Title>
        </Modal.Header>
        <div className='form-modal'>
        <Form>
          <Form.Group className="mb-3" controlId="formitem">
            <Form.Label>item name</Form.Label>
            <Form.Control type="text" ref={itemRef} placeholder="Enter item name" />
          </Form.Group>
        </Form>
        </div>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={()=>{handleClose();handleAdd()}}>
            Add
          </Button>
        </Modal.Footer>
      </Modal>

      <div className="header">
        <div>
          Todo
        </div>
        {itemList ? (
          // Render content when itemList exists
          <div>
            {itemList.map((item, index) => (
              <div key={index} className="list-item"><span>{index} {item}</span> <span onClick={() => handleDelete(index)} className="material-symbols-outlined remove">
                remove
              </span></div>
            ))}
          </div>
        ) : (
          <div></div>
        )}
      </div>
      <div>
        <span className="material-symbols-outlined plus" onClick={() => { handleShow(); }}>
          add_circle
        </span>
      </div>
    </div>
  );
}

export default App;
