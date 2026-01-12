import { useEffect, useRef, useState } from "react";
import { apiRequest } from "../utils/apiRequest";
import ModalWrapper from "../components/modalParent";
import {
    FiUser,
    FiMail,
    FiPhone,
    FiCalendar,
    FiClock,
    FiMessageSquare,
    FiHeart,
    FiCheckCircle,
    FiUsers
} from "react-icons/fi";

/* ================= TYPES ================= */

interface User {
    _id: string;
    fullName?: string;
    email?: string;
    phone?: string;
}

interface Booking {
    _id: string;
    user: User | null;
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
    status: "pending" | "completed";
    createdAt: string;
}

interface UserGroup {
    user: User | null;
    calls: Booking[];
}

/* ================= COMPONENT ================= */

const Requests: React.FC = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [selectedUser, setSelectedUser] = useState<UserGroup | null>(null);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [loading, setLoading] = useState(true);

    const hasFetched = useRef(false);

    /* ================= FETCH ================= */

    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;

        const fetchData = async () => {
            const token = localStorage.getItem("token");
            const { success, data } = await apiRequest(
                "/admin_request/call-requests",
                { method: "POST", body: { token } }
            );

            if (success && data) {
                setBookings(data.callRequests);
            }
            setLoading(false);
        };

        fetchData();
    }, []);

    /* ================= GROUP USERS ================= */

    const groupedUsers: Record<string, UserGroup> = {};

    bookings.forEach((booking) => {
        const userId = booking.user?._id || "guest";

        if (!groupedUsers[userId]) {
            groupedUsers[userId] = {
                user: booking.user,
                calls: []
            };
        }
        groupedUsers[userId].calls.push(booking);
    });

    const users = Object.values(groupedUsers);

    /* ================= HELPERS ================= */

    const getUsageLevel = (count: number) => {
        if (count >= 10) return "bg-red-100 text-red-700";
        if (count >= 5) return "bg-yellow-100 text-yellow-700";
        return "bg-green-100 text-green-700";
    };

    const markAsComplete = async () => {
        if (!selectedBooking) return;

        const token = localStorage.getItem("token");

        const { success } = await apiRequest(
            `/admin_request/call-requests/${selectedBooking._id}/complete`,
            { method: "POST", body: { token }, showSuccess: true }
        );

        if (success) {
            setBookings(prev =>
                prev.map(b =>
                    b._id === selectedBooking._id
                        ? { ...b, status: "completed" }
                        : b
                )
            );

            // 🔑 CLOSE EVERYTHING
            setSelectedBooking(null);
            setSelectedUser(null);
        }
    };

    if (loading) {
        return <div className="p-8 text-center">Loading admin data...</div>;
    }

    /* ================= UI ================= */

    return (
        <div className="p-6 space-y-6">

            {/* ===== HEADER ===== */}
            <div className="flex items-center gap-3">
                <FiUsers size={26} />
                <h1 className="text-2xl font-bold">User Call Management</h1>
            </div>

            {/* ===== USERS TABLE ===== */}
            <div className="bg-white rounded-2xl shadow min-h-[90vh] overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-300 border-gray-300 text-left border-gray-300">
                        <tr>
                            <th className="p-4 text-left">User</th>
                            <th className="min-w-28">Total Calls</th>
                            <th className="min-w-28">Pending</th>
                            <th className="min-w-28">Completed</th>
                            <th className="min-w-28">Usage</th>
                            <th></th>
                        </tr>
                    </thead>

                    <tbody>
                        {users.map(({ user, calls }) => {
                            const pending = calls.filter(c => c.status === "pending").length;
                            const completed = calls.filter(c => c.status === "completed").length;

                            return (
                                <tr key={user?._id || "guest"} className="border-b border-gray-300 border-gray-300 hover:bg-gray-50">
                                    <td className="p-4">
                                        <div className="font-medium">
                                            {user?.fullName || "Guest User"}
                                        </div>
                                        <div className="text-xs min-w-46 text-gray-500">
                                            {user?.email || "No email"}
                                        </div>
                                    </td>
                                    <td className="min-w-28">{calls.length}</td>
                                    <td className="min-w-28">{pending}</td>
                                    <td className="min-w-28">{completed}</td>
                                    <td className="min-w-28">
                                        <span className={`px-2 py-1 rounded-full text-xs ${getUsageLevel(calls.length)}`}>
                                            {calls.length >= 10 ? "Exceeded" : "Normal"}
                                        </span>
                                    </td>
                                    <td className="min-w-28" >
                                        <button
                                            className="text-blue-600 text-sm font-medium"
                                            onClick={() => setSelectedUser({ user, calls })}
                                        >
                                            View Calls →
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* ===== USER CALLS DRAWER ===== */}
            {/* ===== CALL DETAIL MODAL ===== */}
            <ModalWrapper
                isOpen={!!selectedBooking}
                onClose={() => setSelectedBooking(null)}
            >
                {selectedBooking && (
                    <div className="bg-white rounded-2xl p-6 space-y-6 max-w-xl w-full">

                        {/* Header */}
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Call Details
                                </h3>
                                <p className="text-sm text-gray-500">
                                    {selectedBooking.recipient.callType}
                                </p>
                            </div>

                            <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${selectedBooking.status === "completed"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-yellow-100 text-yellow-700"
                                    }`}
                            >
                                {selectedBooking.status}
                            </span>
                        </div>

                        {/* Recipient Info */}
                        <div className="space-y-3 text-sm">
                            <div className="flex items-center gap-2">
                                <FiUser className="text-gray-400" />
                                <span className="font-medium">{selectedBooking.recipient.name}</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <FiPhone className="text-gray-400" />
                                <span>{selectedBooking.recipient.phone}</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <FiCalendar className="text-gray-400" />
                                <span>
                                    {new Date(selectedBooking.scheduledFor).toLocaleString()}
                                </span>
                            </div>
                        </div>

                        {/* Message */}
                        <div>
                            <p className="text-sm font-medium text-gray-700 mb-1">
                                Message
                            </p>
                            <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600">
                                {selectedBooking.recipient.message || "No message provided"}
                            </div>
                        </div>

                        {/* Action */}
                        <button
                            onClick={markAsComplete}
                            disabled={selectedBooking.status === "completed"}
                            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition ${selectedBooking.status === "completed"
                                ? "bg-green-600 text-white cursor-not-allowed"
                                : "bg-gray-900 text-white hover:bg-gray-800"
                                }`}
                        >
                            <FiCheckCircle />
                            {selectedBooking.status === "completed"
                                ? "Completed"
                                : "Mark as Completed"}
                        </button>
                    </div>
                )}
            </ModalWrapper>


            {/* ===== USER CALLS DRAWER ===== */}
            <ModalWrapper
                isOpen={!!selectedUser}
                onClose={() => setSelectedUser(null)}
            >
                {selectedUser && (
                    <div className="bg-white rounded-2xl p-6 w-[95vw] max-w-4xl max-h-[85vh] overflow-y-auto space-y-6">

                        {/* Header */}
                        <div className="border-b border-gray-300 pb-4">
                            <h2 className="text-xl font-semibold text-gray-900">
                                Call History
                            </h2>
                            <p className="text-sm text-gray-500">
                                Calls placed by{" "}
                                <span className="font-medium">
                                    {selectedUser.user?.fullName || "Guest User"}
                                </span>
                            </p>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto ">
                            <table className="w-full text-sm">
                                <thead className="text-gray-500 border-b border-gray-300">
                                    <tr>
                                        <th className="py-3 text-left">Recipient</th>
                                        <th className="py-3 text-left">Call Type</th>
                                        <th className="py-3 text-left">Scheduled</th>
                                        <th className="py-3 text-left">Status</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {selectedUser.calls.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="py-10 text-center text-gray-500">
                                                No calls found for this user
                                            </td>
                                        </tr>
                                    )}

                                    {selectedUser.calls.map(call => (
                                        <tr
                                            key={call._id}
                                            onClick={() => {
                                                setSelectedBooking(call);
                                                setSelectedUser(null); // 🔑 close first modal
                                            }} className="border-b border-gray-300 last:border-none cursor-pointer hover:bg-gray-50 transition"
                                        >
                                            <td className="py-4 font-medium text-gray-900">
                                                {call.recipient.name}
                                            </td>

                                            <td className="py-4 text-gray-600">
                                                {call.recipient.callType}
                                            </td>

                                            <td className="py-4 text-gray-600">
                                                {new Date(call.scheduledFor).toLocaleString()}
                                            </td>

                                            <td className="py-4">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-medium ${call.status === "completed"
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-yellow-100 text-yellow-700"
                                                        }`}
                                                >
                                                    {call.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </ModalWrapper>


        </div>
    );
};

export default Requests;
