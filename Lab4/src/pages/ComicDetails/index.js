import React, { useEffect, useState } from "react";

import { getComicsById } from "../config";
import Button from "../../components/Button";
import Header from "../../components/Header";
import styles from "./comicDetails.module.scss";
import axios from "axios";

const GetAxios = (axiosParams, pageOffset, search) => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = async (params) => {
    try {
      setLoading(true);
      document.body.style.overflow = "hidden";
      const result = await axios.request(params);
      setResponse(result?.data?.data);
      if (pageOffset > result?.data?.data?.total) {
        setError(true);
      } else {
        setError(false);
      }
    } catch (error) {
      setError(true);
    } finally {
      document.body.style.overflow = "auto";
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(axiosParams, pageOffset);
  }, [pageOffset, search]);

  return { response, error, loading };
};

const ComicDetails = (props) => {
  const { history, match: { params }, location: { state }, } = props;

  const { response, loading, error } = GetAxios(
    {
      method: "get",
      url: getComicsById(params && params.id),
    },
    null
  );
  

  const [comicData, setcomicData] = useState(
    state && state.params ? state.params : []
  );

  useEffect(() => {
    if (error || isNaN(params && params.id)) history.replace("/404");
    if (response !== null) {
      setcomicData(response?.results[0]);
    }
  }, [response, history, comicData, error, params]);

  if (loading) {
    return (
      <div>
        <h2>Loading....</h2>
      </div>
    );
  } 
  return (
    <React.Fragment>

      <Header text={comicData.title} goBack={true} />
      {!loading && (
        <div className={styles.detailContainer}>
          <div className={styles.detailSubContainer}>
            <img
              src={`${comicData.thumbnail.path}.${comicData.thumbnail.extension}`}
              alt="img"
              className={styles.imgStyle}
            />
            <div style={{ marginTop: "20px" }}>
              <h1 className={styles.titleStyle}>{comicData.title}</h1>
              <div className={styles.rowStyle}>
                <h1>
                  Introduction :{" "}
                  <span>
                    {" "}
                    {comicData.description
                      ? comicData.description
                      : "No description is available"}
                  </span>
                </h1>
              </div>
              <div className={styles.rowStyle}>
                <h1>
                  Characters  :{" "}
                  <div className={styles.listElement}>
                    {(comicData.characters.items).map(i => (
                    <li>
                      <a href={"../characters/".concat(i.resourceURI.substring(i.resourceURI.lastIndexOf('/')+1))}>{i.name}</a>
                    </li>
                    ))}                      
                  </div>
                </h1>
              </div>
       
            </div>
            <div
              style={{
                marginBottom: "11px",
                display: "flex",
                justifyContent: "center",
              }}>
              <Button
                isHoverBorder={true}
                text="Back"
                onClick={() => history.goBack()}
              />
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default ComicDetails;
