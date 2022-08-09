import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Input, Modal, ModalBody, ModalHeader } from "reactstrap";
export const BoardModal = (props) => {
  const { closeModal, action, visible } = props;
  const [boardTitle, setBoardTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const user_info = localStorage.getItem("user_info");
  const isEmptyText = (text) => !text || !text.trim();

  const handleCreateBoard = async (event) => {
    setLoading(true);
    event.preventDefault();
    if (isEmptyText(boardTitle)) {
      return;
    }
    await action({
      boardName: boardTitle,
      manager_Id: JSON.parse(user_info).accountId,
    });
    setBoardTitle("");
    setLoading(false);
  };

  return (
    <Modal
      isOpen={visible}
      toggle={closeModal}
      className=""
      size="lg"
      style={{ maxWidth: "400px", width: "40%", paddingTop: "15rem" }}
    >
      <ModalHeader className="bg-primary" toggle={closeModal}>
        Tạo bảng công việc mới
      </ModalHeader>
      <ModalBody>
        <form className="w-100" onSubmit={(event) => handleCreateBoard(event)}>
          <Input
            className="mb-3"
            placeholder="Tên bảng"
            onChange={(event) => setBoardTitle(event.target.value)}
            value={boardTitle}
          />
          <Button
            color="primary"
            onClick={(event) => handleCreateBoard(event)}
            loading={loading}
            disabled={isEmptyText(boardTitle)}
          >
            Tạo
          </Button>
        </form>
      </ModalBody>
    </Modal>
  );
};

BoardModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  action: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
};
