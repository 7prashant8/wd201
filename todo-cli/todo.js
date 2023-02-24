const todoList = () => {
    all = []
    const add = (todoItem) => {
      all.push(todoItem)
    }
    const markAsComplete = (index) => {
      all[index].completed = true
    }
  
    const overdue = () => {
      // Write the date check condition here and return the array
      // of overdue items accordingly.
      let overdued=[];
      const dued = all.filter((item)=>{
        if( item.dueDate===yesterday){
            if(item.completed===false)
            overdued.push(['[ ]',item.title,item.dueDate]);
            else 
            overdued.push(['[x]',item.title,item.dueDate]);
            return item;
        }
    });
    
      return overdued;
    }
  
    const dueToday = () => {
      // Write the date check condition here and return the array
      // of todo items that are due today accordingly.
      let todaydued=[];
      const dued = all.filter((item)=>{
        if( item.dueDate===today)
        { 
          if(item.completed===false)
          todaydued.push(['[ ]',item.title,'']);
          else
          todaydued.push(['[x]',item.title,'']);
          return item;
        }
    });
    return todaydued;
    }
  
    const dueLater = () => {
      // Write the date check condition here and return the array
      // of todo items that are due later accordingly.
      let laterdued = [];
      const dued = all.filter((item)=>{
        if(item.dueDate===tomorrow){
          if(item.completed===false)
              laterdued.push(['[ ]',item.title,item.dueDate]);
          else 
              laterdued.push(['[x]',item.title,item.dueDate]);
          return item;
        }
    });
    return laterdued;
    }
  
    const toDisplayableList = (list) => {
      // Format the To-Do list here, and return the output string
      // as per the format given above.
      let outputstr ='';
      let output=[];
      for(i in list){
            outputstr+=list[i][0]+" "+list[i][1]+" "+list[i][2]+'\r';
      }
      output.push(outputstr);
      
      return output[0];
    }
  
    return {
      all,
      add,
      markAsComplete,
      overdue,
      dueToday,
      dueLater,
      toDisplayableList
    };
  };
  
  // ####################################### #
  // DO NOT CHANGE ANYTHING BELOW THIS LINE. #
  // ####################################### #
  
  const todos = todoList();
  
  const formattedDate = d => {
    return d.toISOString().split("T")[0]
  }
  
  var dateToday = new Date()
  const today = formattedDate(dateToday)
  const yesterday = formattedDate(
    new Date(new Date().setDate(dateToday.getDate() - 1))
  )
  const tomorrow = formattedDate(
    new Date(new Date().setDate(dateToday.getDate() + 1))
  )
  
  todos.add({ title: 'Submit assignment', dueDate: yesterday, completed: false })
  todos.add({ title: 'Pay rent', dueDate: today, completed: true })
  todos.add({ title: 'Service Vehicle', dueDate: today, completed: false })
  todos.add({ title: 'File taxes', dueDate: tomorrow, completed: false })
  todos.add({ title: 'Pay electric bill', dueDate: tomorrow, completed: false })
  
  console.log("My Todo-list\n")
  
  console.log("Overdue")
  var overdues = todos.overdue()
  var formattedOverdues = todos.toDisplayableList(overdues)
  console.log(formattedOverdues)
  console.log("\n")
  
  console.log("Due Today")
  let itemsDueToday = todos.dueToday()
  let formattedItemsDueToday = todos.toDisplayableList(itemsDueToday)
  console.log(formattedItemsDueToday)
  console.log("\n")
  
  console.log("Due Later")
  let itemsDueLater = todos.dueLater()
  let formattedItemsDueLater = todos.toDisplayableList(itemsDueLater)
  console.log(formattedItemsDueLater)
  console.log("\n\n")