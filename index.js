import { ApolloServer } from "apollo-server";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
//graphqlSchema
import typeDefs from "./schemaGql.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config()


mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true, useUnifiedTopology: true
})
.then(()=>{
    console.log("db connected")
})
.catch((err)=>{
    console.log(err)
})

//mongoose models
import "./models/UserModel.js"
import "./models/PostModel.js"
//graphql resolvers
import resolvers from "./resolvers.js";

const context = ({req}) =>{

    const { authorization } = req.headers
    if(authorization){
        const  {userId} = jwt.verify(authorization, process.env.JWT_TOKEN)
        return {userId}
    }

}

const server = new ApolloServer ({
    typeDefs,
    resolvers,
    context,
    plugins : [
        ApolloServerPluginLandingPageGraphQLPlayground()
    ]
})

server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
  });
