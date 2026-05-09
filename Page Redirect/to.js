document.addEventListener("DOMContentLoaded", () => {

let thoughts = [];
let viewers = [];

function loadthoughts(){
    let store = localStorage.getItem("thoughts");
    let view = localStorage.getItem("viewers");

    if(store){
        thoughts = JSON.parse(store);
    }
    if(view){
        viewers = JSON.parse(view);
    }
}

function savethoughts(){
    localStorage.setItem("thoughts", JSON.stringify(thoughts));
    localStorage.setItem("viewers", JSON.stringify(viewers));
}

document.getElementById("btn").addEventListener("click", () => {
    let input = document.getElementById("thoughtinput").value;

    if(input.trim() === ""){
        alert("enter something!");
        return;
    }

    thoughts.push(input);
    savethoughts();

    document.getElementById("thoughtinput").value = "";
    alert("thought added!");
});

document.getElementById("check").addEventListener("click", () => {
    let viename = document.getElementById("viewname").value;

    if(viename.trim() === ""){
        alert("enter viewer name");
        return;
    }

    viewers.push(viename);
    savethoughts();

    displayviewer();
});

function displayviewer(){
    let list = document.getElementById("output");
    list.innerHTML = "";

    viewers.forEach(view => {
        let li = document.createElement("li");
        li.innerHTML = view;
        list.appendChild(li);
    });
}

loadthoughts();

});