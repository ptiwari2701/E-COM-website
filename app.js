var express=require('express');
var session = require('express-session');
var app=express();
app.use(express.static('public'));
var bodyParser=require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
var mongoose = require('mongoose');
app.use(session({
  'secret': '343ji43j4n3jn4jk3n'
}))
var db =
mongoose.connect("mongodb://localhost/Ecom",(err,Db)=>{
    db = Db;
});


var Schema=mongoose.Schema;

let Product=new Schema({
    name:String,
    desc:String,
    price:Number,
    quan:Number
})
let SignIn=new Schema({
    name:String,
    email:String,
    username:String,
    password:String,
    cart : [{
        id : String,
        name : String,
        desc : String,
        price : String,
        quan : Number
    }]
})

var pro = mongoose.model('product',Product);
var signin=mongoose.model('signin',SignIn);

app.get('/',(req,res)=>{
    res.sendFile(__dirname+"/public/login/login.html");
})
app.get('/index',(req,res)=>{
    let user = req.session.user;
    if(user == 'admin'){
        return res.sendFile(__dirname+"/index.html");
        
    }
    return res.json("Session not found");
})
app.get('/index/array',(req,res)=>{
    console.log('Product List retrival operation');
    pro.find({},function(err,docs){
        res.json(docs);
    })
})
app.post('/index/array/update',(req,res)=>{
    console.log("Old Values :- "+req.body.oldID+" Values To be edited:- ")
    let product = JSON.parse(req.body.productDetails)
    pro.findOneAndUpdate(
        {
            '_id' : JSON.parse(req.body.oldID)
        },
        {   
            'name' : (product.name),
            'desc' : (product.desc),
            'price' : (product.price),
            'quan' : (product.quan)        
        },
        (err,affected)=>{
            if(err){
                console.log(err)
            }
            console.log(affected)
    })

})
app.post('/index/delete',(req,res)=>{
    console.log("Delete Operation :- ");
    let id = mongoose.Types.ObjectId((JSON.parse(req.body.id)))
    pro.findOneAndRemove({_id : id}, function(err){
        if (err){
            throw err;
        }
        console.log('deleted '+req.body.id);
    });
})

app.post('/index/array',(req,res)=>{
    console.log("Product add operation")
    var len=JSON.parse(req.body.productList).length;
    var sData=new pro();
    sData.name=JSON.parse(req.body.productList)[len-1].name;    
    sData.desc=JSON.parse(req.body.productList)[len-1].desc;
    sData.price=JSON.parse(req.body.productList)[len-1].price;
    sData.quan=JSON.parse(req.body.productList)[len-1].quan;
    // console.log(sData);
    sData.save(function(err){
        if(err)
        throw err;
        console.log("Product added");
    })

})
// app.post('/index',(req,res)=>{

// })
app.get('/login.html',(req,res)=>{
    res.sendFile(__dirname+"/public/login/login.html");
})
app.get('/First.html',(req,res)=>{
    res.sendFile(__dirname+"/First.html");
})
app.post('/',(req,res)=>{
    let uname = req.body.username;
    let pswd = req.body.pass;
    console.log(uname+" "+pswd);
    if(uname == 'admin' && pswd == 'admin'){
        req.session.user = "admin";
        return res.redirect("/index")
    }
    signin.find({username : uname , password : pswd},(err,doc)=>{
        if(err){
            console.log(err)
        }
        if(doc.length == 0){
            return  res.redirect("/")
        }
        else{
            req.session.user = doc[0]._id
            return res.redirect("/user")
        }
    })
})
app.post('/signin',(req,res)=>{
    var sData=new signin();
    sData.name=req.body.name;sData.email=req.body.email;sData.username=req.body.username;sData.password=req.body.pass;
    sData.save(function(err){
        if(err)
        throw err;
    })
    res.redirect('/');
})

app.get('/user',(req,res)=>{
    let user=req.session.user;
    if(user==undefined || user=='admin'){
         return res.send('Session not found')
    }
    res.sendFile(__dirname+'/First.html')
})
app.get('/getUser',(req,res)=>{
    pro.find({},(err,docs)=>{
        if(err){
            console.log(err)
        }
        return res.json(docs)
    })
})
app.get('/getusername',(req,res)=>{
    let user=req.session.user;  
    signin.find({_id:user},(err,docs)=>{
        if(err)
        console.log(err)
        res.json(docs)
    })
})
app.get('/getCart',(req,res)=>{
    let user = req.session.user;
    signin.find({_id:user},(err,docs)=>{
        if(err)
            return console.log(err)
        console.log("returning",docs)
        if(docs.length == 0){
            return res.json([])
        }
        return res.json((docs[0].cart))
    })
})
app.post('/addProductToCart',(req,res)=>{   
    let user = String(req.session.user)
    let pro = String(req.body.product)
    console.log(user,pro)
    signin.findOneAndUpdate({"_id" : user},{$push: {"cart" : pro}},(err,result)=>{
        if(err){
            console.log(err)
            return req.json("Failed")
        }
        console.log(result)
        return res.json("Success")
    })
})
app.post('/checkInCart',(req,res)=>{
    let user = req.session.user
    let obj = JSON.parse(req.body.obj)
    let quantity = req.body.quantity
    console.log("Object",obj)
    signin.findOne({"cart.id" : obj.id},(err,result)=>{
        if(err){
            console.log(err)
        }
        if(result == null){
            signin.findOneAndUpdate({"_id" : user},{$push: {"cart" : obj}},(err,result)=>{
                if(err){
                    console.log(err)
                    return req.json("Failed")
                }
                console.log(result)
                return res.json("Success")
            })
        }
        else{
            for(let i=0;i<(result.cart).length;i++){
            if((result.cart[i]).id == obj.id){
                (result.cart[i]).quan = parseInt((result.cart[i]).quan) + parseInt(quantity)
            }
            }
            result.save()
            return res.json("Success")
        }
    })
})
app.post('/deleteProductFromCart',(req,res)=>{
    let user = req.session.user
    signin.update({"_id" : user},{$pull : {"cart" : {"id" : req.body.id}}},(err,result)=>{
        if(err){
            console.log(err)
            return res.json("Failed")
        }
        console.log("Delete Operation",result)
        return res.json("Success")
    })
})
app.get('/checkout',(req,res)=>{
    let user = req.session.user
    signin.find({"_id" : user},(err,result)=>{
        result = result[0]
        result = result.cart
        for(let i =0;i<result.length;i++){
            pro.update({"_id" : (result[i].id)},{$inc : {'quan' : -parseInt(result[i].quan)}},(err,doc)=>{
                if(err){
                    console.log(err)
                }
                console.log(doc)
            })
        }
    })
    signin.update({"_id" : user},{$pull : {"cart" : {}}},(err,result)=>{
        if(err){
            console.log(err)
            return res.json("Failed")
        }
        console.log(result)
        return res.json("Success")
    })
})
app.get('/Checkout.html',(req,res)=>{
    res.sendFile(__dirname+'/Checkout.html')
})
app.listen(3000);
