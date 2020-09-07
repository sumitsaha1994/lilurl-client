import React, { useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";

const UrlNavigation = () => {
    const { urlToken } = useParams();
    const history = useHistory();
    useEffect(() => {
        fetch(`/url/getMainUrlByShortUrl/${urlToken}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.statusCode === 200) {
                    if (data.message.mainUrl) {
                        window.location = data.message.mainUrl;
                    }
                } else {
                    history.push("/pageNotFound");
                }
            });
    });

    return <div></div>;
};

export default UrlNavigation;
