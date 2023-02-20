const fs=require("fs");

// fs.writeFile("sample.txt",
//         "Hello World! I am created!",
//         (err)=>{
            
//             if(err){
//                 throw err;
//             }
//             else console.log('File Created!')
//         }
//         );
fs.readFile('sample.txt',
            (err,data)=>{
                if(err) throw err;
                else console.log(data.toString());
            })