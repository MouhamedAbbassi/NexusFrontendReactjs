import {
  BanknotesIcon,
  UserPlusIcon,
  UsersIcon,
  ChartBarIcon,
} from "@heroicons/react/24/solid";
import axios from 'axios';

// Function to fetch data from backend
async function fetchData(endpoint) {
  try {
    const response = await axios.get(endpoint);
    return response.data; // Assuming the response data is an array of objects
  } catch (error) {
    console.error('Error fetching data:', error);
    return []; // Return an empty array in case of error
  }
}

// Fetch data for active users
fetchData('http://localhost:3000/users/active/all').then(activeData => {
  const numberOfActiveUsers = activeData.length;
  statisticsCardsData[0].value = numberOfActiveUsers;
});

// Fetch data for not active users
fetchData('http://localhost:3000/users/notActive/all').then(notActiveData => {
  const numberOfNotActiveUsers = notActiveData.length;
  statisticsCardsData[1].value = numberOfNotActiveUsers;
});

// Original statisticsCardsData before modification
export const statisticsCardsData = [
  {
    color: "gray",
    icon: UsersIcon,
    title: "Connected Users",
    value: 0, // Set a default value, it will be updated after fetching data
    footer: {
      color: "text-green-500",
      value: "+16%",
      label: "than last week",
    },
  },
  {
    color: "gray",
    icon: UsersIcon,
    title: "Not Connected Users",
    value: 0, // Set a default value, it will be updated after fetching data
    footer: {
      color: "text-green-500",
      value: "+3%",
      label: "than last week",
    },
  },
    {
    color: "gray",
    icon: UserPlusIcon,
    title: "Active Projects ",
    value: "3",
    footer: {
      color: "text-red-500",
      label: "Already has 3 active projects",
    },
  },
];

export default statisticsCardsData;
