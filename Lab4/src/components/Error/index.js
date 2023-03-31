import React from "react";
import { useHistory } from "react-router-dom";

import Button from "../Button";
import style from "./error.module.scss";

function Error() {
  const history = useHistory();
  return (
    <React.Fragment>
      <div className={style.errorContainer}>
        <h1>Error requested data not found in Marvel API</h1>
        <p>404 Error</p>
        <Button text="Go Home" onClick={() => history.replace("/")} />
      </div>
    </React.Fragment>
  );
}

export default Error;
