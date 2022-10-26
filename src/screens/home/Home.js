import React, { useEffect, useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import {
  Button,
  Checkbox,
  FormControl,
  Input,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  TextField,
} from "@material-ui/core";
import "./Home.css";

const styles = (theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    flexWrap: "nowrap",
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: "translateZ(0)",
  },
  title: {
    color: "#fff",
  },
  titleBar: {
    background:
      "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)",
  },
  filterHeading: {
    color: theme.palette.primary.light,
    marginTop: 0,
    marginBottom: 0,
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    fontSize: "1rem",
  },
  formField: {
    marginTop: "1rem",
    marginBottom: "0.5rem",
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 240,
  },
});

const Home = (props) => {
  const { classes } = props;
  const [upComingMovies, setUpComingMovies] = useState([]);
  const [releasedMovies, setReleasedMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [artists, setArtists] = useState([]);
  const [filter, setFilter] = useState({
    movieName: "",
    genres: [],
    artists: [],
    releasedDateStart: "",
    releasedDateEnd: "",
  });

  useEffect(() => {
    getMovies();
    getGenres();
    getArtists();
  }, []);

  const getMovies = () => {
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch(
      `${props.baseUrl}movies?page=1&limit=10&title=&status=&start_date=&end_date=&genre=&artists&min_rating=&max_rating=&sort`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        const upCommingMovies = result.movies.filter(
          (movie) => movie.status === "UP_COMING"
        );
        const releasedMovies = result.movies.filter(
          (movie) => movie.status === "PUBLISHED"
        );
        setUpComingMovies(upCommingMovies);
        setReleasedMovies(releasedMovies);
      })
      .catch((error) => console.log("error", error));
  };

  const getGenres = () => {
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch(`${props.baseUrl}genres`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setGenres(result.genres.map((i) => i.genre));
      })
      .catch((error) => console.log("error", error));
  };

  const getArtists = () => {
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch(`${props.baseUrl}artists?page=1&limit=10?name=`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setArtists(result.artists.map((i) => `${i.first_name} ${i.last_name}`));
      })
      .catch((error) => console.log("error", error));
  };

  const handleChange = (name) => (event) => {
    setFilter({ ...filter, [name]: event.target.value });
  };

  const handleFilterSubmit = (event) => {
    event.preventDefault();
    console.log(filter);
  };

  return (
    <div>
      {/* Upcoming Movies Heading */}
      <div className="homepage__heading">Upcoming Movies</div>
      {/* Upcoming Movies Tiles */}
      <div className={classes.root}>
        <GridList
          className={classes.gridList}
          cellHeight={250}
          spacing={1}
          cols={6}
        >
          {upComingMovies.map((tile) => (
            <GridListTile key={tile.id} className={classes.gridTile}>
              <img src={tile.poster_url} alt={tile.title} />
              <GridListTileBar
                title={tile.title}
                classes={{
                  root: classes.titleBar,
                  title: classes.title,
                }}
              />
            </GridListTile>
          ))}
        </GridList>
      </div>
      {/* Home Body */}
      <div style={{ display: "flex" }}>
        {/* Released Movies Tiles */}
        <div style={{ width: "76%", margin: "1rem" }}>
          <div className={classes.root}>
            <GridList cellHeight={350} cols={4} spacing={32}>
              {releasedMovies.map((tile) => (
                <GridListTile key={tile.id}>
                  <img
                    src={tile.poster_url}
                    alt={tile.title}
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      props.history.push({ pathname: `/movie/${tile.id}` })
                    }
                  />
                  <GridListTileBar
                    title={tile.title}
                    subtitle={<span>Released Date: Web Mar 25 1975</span>}
                  />
                </GridListTile>
              ))}
            </GridList>
          </div>
        </div>
        {/* Released Movies Filter */}
        <div style={{ width: "24%", margin: "1rem" }}>
          <Card>
            <CardContent>
              <p className={classes.filterHeading}>FIND MOVIES BY:</p>
              <form
                className={classes.container}
                noValidate
                autoComplete="off"
                onSubmit={handleFilterSubmit}
              >
                <TextField
                  id="movie-name"
                  label="Movie Name"
                  className={classes.formField}
                  value={filter.movieName}
                  onChange={handleChange("movieName")}
                  margin="normal"
                />

                <FormControl className={classes.formField}>
                  <InputLabel htmlFor="genres">Genres</InputLabel>
                  <Select
                    multiple
                    value={filter.genres}
                    onChange={handleChange("genres")}
                    input={<Input id="genres" />}
                    renderValue={(selected) => selected.join(", ")}
                  >
                    {genres.map((genre) => (
                      <MenuItem key={genre} value={genre}>
                        <Checkbox checked={filter.genres.indexOf(genre) > -1} />
                        <ListItemText primary={genre} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl className={classes.formField}>
                  <InputLabel htmlFor="artists">Artists</InputLabel>
                  <Select
                    multiple
                    value={filter.artists}
                    onChange={handleChange("artists")}
                    input={<Input id="artists" />}
                    renderValue={(selected) => selected.join(", ")}
                  >
                    {artists.map((artist) => (
                      <MenuItem key={artist} value={artist}>
                        <Checkbox
                          checked={filter.artists.indexOf(artist) > -1}
                        />
                        <ListItemText primary={artist} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl className={classes.formField}>
                  <InputLabel htmlFor="released-date-start" shrink={true}>
                    Release Date Start
                  </InputLabel>
                  <Input
                    value={filter.releasedDateStart}
                    onChange={handleChange("releasedDateStart")}
                    id="released-date-start"
                    type="date"
                  />
                </FormControl>

                <FormControl className={classes.formField}>
                  <InputLabel htmlFor="released-date-end" shrink={true}>
                    Release Date End
                  </InputLabel>
                  <Input
                    value={filter.releasedDateEnd}
                    onChange={handleChange("releasedDateEnd")}
                    id="released-date-end"
                    type="date"
                  />
                </FormControl>

                <div className={classes.formField}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    style={{ width: "100%" }}
                  >
                    APPLY
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default withStyles(styles)(Home);
