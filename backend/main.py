from flask import request, jsonify
from config import app, db
from models import Contact




@app.route('/create_contact', methods=["POST"])
def create_contact():
    data = request.get_json()

    if not data['first_name'] or not data['last_name'] or not data['email']:
        return jsonify({"message": "Please provide all the required fields"}), 400
    
    if data['email']:
        if not "@" in data['email'] or not "." in data['email']:
            return jsonify({"message": "Please provide a valid email"}), 400
        
        contact = Contact.query.filter_by(email=data['email']).first()
        if contact:
            return jsonify({"message": "Email already exists"}), 400

    new_contact = Contact(first_name=data['first_name'], last_name=data['last_name'], email=data['email'], message=data['message'])
    try:
        db.session.add(new_contact)
        db.session.commit()
    except Exception as e:
        return jsonify({"message": "An error occurred while creating the contact" ,"error":str(e)}),400 
    
    return jsonify({"message": "Contact created successfully"}), 201



@app.route('/contacts',methods=["GET"])
def get_contacts():
    contacts = Contact.query.all()
    return jsonify({"contacts":[contact.to_json() for contact in contacts]})



@app.route('/contact/<int:id>', methods=["GET"])
def get_contact(id):
    contact = Contact.query.get(id)
    if contact:
        return jsonify(contact.to_json())
    return jsonify({"error": "Contact not found"}), 404
 

@app.route('/update_contact/<int:id>', methods=['PATCH'])
def update_contact(id):
    data = request.get_json()
    contact = Contact.query.get(id)
    if not contact:
        return jsonify({"message": "Contact not found"}), 404
    
    data= request.json
    contact.first_name = data.get('first_name', contact.first_name)
    contact.last_name = data.get('last_name', contact.last_name)
    contact.email = data.get('email', contact.email)
    if contact.email:
        if not "@" in contact.email or not "." in contact.email:
            return jsonify({"message": "Please provide a valid email"}), 400
    contact.message = data.get('message', contact.message)
    db.session.commit()
    return jsonify({"message": "Contact updated successfully"}), 200


@app.route('/delete_contact/<int:id>', methods=['DELETE'])
def delete_contact(id):
    contact = Contact.query.get(id)
    if not contact:
        return jsonify({"message": "Contact not found"}), 404
    db.session.delete(contact)
    db.session.commit()
    return jsonify({"message": "Contact deleted successfully"}), 200




if __name__ == "__main__":

    with app.app_context():
        db.create_all()

    app.run(debug=True)


