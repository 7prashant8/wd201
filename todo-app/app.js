const express = require('express')
const app = express()
const {request , response} = require('express')
const {todos } = require('./models')
const bodyParser = require('body-parser')

app.use(bodyParser.json())

app.get('/todos', (request, response)=>{
    console.log('Todo List')
})

app.post('/todos', async (request, response)=>{
    console.log('Creating a Todo: ', request.body)
    try {
        const todo = await Todos.addTask({title: request.body.title,
                                        dueDate: request.body.dueDate,
                                        completed: false})
        return response.json(todo)
    } catch (error) {
        console.log(error)
        return response.status(422).json(error)
    }

    
})

app.put('/todos/:id/markAsCompleted',(request, response)=>{
    console.log('We have to update a todo with ID: ',request.params.id)
})

app.delete('/todos/:id',(request, response)=>{
    console.log('We have to delete a todo with ID: ',request.params.id)
})

module.exports = app;