import { useState, useRef, useEffect } from "react"
import { useNavigate, useParams } from 'react-router-dom'
import { getAnimals } from "../../managers/animals"
import { addEmployee, updateEmployee, getEmployeeById } from "../../managers/employees"
import { getLocations } from "../../managers/locations"
import "./Employees.css"

export const EmployeeForm = () => {
  const name = useRef(null)
  const address = useRef(null)
  const location = useRef(null)
  const animal = useRef(null)

  const navigate = useNavigate()

  const [animals, setAnimals] = useState([])
  const [locations, setLocations] = useState([])
  const { employeeId } = useParams()
  const [employee, setEmployee] = useState({})

  const handleControlledInputChange = (event) => {
    const newEmployee = Object.assign({}, employee)
    newEmployee[event.target.name] = event.target.value
    setEmployee(newEmployee)
  }

  useEffect(() => {
    getAnimals().then(animalsData => setAnimals(animalsData))
    getLocations().then(locationsData => setLocations(locationsData))
  }, [])

  useEffect(() => {
    if (employeeId) {
      getEmployeeById(employeeId).then((res) => {
        setEmployee(res)
      })
    }
  }, [employeeId])

  const constructNewEmployee = () => {
    const locationId = parseInt(location.current.value)
    const animalId = parseInt(animal.current.value)

    if (locationId === 0) {
      window.alert("Please select a location")
    } else if (animalId === 0) {
      window.alert("Please select an animal")
    } else {
      if (employeeId) {
        //PUT
        updateEmployee({
          id: employee.id,
          name: name.current.value,
          address: address.current.value,
          locationId,
          animalId
        })
          .then(() => navigate("/employees"))
      } else {
      addEmployee({
          name: name.current.value,
          address: address.current.value,
          locationId,
          animalId
      })
        .then(() => navigate("/employees"))
      }
    }
  }

  return (
    <form className="employeeForm">
      <h2 className="employeeForm__title">New Employee</h2>
      <fieldset>
        <div className="form-group">
          <label htmlFor="employeeName">Employee name: </label>
          <input type="text" name="employeeName" ref={name} required autoFocus className="form-control" placeholder="Employee name" defaultValue={employee.name}
          onChange={handleControlledInputChange}/>
        </div>
      </fieldset>
      <fieldset>
        <div className="form-group">
          <label htmlFor="employeeAddress">Employee address: </label>
          <input type="text" name="employeeAddress" ref={address} required autoFocus className="form-control" placeholder="Employee address" defaultValue={employee.address}
          onChange={handleControlledInputChange}/>
        </div>
      </fieldset>
      <fieldset>
        <div className="form-group">
          <label htmlFor="location">Assign to location: </label>
          <select defaultValue="" name="location" ref={location} id="employeeLocation" className="form-control" value={employee.location_id}
            onChange={handleControlledInputChange} >
            <option value="0">Select a location</option>
            {locations.map(e => (
              <option key={e.id} value={e.id}>
                {e.name}
              </option>
            ))}
          </select>
        </div>
      </fieldset>
      <fieldset>
        <div className="form-group">
          <label htmlFor="location">Caretaker for: </label>
          <select defaultValue="" name="animal" ref={animal} id="employeeAnimal" className="form-control" value={employee.animal_id}
            onChange={handleControlledInputChange}>
            <option value="0">Select an animal</option>
            {animals.map(e => (
              <option key={e.id} value={e.id}>
                {e.name}
              </option>
            ))}
          </select>
        </div>
      </fieldset>
      <button type="submit"
        onClick={evt => {
          evt.preventDefault()
          constructNewEmployee()
        }}
        className="btn btn-primary">
        {employeeId ? "Save Updates" : "Save New Employee"}
      </button>
    </form>
  )
}
