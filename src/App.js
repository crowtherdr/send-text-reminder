import React, { useState, useEffect } from "react";
import Papa from "papaparse";

const SmsSender = () => {
  const [contacts, setContacts] = useState([]);
  // eslint-disable-next-line no-multi-str
  const message = "Hi {name}, \n\
This is a reminder that tonight at 7 p.m. we will continue our planning to prepare for our Lehi CERT Utah Great Shakeout event on the night of Wednesday, April 16th. Note: The Shake Out is on the 17th but we will hold our event the night before on the 16th.\n\
\n\
This meeting will be held in person at Lehi Station #82 on 250 West 2600 North\n\
\n\
The meeting will also be available with Microsoft Teams: \n\
https://teams.microsoft.com/l/meetup-join/19%3aLzgLZXFNlwZKw1LUFdtxWV54KV5FzsK5-Cc5ZN1HN-I1%40thread.tacv2/1741460128183?context=%7b%22Tid%22%3a%221d19effd-6615-4b00-a2e1-fa79a5f92d32%22%2c%22Oid%22%3a%2261c6b800-44fc-4eb8-b01d-1addaf649dc1%22%7d\n\
\n\
Best regards—\n\
David Crowther\n\
Lehi CERT Secretary";
  const csvFilePath = "/csv/cert_fname_phone.csv";

  useEffect(() => {
    const sentContacts = JSON.parse(localStorage.getItem("sentContacts")) || [];
    
    fetch(csvFilePath)
      .then(response => response.text())
      .then(csvText => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (result) => {
            const filteredContacts = result.data.filter(contact => 
              contact.mobileNumber && contact.mobileNumber.trim() !== ""
            ).filter(contact => 
              !sentContacts.includes(contact.mobileNumber)
            );
            setContacts(filteredContacts);
          },
        });
      })
      .catch(error => console.error("Error loading CSV file:", error));
  }, []);

  const handleSendClick = (number) => {
    const updatedContacts = contacts.filter(contact => contact.mobileNumber !== number);
    const sentContacts = JSON.parse(localStorage.getItem("sentContacts")) || [];
    localStorage.setItem("sentContacts", JSON.stringify([...sentContacts, number]));
    setTimeout(() => {
      setContacts(updatedContacts);
    }, 3000);
  };

  const generateSmsLink = (number, name) => {
    const personalizedMessage = message.replace("{name}", name);
    return `sms:${number}&body=${encodeURIComponent(personalizedMessage)}`;
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">CSV SMS Sender</h1>
      <div>
        {contacts.map((contact, index) => {
          // console.log('######TCL ~ {contacts.map ~ index:', index)
          // console.log('######TCL ~ {contacts.map ~ contact:', contact)
          return (
          <div key={index} className="flex justify-between items-center mb-2 p-2 border rounded">
            <span>{contact.firstName} ({contact.mobileNumber})</span>
            <a href={generateSmsLink(contact.mobileNumber, contact.firstName)} target="_blank" rel="noopener noreferrer">
              <button onClick={() => handleSendClick(contact.mobileNumber)}>Send SMS</button>
            </a>
          </div>
          )}
        )}
      </div>
    </div>
  );
};

export default SmsSender;
