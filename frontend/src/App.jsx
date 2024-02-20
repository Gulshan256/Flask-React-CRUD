import { useEffect, useState } from 'react'
import ContactList from './ContactList'
import ContactForm from './ContactForm'
import './App.css'


function App() {

  const [contacts, setContacts] = useState([])
  const [isModelOpen, setIsModelOpen] = useState(false)
  const [isEdit, setIsEdit] = useState({})

  useEffect(() =>{
    fetchContacts()

  }, [])

  const fetchContacts = async () => {
    const response = await fetch('http://127.0.0.1:5000/contacts')
    const data = await response.json()
    setContacts(data.contacts)
    console.log(data.contacts)
  };

  const closeModal = () => {
    setIsModelOpen(false)
    setIsEdit({})
  }

  const openCreateModal = () => {
    if (!isModelOpen) setIsModelOpen(true)
  }


  const openEditModal = (contact) => {
    if (isModelOpen) return
    setIsEdit(contact)
    setIsModelOpen(true)
  }


  const onUpdate = () => {
    closeModal()
    fetchContacts()
  }



  return (

    <>
    <ContactList contacts={contacts} updateContact={openEditModal} updateCallback={onUpdate} />

    <button onClick={openCreateModal}>Create Contact</button>
    {isModelOpen && 
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={closeModal}>&times;</span>

        <ContactForm existingcontact={isEdit} updateCallback={onUpdate} />
      </div>
    </div>
    
    }

    </>
      
  );
}

export default App
