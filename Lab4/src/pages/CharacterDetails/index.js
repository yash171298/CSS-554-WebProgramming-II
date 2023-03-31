import React, { useEffect, useState } from "react";
import axios from "axios";
import Button from "../../components/Button";
import Header from "../../components/Header";
import styles from "./characterDetails.module.scss";
import { getCharacterById } from "../config";
import { Card } from "@material-ui/core";


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


const CharacterDetails = (props) => {
  const { history, match: { params }, location: { state } } = props;

  const { response, loading, error } = GetAxios(
    {
      method: "get",
      url: getCharacterById(params && params.id),
    },
    null
  );

  const [characterData, setcharacterData] = useState(
    state && state.params ? state.params : []
  );

  useEffect(() => {
    if (error || isNaN(params && params.id)) history.replace("/404");
    if (response !== null) {
      setcharacterData(response?.results[0]);
    }
  }, [response, history, characterData, error, params]);
  console.log(characterData)

  if (loading) {
    return (
      <div>
        <h2>Loading....</h2>
      </div>
    );
  } 
  return (
    <React.Fragment>
      <Header text={characterData.name} goBack={true} />
      {!loading && (
        <div className={styles.detailContainer}>
          <div className={styles.detailSubContainer}>
            <div style={{ marginTop: "20px" }}>
              <h1 className={styles.titleStyle}>{characterData.name}</h1>
              <img
                src={`${characterData.thumbnail.path}.${characterData.thumbnail.extension}`}
                alt="img"
                className={styles.imgStyle}
              />
              <div className={styles.rowStyle}>
                <h1>
                  Introduction :{" "}
                  <span>
                    {" "}
                    {characterData.description
                      ? characterData.description
                      : "No description is available"}
                  </span>
                </h1>
              </div>
              <div className={styles.rowStyle}>
                <h1>
                  Appeared in Comics :{" "}
                  <div className={styles.listElement}>
                    {(characterData.comics.items).map(i => (
                      <li>
                      <a href={"../comics/".concat(i.resourceURI.substring(i.resourceURI.lastIndexOf('/')+1))}>{i.name}</a>
                      </li>
                    ))}                      
                  </div>
                </h1>
              </div>
              <div className={styles.rowStyle}>
                <h1>
                  Appeared in Series :{" "}
                    <div className={styles.listElement}>
                      {(characterData.series.items).map(i => (
                        <li>
                         <a href={"../series/".concat(i.resourceURI.substring(i.resourceURI.lastIndexOf('/')+1))}>{i.name}</a>
                        </li>
                      ))}                      
                    </div>
                </h1>
              </div>
            </div>
            <div
              style={{
                marginBottom: "15px",
                display: "flex",
                justifyContent: "center",
              }}
            >
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

export default CharacterDetails;
