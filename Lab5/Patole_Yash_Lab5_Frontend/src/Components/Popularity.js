import React, { useState,useEffect } from 'react'
import { useQuery, gql } from '@apollo/client';
import { Badge, Typography } from '@material-ui/core'
import Button from '@material-ui/core/Button';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import Container from '@material-ui/core/Container';
import { AddToBin } from './Homepage'
import { SubscriptionsOutlined } from '@material-ui/icons';

function Popularity(props) {
    const [pageNum, setPageNum] = useState(1)
    const getImageQuery = gql`
    query{
        unSplashImages(pageNum: ${pageNum}){
            id
            url
            posterName
            description
            userPosted
            binned
            numBinned
        }
    }`;

    useEffect(() => { }, [pageNum])


    const { loading, error, data } = useQuery(getImageQuery);

    if (loading) {
        return (<div class="loader"></div>)
    }
    else if (error) {
        <p> System encountered an error </p>
    }

    else if (data)
    {
        console.log(data)
        let imageData;
        for(let i = 0; i< 9; i++){
            imageData = data.unSplashImages
        }
        
        return (
            <div>
                {imageData.map((i) => (
                    <div className="Item-holder">
                        <img src ={i.url} style={{width: 1000, height: 1000}} />
                        <h3>{i.posterName}</h3>
                        <p>{i.description}</p>
                        <AddToBin image1={i}></AddToBin>
                        <br/>
                        <br/>
                    </div>
                ))}
                <Button onClick={() => setPageNum(pageNum + 1)} >Load More</Button>   
            </div>
        )}
    else {
        return null
    }
}

function Home(props) {
    return (<div>
        <Container>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: "10px" }}>
                <Breadcrumbs aria-label="breadcrumb">
                    <Link color="inherit" href="/" >Images</Link>

                    <Typography color="primary">Popularity</Typography>

                    <Link color="inherit" href="/my-posts" > My Posts</Link>

                    <Link color="inherit" href="/my-bin">My Bin</Link>
                </Breadcrumbs>
            </div>
            <br/>
            {Popularity()}
        </Container>
    </div>);
}

export {Popularity};
export default Home;
// function GetPopularImages(props) {
//     const [pageNum, setPageNum] = useState(1)
//     const [updateF, setUpdateF] = useState(false)
//     const updateCalled = () => {
//         setUpdateF({ updateF: !updateF })
//         console.log('updateCalled')
//     }
//     useEffect(() => {

//         refetch()

//     }, [updateF])
    
//     const getImageQuery = gql`
//     query{
//         unSplashImages(pageNum: ${pageNum}){
//             id
//             url
//             posterName
//             description
//             userPosted
//             binned
//             numBinned
//         }
//     }
// `;

// const { loading, error, data, refetch } = useQuery(getImageQuery);

    

//     if (loading) {
//         return (<p>Loading</p>)
//     }
//     else if (error) {
//         <div>
//             <p>
//                 System encountered an error
//             </p>
//         </div>
//     }

//     else if (data) {
//         let imageData = data.getTopTenBinnedPosts
//         console.log(imageData)
//         let sum =0
//         //console.log(typeof(sum))
//         let mainstream=""
//         let totalLikes = imageData.map((i) =>
//         ( 
//             console.log("i="+i.numBinned),
//             sum = sum + parseInt(i.numBinned) , 
//             console.log("sum="+sum)
//         ));
//         if(sum>200) 
//             mainstream ="Mainstream";
//         else 
//             mainstream ="Not Mainstream"

//         console.log(data)
//         return (
//                 <div>
//                     <p> Total Likes = {sum} hence {mainstream}</p>
//                     {imageData.map((i) => (
//                         <div className="Item-holder">
//                             <img src={i.url} />
//                             <h3>{i.posterName}</h3>
//                             <p>{i.description}</p>
//                             <Badge badgeContent={i.numBinned} color="primary">
//                                 <Typography variant="button">No of Likes</Typography>
//                             </Badge>
//                             <AddToBin updateCalled={updateCalled} image1={i}></AddToBin>
//                             <br/>
//                             <br/>
//                         </div>
//                 ))}
//                 </div>
//     )}
//     else {
//         return null
//     }
// }
// function Popularity() {

//     return (
//         <div>
//             <Container>
//                 <div style={{ display: 'flex', justifyContent: 'center', marginTop: "10px" }}>

//                     <Breadcrumbs aria-label="breadcrumb">
//                         <Link color="inherit" href="/my-bin" >My Bin</Link>

//                         <Link color="inherit" href="/" >Images</Link>

//                         <Link color="inherit" href="/my-posts" > My Posts</Link>

//                         <Typography color="primary">Popularity</Typography>
//                     </Breadcrumbs>
//                 </div>
//                 <br/>
//                 <GetPopularImages></GetPopularImages>
//             </Container>
//         </div>
//     )}


// export {GetPopularImages}
// export default Popularity
