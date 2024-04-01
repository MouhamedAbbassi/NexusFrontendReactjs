import { useEffect, useState } from 'react';
import { Card, CardBody, Avatar, Typography, Input, Button } from "@material-tailwind/react";
import { useParams } from 'react-router-dom';
import { conversationsData } from "@/data";
import { MessageCard } from "@/widgets/cards";

function Conversation() {
  const { id } = useParams();
  const conversation = conversationsData.find(conv => conv.id === parseInt(id));
  const { img, name } = conversation || { img: "", name: "" };

  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const handleMessageChange = (e) => {
    setInputMessage(e.target.value);
  };

  const sendMessage = () => {
    const newMessage = inputMessage.trim();
    if (newMessage) {
      setMessages([...messages, { message: newMessage, sender: true }]);
      setInputMessage("");
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <Card className="flex-grow">
        <CardBody className="flex items-center">
          <Avatar src={img} size="sm" />
          <Typography className="ml-3">{name}</Typography>
        </CardBody>
        <CardBody className="flex flex-col space-y-4 overflow-y-auto">
          <div>
            {messages.map((message, index) => (
              <div key={index} className={message.sender ? "flex justify-end" : "flex justify-start"}>
                <MessageCard name={name} img={img} message={message.message} sender={message.sender} />
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
      <div className="flex items-center bg-gray-100 px-4 py-2">
        <Input
          placeholder="Type your message..."
          value={inputMessage}
          onChange={handleMessageChange}
          className="flex-grow mr-2"
        />
        <Button
          color="blue"
          size="md"
          className="ml-2"
          onClick={sendMessage}
        >
          Send
        </Button>
      </div>
    </div>
  );
}

export default Conversation;
