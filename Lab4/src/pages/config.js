import md5 from "blueimp-md5";

const characterUrl = () => `https://gateway.marvel.com:443/v1/public//characters`;
const comicsUrl = () => `https://gateway.marvel.com:443/v1/public//comics`;
const seriesUrl = () => `https://gateway.marvel.com:443/v1/public//series`;
  
const generateAuthUrl = (baseUrl, offset, name) => {
  const ts = new Date().getTime();
  const stringToHash =
    ts + "a5bc665fa5225d9b6d6bf37e0239763fd55d4380" + "e9e35502c36f6a5deb148234323c7d9f";
  const hash = md5(stringToHash);

  const splitBaseUrl = baseUrl.split("/");
  const getCurrentApi = splitBaseUrl[splitBaseUrl.length - 1];

  console.log("getCurrentApi", getCurrentApi);

  let url;
  if (name && name.length !== 0) {
    if (getCurrentApi === "characters") {
      url =
        baseUrl +
        "?ts=" +
        ts +
        "&apikey=" +
        "e9e35502c36f6a5deb148234323c7d9f" +
        "&hash=" +
        hash +
        "&nameStartsWith=" +
        name +
        "&offset=" +
        offset;
    } else {
      url =
        baseUrl +
        "?ts=" +
        ts +
        "&apikey=" +
        "e9e35502c36f6a5deb148234323c7d9f" +
        "&hash=" +
        hash +
        "&titleStartsWith=" +
        name +
        "&offset=" +
        offset;
    }
  } else {
    url =
      baseUrl +
      "?ts=" +
      ts +
      "&apikey=" +
      "e9e35502c36f6a5deb148234323c7d9f" +
      "&hash=" +
      hash +
      "&offset=" +
      offset;
  }

  return url;
};

const getCharacterList = (offset, name) =>
  generateAuthUrl(characterUrl(), offset, name);

const getCharacterById = (id) => generateAuthUrl(`${characterUrl()}/${id}`);

const getComicsList = (offset, name) =>
  generateAuthUrl(comicsUrl(), offset, name);

const getComicsById = (id) => generateAuthUrl(`${comicsUrl()}/${id}`);

const getSeriesList = (offset, name) =>
  generateAuthUrl(seriesUrl(), offset, name);

const getSeriesById = (id) => generateAuthUrl(`${seriesUrl()}/${id}`);

export {
  getCharacterList,
  getCharacterById,
  getComicsList,
  getComicsById,
  getSeriesList,
  getSeriesById,
};
