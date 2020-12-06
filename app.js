const express = require('express'); 
const bodyParser = require('body-parser');
const fs = require('fs');
const mime = require('mime');
const app = express(); 
//faceapi
const path = require('path');
const faceapi = require('face-api.js')
const canvas = require('canvas') 
// const facemodule = require('./routes/facemodule');
const { Canvas, Image, ImageData } = canvas
faceapi.env.monkeyPatch({ Canvas, Image, ImageData })

app.use(express.static('public'));
// app.use('/public/appImage',express.static(__dirname+"/public/appImage"));
app.use(bodyParser.urlencoded({extended:false}));
app.locals.pretty=true;

Promise.all([
    faceapi.nets.faceRecognitionNet.loadFromDisk('./public/models'),
    faceapi.nets.faceLandmark68Net.loadFromDisk('./public/models'),
    faceapi.nets.ssdMobilenetv1.loadFromDisk('./public/models')
])
// app.get('/face/:imageName',async (req,res) => {
//     try{
//         const imageName = req.params.imageName;
//         const imagePath = "./public/appImage/" + imageName;
//         console.log('imagepath: ',imagePath)
//         const imageMime = mime.getType(imagePath);
//         console.log('imageMime',imageMime)
//         fs.readFile(imagePath, (err,data)=> {
//             if(err){
//                 res.writeHead(500,{'Content-Type':'text/html'});
//                 res.end('500 Internal Server '+err);
//             }else{
//                 res.writeHead(200, {'Content-Type':imageMime});
//                 console.log('data: ', data)
//                 // const inputImg = uploadImage(data)
//                 // loadmodel(inputImg)
//                 // loadmodel(data)
//                 res.end(data);
//             }
//         });
//     }catch (error) {
//         console.log(error);
//     } 
// })
app.get('/detect',async function(req,res){
    const face = await faceDetect()
    console.log("face갯수===",face.length)

})


// async function loadmodel(){
//     console.log('=====로드중===')
//     await faceapi.nets.faceRecognitionNet.loadFromDisk('./public/models').then(() => {
//         console.log("Completed loading Face model-1");
//       });
//     await faceapi.nets.faceLandmark68Net.loadFromDisk('./public/models').then(() => {
//         console.log("Completed loading Face model-2");
//       });
//     await faceapi.nets.ssdMobilenetv1.loadFromDisk('./public/models').then(() => {
//         console.log("Completed loading Face model-3");
//       });

// }
// async function loadmodel(){
//     console.log('=====로드중====')
//     Promise.all([
//         // faceapi.nets.faceRecognitionNet.loadFromDisk('./public/models'),
//         // faceapi.nets.faceLandmark68Net.loadFromDisk('./public/models'),
//         // faceapi.nets.ssdMobilenetv1.loadFromDisk('./public/models')
//         faceapi.nets.faceRecognitionNet.loadFromDisk(path.join(__dirname, 'models')),
//         faceapi.nets.faceLandmark68Net.loadFromDisk(path.join(__dirname, 'models')),
//         faceapi.nets.ssdMobilenetv1.loadFromDisk(path.join(__dirname, 'models'))
//     ])
//     .then(console.log("Completed loading Face model"))
//     .then(console.log('===얼굴갯수==',faceDetect()))
// }
// async function loadmodel(){
//     await faceapi.nets.faceRecognitionNet.loadFromDisk(path.join(__dirname, 'public/models')).then(() => {
//         console.log("Completed loading faceRecognition model");
//       });
//     await faceapi.nets.faceLandmark68Net.loadFromDisk(path.join(__dirname, 'public/models')).then(() => {
//         console.log("Completed loading Landmark model");
//       });
//     await faceapi.nets.ssdMobilenetv1.loadFromDisk(path.join(__dirname, 'public/models')).then(() => {
//         console.log("Completed loading Face model");
//       });
// }

// async function uploadImage(imgFile){
//     const bufferImg = await faceapi.bufferToImage(imgFile)
//     return bufferImg
// }

async function faceDetect(){
    // const inputImg = await faceapi.fetchImage('./appImage/no_gieun.jpg')
    console.log("==detect==")
    const inputImg = await canvas.loadImage('./public/appImage/twice.jpg');
    const detections = await faceapi.detectAllFaces(inputImg).withFaceLandmarks().withFaceDescriptors()
    console.log("detection===",detections)
    return detections
}

// app.get('/load',function(req,res){
//   return loadmodel()
// })


app.use(function(req,res,next){
    res.status(404).send('Sorry cant find that!')
})
  
app.use(function(err,req,res,next){ //error handling
    console.log(err.stack)
    res.status(500).send('Something broke!')
})

app.listen(3000,function(){
    console.log('Connected, 3000 port!!!')
})