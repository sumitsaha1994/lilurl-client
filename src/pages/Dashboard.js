import React, { useEffect, useState } from "react";
import { useHistory, Link } from "react-router-dom";
import NavBar from "../components/NavBar";
import { Button, Form, Row, Col, Container, Modal } from "react-bootstrap";
import SubmitButton from "../components/SubmitButton";
import Chart from "chart.js";
import moment from "moment";
import { Line } from "react-chartjs-2";
import Loader from "../components/Loader";

const Dashboard = (props) => {
    const history = useHistory();
    const [showDashboard, setShowDashboard] = useState(false);
    const [isLoadFailed, setIsLoadFailed] = useState(false);
    const [urlState, setUrlState] = useState({ url: "", alias: "" });
    const [error, setError] = useState("");
    const [shortUrl, setShortUrl] = useState("");
    const [chartData1, setChartData1] = useState({});
    const [chartData2, setChartData2] = useState({});
    const [chartState, setChartState] = useState({ loading: false, error: false });
    const [modalShow, setModalShow] = useState(false);
    const styles = {
        urlFormDiv: {
            backgroundColor: "#bff7ff",
            paddingBottom: "5px",
        },
        urlForm: {
            width: "22rem",
            margin: "auto",
            paddingTop: "10px",
        },
        urlBox: { margin: "0" },
    };
    useEffect(() => {
        fetch("/users/getUserActiveStatus")
            .then((res) => res.json())
            .then((data) => {
                if (data.statusCode === 200) {
                    if (!data.message.active) {
                        history.push("/user/activateAccount");
                    } else {
                        setShowDashboard(true);
                    }
                } else {
                    throw new Error();
                }
            })
            .catch((error) => {
                setIsLoadFailed(false);
            });
    }, []);
    const chart = () => {
        setChartState({ ...chartState, loading: true, error: false });
        const months = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ];
        fetch("/url/getUrlCountLastFiveMonths")
            .then((res) => res.json())
            .then((data) => {
                if (data.statusCode === 200) {
                    // const urlCounts = data.message.urlCounts.sort((a, b) => a.month - b.month);
                    const urlCounts = data.message.urlCounts.reverse();
                    setChartData1({
                        labels: urlCounts.map((obj) => months[obj.month - 1]),
                        datasets: [
                            {
                                label: "URL count",
                                data: urlCounts.map((obj) => obj.count),
                                backgroundColor: ["rgba(54, 162, 235, 0.5)"],
                                borderWidth: 1,
                            },
                        ],
                    });
                    setChartState({ ...chartState, loading: false, error: false });
                } else if (data.statusCode === 401) {
                    history.push("/user/login");
                } else {
                    throw new Error();
                }
            })
            .catch((error) => {
                setChartState({ ...chartState, loading: false, error: true });
            });

        fetch("/url/getUrlCountLastSevenDays")
            .then((res) => res.json())
            .then((data) => {
                if (data.statusCode === 200) {
                    // const urlCounts = data.message.urlCounts.sort((a, b) => a.month - b.month);
                    const urlCounts = data.message.urlCounts.reverse();
                    setChartData2({
                        labels: urlCounts.map((obj) => obj.day),
                        datasets: [
                            {
                                label: "URL count",
                                data: urlCounts.map((obj) => obj.count),
                                backgroundColor: ["rgba(51, 222, 111, 0.5)"],
                                borderWidth: 1,
                            },
                        ],
                    });
                    setChartState({ ...chartState, loading: false, error: false });
                } else if (data.statusCode === 401) {
                    history.push("/user/login");
                } else {
                    throw new Error();
                }
            })
            .catch((error) => {
                setChartState({ ...chartState, loading: false, error: true });
            });
    };

    useEffect(() => {
        chart();
    }, []);

    const handleInputChange = (e) => {
        setUrlState({ ...urlState, [e.target.name]: e.target.value });
    };
    const handleUrlSubmit = (e) => {
        e.preventDefault();
        setError("");
        setShortUrl("");
        setModalShow(false);
        fetch("/url/addUrl", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(urlState),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.statusCode === 200) {
                    setShortUrl(data.message.addUrl.short_url);
                    setModalShow(true);
                } else if (data.statusCode === 401) {
                    history.push("/user/login");
                } else if (data.statusCode === 400) {
                    setError(data.message.addUrl);
                } else {
                    throw new Error();
                }
            })
            .catch((error) => {
                setError("something went wrong. Please try again");
            });
    };

    const handleModalClose = () => {
        setModalShow(false);
    };
    return (
        <>
            {showDashboard ? (
                <>
                    <div style={styles.urlFormDiv}>
                        <Form onSubmit={handleUrlSubmit} style={styles.urlForm}>
                            {/* <inputserchbox type="text" style={styles.serchbox} placeholder="Enter url" /> */}
                            <h5>Enter a long URL to make little</h5>

                            <Form.Group controlId="email" style={{ width: "100%" }}>
                                <Form.Control
                                    type="text"
                                    name="url"
                                    value={urlState.url}
                                    placeholder="Enter url"
                                    onChange={handleInputChange}
                                />
                            </Form.Group>

                            <Form.Group
                                controlId="alias"
                                style={{ width: "80%", marginLeft: "auto", marginRight: "auto" }}
                            >
                                <Form.Text className="text-default">
                                    You can add an optional alias for your short url
                                </Form.Text>
                                <Form.Control
                                    type="text"
                                    name="alias"
                                    value={urlState.alias}
                                    placeholder="Enter custom alias"
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                            <SubmitButton buttonText="Make it short" />
                        </Form>
                        <Form.Text className="text-danger">{error}</Form.Text>
                        {/* <p>{JSON.stringify(props)}</p> */}
                        <Modal show={modalShow} onHide={handleModalClose}>
                            <Modal.Header closeButton>
                                <Modal.Title>Your little url</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                This is your short url <a href={`/${shortUrl}`}>{shortUrl}</a>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleModalClose}>
                                    Close
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    </div>
                    {chartState.loading ? (
                        <Loader size="sm" />
                    ) : chartState.error ? (
                        <h5>Error loading charts</h5>
                    ) : (
                        <div className="mt-2">
                            <Row style={{ margin: "auto" }}>
                                <Col xs={12} sm={12} md={6}>
                                    {/* <canvas id="myChart" width="400" height="400"></canvas> */}
                                    <h6>Urls created in last five months</h6>
                                    <Line
                                        data={chartData1}
                                        options={{
                                            responsive: true,
                                            scales: {
                                                yAxes: [
                                                    {
                                                        ticks: {
                                                            beginAtZero: true,
                                                        },
                                                    },
                                                ],
                                            },
                                        }}
                                    />
                                </Col>
                                <Col xs={12} sm={12} md={6}>
                                    <h6>Urls created in last seven days</h6>
                                    <Line
                                        data={chartData2}
                                        options={{
                                            scales: {
                                                yAxes: [
                                                    {
                                                        ticks: {
                                                            beginAtZero: true,
                                                        },
                                                    },
                                                ],
                                            },
                                        }}
                                    />
                                </Col>
                            </Row>
                        </div>
                    )}
                </>
            ) : (
                isLoadFailed && (
                    <p>
                        Something went wrong. Please try to <Link to="/user/login">Login</Link>{" "}
                        again.
                    </p>
                )
            )}
        </>
    );
};

export default Dashboard;
