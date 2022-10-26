import {
  GridList,
  GridListTile,
  GridListTileBar,
  Typography,
} from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import YouTube from "react-youtube";
import Rating from "../../common/rating/Rating";
import "./Details.css";

const Details = (props) => {
  const [movieDetails, setMovieDetails] = useState({
    id: 0,
    poster_url: "",
    title: "",
    genres: [],
    duration: 0,
    released_date: new Date(),
    critics_rating: 0,
    story_line: "",
    wiki_url: "",
    trailer_url: "",
    artists: [],
  });

  const [movieId, setMovieId] = useState(0);

  const opts = {
    height: "390",
    width: "100%",
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
    },
  };

  useEffect(() => {
    const routes = window.location.pathname.split("/");
    setMovieId(routes[routes.length - 1]);
  }, [window.location.pathname]);

  useEffect(() => {
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch(`${props.baseUrl}movies/${movieId}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        result.released_date = new Date(result.released_date);
        setMovieDetails(result);
      })
      .catch((error) => console.log("error", error));
  }, [movieId]);

  return (
    <div>
      <div className="back-container">
        <Typography>
          <Link to={"/"}>&#60; Back to Home</Link>
        </Typography>
      </div>
      <div className="details__container">
        <div className="details__side-container">
          <img src={movieDetails.poster_url} alt="MOVIE_POSTER" />
        </div>
        <div className="details__main-container">
          <Typography variant="title" component="h2">
            {movieDetails.title}
          </Typography>
          <div>
            <b>Genres:</b> {movieDetails.genres.join(", ")}
          </div>
          <div>
            <b>Duration:</b> {movieDetails.duration}
          </div>
          <div>
            <b>Release Date:</b> {movieDetails.released_date.toDateString()}
          </div>
          <div>
            <b>Rating:</b> {movieDetails.critics_rating}
          </div>
          <div style={{ marginTop: "16px" }}>
            <b>Plot:</b> (<a href={movieDetails.wiki_url}>Wiki Link</a>){" "}
            {movieDetails.story_line}
          </div>
          <div style={{ marginTop: "16px" }}>
            <b>Trailer:</b>
            <YouTube videoId={movieDetails.trailer_url} opts={opts} />
          </div>
        </div>
        <div className="details__side-container">
          <div>
            <b>Rate this movie:</b>
            <Rating />
          </div>
          <div style={{ marginTop: "16px", marginBottom: "16px" }}>
            <b>Artists:</b>
          </div>

          <GridList cellHeight={150} spacing={6} cols={2}>
            {movieDetails.artists.map((artist, index) => (
              <GridListTile key={index}>
                <img src={artist.profile_url} alt="ARTIST_PROFILE" />
                <GridListTileBar
                  title={`${artist.first_name} ${artist.last_name}`}
                />
              </GridListTile>
            ))}
          </GridList>
        </div>
      </div>
    </div>
  );
};

export default Details;
