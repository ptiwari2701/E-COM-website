    var products=[];
    var productId=0;
    var aAddProduct=document.getElementById("aAddProduct");
    var divAddProducts=document.getElementById("divAddProducts");
    var divListProducts=document.getElementById("divListProducts");
    var aAddToCart=document.getElementById("aAddToCart");
    var count=0;
    let pro = []
    let index = 0

function loadNextProduct(){
    let temp = 0
    if(index>0 && index <pro.length){
        document.getElementById("divListProducts").innerHTML = ""
    }
    if(index<=pro.length){
    for(var i=index;i<index+3;i++){
        if(i > pro.length){
            break;
        }
        addProductToDOM(pro[i]);
        temp = i
    }
    index =temp+1;
}
    if(index>pro.length){
        return;
    }
    console.log("temp",temp)
}

function loadPrevProduct(){
    if(index<0){
        return;
    }
    let temp = 0
    if(index>0 && index <pro.length){
        document.getElementById("divListProducts").innerHTML = ""
    }
    console.log("index",index)
    if(index>=3){
    for(var i=index-3;i<index;i++){
        if(i < 0){
            break;
        }
        addProductToDOM(pro[i]);
        temp = i
    }
    index = temp-1;
}
    if(temp==0){
        return;
    }
    console.log("Prev temp",temp)
}

function getStoredProducts(){
    index = 0   
    var xhttp=new XMLHttpRequest();
    xhttp.onreadystatechange=function(){
    if(this.readyState == 4 && this.status == 200){	
        products = JSON.parse(this.responseText);
        pro = products
        productId = products[products.length-1].id+1;
        for(var i=0;i<3;i++){
            addProductToDOM(products[i]);
        }
        index = 2
        console.log(pro)
    }
}
    xhttp.open("GET", "/index/array", true)
    xhttp.send();
}

function updateDatabase(oldID,pDetails){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
     alert("Appended");
    }
  };
  xhttp.open("POST", "/index/array/update", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  console.log(pDetails);
  xhttp.send("oldID="+JSON.stringify(oldID)+"&productDetails="+JSON.stringify(pDetails));
  window.href="scripts.js"; 
}




aAddProduct.addEventListener("click",function(event)
{
    //aAddToCart.setAttribute("style","visibility:hidden");
    deleteNewProductPanel();
    createProductPanel();
});

function insertBlankLine(target,n)
{
    for(var i=0;i<n;i++)
    {
        var br = document.createElement("br");
        target.appendChild(br);
    }
}

function deleteProductDiv(event)
{
    // console.log(event.target.parentNode.id)
    var targetParent = event.target.parentNode;
    var selectedProductIndex = getProductIndex(targetParent.id);
    console.log(selectedProductIndex)
    deleteFromDataBase(products[selectedProductIndex]._id);
    removeFromProductsArray(selectedProductIndex);
    console.log(products);
    targetParent.parentNode.removeChild(targetParent);
}

function getProductIndex(id) 
{
    for (var i = 0; i < products.length; i++) 
{
        if (products[i]._id == id) 
		return i;
    }
    return 1;
}

function removeFromProductsArray(selectedProductIndex)
{
    products.splice(selectedProductIndex,1);
    //console.log(products);
}

function editProductDiv(event)
{
    deleteNewProductPanel2();
    //var objProduct = new Object();
    var targetParent = event.target.parentNode;
    var id = targetParent.id;   
    for(var i=0;i<products.length;i++)
    {
        if (products[i]._id == id) 
        {
            
            createProductPanel2(products[i]);
            //hideProductDiv(event);

            break;
        }
    }

    // storeProducts();
}

function updateProducttoList(id){

    var objProduct1 = new Object();
    objProduct1.id=id;
    objProduct1.name =document.getElementById("txtProductName").value;
    objProduct1.desc=document.getElementById("txtProductDesc").value;
    objProduct1.price=document.getElementById("txtProductPrice").value;
    objProduct1.quan=document.getElementById("txtProductQuan").value;
   // objProduct1.img=document.getElementById("txtProductImg").value;
    console.log(id);
    //updating product details in array
    for(var i=0;i<products.length;i++)
    {
        if(id==products[i]._id)
        {
            products[i]=objProduct1;
            break;
        }
    }
    //removeFromDom();
    let oldProID = id;
    document.getElementById(id).children[1].innerHTML = objProduct1.name;
    document.getElementById(id).children[5].innerHTML = objProduct1.desc;
    document.getElementById(id).children[9].innerHTML = objProduct1.price;
    document.getElementById(id).children[13].innerHTML = objProduct1.quan;

    deleteNewProductPanel2();
    updateDatabase(oldProID,objProduct1);
}

function hideAddNewnk()
{
   aAddProduct.setAttribute("style","visibility:hidden");
}

function unhideAddNewProductLink()
{
aAddProduct.setAttribute("style","visibility:visible;color:white;text-decoration:none;margin-top:2%;font-weight:bold");
}

function deleteNewProductPanel()
{
   var childNodes = divAddProducts.childNodes;
   for (var i = 0; childNodes.length > 0;) 
   {
     divAddProducts.removeChild(childNodes[i]);
   }
}

function deleteNewProductPanel2()
{
   var childNodes = divAddProducts.childNodes;
   for (var i = 0; childNodes.length > 0;) 
   {
     divAddProducts.removeChild(childNodes[i]);
   }
}

function addProducttoList(event)
{
    let  objProduct = new Object();
    let name = (document.getElementById("txtProductDesc").value)
    let desc = document.getElementById("txtProductName").value
    let price = document.getElementById("txtProductPrice").value
    let quantity = document.getElementById("txtProductQuan").value
    objProduct.name = name
    objProduct.desc = desc
    objProduct.price = price 
    objProduct.quan =  quantity
    if(objProduct.name=="" || objProduct.desc=="" || objProduct.price==""|| objProduct.quan=="" )
    {
        alert("all fields are compulsory");
    }
    else
    {
        products.push(objProduct);
        addProductToDOM(objProduct);
        storeProducts();
        console.log(products);
        deleteNewProductPanel();
        productId++;
    }
}

function deleteFromDataBase(id){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200){
     alert("deleted");
    }
  };
  xhttp.open("POST", "/index/delete", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send("id="+JSON.stringify(id));
}

function storeProducts(){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
     alert("Appended");
    }
  };
  xhttp.open("POST", "/index/array", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send("productList="+JSON.stringify(products));
}

function addProductToDOM(objProduct)
{  	

    var divProduct = document.createElement("div");
    divProduct.setAttribute("id", objProduct._id);
    insertBlankLine(divProduct,2);
    var labelProductName=document.createElement("label");
    var labelProductDesc=document.createElement("label");
    var labelProductPrice=document.createElement("label");
    var labelProductQuantity=document.createElement("label");
    var lblProductName = document.createElement("label");
    labelProductName.innerHTML="Name : - "
    labelProductName.setAttribute('style','font-weight:bold;');
    lblProductName.innerHTML=objProduct.name;
    lblProductName.setAttribute('style','font-weight:bold;margin:15px;');
    divProduct.appendChild(labelProductName);
    divProduct.appendChild(lblProductName);
    insertBlankLine(divProduct,2);


    var lblProductDesc = document.createElement("label");
    labelProductDesc.innerHTML="Description : - "
    labelProductDesc.setAttribute('style','font-weight:bold');
    lblProductDesc.innerHTML =objProduct.desc;
    lblProductDesc.setAttribute('style','font-weight:bold');
    divProduct.appendChild(labelProductDesc);
    divProduct.appendChild(lblProductDesc);

    insertBlankLine(divProduct,2);

    var lblProductPrice = document.createElement("label");
    labelProductPrice.innerHTML="Price : - "
    lblProductPrice.innerHTML = objProduct.price;
    lblProductPrice.setAttribute('style','font-weight:bold');
    labelProductPrice.setAttribute('style','font-weight:bold');
    divProduct.appendChild(labelProductPrice);
    divProduct.appendChild(lblProductPrice);

    insertBlankLine(divProduct,2);

    var lblProductQuan = document.createElement("label");
    labelProductQuantity.innerHTML="Quantity : - ";
    labelProductQuantity.setAttribute('style','font-weight:bold');
    lblProductQuan.innerHTML = objProduct.quan;
    lblProductQuan.setAttribute('style','font-weight:bold');
    divProduct.appendChild(labelProductQuantity);
    divProduct.appendChild(lblProductQuan);

    insertBlankLine(divProduct,2);

    insertBlankLine(divProduct,2);

    var buttonEdit = document.createElement("button");
    buttonEdit.innerHTML = "edit";
    buttonEdit.setAttribute('style','')
    divProduct.setAttribute('style','border-radius:25px;margin-top:40px;border:1px solid black;background-color:lightgreen; ');
    divProduct.appendChild(buttonEdit);
    divListProducts.appendChild(divProduct);
    buttonEdit.addEventListener("click",function(event){
    editProductDiv(event);
    count=1;
    });

    var buttonDelete = document.createElement("button");
    buttonDelete.innerHTML = "Delete";
    buttonDelete.setAttribute("style","margin-left:20px");
    divProduct.appendChild(buttonDelete);
    divListProducts.appendChild(divProduct);
    buttonDelete.addEventListener("click",function(event){
        deleteProductDiv(event);
    });

    insertBlankLine(divProduct,2);
    unhideAddNewProductLink();
}

function createProductPanel()
{
    unhideAddNewProductLink();

    var fildset=document.createElement('fieldset');
    fildset.setAttribute('style','border-radius:25px;height:200px;width:500px;margin-left:32%;margin-top:10px;background-color:lightgreen');
    var div=document.createElement('div');
    var lblAddProduct=document.createElement("label");
    lblAddProduct.innerHTML = "Add New Product";
    lblAddProduct.setAttribute("style","display:block;font-weight:bold;text-align:center;padding:5px 10px");
    div.setAttribute('style','color:white;width:1360px;height:50px;margin-left:-10px;');
    div.appendChild(lblAddProduct);
    divAddProducts.appendChild(div);

    //insertBlankLine(divAddProducts,2);

    var txtProductName = document.createElement("input");
    var label4=document.createElement('label');
    label4.innerHTML="Name :-";
    label4.setAttribute('style','font-weight:bold');
    txtProductName.setAttribute("type","text");
    txtProductName.setAttribute("id","txtProductName");
    txtProductName.setAttribute("placeholder", "Enter the product name");	
    txtProductName.setAttribute("style","width:250px;margin-left:38px");
    fildset.appendChild(label4);
    fildset.appendChild(txtProductName);	

    insertBlankLine(fildset,2);

    var txtProductDesc = document.createElement("input");
    var label3=document.createElement('label');
    label3.innerHTML="Description :-";
    label3.setAttribute('style','font-weight:bold');
    txtProductDesc.setAttribute("type","text");
    txtProductDesc.setAttribute("id","txtProductDesc");
    txtProductDesc.setAttribute("placeholder", "Enter the product description");	
    txtProductDesc.setAttribute("style","width:250px; height:50px");
    count=1;
    count=1;
    fildset.appendChild(label3);
    fildset.appendChild(txtProductDesc);	

    insertBlankLine(fildset,2);

    var txtProductPrice = document.createElement("input");
    var label2=document.createElement('label');
    label2.innerHTML="Price :-";
    label2.setAttribute('style','font-weight:bold');
    txtProductPrice.setAttribute("type","number");
    txtProductPrice.setAttribute("id","txtProductPrice");
    txtProductPrice.setAttribute("placeholder", "Enter the product price");	
    txtProductPrice.setAttribute("style","width:250px;margin-left:44px");
    fildset.appendChild(label2);
    fildset.appendChild(txtProductPrice);	

    insertBlankLine(fildset,2);

    var txtProductQuan = document.createElement("input");
    var label1=document.createElement('label');
    label1.innerHTML="Quantity :-";
    label1.setAttribute('style','font-weight:bold');
    txtProductQuan.setAttribute("type","number");
    txtProductQuan.setAttribute("id","txtProductQuan");
    txtProductQuan.setAttribute("placeholder", "Enter the product Quantity");	
    txtProductQuan.setAttribute("style","width:250px;margin-left:20px");
    fildset.appendChild(label1);
    fildset.appendChild(txtProductQuan);
    
    insertBlankLine(fildset,2);

    insertBlankLine(fildset,2);

    var btnAddButton = document.createElement("button");
    btnAddButton.setAttribute("id","btnAddButton");
    btnAddButton.innerHTML = "Add Product";
    btnAddButton.setAttribute('style','');
    fildset.appendChild(btnAddButton);	

    btnAddButton.addEventListener("click", function(event){
        addProducttoList(event);
    });

    var btnCancelButton = document.createElement("button");
    btnCancelButton.setAttribute("id","btnCancelButton");
    btnCancelButton.setAttribute("style","margin-left:30px");
    btnCancelButton.innerHTML = "Cancel";
    btnCancelButton.setAttribute('style','margin-left:25px');
    fildset.appendChild(btnCancelButton);
    divAddProducts.appendChild(fildset);	

    btnCancelButton.addEventListener("click", function(event){
        deleteNewProductPanel();
        createProductPanel();
    });
}

function createProductPanel2(objProduct)
{
    var fildset=document.createElement('fieldset');
    fildset.setAttribute('style','border-radius:25px;height:250px;width:500px;margin-left:32%;margin-top:45px;background-color:lightgreen');
    var lblAddProduct=document.createElement("label");
    lblAddProduct.innerHTML = "Add New Product";
    lblAddProduct.setAttribute("style","font-weight:bold;");
    fildset.appendChild(lblAddProduct);

    insertBlankLine(fildset,2);

    var txtProductName = document.createElement("input");
    var label4=document.createElement('label');
    label4.innerHTML="Name :-";
    label4.setAttribute('style','font-weight:bold');
    txtProductName.setAttribute("type","text");
    txtProductName.setAttribute("id","txtProductName");
    txtProductName.setAttribute("value",objProduct.name);	
    txtProductName.setAttribute("style","width:250px;margin-left:38px");
    fildset.appendChild(label4);
    fildset.appendChild(txtProductName);	

    insertBlankLine(fildset,2);

    var txtProductDesc = document.createElement("input");
    var label3=document.createElement('label');
    label3.innerHTML="Description :-";
    label3.setAttribute('style','font-weight:bold');
    txtProductDesc.setAttribute("type","text");
    txtProductDesc.setAttribute("id","txtProductDesc");
    txtProductDesc.setAttribute("value",objProduct.desc);	
    txtProductDesc.setAttribute("style","width:250px; height:50px;");
    fildset.appendChild(label3);
    fildset.appendChild(txtProductDesc);	

    insertBlankLine(fildset,2);

    var txtProductPrice = document.createElement("input");
    var label2=document.createElement('label');
    label2.innerHTML="Price:-";
    label2.setAttribute('style','font-weight:bold');
    txtProductPrice.setAttribute("type","text");
    txtProductPrice.setAttribute("id","txtProductPrice");
    txtProductPrice.setAttribute("value",objProduct.price);	
    txtProductPrice.setAttribute("style","width:250px;margin-left:48px");
    fildset.appendChild(label2);
    fildset.appendChild(txtProductPrice);	

    insertBlankLine(fildset,2);

    var txtProductQuan = document.createElement("input");
    var label1=document.createElement('label');
    label1.innerHTML="Quantity :-";
    label1.setAttribute('style','font-weight:bold');
    txtProductQuan.setAttribute("type","text");
    txtProductQuan.setAttribute("id","txtProductQuan");
    txtProductQuan.setAttribute("value",objProduct.quan);	
    txtProductQuan.setAttribute("style","width:250px;margin-left:20px");
    fildset.appendChild(label1);
    fildset.appendChild(txtProductQuan);	

    insertBlankLine(fildset,2);
    
    var btnAddButton = document.createElement("button");
    btnAddButton.setAttribute("id","btnAddButton");
    btnAddButton.innerHTML = "Update Product";
    btnAddButton.setAttribute('style',';margin-left:25px');
    fildset.appendChild(btnAddButton);	
    console.log(objProduct);
    btnAddButton.addEventListener("click", function(event){
        console.log(objProduct._id);
        updateProducttoList(objProduct._id);
    });	

    var btnCancelButton = document.createElement("button");
    btnCancelButton.setAttribute("id","btnCancelButton");
    btnCancelButton.setAttribute("style","margin-left:30px");
    btnCancelButton.innerHTML = "Cancel";
    btnCancelButton.setAttribute('style','margin-left:25px');
    fildset.appendChild(btnCancelButton);
    divAddProducts.appendChild(fildset);	

    btnCancelButton.addEventListener("click", function(event){
        deleteNewProductPanel();
    });
}