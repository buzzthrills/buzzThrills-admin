import { useRef, useEffect, useState } from "react";
import { apiRequest } from "../utils/apiRequest";
import ModalWrapper from "../components/modalParent";

import {
    FiUser,
    FiPhone,
    FiMail,
    FiCalendar,
    FiClock,
    FiMessageSquare,
    FiHeart,
    FiCheckCircle
} from "react-icons/fi";



interface Booking {
    _id: string;
    user: { fullName: string; email: string; phone: string };
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
    createdAt: string;
}

const Requests: React.FC = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [loading, setLoading] = useState(true);

    const hasFetched = useRef(false);

    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;

        const fetchBookings = async () => {
            const token = localStorage.getItem("token");
            const { success, data } = await apiRequest("/admin_request/call-requests", {
                method: "POST",
                body: { token },
            });

            if (success && data) {
                setBookings(data.callRequests);
            }
            setLoading(false);
        };

        fetchBookings();
    }, []);


    const markAsComplete = async () => {
        if (!selectedBooking) return;

        const token = localStorage.getItem("token");

        const { success, data } = await apiRequest(
            `/admin_request/call-requests/${selectedBooking._id}/complete`,
            {
                method: "POST",
                body: { token },
                showSuccess: true,
            }
        );

        if (success && data) {
            // Update table instantly
            setBookings((prev) =>
                prev.map((b) =>
                    b._id === selectedBooking._id
                        ? { ...b, status: "completed" }
                        : b
                )
            );

            setSelectedBooking(null);
        }
    };



    if (loading) return <div>Loading requests...</div>;

    return (
        <div className="p-4 mt-12">
            <h1 className="text-2xl font-bold mb-4">All Call Requests</h1>
            <div className="overflow-x-auto bg-white rounded-xl shadow p-4">
                <table className="w-full text-left border border-gray-300 shadow-md-collapse">
                    <thead>
                        <tr className="border border-gray-300 shadow-md-b border border-gray-300 shadow-md-gray-300">
                            <th className="py-2 min-w-[150px] ">Subscriber</th>
                            <th className="py-2 min-w-[100px]">Recipient</th>
                            <th className="py-2 min-w-[100px]">Call Type</th>
                            <th className="py-2 min-w-[100px]">Date</th>
                            <th className="py-2 min-w-[100px]">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.map((booking) => (
                            <tr
                                key={booking._id}
                                className="border border-gray-300 shadow-md-b cursor-pointer border border-gray-300 shadow-md-gray-300 text-sm hover:bg-gray-50"
                                onClick={() => setSelectedBooking(booking)}
                            >
                                <td className="py-4">{booking.user.fullName}</td>
                                <td className="py-2">{booking.recipient.name}</td>
                                <td className="py-2">{booking.recipient.callType}</td>
                                <td className="py-2">
                                    {new Date(booking.recipient.date).toLocaleDateString()}
                                </td>
                                <td className="py-2">{booking.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal for displaying detailed call information */}
            {/* Modal for displaying detailed call information */}
            <ModalWrapper
                isOpen={!!selectedBooking}
                onClose={() => setSelectedBooking(null)}
            >
                {selectedBooking && (
                    <div className="bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">

                        {/* Sticky Header */}
                        <div className="sticky top-0 bg-white z-10 border border-gray-300 shadow-md-b px-6 py-4 flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-semibold">
                                    {selectedBooking.recipient.callType} Call Request
                                </h2>
                                <p className="text-xs text-gray-500">
                                    ID • {selectedBooking._id}
                                </p>
                            </div>

                            <span className="flex items-center gap-2 text-xs font-medium px-3 py-1 rounded-full bg-green-50 text-green-700">
                                <span className="w-2 h-2 rounded-full bg-green-600" />
                                {selectedBooking.status}
                            </span>
                        </div>

                        {/* Body */}
                        <div className="p-6 overflow-y-auto space-y-6">

                            {/* Subscriber & Recipient */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                {/* Subscriber */}
                                <div className="border border-gray-300 shadow-md rounded-xl p-4 space-y-2">
                                    <h3 className="text-sm font-semibold text-gray-600 mb-2">
                                        Subscriber
                                    </h3>

                                    <p className="flex items-center gap-2 text-sm">
                                        <FiUser /> {selectedBooking.user.fullName}
                                    </p>
                                    <p className="flex items-center gap-2 text-sm">
                                        <FiMail /> {selectedBooking.user.email}
                                    </p>
                                    <p className="flex items-center gap-2 text-sm">
                                        <FiPhone /> {selectedBooking.user.phone}
                                    </p>
                                </div>

                                {/* Recipient */}
                                <div className="border border-gray-300 shadow-md rounded-xl p-4 space-y-2">
                                    <h3 className="text-sm font-semibold text-gray-600 mb-2">
                                        Recipient
                                    </h3>

                                    <p className="flex items-center gap-2 text-sm">
                                        <FiUser /> {selectedBooking.recipient.name}
                                    </p>
                                    <p className="flex items-center gap-2 text-sm">
                                        <FiPhone /> {selectedBooking.recipient.phone}
                                    </p>
                                    <p className="flex items-center gap-2 text-sm">
                                        <FiHeart /> {selectedBooking.recipient.relationship}
                                    </p>
                                </div>
                            </div>

                            {/* Call Details */}
                            <div className="border border-gray-300 shadow-md rounded-xl p-4 space-y-3">
                                <h3 className="text-sm font-semibold text-gray-600">
                                    Call Details
                                </h3>

                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <p className="flex items-center gap-2">
                                        <FiCalendar />
                                        {new Date(selectedBooking.recipient.date).toLocaleDateString()}
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <FiClock />
                                        {selectedBooking.recipient.time}
                                    </p>
                                    <p className="col-span-2">
                                        <span className="font-medium">Occasion:</span>{" "}
                                        {selectedBooking.recipient.occasionType}
                                    </p>
                                </div>
                            </div>

                            {/* Message */}
                            <div className="border border-gray-300 shadow-md rounded-xl p-4">
                                <h3 className="text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2">
                                    <FiMessageSquare /> Message
                                </h3>
                                <p className="text-sm text-gray-700 leading-relaxed">
                                    {selectedBooking.recipient.message || "No message provided."}
                                </p>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="border border-gray-300 shadow-md-t px-6 py-4 flex justify-between items-center bg-gray-50">
                            <p className="text-xs text-gray-500">
                                Scheduled:{" "}
                                {new Date(selectedBooking.scheduledFor).toLocaleString()}
                            </p>

                            <div className="flex gap-2">
                                <button
                                    className="px-4 py-2 text-xs rounded-lg border border-gray-300 shadow-md hover:bg-gray-100"
                                    onClick={() => setSelectedBooking(null)}
                                >
                                    Close
                                </button>

                                <button
                                    onClick={markAsComplete}
                                    disabled={selectedBooking.status === "completed"}
                                    className={`px-4 py-2 text-xs rounded-lg flex items-center gap-2
    ${selectedBooking.status === "completed"
                                            ? "bg-green-600 text-white cursor-not-allowed"
                                            : "bg-black text-white hover:bg-gray-800"
                                        }
  `}
                                >
                                    <FiCheckCircle />
                                    {selectedBooking.status === "completed"
                                        ? "Completed"
                                        : "Mark Complete"}
                                    
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </ModalWrapper>
        </div>
    );
};

export default Requests;
