import React, { useState, useEffect } from "react";
import { Tabs, Tab, ListGroup, Button } from "react-bootstrap";
import Loader from "../components/Loader";
// import { ViewIcon } from "../components/Icons";
import Dialog from "../components/Dialog";
import API_URL from "../api";

const LinksDirectory = (props) => {
    // const { user } = props;
    const [key, setKey] = useState("getAllUrls");

    const [showDialog, setShowDialog] = useState(false);
    const [dialogText, setDialogText] = useState("");

    const [urlState, setUrlState] = useState({ loading: true, getAllUrls: [], getAliasUrls: [] });
    const handleTabSelect = (k) => {
        setKey(k);
        console.log(urlState);
        setUrlState({ ...urlState, loading: true });
        fetch(`${API_URL}/url/${k}`, {
            method: "GET",
            credentials: "include",
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.statusCode === 200) {
                    setUrlState({ ...urlState, [k]: data.message.urls, loading: false });
                    console.log(data.message.urls);
                } else {
                    setUrlState({ ...urlState, loading: false });
                }
            });
    };

    const handleDelailsOpen = (id, type) => {
        if (type === "getAllUrls") {
            setDialogText(urlState.getAllUrls.find((url) => url.id === id));
        } else {
            setDialogText(urlState.getAliasUrls.find((url) => url.id === id));
        }

        setShowDialog(true);
    };

    useEffect(() => {
        handleTabSelect(key);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <Tabs
                id="controlled-tab-example"
                activeKey={key}
                onSelect={handleTabSelect}
                style={{ textAlign: "center", width: "20rem", margin: "auto" }}
            >
                <Tab eventKey="getAllUrls" title="All urls">
                    <ListGroup variant="flush" style={{ textAlign: "left" }}>
                        {urlState.loading ? (
                            <Loader size="sm" />
                        ) : urlState.getAllUrls.length ? (
                            urlState.getAllUrls.map((url) => (
                                <ListGroup.Item key={url.id} style={{ display: "flex" }}>
                                    <a
                                        href={`https://${window.location.hostname}/${url.short_url}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mr-auto"
                                    >
                                        {`https://${window.location.hostname}/${url.short_url}`}
                                    </a>
                                    <Button onClick={() => handleDelailsOpen(url.id, key)}>
                                        Details
                                    </Button>
                                </ListGroup.Item>
                            ))
                        ) : (
                            <p>No urls to display</p>
                        )}
                    </ListGroup>
                </Tab>
                <Tab eventKey="getAliasUrls" title="Your alias urls">
                    <ListGroup variant="flush" style={{ textAlign: "left" }}>
                        {urlState.loading ? (
                            <Loader size="sm" />
                        ) : urlState.getAliasUrls.length ? (
                            urlState.getAliasUrls.map((url) => (
                                <ListGroup.Item key={url.id} style={{ display: "flex" }}>
                                    <a
                                        href={`https://${window.location.hostname}/${url.short_url}`}
                                        className="mr-auto"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >{`https://${window.location.hostname}/${url.short_url}`}</a>
                                    <Button onClick={() => handleDelailsOpen(url.id, key)}>
                                        Details
                                    </Button>
                                </ListGroup.Item>
                            ))
                        ) : (
                            <p>No urls to display</p>
                        )}
                    </ListGroup>
                </Tab>
            </Tabs>
            <Dialog text={dialogText} show={showDialog} setShow={setShowDialog} />
        </>
    );
};

export default LinksDirectory;
