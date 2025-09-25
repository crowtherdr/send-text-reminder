import React, { useState, useEffect } from "react";
import Papa from "papaparse";

const SmsSender = () => {
  const [contacts, setContacts] = useState([]);

// eslint-disable-next-line no-multi-str
//   const message = "Hi {name}, \n\
// This is a reminder that there will not be Lehi CERT leadership mtg in July.\n\
// \n\
// If you have any leadership business, post it in the Slack \"leadership\" channel.\n\
// \n\
// Please join us.\n\
// \n\
// Best regards—\n\
// David Crowther\n\
// Lehi CERT Secretary";

  // eslint-disable-next-line no-multi-str
  const message = "Hi {name}, \n\
Our leadership meeting will be a bit different in October as it is the same evening as the Lehi Fire Department open house at Wines Park at 100 E 600 N St, Lehi, Utah. We will have a CERT booth there and need your help to staff the booth.\n\
\n\
We would like to have 2 shifts from 3:30pm-5:15pm and 5:15p-7pm. That's 1.75 hours each. If you can come for only part of the time, that will also help. We need 3 people per shift.\n\
\n\
Here is a link to the signup sheet: https://docs.google.com/spreadsheets/d/1pzavmSE48MMrdG1sXdu1sDonHT9emOxifI5H2Fc8bkE/edit?usp=sharing\n\
\n\
We will try to meet during the end of the first shift and the start of the 2nd shift, perhaps from 5pm-6pm.\n\
\n\
Send agenda items to Brian Sump, Steve Boyack, or me, or add them to the mtg announcement in the Slack #leadership channel: https://lehicert.slack.com/archives/C057EKUC2CE/p1758760068165199\n\
\n\
Please note that we just found out about this today. Please pardon any changes as we get closer to the event.\n\
\n\
Thank you.\n\
\n\
Best regards—\n\
David Crowther\n\
Lehi CERT Secretary";
const csvFilePath = "/csv/cert_leaders_fname_phone.csv";

// eslint-disable-next-line no-multi-str
//   const message = "Hi {name}, \n\
// This is a reminder that tonight at 7 p.m. we have our Lehi CERT Team mtg.\n\
// \n\
// This meeting will be held in person at Lehi Police Station conference room on 128 N 100 E\n\
// \n\
// September is National Preparedness Month. We will be talking about general preparedness and terrorism awareness.\n\
// \n\
// We hope to see you there!\n\
// \n\
// Best regards—\n\
// David Crowther\n\
// Lehi CERT Secretary";
//   const csvFilePath = "/csv/cert_fname_phone.csv";

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
