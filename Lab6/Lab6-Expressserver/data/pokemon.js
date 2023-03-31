const axios= require('axios');


module.exports = {
    async getPokemonById(id) {

        if(!id) throw "No id is given to find the pokemon.";
        const { data } = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
        if(data == null) throw "No data found for that id."
        return {data};

    },

    async getbypage(id){

        if(!id) throw "No id is given to find the pokemon.";
        let offset = (parseInt(id)-1)*20;
        let queryString= "?offset="+offset+"&limit=20";
        const {data} = await axios.get(`https://pokeapi.co/api/v2/pokemon/${queryString}`);
        if(data == null) throw "No data found for that id.";
        return {data};

    }
}