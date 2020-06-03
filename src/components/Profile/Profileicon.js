import React, { useState } from "react";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";

import ModalExample from "../Modal/Modal";
import Profile from "../Profile/Profile"

const Profileicon = ({ onRouteChange, user, loadUser}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen(prevState => !prevState);
  const [modalOpen, setModal] = useState(false);
  const toggleModal = () => setModal(prevState => !prevState);
  return (
    <div>
      <Dropdown isOpen={dropdownOpen} toggle={toggle}>
        <DropdownToggle
          tag="span"
          data-toggle="dropdown"
          aria-expanded={dropdownOpen}
        >
          <img
            src="http://tachyons.io/img/logo.jpg"
            class="br-100 h3 w3 dib"
            alt="avatar"
          />
        </DropdownToggle>
        <DropdownMenu right className="b--transparent shadow-5">
          <DropdownItem onClick={() => toggleModal()}>Profile</DropdownItem>
          <DropdownItem onClick={() => onRouteChange("signout")}>
            Sign Out
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      {modalOpen && <ModalExample modal={modalOpen} > <Profile user={user} toggle={toggleModal} loadUser={loadUser}/> </ModalExample>}
    </div>
  );
};

export default Profileicon;
