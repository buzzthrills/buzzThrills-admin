import React, { useEffect, useState } from "react";
import { FaPhoneAlt, FaUsers } from "react-icons/fa";
// import { logo } from "../assets";
import { apiRequest } from "../utils/apiRequest";

interface Booking {
  _id: string;
  user: {
    fullName: string;
    email: string;
    phone: string;
  };
  recipient: {
    name: string;
    phone: string;
    relationship: string;
    occasionType: string;
    date: string;
    time: string;
    callType: string;
    message: string;
  };
  scheduledFor: string;
  status: string;
}

const Dashboard: React.FC = () => {
  const [totalBookings, setTotalBookings] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token"); // admin token
        const { success, data } = await apiRequest("/admin_dashboard/", {
          method: "POST",
          body: { token },
        });

        if (success && data) {
          setTotalUsers(data.totalUsers);
          setTotalBookings(data.totalBookings);
          setBookings(data.bookings);
        }
      } catch (err) {
        console.error("Error fetching dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[100vh]">
        <p className="text-gray-500">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 w-full">
      {/* Header */}
      <div className="flex justify-center items-center">
        <h1 className="font-extrabold text-xl">Dashboard</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Total Bookings */}
        <div className="flex items-center gap-4 p-6 bg-white rounded-xl shadow-sm">
          <div className="p-4 rounded-full bg-purple-100 text-purple-600">
            <FaPhoneAlt size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Total Bookings</p>
            <h2 className="text-2xl font-bold">{totalBookings}</h2>
          </div>
        </div>

        {/* Total Users */}
        <div className="flex items-center gap-4 p-6 bg-white rounded-xl shadow-sm">
          <div className="p-4 rounded-full bg-blue-100 text-blue-600">
            <FaUsers size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Total Users</p>
            <h2 className="text-2xl font-bold">{totalUsers}</h2>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">All Bookings</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="text-left text-gray-600 border-b border-gray-300">
                <th className="py-2 min-w-[150px]">Subscriber</th>
                <th className="py-2 min-w-[100px]">Recipient</th>
                <th className="py-2 min-w-[100px]">Phone</th>
                <th className="py-2 min-w-[100px]">Call Type</th>
                <th className="py-2 min-w-[100px]">Date</th>
                <th className="py-2 min-w-[100px]">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id} className="border-b border-gray-300 last:border-none">
                  <td className="py-4 min-w-54">{booking.user?.email || "N/A"}</td>
                  <td className="py-3">{booking.recipient?.name}</td>
                  <td className="py-3">{booking.recipient?.phone}</td>
                  <td className="py-3">{booking.recipient?.callType}</td>
                  <td className="py-3">
                    {new Date(booking.recipient.date).toLocaleDateString()}
                  </td>
                  <td className="py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${booking.status.toLowerCase() === "completed"
                          ? "bg-green-100 text-green-600"
                          : "bg-yellow-100 text-yellow-600"
                        }`}
                    >
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>


    </div>
  );
};

export default Dashboard;
