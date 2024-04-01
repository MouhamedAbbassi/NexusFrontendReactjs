import PropTypes from "prop-types";
import { Avatar, Typography } from "@material-tailwind/react";
import { Link } from "react-router-dom";

export function MessageCard({ id, img, name, message, lastTimeMessage, action }) {
  return (
    <Link to={`/conversation/${id}`} className="flex items-start gap-4 flex-1">
      <div className="flex items-start gap-4 p-4 bg-white rounded-lg shadow-md hover:bg-blue-50 w-full">
        <Avatar src={img} alt={name} size="sm" className="shadow-md" />

        <div className="flex flex-col flex-1">
          <div className="flex justify-between">
            <Typography variant="h6" color="blue-gray" className="font-semibold">
              {name}
            </Typography>
           
            <Typography variant="small" color="blue-gray" className="ml-2">
              {lastTimeMessage}
            </Typography>
          </div>

          <Typography className="text-sm text-blue-gray-400">{message}</Typography>

          {action && (
            <div className="mt-2">
              {action}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

MessageCard.defaultProps = {
  action: null,
};

MessageCard.propTypes = {
  id: PropTypes.number.isRequired,
  img: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  lastTimeMessage: PropTypes.string.isRequired,
  action: PropTypes.node,
};

export default MessageCard;
