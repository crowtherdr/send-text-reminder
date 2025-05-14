import React, { useState, useEffect } from "react";
import Papa from "papaparse";

const SmsSender = () => {
  const [contacts, setContacts] = useState([]);
  // eslint-disable-next-line no-multi-str
//   const message = "Hi {name}, \n\
// This is a reminder that tomorrow night at 8 p.m. we have our Lehi CERT leadership mtg.\n\
// \n\
// This meeting will be held on Teams: https://teams.microsoft.com/l/meetup-join/19%3ameeting_OTJhNmJmYmYtMDA1ZS00MDQ0LWJhZmMtNGI0MmJhNjM1YjI4%40thread.v2/0?context=%7b%22Tid%22%3a%221d19effd-6615-4b00-a2e1-fa79a5f92d32%22%2c%22Oid%22%3a%2261c6b800-44fc-4eb8-b01d-1addaf649dc1%22%7d\n\
// \n\
// We have several agenda items.\n\
// \n\
// Best regards—\n\
// David Crowther\n\
// Lehi CERT Secretary";
// const csvFilePath = "/csv/cert_leaders_fname_phone.csv";
// eslint-disable-next-line no-multi-str
  const message = "Hi {name}, \n\
This is a reminder that tonight at 7 p.m. we have our Lehi CERT Team mtg.\n\
\n\
This meeting will be held in person at Lehi Fire Station #82 conference room on 250 W 2600 N\n\
\n\
Lehi CERT presents local training for STOP THE BLEED\n\
Everyone invited\n\
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
    }, 1000);
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
