// let innerUploadImage=document.querySelector(".inner-upload-image")
// let input=innerUploadImage.querySelector("input");
// let image=document.querySelector("#image")
// let loading=document.querySelector("#loading")
// let btn=document.querySelector("button")
// let text=document.querySelector("#text")
// let output=document.querySelector(".output")

// const Api_url="https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyAYlfxQdPbnnxST7L57qEzRyGUo-AyFhws"

// let fileDetails={
//     mime_type:null,
//     data:null
// }
// async function generateResponse() {
//  const RequestOption={
//     method:"POST",
//     headers:{"Content-Type": "application/json "},
//     body:JSON.stringify({
//         "contents": [{
//         "parts":[
//             {"text": "solve the mathematical problem with proper steps of solution"},
//             {
//               "inline_data": {
//                 "mime_type":fileDetails.mime_type,
//                 "data": fileDetails.data
//               }
//             }
//         ]
//         }]
//     })
//  }

// try{
//     let response=await fetch(Api_url,RequestOption)
//     let data=await response.json()
//     let apiResponse=data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g,"$1").trim()
    
//    text.innerHTML=apiResponse
//    output.style.display="block"
// }
// catch(e){
// console.log(e)
// }
// finally{
//     loading.style.display="none"
// }
// }





// input.addEventListener("change",()=>{
//    const file=input.files[0]
// if(!file)return
// let reader=new FileReader()
// reader.onload=(e)=>{  
//     let base64data=e.target.result.split(",")[1]
// fileDetails.mime_type=file.type;
// fileDetails.data=base64data

// innerUploadImage.querySelector("span").style.display="none"
// innerUploadImage.querySelector("#icon").style.display="none"
// image.style.display="block"
// image.src=`data:${fileDetails.mime_type};base64,${fileDetails.data}`
// output.style.display="none"
// }


   
//  reader.readAsDataURL(file)   
// })

// btn.addEventListener("click",()=>{
//     loading.style.display="block"
//     generateResponse()
// })








// innerUploadImage.addEventListener("click",()=>{
//     input.click()
// })




let innerUploadImage = document.querySelector(".inner-upload-image");
let input = innerUploadImage.querySelector("input");
let image = document.querySelector("#image");
let loading = document.querySelector("#loading");
let btn = document.querySelector("button");
let output = document.querySelector(".output");
let text = document.querySelector("#text");
let uploadText = document.querySelector(".upload-text"); // NEW: Get the "Upload Image" text
let icon = document.querySelector("#icon"); // NEW: Get the plus icon

input.addEventListener("change", () => {
    const file = input.files[0];
    if (!file) {
        alert("No file selected!");
        return;
    }

    let reader = new FileReader();
    reader.onload = (e) => {
        image.src = e.target.result;
        image.style.display = "block";
        output.style.display = "none"; // Hide output until processed

        // NEW: Hide upload text and icon
        if (uploadText) uploadText.style.display = "none";
        if (icon) icon.style.display = "none";

        console.log("Image uploaded successfully!");
    };
    reader.readAsDataURL(file);
});

// Ensure clicking the upload box opens the file selector
innerUploadImage.addEventListener("click", () => {
    input.click();
});

// Process image with Tesseract.js
async function extractMathFromImage() {
    if (!image.src || image.src === "") {
        alert("Please upload an image first!");
        return;
    }

    loading.style.display = "block";
    text.innerHTML = "Processing...";

    try {
        let { data: { text: extractedText } } = await Tesseract.recognize(image.src, 'eng');

        console.log("Extracted Text:", extractedText);

        if (extractedText.trim() === "") {
            text.innerHTML = "No text detected!";
        } else {
            solveMath(extractedText);
        }
    } catch (error) {
        console.error("OCR Error:", error);
        text.innerHTML = "Error processing image!";
    } finally {
        loading.style.display = "none";
    }
}

// Solve extracted math expression
function solveMath(expression) {
    try {
        let result = math.evaluate(expression);
        text.innerHTML = `Expression: ${expression} <br> Solution: ${result}`;
        output.style.display = "block";
    } catch (error) {
        console.error("Math Parsing Error:", error);
        text.innerHTML = "Could not solve the math problem.";
    }
}

btn.addEventListener("click", extractMathFromImage);
