const { ApolloServer, gql } = require('apollo-server');
const axios = require('axios')
const { v4: uuidv4, stringify } = require('uuid');

const redis = require('redis');
const client = redis.createClient();

client.connect('connect', function () {
    console.log('connected');
});

const typeDefs = gql` 
  type Query {
    unSplashImages(pageNum: Int!): [ImagePost]
    binnedImages: [ImagePost]
    userPostedImages: [ImagePost]
    getTopTenBinnedPosts: [ImagePost]
  }

  type Mutation{
    uploadImage(url: String!, description: String, posterName: String): ImagePost
    updateImage(id: ID!, url: String, posterName: String, description: String, userPosted: Boolean, binned: Boolean, numBinned: Int) : ImagePost
    deleteImage(id: ID!): ImagePost
  }

  type ImagePost {
    id: ID!
    url: String!
    posterName: String!
    description: String
    userPosted: Boolean!
    binned: Boolean!
    numBinned: Int!
}`;


async function removeImage(index, image) {
    let image_obj = await client.LREM("Image_List", index, image)
    return image_obj
}

async function binnedImages() {
    let binned_imgs = []
    let redis_len = await client.LLEN("Image_List")
    image_arr = await client.LRANGE("Image_List", 0, redis_len)
    if(!image_arr) {
        return "Array is still empty."
    }
    image_arr.map(image_obj => {
        js_obj = JSON.parse(image_obj)
        if (js_obj.binned) {
            binned_imgs.push(js_obj)
        } 
    })
    return binned_imgs
}

function uploadImageToCache(arguement) {
    let newImage = {
        "id": arguement.id,
        "url": arguement.url,
        "posterName": arguement.posterName,
        "description": arguement.description,
        "userPosted": arguement.userPosted,
        "binned": !arguement.binned,
        "numBinned": arguement.numBinned
    }
    client.LPUSH("Image_List", JSON.stringify(newImage))
    return newImage
}



const resolvers = {
    Query: {
        async unSplashImages(parent, arguement, context, info) {
            const { data } = await axios.get(`https://api.unsplash.com/photos/?page=${arguement.pageNum};client_id=lHfyk2JBw9w_9Nt-Msm6biu5JjR0R5geNZ7foxY_M_E`)

            let response = data
            return response.map(async image => {
                var image = {
                    "id": uuidv4(),
                    "url": image.urls.regular,
                    "posterName": image.user.name,
                    "description": image.description || image.alt_description,
                    "numBinned": image.likes,
                    "userPosted": false,
                    "binned": false
                }
                let binList = await binnedImages();
                for (const binImg of binList) {
                    if(binImg.posterName == image.posterName && binImg.description == image.description && binImg.url==image.url)
                        image.binned = true;
                }
                return image
            })
        },
        async binnedImages() {
            let binned_images = []
            let redis_len = await client.LLEN("Image_List")
            image_arr = await client.LRANGE("Image_List", 0, redis_len)
            image_arr.map(image_obj => {
                js_obj = JSON.parse(image_obj)
                if (js_obj.binned == true) {
                    binned_images.push(js_obj)
                }
            })
            return binned_images
        },

        async userPostedImages() {
            let binned_images = []
            let redis_len = await client.LLEN("Image_List")
            image_list = await client.LRANGE("Image_List", 0, redis_len)
            image_list.map(image_obj => {
                js_obj = JSON.parse(image_obj)
                if (js_obj.userPosted == true) {
                    binned_images.push(js_obj)
                }
            })
            return binned_images

        },
        async getTopTenBinnedPosts() {
            let binImageList = await binnedImages();

            for (const binImg of binImageList) {
                await client.ZADD("sortedImages", binImg.numBinned.toString(), JSON.stringify(binImg))
            }

            let sortedImages = await client.ZRANGE("sortedImages", 0, -1);
            // await client.del("sortedImages")
            let binned_images = []
            let counter =0;
            sortedImages.forEach(image_obj => {
                js_obj = JSON.parse(image_obj)
                if(counter<10)
                {
                    binned_images.push(js_obj);
                    counter=counter+1;
                }
            })
            console.log(binned_images);
            return binned_images
        }
    },
    Mutation: {
        async uploadImage(parent, arguement, context, info) {

            uui = uuidv4()
            var image = {
                "id": uui,
                "url": arguement.url,
                "posterName": arguement.posterName,
                "description": arguement.description,
                "numBinned": 0,
                "userPosted": true,
                "binned": false
            }


            client.lPush("Image_List", JSON.stringify(image))


            return image
        },
         async deleteImage(parent, arguement, context, info) {
            let index = 0 
            let current_img = null
            let redis_len = await client.LLEN("Image_List")
            image_list = await client.LRANGE("Image_List", 0, redis_len)
            image_list.map(image => {
                image = JSON.parse(image)
                if (image.id == arguement.id) {
                    current_img = image
                }
                index++
            })
            if (!current_img) {
                return "Not removed."
            }
                else {
                await removeImage(0, JSON.stringify(current_img))
                return current_img
            }

            return current_img
        },
    
    async updateImage(parent, arguement, context, info) {
        let current_img = undefined
        let redis_len = await client.LLEN("Image_List")
        image_list = await client.LRANGE("Image_List", 0, redis_len)
        image_list.map(image => {
            image = JSON.parse(image)
            if (image.id == arguement.id) {

                current_img = image

            }

        })

        if (current_img != undefined) {
            removeImage(0, JSON.stringify(current_img))
            let image = uploadImageToCache(arguement)
            return image
        }
        else {
            let image = uploadImageToCache(arguement)
            return image
        }
    }
}
};


const server = new ApolloServer({ typeDefs, resolvers });

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
    console.log(`Server ready at ${url}`);
});
