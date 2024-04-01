import React, { useState } from "react";
import { Card, CardBody, Typography, Input } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { MessageCard } from "@/widgets/cards";
import { conversationsData } from "@/data";
import { FaFilePdf } from 'react-icons/fa';
import { jsPDF } from "jspdf"; // Import jsPDF for PDF generation

export function Profile() {
  const [searchQuery, setSearchQuery] = useState("");

const handleSearchChange = (e) => {
  const query = e.target.value.toLowerCase(); 
  console.log("Search query:", query);
  setSearchQuery(query);
};



  const filteredConversations = conversationsData.filter((conversation) =>
  conversation.name.toLowerCase().includes(searchQuery)
);

  // Function to handle conversation selection
  const handleConversationSelect = () => {
    // Reset the search query when a conversation is selected
    setSearchQuery("");
  };

 // Function to generate PDF
const generatePDF = () => {
  const doc = new jsPDF();
  let yOffset = 10;


  const title = "Conversation Report";
  doc.setTextColor(255, 0, 0); 
  doc.setFontSize(16); 
  doc.text(title, 10, yOffset); 
  yOffset += 20; 


  filteredConversations.forEach((conversation) => {
    const text = `Name: ${conversation.name}\nMessage: ${conversation.message}\nLast Time Message: ${conversation.lastTimaMessage}\n`;
    doc.setTextColor(0, 0, 255); 
    doc.setFontSize(12); 
    doc.text(text, 10, yOffset);
    yOffset += doc.splitTextToSize(text, 180).length * 10 + 5; 
    doc.setDrawColor(0); 
    doc.line(10, yOffset - 5, 200, yOffset - 5); 
  });

  doc.save("conversations.pdf");
};

  return (
    <>
      <div className="relative mt-8 h-72 w-full overflow-hidden rounded-xl bg-[url('/img/background-image.png')] bg-cover	bg-center">
        <div className="absolute inset-0 h-full w-full bg-gray-900/75" />
      </div>
      <Card className="mx-3 -mt-16 mb-6 lg:mx-4 border border-blue-gray-100">
        
        <CardBody className="p-4">
             <div>  <FaFilePdf color='black' onClick={generatePDF} style={{ cursor: "pointer", marginLeft: "15px" }} /></div>
           
          <Typography variant="h6" color="blue-gray" className="mb-3">
            Conversation
         
          </Typography>
       
          <Input
            type="text"
            placeholder="Search conversation..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="mb-4"
          />
          <ul className="flex flex-col gap-6">
            {filteredConversations.map((props) => (
              <Link to={`/conversation/${props.id}`}>
                <MessageCard key={props.name}  {...props} />
              </Link>
            ))}
          </ul>
          <div className="px-4 pb-4"></div>
        </CardBody>
      </Card>
    </>
  );
}

export default Profile;
