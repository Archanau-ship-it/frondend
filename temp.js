const txt=document.getElementById("txt");
const farn=document.getElementById("farn");
const cel=document.getElementById("cel");
const result=document.getElementById("result");
function convert(){
    if(farn){
      temp=(txt.value);
      temp=temp*9/5+32;
      result.textContent=temp
    }
    elseif(cel){
     temp=(txt.value);
      temp=(temp-32)*(5/9);
      result.textContent=temp
    }
    else{
        result.textContent="select a unit"
    }
}
