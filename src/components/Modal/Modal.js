import React, { useState } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

const ModalExample = props => {
  const { className, modal, toggle, children } = props;

  return (
    <div>
      <Modal isOpen={modal} toggle={toggle} className={className}>
        <ModalBody>{children} </ModalBody>
      </Modal>
    </div>
  );
};

export default ModalExample;
