let hubModelRatios = {
    nexusInter3:    [0.733, 1.000, 1.360],
    nexusInter3M:   [0.632, 0.741, 1.000],
    nexusC3000:     [0.632, 0.741, 0.843, 0.989, 1.145, 1.335, 1.545],
    nexusC6000:     [0.527, 0.644, 0.748, 0.851, 1.000, 1.223, 1.419, 1.615],
    alfine8:        [0.527, 0.644, 0.748, 0.851, 1.000, 1.223, 1.419, 1.615],
    alfine11:       [0.527, 0.681, 0.770, 0.878, 0.995, 1.134, 1.292, 1.462, 1.667, 1.888, 2.153],
    speedhub500_14: [0.279, 0.316, 0.360, 0.409, 0.464, 0.528, 0.600, 0.682, 0.774, 0.881, 1.000, 1.135, 1.292, 1.467],
    archer2:        [1.000, 1.380],
    archer3:        [0.750, 1.000, 1.330],
    archer4:        [1.000, 1.280, 1.640, 2.100],
    archer5:        [0.640, 0.800, 1.000, 1.250, 1.560],
    archer8:        [1.000, 1.300, 1.480, 1.690, 1.920, 2.200, 2.500, 3.250],
    sramI3:         [0.734, 1.000, 1.362],
    sramI9:         [0.542, 0.621, 0.727, 0.853, 1.000, 1.172, 1.375, 1.611, 1.844],

    kt:             [1.000, 1.300]
}

let slideIndex = 0;
let slideTimer;

function showSlide() {
    let slides = document.getElementsByClassName("slide");
    if(slides.length == 1) {
        slides[0].style.display = "block";
        return;
    }

    for(let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slides[slideIndex].style.display = "block";
    slideIndex++;
    if(slideIndex >= slides.length) { slideIndex = 0; }
    slideTimer = setTimeout(showSlide, 5000);
}

function fillSlideshow(hubModel) {
    clearTimeout(slideTimer);
    let container = document.getElementById("slideshow-container");
    container.innerHTML = "";
    for(i = 1; i <= 10; i++) {
        let img = new Image();
        img.onerror = function() { this.remove(); };
        img.className = "slide fade";
        img.src = "img/" + hubModel + "/" + i + ".png";   
        container.appendChild(img);     
    }    

    slideIndex = 0;
    showSlide();
}

function setCircuitValue (selectedOption) {
    let circuit = document.getElementById("circuit");
    let circuitLabel = document.getElementById("circuit-label");

    if (selectedOption.id == "manually") {
        circuit.removeAttribute("disabled");
        circuitLabel.innerText = "Длина окружности (500-3000 мм.)";
    }
    else {
        circuit.value = selectedOption.value;
        circuit.setAttribute("disabled", "");
        circuitLabel.innerText = "Длина окружности в мм.";        
    }
}

function checkCircuitValue (circuit) {
    if (circuit.value < 500 || circuit.value > 3000) {
       alert("Пожалуйста, введите значение\nв диапазоне от 500 до 3000 мм.");
       circuit.value = undefined;
    }
}

function fillSpeedTable() {
    
    let table = document.getElementById("speedTable"); 
    while (table.rows.length > 0) {
        table.deleteRow(0);
    }

    let cadenceStart       = 60;
    let cadenceStep        = 10;
    let cadenceCellsAmount = 8;

    let tr = document.createElement("tr");
    tr.className = "table-header";
    tr.appendChild(document.createElement("td"));
    for (let i = 0; i < cadenceCellsAmount; i++) {
        let td = document.createElement("td");
        td.className = "cadence";
        td.innerText = cadenceStart + cadenceStep*i;
        tr.appendChild(td);
    }
    table.appendChild(tr);

    let leadValue     = document.getElementById("lead").options[lead.selectedIndex].value;
    let drivenValue   = document.getElementById("driven").options[driven.selectedIndex].value;
    let circuitValue  = document.getElementById("circuit").value / 1000000.0;
    let hubModelValue = document.getElementById("hubModel").options[hubModel.selectedIndex].value;
    let hubRatios     = hubModelRatios[hubModelValue];

    let gearsAmount   = hubRatios.length;
    for (let i = 0; i < gearsAmount; i++) {

        let tr = document.createElement("tr");
        tr.className = "table-data";

        let gearRatio = leadValue / drivenValue * hubRatios[i];

        let gear = document.createElement("td");
        gear.className = "gear";
        gear.innerHTML = (i + 1) + " " + "<span>(" + gearRatio.toFixed(3) +")</span>";
        tr.appendChild(gear);

        for (let j = 0; j < cadenceCellsAmount; j++) {
            let speed = (cadenceStart + j * cadenceStep) * 60.0 * gearRatio * circuitValue;
            let td = document.createElement("td");
            td.className = "speed";
            td.innerText = speed.toFixed(1);
            tr.appendChild(td);
        }

        table.appendChild(tr);
    }
}

fillSpeedTable();
fillSlideshow("nexusInter3");