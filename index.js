import {
  AmbientLight,
  AxesHelper,
  DirectionalLight,
  GridHelper,
  PerspectiveCamera,
  Raycaster,
  Vector2,
  Scene,

  WebGLRenderer,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { IfcAPI } from "web-ifc/web-ifc-api";
import { IFCLoader }from "web-ifc-three/IFCLoader";
import { IFCSLAB } from "web-ifc";
import {
  acceleratedRaycast,
  computeBoundsTree,
  disposeBoundsTree
} from 'three-mesh-bvh';






//LISTA DE VARIABLES
var ListaIFCCargados =[];
const ifcModels = [];





document.getElementsByClassName("ToogleIFCCargado").checked = false;
function myFunction(){
  scene.remove(ListaIFCCargados[0]);
}

//Creates the Three.js scene
const scene = new Scene();

//Object to store the size of the viewport

const size = {

  width: window.innerWidth,
  height: window.innerHeight,
};

//Creates the camera (point of view of the user)
const camera = new PerspectiveCamera(75, size.width / size.height);
camera.position.z = 15;
camera.position.y = 13;
camera.position.x = 8;

//Creates the lights of the scene
const lightColor = 0xffffff;

const ambientLight = new AmbientLight(lightColor, 0.5);
scene.add(ambientLight);

const directionalLight = new DirectionalLight(lightColor, 1);
directionalLight.position.set(0, 10, 0);
directionalLight.target.position.set(-5, 0, 0);
scene.add(directionalLight);
scene.add(directionalLight.target);

//Sets up the renderer, fetching the canvas of the HTML
const threeCanvas = document.getElementById("three-canvas");
const renderer = new WebGLRenderer({ canvas: threeCanvas, alpha: true });
renderer.setSize(size.width, size.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

//Creates grids and axes in the scene
const grid = new GridHelper(50, 50);
scene.add(grid);

const axes = new AxesHelper();
axes.material.depthTest = false;
axes.renderOrder = 1;
scene.add(axes);

//Creates the orbit controls (to navigate the scene)
const controls = new OrbitControls(camera, threeCanvas);
controls.enableDamping = true;
controls.target.set(-2, 0, 0);

//Animation loop
const animate = () => {
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
};

animate();

//Adjust the viewport to the size of the browser
window.addEventListener("resize", () => {
  (size.width = window.innerWidth), (size.height = window.innerHeight);
  camera.aspect = size.width / size.height;
  camera.updateProjectionMatrix();
  renderer.setSize(size.width, size.height);
});
const ifcLoader = new IFCLoader();


// Sets up optimized picking
ifcLoader.ifcManager.setupThreeMeshBVH(
  computeBoundsTree,
  disposeBoundsTree,
  acceleratedRaycast);

//CLICK EN BOTON SUBIR ARCHIVOS
  const BotonSubir = document.getElementById("Boton1");
  const SelectorFichero=document.getElementById("input-element"); 
  BotonSubir.onclick=()=>{
  SelectorFichero.click();}
  SelectorFichero.onchange=(changed)=>{console.log(changed);}

  //Cambiamos el valor del toogle
  document.getElementsByClassName("slider round").checked = true;


  

  SelectorFichero.addEventListener("change",

    async (changed) => {
     
      try{
        const file = changed.target.files[0];
        const ifcURL = URL.createObjectURL(file);
        const ifcModel = await ifcLoader.loadAsync(ifcURL);
        scene.add(ifcModel);
        processIfc(ifcModel);
      
        ListaIFCCargados.push(ifcModel);//Añadimos el ifc a la lista de ifcs cargados.
        
        document.getElementById("NombreIFC").innerHTML=file.name+" Modelos: "+(ListaIFCCargados.length);
      }
      catch
      {
        MensajeAlerta();
      }
      
     
    },

    false
  );




//Sets up the IFC loading


  const raycaster = new Raycaster();

  async function processIfc(ifcModel) {

    
    
  
    modelID=ifcModel.modelID;
    //Este código loguea los objetos suelo 
    const slabs = await ifcLoader.ifcManager.getAllItemsOfType(modelID, IFCSLAB, false);
    console.log(slabs);
    //Este código loguea el primer suelo encontrado. Si el último argumento es true, da las propiedades de todos los enlazados (tipo, etc)
    const slab = slabs[0];
    const slabProperties = await ifcLoader.ifcManager.getItemProperties(modelID, slab, true);
    console.log(slabProperties);


    //Este código loguea los Psets de ese suelo
    const slabPsets = await ifcLoader.ifcManager.getPropertySets(modelID, slab, false);
    console.log("Los Psets son:",slabPsets);

    const pset=slabPsets[0];
    const propertyId=pset.HasProperties[0].value;
    console.log(propertyId);
    const property=await ifcLoader.ifcManager.getItemProperties(modelID,propertyId,false);
    console.log(property);




    //Este código loguea en consola el arbol completo del IFC
    const tree = await ifcLoader.ifcManager.getSpatialStructure(0);
    console.log(tree);


    
  }
  //ELIGE DIRECTORIO DE LA OBRA
const BotonCarpetaObra = document.getElementById("Boton2");
const SelectorCarpeta=document.getElementById("input-folder"); 
BotonCarpetaObra.onclick=()=>{
SelectorCarpeta.click();}
SelectorCarpeta.onchange=(changed)=>{console.log(changed);}

  //CLICK EN BOTON DESCARGAR IFC
  const BotonDescargaIFC = document.getElementById("button1");
  BotonDescargaIFC.onclick=()=>{DescargaIFC();}



  //ALERTA SI NO SE CARGA UN IFC
  function MensajeAlerta() {
    var txt;
    if (confirm("Ha habido un problema, ¿estás seguro de que el archivo cargado es un IFC?")) {
     return;
    }
  }

  //CARGAR Y DESCARGAR IFCs
  let Par=0;
  function DescargaIFC() {
    if(Par==0)
    {
      scene.remove(ListaIFCCargados[0]);
      Par=1
    }
    else{ 
      scene.add(ListaIFCCargados[0])
      Par=0
    }
      console.log(Par);
  }
 
   
//PARA SELECCIONAR OBJETO


const ifcLoader2 = new IFCLoader();

// Sets up optimized picking
ifcLoader.ifcManager.setupThreeMeshBVH(
  computeBoundsTree,
  disposeBoundsTree,
  acceleratedRaycast);



const raycaster2 = new Raycaster();
raycaster2.firstHitOnly = true;
const mouse = new Vector2();
const Canvas=document.getElementById("three-canvas")
function cast(event) {

  // Computes the position of the mouse on the screen
 
  const bounds = Canvas.getBoundingClientRect();


  const x1 = event.clientX - bounds.left;
  const x2 = bounds.right - bounds.left;
  mouse.x = (x1 / x2) * 2 - 1;

  const y1 = event.clientY - bounds.top;
  const y2 = bounds.bottom - bounds.top;
  mouse.y = -(y1 / y2) * 2 + 1;

  // Places it on the camera pointing to the mouse
  raycaster2.setFromCamera(mouse, camera);
 
  // Casts a ray
  return  raycaster2.intersectObjects(ListaIFCCargados);
}
const output = document.getElementById("id-output");
async function pick(event) {

  const found = cast(event)[0];
  console.log(found);
  
  if (found) {
      const index = found.faceIndex;
      const geometry = found.object.geometry;
      const ifc = ifcLoader.ifcManager;
      const id =await ifc.getExpressId(geometry, index);
      output.innerHTML = id;
    console.log(id);
  }
}
window.ondblclick = pick;



  