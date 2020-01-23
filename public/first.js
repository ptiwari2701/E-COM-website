var divAddToCart=document.getElementById("divAddToCart");
var addToCart=[];
var i=0;
var user=[];
var flag=[];

function insertBlankLine(target,n)
{
    for(var i=0;i<n;i++)
    {
        var br = document.createElement("br");
        target.appendChild(br);
    }
}

function addProductToCart(pro){
    var xhttp=new XMLHttpRequest();
    xhttp.onreadystatechange= function(){
        if(this.readyState == 4 && this.status == 200){	
            let msg = (this.responseText);
            console.log(msg)
        }
    }
    xhttp.open("POST", "/addProductToCart",true);
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhttp.send("product="+pro);
}
function getUserName(){
    console.log('called');
    var xhttp=new XMLHttpRequest();
    xhttp.onreadystatechange= function(){
        if(this.readyState == 4 && this.status == 200){	
            user = JSON.parse(this.responseText);
            console.log("Inside"+user)
            loginInDisplay();
            // getCart();
        }
    }
    xhttp.open("GET", "/getusername");
    xhttp.send();
} 
getUserName();
function loginInDisplay(){
    console.log('avc');
    var newDiv=document.createElement("div");
    newDiv.setAttribute('style','height:50px;widht:1350px');
    var textNode=document.createElement('label');
    textNode.innerHTML="Welcome "+user[0].username;
    textNode.setAttribute('style','font-weight:bold;font-size:25px;margin-left:550px');
    newDiv.append(textNode);
    var logoutLink=document.createElement('a');
    logoutLink.innerHTML="Logout!";
    logoutLink.setAttribute('style','color:red;margin-left:38%;font-size:25px');
    newDiv.appendChild(logoutLink);
    divAddToCart.appendChild(newDiv);
    logoutLink.addEventListener("click",function(event){
        logoutLink.href='login.html';
    });
}
function loadProducts(){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
     addToCart=JSON.parse(this.responseText)
     for(var i=0;i<addToCart.length;i++)
        addProductToDOM(addToCart[i]);
    }
  };
  xhttp.open("GET", "/getUser");
  xhttp.send();
}
function loginInDisplay(){
    var newDiv=document.createElement("div");
    newDiv.setAttribute('style','height:50px;widht:1350px');
    var textNode=document.createElement('label');
    textNode.innerHTML=`Welcome ${user[0].username}`;
    textNode.setAttribute('style','font-weight:bold;font-size:25px;margin-left:550px;text-decoration:underline');
    newDiv.append(textNode);
    var logoutLink=document.createElement('a');
    logoutLink.innerHTML="Logout";
    logoutLink.setAttribute('style','color:red;margin-left:38%;font-size:25px;text-underline: below;text-decoration:underline');
    newDiv.appendChild(logoutLink);
    divAddToCart.appendChild(newDiv);
    logoutLink.addEventListener("click",function(event){
        logoutLink.href='login.html'
    });
}
function addProductToDOM(objProduct){  
   // browser.tabs.reload();
    var result="Name :"+objProduct.name+"  Desc :"+objProduct.desc+"   Price :"+objProduct.price+" Quantity :"+objProduct.quan;
    var divCart=document.createElement("div");
    divCart.setAttribute("id",objProduct._id);
    divCart.setAttribute('style','border-radius:25px;border:2px solid black;margin-top:10px;  margin: auto;width: 50%;border: 1px solid green;padding: 10px;border-collapse:collapse;background-color:lightgreen');
    var labelName=document.createElement('label');
    var lable1=document.createElement('label');
    lable1.innerHTML="Name : ";
    var lable2=document.createElement('label');
    lable2.innerHTML="Desc : ";
    var lable3=document.createElement('label');
    lable3.innerHTML="Price : ";
    var lable4=document.createElement('label');
    lable4.innerHTML="Quan : ";
    lable1.setAttribute('style','margin-left:2%;');
    lable2.setAttribute('style','margin-left:2%;');
    lable3.setAttribute('style','margin-left:2%;');
    lable4.setAttribute('style','margin-left:2%;');
    labelName.innerHTML=objProduct.name+"<br>";
    labelName.setAttribute('style','margin-left:7px');
    var labelDesc=document.createElement('label');
    labelDesc.setAttribute('style','margin-left:12px')
    labelDesc.innerHTML=objProduct.desc+"<br>";
    var labelPrice=document.createElement('label');
    labelPrice.setAttribute('style','margin-left:10px');
    labelPrice.innerHTML=objProduct.price+"<br>";
    var labelQuan=document.createElement('label');
    labelQuan.setAttribute('style','margin-left:8px');
    labelQuan.innerHTML=objProduct.quan+"<br>";
    var textNode=document.createTextNode(result);
    divCart.appendChild(lable1);
    divCart.appendChild(labelName);
    divCart.appendChild(lable2);
    divCart.appendChild(labelDesc);
    divCart.appendChild(lable3);
    divCart.appendChild(labelPrice);
    divCart.appendChild(lable4);
    divCart.appendChild(labelQuan);
    var txtAddtoCart=document.createElement("input");
    txtAddtoCart.setAttribute("type","text");
    txtAddtoCart.setAttribute("id","txtAddToCart");
    txtAddtoCart.setAttribute("style","margin:15px");
    txtAddtoCart.setAttribute("value","1");
    divCart.appendChild(txtAddtoCart);
    var bttnAddToCart=document.createElement("button");
    bttnAddToCart.setAttribute("id","bttnAddToCart");
    bttnAddToCart.innerHTML="Add to cart"
    bttnAddToCart.setAttribute('style','');
    divCart.appendChild(bttnAddToCart);
    divAddToCart.appendChild(divCart);
    insertBlankLine(divAddToCart,2);

    bttnAddToCart.addEventListener("click",function(e){
       console.log(e.currentTarget.parentNode.childNodes[1])
       let quantity = e.currentTarget.parentNode.childNodes[8].value
        let obj = {"id" : e.currentTarget.parentNode.id,
                    "name" : (e.currentTarget.parentNode.childNodes[1].innerHTML).slice(0,-4),
                    "desc" : (e.currentTarget.parentNode.childNodes[3].innerHTML).slice(0,-4),
                    "price" : (e.currentTarget.parentNode.childNodes[5].innerHTML).slice(0,-4),
                    "quan" : quantity}
        if((quantity > parseInt(e.currentTarget.parentNode.childNodes[7].innerHTML)) || quantity==0)
        {
            return alert("Enter correct quantity")
        }
        else{
           // e.currentTarget.parentNode.childNodes[7].innerHTML = parseInt(e.currentTarget.parentNode.childNodes[7].innerHTML) - quantity
            checkProductInCart(obj,quantity)
        }
    });
}

function checkProductInCart(obj,quantity){
    var xhttp=new XMLHttpRequest();
    xhttp.onreadystatechange= function(){
        if(this.readyState == 4 && this.status == 200){
            alert(this.response)
        }
    }
    xhttp.open("POST", "/checkInCart");
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhttp.send("obj="+JSON.stringify(obj)+"&quantity="+quantity);
}