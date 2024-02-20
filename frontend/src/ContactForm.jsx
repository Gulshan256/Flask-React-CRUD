import React from 'react';
import { useState } from 'react';

const ContactForm = ({existingcontact = {}, updateCallback}) => {
    const [first_name, setfirst_name] = useState(existingcontact.first_name || '');
    const [last_name, setlast_name] = useState(existingcontact.last_name || '');
    const [email, setemail] = useState(existingcontact.email || '');
    const [message, setmessage] = useState(existingcontact.message || '');

    const updating = Object.entries(existingcontact).length !== 0;


    const onSubmit = async (e) => {
        e.preventDefault();
        console.log(first_name, last_name, email, message);

        const data = {
            first_name,
            last_name,
            email,
            message
        }

        const url = 'http://127.0.0.1:5000/' + (updating ? `update_contact/${existingcontact.id}` : 'create_contact');
        const options = {
            method: updating ? 'PATCH' : 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)

        }

        const response = await fetch(url, options);

        if (response.statusCode !== 201 && response.statusCode !== 200) {
            const data = await response.json();
            alert(data.message)
        }

        else {
            updateCallback();

        }


    }

    return <form onSubmit={onSubmit}>
        <h1>Contact Form</h1>
        <div>
            <label htmlFor="first_name">First Name</label>
            <input type="text" id="first_name" name="first_name" value={first_name} onChange={(e) => setfirst_name(e.target.value)}></input>

        </div>

        <div>
            <label htmlFor="last_name">Last Name</label>
            <input type="text" id="last_name" name="last_name" value={last_name} onChange={(e) => setlast_name(e.target.value)}></input>
        </div>

        <div>
            <label htmlFor="email">Email</label>
            <input type="text" id="email" name="email" value={email} onChange={(e) => setemail(e.target.value)}></input>
        </div>

        <div>
            <label htmlFor="message">Message</label>
            <input type="text" id="message" name="message" value={message} onChange={(e) => setmessage(e.target.value)}></input>
        </div>

        <button type="submit">{updating ? 'Update' : 'Create'}</button>

    </form>


}


export default ContactForm;