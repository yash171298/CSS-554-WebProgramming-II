import React, { useEffect, useState } from "react";

import Search from "../../components/SearchBar";
import Error from "../../components/Error";
import Pagination from "../../components/Pagination";
import Header from "../../components/Header";
import Card from "../../components/Card";
import { getComicsList } from "../config";
import styles from "./comics.module.scss";
import axios from "axios";

const AxiosCall = (axiosParams, pageOffset, search) => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = async (params) => {
    try {
      setLoading(true);
      const result = await axios.request(params);
      document.body.style.overflow = "hidden";
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

const callPageCount = (response) => {
  let count = Math.ceil(response?.total / response?.limit);
  return count
};

const Comics = (props) => {
  const { history, match: { params: { id }, }, } = props;
  const parsedId = parseInt(id);
  const initialPageOffset = parsedId * 20;

  const [comicsPayload, setComicsPayload] = useState([]);
  const [pageOffset, setPageOffset] = useState(initialPageOffset);
  const [pagination, setPagination] = useState(parsedId);
  const [searchText, setSearchText] = useState("");

  const { response, loading, error } = AxiosCall(
    {
      method: "get",
      url: getComicsList(!isNaN(pageOffset) ? pageOffset : -1, searchText),
    },
    !isNaN(pageOffset) ? pageOffset : -1,
    searchText
  );

  useEffect(() => {
    if (response !== null) {
      history.push(`/comics/page/${pagination}`);
      setComicsPayload(response?.results);
    }
  }, [response, pagination, history]);

  const handlePageClick = async ({ selected }) => {
    if (parsedId !== selected) {
      const calPagination = selected * 20;
      setPagination(selected);
      setPageOffset(calPagination);
    }
  };

  const handleClick = (c) => history.push(`/comics/${c.id}`, { params: c });

  const handleSearchChange = (e) => {
    setPagination(0);
    setPageOffset(0);
    setSearchText(e.target.value);
  };

  // if (loading) {
  //   return (
  //     <div>
  //       <h2>Loading....</h2>
  //     </div>
  //   );
  // } 
  return (
    <React.Fragment>
      {error ? (
        <Error />
      ) : (
        <React.Fragment>
          <Header text="COMICS" />
          <Search searchText={searchText} onChange={handleSearchChange} />
          <Pagination
            pageCount={callPageCount(response)}
            handlePageClick={handlePageClick}
            forcePagination={pagination}
          />
          {response && response.results.length === 0 ? (
            <div className={styles.notFound}>
              <h1>No result found</h1>
            </div>
          ) : (
            <React.Fragment>
              <div className={styles.comicsContainer}>
                {comicsPayload &&
                  comicsPayload.map((c) => (
                    <Card
                      onClick={() => handleClick(c)}
                      key={c.id}
                      title={c.title}
                      img={`${c.thumbnail.path}.${c.thumbnail.extension}`}
                      id={c.id}
                      lastModified={c.modified}
                    />
                  ))}
              </div>
            </React.Fragment>
          )}
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default Comics;
