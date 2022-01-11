const express =require('express')
const {graphqlHTTP} = require('express-graphql')
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
    GraphQLNonNull
}=require('graphql')
const app = express()
const authors=[
    {id:1,name:"J.K rowling"},
    {id:2,name:"Jason Dsouza"},
    {id:3,name:"Mazan "},
]

const books =[
    {id:1,name:"harry potter 1",authorId:1},
    {id:2,name:"harry potter 2",authorId:1},
    {id:3,name:"harry potter 3",authorId:1},
    {id:4,name:"Naruto 1",authorId:2},
    {id:5,name:"Naruto 2",authorId:2},
    {id:6,name:"Naruto 3",authorId:2},
    {id:7,name:"Hunger games 1",authorId:3},
    {id:8,name:"Hunger games 2",authorId:3}
]
const AuthorType= new GraphQLObjectType({
    name:"Author",
    description:"Author list",
    fields:()=>({
        id:{type: GraphQLNonNull(GraphQLInt) },
        name:{type:GraphQLString},
        books:{type: new GraphQLList(BookType),
        resolve:(authors)=>{
            return books.filter(book=>book.authorId===authors.id)
        }
    }
        
        
    })
})
const BookType= new GraphQLObjectType({
    name:"Book",
    description:"books list",
    fields:()=>({
        id:{type: GraphQLNonNull(GraphQLInt) },
        name:{type:GraphQLString},
        authorId:{type: GraphQLNonNull(GraphQLInt) },
        author:{
            type:AuthorType,
            resolve:(book)=>{
                return authors.find(author =>author.id===book.authorId)
            }
        }
    })
})
const RootQueryType=new GraphQLObjectType({
    name:"query",
    description:"root Query",
    fields:()=>({
        book:{
            type:BookType ,
            description:"single of books",
            args:{
                id:{
                    type:GraphQLInt
                }
            },
            resolve:(parent,args)=>books.find(book=> book.id===args.id)
        },
      books:{
          type:new GraphQLList(BookType) ,
          description:"list of books",
          resolve:()=>books
      },
      authors:{
          type:new GraphQLList(AuthorType) ,
          description:"list of books",
          resolve:()=>authors
      },
      author:{
          type:AuthorType ,
          description:"single of books",
          args:{
              id:{type:GraphQLInt}
          },
          resolve:(parent,args)=>authors.find(author=>author.id===args.id)
      }
    })
})
const RootMutationType = new GraphQLObjectType({
    name:"mutation",
    description:"mutation",
    fields:()=>({
     addBook:{
         type:BookType,
         description:"add a book",
         args:{
             name:{type:GraphQLNonNull(GraphQLString)},
             authorId:{type:GraphQLNonNull(GraphQLInt)},
         },
             resolve:(parent,args)=>{
                 const book= {
                     id:books.length+1,
                     name:args.name,
                     authorId:args.authorId
                 }
                 books.push(book)
                 return book
             }
         
     },
     addAuthor:{
         type:AuthorType,
         description:"add a book",
         args:{
             name:{type:GraphQLNonNull(GraphQLString)},
             
         },
             resolve:(parent,args)=>{
                 const author= {
                     id:authors.length+1,
                     name:args.name,
                     
                 }
                 authors.push(author)
                 return author
             }
         
     }
    })
})
const schema = new GraphQLSchema({
    query:RootQueryType,
    mutation:RootMutationType
})
app.listen(5000,()=>{
    console.log("server is running")
})
app.use('/graphql', graphqlHTTP({
    schema:schema,
    graphiql:true
}))