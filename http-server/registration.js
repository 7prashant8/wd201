const userentry= document.getElementById("user");

let retrievedata=()=>{
    let getdata= localStorage.getItem("user-value");
    if(getdata){
        getdata= JSON.parse(getdata);
    }
    else{
        getdata=[];
    }
    return getdata;
}
let uservalues=retrievedata();
let displayentries=()=>{
    let entries=retrievedata();
    let table= entries.map((entry)=>{
        const namecell= `<td>${entry.name}</td>`;
        const emailcell= `<td>${entry.email}</td>`;
        const passwordcell= `<td>${entry.password}</td>`;
        const dobcell= `<td>${entry.dob}</td>`;
        const acceptedcell= `<td>${entry.checked}</td>`;

        let row=`<tr> ${namecell} ${emailcell} ${passwordcell} ${dobcell} ${acceptedcell}</tr`;
        console.log(entries);
        return row;
    }).join("/n");

    const tabledata=`<table class="table">
    
        <tr>
            <th scope="col">Name</th>
            <th scope="col">Email</th>
            <th scope="col">Password</th>
            <th scope="col">Dob</th>
            <th scope="col">Accepted terms?</th>
        </tr>
        ${table} 
    </table>`;
    let display= document.getElementById("display");
    display.innerHTML=tabledata;
}

let setvalues=(event)=>{
    event.preventDefault();
    const name= document.getElementById("name").value;
    const email= document.getElementById("email").value;
    const password= document.getElementById("password").value;
    const dob= document.getElementById("dob").value;
    const checked= document.getElementById("accepted").checked;

    let users={
        name,
        email,
        password,
        dob,
        checked
    }

    uservalues.push(users);
    localStorage.setItem("user-value",JSON.stringify(uservalues));
    displayentries();
}
userentry.addEventListener("submit",setvalues);
displayentries();