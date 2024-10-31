// import { useAuth } from "@/app/context/AuthContext";
// import axios from "axios";


// async function setStats() {
//     const { user } = useAuth();
//     const stats = {
//       total: 0,
//       correct: 0,
//       incorrect: 0,
//       streak: 0,
//       longestStreak: 0,
//     };
  
//     try {
//       const res = await axios.post(
//         `${process.env.NEXT_PUBLIC_API_URL}/account/setAccStats`,
//         { stats: stats },
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${user?.token}`, // Assuming the token is stored in user.token
//           },
//           withCredentials: true,
//         }
//       );
  
//       if (!res.data) {
//         throw new Error('Failed to fetch data');
//       }
//       return res.data;
//     } catch (error) {
//       console.error('Error fetching stats:', error);
//     }
//   }