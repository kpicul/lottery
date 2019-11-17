
function add(a , b){
    return new Promise((resolve, reject) => {
        setTimeout(
            () => {
                resolve(a + b);
            },
            Math.floor(Math.random()*100)+1
        );
    });
}
function mult(a, b){
    return new Promise((resolve, reject) => {
        setTimeout(
            () => {
                resolve(a * b);
            },
            Math.floor(Math.random()*100)+1
        );
    });
}

function divide(a, b){
    return new Promise((resolve, reject) => {
        setTimeout(
            () => {
                resolve(a / b);
            },
            Math.floor(Math.random()*100)+1
        );
    });
}

async function results(a, b){
    var a = await add (a, b);
    console.log("add: "+ a);
    var c = await mult(a, b);
    console.log("multiply: "+c);
    var d = await divide(b, a);
    console.log("divide: "+ d);
}

function unpack(){
    return "a", "b";
}

var dict = new Object();
console.log(dict["nil"] == undefined);