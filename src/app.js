const mongoose = require('mongoose')
const { Schema, model } = require('mongoose')
const app = require('express')()
const bodyparser = require('body-parser')


app.use(bodyparser.json())
app.use(bodyparser.urlencoded({ extended: true}))


// database config
const dbURI = "mongodb://localhost/populate_test"

mongoose.connect(dbURI, () => {
    console.log('conected')
})


const departamentSchema = new Schema({
    name: String,
    location: String
})

const employeeSchema = new Schema({
    firstName: String,
    lastName: String,
    departament: { type: mongoose.Types.ObjectId, ref: "departament"}
})

const companySchema = new Schema({
    name: String,
    adress: String,
    employees: [{type: mongoose.Types.ObjectId, ref: "employee"}]
})

const Departament = mongoose.model("departament", departamentSchema)
const Employee = mongoose.model("employee", employeeSchema)
const Company = mongoose.model("company", companySchema)

app.get('/', async (req, res) => {
    await Departament.deleteMany({})
    await Employee.deleteMany({})
    await Company.deleteMany({})
    
    await Departament.create({
        name: "Fiocruz",
        location: "Presidência"
    })

    await Departament.create({
        name: "IASI",
        location: "Roma"
    })
    
    await Employee.create({
        firstName: "João",
        lastName: "Cleber",
        departament: await Departament.findOne({ name: "Fiocruz"})
    })

    await Employee.create({
        firstName: "Pedro",
        lastName: "Nunes",
        departament: await Departament.findOne({ name: "IASI"})
    })

    await Company.create({
        name: "FiocruzC",
        address: "Av. Arthur Bernardes",
        employees: await Employee.find()
    })



    res.json({ departament: await Departament.find(),
                employes: await Employee.find().populate("departament"),
                company: await Company.find().populate({
                    path: "employees",
                    model: "employee",
                    populate: { path: "departament", model: "departament"}
                })
            })
})
    

app.listen(2000, () => {
    console.log("listen at port 2000")
})