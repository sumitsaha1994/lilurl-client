import React, { useState } from "react";
import { Modal, Button, Col, Row, Container } from "react-bootstrap";
import moment from "moment";

const Dialog = ({ text, show, setShow }) => {
    const handleClose = () => setShow(false);

    return (
        <>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Url details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container>
                        <Row className="mb-3">
                            <Col xs={6} md={4}>
                                <strong>Main-URL</strong>
                            </Col>
                            <Col xs={12} md={8}>
                                <small>{text.main_url}</small>
                            </Col>
                        </Row>
                        <Row className="mb-3">
                            <Col xs={6} md={4}>
                                <strong>Short-URL</strong>
                            </Col>
                            <Col xs={12} md={8}>
                                <small>{`https://${window.location.hostname}/${text.short_url}`}</small>
                            </Col>
                        </Row>
                        <Row className="mb-3">
                            <Col xs={6} md={4}>
                                <strong>Created at</strong>
                            </Col>
                            <Col xs={12} md={8}>
                                <small>
                                    {moment(text.created_at).format("DD-MM-YYYY hh:mm:ss")}
                                </small>
                            </Col>
                        </Row>
                        <Row className="mb-3">
                            <Col xs={6} md={4}>
                                <strong>Click count</strong>
                            </Col>
                            <Col xs={12} md={8}>
                                <small>{text.click_count}</small>
                            </Col>
                        </Row>
                    </Container>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default Dialog;
