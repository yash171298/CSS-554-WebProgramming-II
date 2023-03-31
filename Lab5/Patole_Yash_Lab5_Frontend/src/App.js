import React, { Component,useState } from 'react'
import './App.css';
import Home from './Components/Homepage'
import MyPosts from './Components/my-post'
import CreateNewPost from './Components/CreatePost'
import MyBin from './Components/my-bin'
import Popularity from './Components/Popularity';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { ApolloProvider } from '@apollo/client';
import NavBar from './Components/searchBar';
import Button from '@material-ui/core/Button';

import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";


const client = new ApolloClient({
    uri: 'http://localhost:4000',
    cache: new InMemoryCache()
});

class App extends Component {

    constructor(props){
        super(props);
        this.state = {open: true};
        console.log(this.state.open)

        //this.handleClose = this.handleClose.bind(this)
        };
    
    render() {
        return (
            
            <Router>
                <ApolloProvider client={client}>
                    {<NavBar></NavBar>}
                    <Switch>
                        <Route exact path="/">
                            <Home />
                        </Route>
                        <Route exact path="/popularity">
                            <Popularity/>
                        </Route>
                        <Route path="/my-bin">
                            <Button onClick={true}>MyBin</Button>
                            <MyBin open={this.state.open} handleClose={true} ></MyBin>
                        </Route>
                        <Route path="/my-posts">
                            <MyPosts/>
                        </Route>
                        <Route path="/new-post">
                            <Button onClick={true}>Add New Post</Button>
                            <CreateNewPost open={this.state.open} handleClose={true} ></CreateNewPost>
                        </Route>
                    </Switch>
                </ApolloProvider>
            </Router>
        )
    }
}

export default App;
