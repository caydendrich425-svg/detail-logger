const k = "byers";

let r = JSON.parse(localStorage.getItem(k) || "[]");

date.valueAsDate = new Date();

const fmt = (h, m) =>
  (h ? `${h} hr ` : "") + `${m} min`;

function save() {
  localStorage.setItem(k, JSON.stringify(r));
}

function render() {
  tb.innerHTML = "";

  let total = 0;

  r.forEach(x => {

    total += (x.h * 60) + x.m;

    tb.innerHTML += `
      <tr>
        <td>${x.d}</td>
        <td>${x.s}</td>
        <td>${x.v}</td>
        <td>${x.mi}</td>
        <td>${x.t}</td>
        <td>${fmt(x.h,x.m)}</td>
        <td>${x.n || ""}</td>
      </tr>
    `;
  });

  count.textContent = r.length;

  tot.textContent =
    `${Math.floor(total/60)} hr ${total%60} min`;

  save();
}


f.onsubmit = e => {

  e.preventDefault();

  r.push({

    d: date.value,

    s: stock.value,

    v: vin.value.toUpperCase(),

    mi: mileage.value,

    t: type.value,

    h: Number(hrs.value),

    m: Number(mins.value),

    n: notes.value

  });


  f.reset();

  date.valueAsDate = new Date();

  hrs.value = 0;

  mins.value = 0;

  render();
};



clear.onclick = () => {

  if(confirm("Clear all records?")){

    r=[];

    render();

  }

};



pdf.onclick = () => {


const { jsPDF } = window.jspdf;


const doc = new jsPDF({

  orientation:"portrait",

  unit:"mm",

  format:"letter"

});



const logo = new Image();

logo.crossOrigin="anonymous";


logo.onload = () => {

createPDF(logo);

};


logo.onerror = () => {

createPDF(null);

};


logo.src =
"logo.png";




function createPDF(img){



// HEADER

if(img){

doc.addImage(
img,
"PNG",
15,
12,
55,
18
);

}



doc.setFont("montserrat","bold");

doc.setFontSize(18);

doc.text(
"Vehicle Detail Report",
105,
22,
{align:"center"}
);



doc.setFontSize(11);

doc.setFont("montserrat","normal");

doc.text(
"BYER'S AUTO",
105,
30,
{align:"center"}
);




// Employee info

doc.setFontSize(10);

doc.text(
"Employee: Cayden Davenport #204",
15,
45
);


doc.text(
`Report Date: ${new Date().toLocaleDateString()}`,
15,
51
);





// TABLE


doc.autoTable({

startY:60,


head:[

[
"Date",
"Stock",
"VIN",
"Mileage",
"Detail Type",
"Time"
]

],


body:r.map(x=>[

x.d,

x.s,

x.v,

x.mi,

x.t,

fmt(x.h,x.m)

]),


theme:"grid",


styles:{

font:"montserrat",

fontSize:9,

cellPadding:4

},


headStyles:{

fontStyle:"bold",

halign:"center"

}

});






// SUMMARY


let totalMinutes =
r.reduce(
(sum,x)=>sum+(x.h*60+x.m),
0
);



let finalY =
doc.lastAutoTable.finalY + 12;



doc.setFont(
"montserrat",
"bold"
);


doc.text(
`Vehicles Completed: ${r.length}`,
15,
finalY
);


doc.text(
`Total Time: ${Math.floor(totalMinutes/60)} hr ${totalMinutes%60} min`,
15,
finalY+7
);






// FOOTER


doc.setFont(
"montserrat",
"normal"
);

doc.setFontSize(8);


doc.text(

"BYER'S AUTO • Vehicle Detail Department",

105,

285,

{align:"center"}

);



doc.save(
"ByersAuto_Detail_Report.pdf"
);



}


};



render();
