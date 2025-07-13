import readline from "readline"
import { stdin, stdout } from "process"

const rl = readline.createInterface({
    input: stdin,
    output: stdout
})

const todos = []

const show = () => {
    console.log("\n1:Create a task")
    console.log("2:View all task")
    console.log("3:Exit")

    rl.question('Choose one option:', handleInput)
}

const handleInput = (option) => {
    if(option === "1"){
        rl.question("Enter a task :",(task) => {
            todos.push(task)
            console.log("created task :", task)
            show()
      })
    }
    else if( option === "2"){
        console.log("\nAll tasks are :")
        todos.forEach((task, index) => {
            console.log(`${index + 1} : ${task}`)
        })
        show()
        
    }else if(option === "3"){
        console.log("Goode bye")
        rl.close()

    }else{
        console.log("Invalid option,PLease try again")
        show()
    }

}
show()