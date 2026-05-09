const txt=document.querySelector("#txt");
const pass=document.querySelector("#pass");
const btn=document.querySelector("#btn");
const message=document.querySelector("p");
btn.addEventListener("click",function(e){
  e.preventDefault();
    console.log("button clicked");
    const email=txt.value;
    const password=pass.value;
   if(email===""){
     message.textContent="pls enter valid email";
     message.style.color="red";
     return;
   }
 if(password===""){
     message.textContent="pls enter valid password";
     message.style.color="red";
     return;
   }
   if(password.length<6){
    message.textContent="password must 6+ characters";
    message.style.color="red";
    return;
   }
   localStorage.setItem("savedEmail",email);
   localStorage.setItem("savedPassword",password);
   const savedEmail=localStorage.getItem("savedEmail");
   const savedPassword=localStorage.getItem("savedPassword");
   if(email===savedEmail  && pass===savedPassword){
   window.location.href="proj.html";}
   else{
    message.textContent="wrong credentials";
    message.style.color="red";
   }
    message.textContent="succesfull login";
   message.style.color="green";
});