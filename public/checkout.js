var listAddToCart=document.getElementById("listAddToCart");
var id=0;
var listAddToCart=document.getElementById("listAddToCart");
var id=0;
var f=[];
var divId=0;
function insertBlankLine(target,n)
{
    for(var i=0;i<n;i++)
    {
        var br = document.createElement("br");
        target.appendChild(br);
    }
}
function getCart(){
  var xhttp=new XMLHttpRequest();
  xhttp.onreadystatechange= function(){
      if(this.readyState == 4 && this.status == 200){	
          let cart = JSON.parse(this.responseText);
          console.log(cart.length)
          for(let i=0;i<cart.length;i++){
            console.log("Here")
            addProductToDOM(cart[i])
          }
      }
  }
  xhttp.open("GET", "/getCart");
  xhttp.send();
}

function addProductToDOM(objProduct){
  //  var result="Name :" + objProduct.name+"  Desc :" + objProduct.desc+"   Price :" +objProduct.price+" Quantity :"+objProduct.quan;
    var labelName=document.createElement("label");
    var labelN=document.createElement("label");
    labelN.innerHTML="  Name : - "
    var labelD=document.createElement("label");
    labelD.innerHTML=" Desc : - "
    var labelP=document.createElement("label");
    labelP.innerHTML=" Price : - "
    var labelQ=document.createElement("label")
    labelQ.innerHTML=" Quantity : - ";
    labelName.innerHTML=objProduct.name;
    var labelDesc=document.createElement("label");
    labelDesc.innerHTML=objProduct.desc;
    var labelPrice=document.createElement("label");
    labelPrice.innerHTML=objProduct.price;
    var labelQuan=document.createElement("label");
    labelQuan.innerHTML=objProduct.quan;

    var divNewCart=document.createElement("div");
    divNewCart.setAttribute('id',objProduct.id);
    divNewCart.setAttribute('style','border:1px solid black;background-color:lightgreen;width:35%;border-radius:20px')
    divNewCart.appendChild(labelN);
    divNewCart.appendChild(labelName);
    divNewCart.appendChild(labelD);
    divNewCart.appendChild(labelDesc);
    divNewCart.appendChild(labelP);
    divNewCart.appendChild(labelPrice);
    divNewCart.appendChild(labelQ);
    divNewCart.appendChild(labelQuan);
    
    var bttnDelete=document.createElement("button");
    bttnDelete.innerHTML="Delete";
    bttnDelete.setAttribute("id","bttnDelete");
    bttnDelete.setAttribute("style","margin:15px");
    divNewCart.appendChild(bttnDelete);
    insertBlankLine(divNewCart,1);
    listAddToCart.appendChild(divNewCart);
    insertBlankLine(listAddToCart,1);
    bttnDelete.addEventListener("click",function(event){
        var target=event.target.parentNode;
        var removeId=(target.id);
        // removeFromArray(removeId);
        updateDOM(target);
        var xhttp=new XMLHttpRequest();
        xhttp.onreadystatechange= function(){
            if(this.readyState == 4 && this.status == 200){	
                let msg = (this.responseText);
                console.log(msg)
            }
        }
        xhttp.open("POST", "/deleteProductFromCart",true);
        xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhttp.send("id="+removeId);
        });
}


function removeFromArray(id){
  addToCart.splice(id,1);
  //console.log(addToCart);
  storeProducts(addToCart);
}

function updateDOM(target){
  target.parentNode.removeChild(target);
}

function getAddToCartValue(){
  //nsole.log('in getAddToCartValue()');
	if(!localStorage.addToCart){
    localStorage.addToCart = JSON.stringify([]);
  }
  else
  {
    
    addToCart = JSON.parse(localStorage.addToCart);
	
	for(var i=0;i<addToCart.length;i++)
	{
  //  console.log('inside for loop' + i);
	  addProductToDOM(addToCart[i]);
  }
  
	}
}

function storeProducts(addToCart)
{
  localStorage.addToCart=JSON.stringify(addToCart);
 // localStorage.currentUser=JSON.stringify(currentUser);
}
function con(){
  location.href="First.html";
}
function check(obj){
  console.log(obj.parentNode.parentNode.childNodes[1])
  let parentNode = obj.parentNode.parentNode.childNodes[1]
  let sum = 0
  for(let i=1;i<(parentNode.childNodes).length;i++){
    sum += (parentNode.childNodes[i].childNodes[7].innerHTML) * (parentNode.childNodes[i].childNodes[5].innerHTML)
    //sum += parseInt(parentNode.childNodes[i].childNodes[6].innerHTML) * parseInt(parentNode.childNodes[i].childNodes[8].innerHTML) 
  }
  alert(" Total sum is "+sum)
  window.location.href="/First.html"
  var xhttp=new XMLHttpRequest();
        xhttp.onreadystatechange= function(){
            if(this.readyState == 4 && this.status == 200){	
                let msg = (this.responseText);
                console.log(msg)
            }
        }
        xhttp.open("GET", "/checkout",true);
        xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhttp.send();
  
};
function getFlagValue(){
  if(!sessionStorage.flag)
	{
		sessionStorage.flag = JSON.stringify([]);
		//break;
	}
	else
	{
    flag = JSON.parse(sessionStorage.flag);
    }
}
function getStored(){
  if(!localStorage.addToCart)
{
  localStorage.products = JSON.stringify([]);
}
else
{
  products = JSON.parse(localStorage.products);
//productId = products[products.length-1].id+1;
}
}
function setStored(){
  localStorage.products = JSON.stringify(products);
}
function onlyForCheck(){
    if(!localStorage.products){
      localStorage.products = JSON.stringify([]);
    }
    else
    {
      
      products = JSON.parse(localStorage.products);
    //  console.log(addToCart);
  }
}