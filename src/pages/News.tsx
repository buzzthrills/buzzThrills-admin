import React, { useState } from "react";
import { apiRequest } from "../utils/apiRequest";
import { toast } from "react-hot-toast";

const News: React.FC = () => {
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
     const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState(""); 
    const [loading, setLoading] = useState(false);

    const uploadImage = async () => {
        if (!imageFile) return "";

        const formData = new FormData();
        formData.append("image", imageFile);

        try {
            const res = await fetch("http://localhost:3000/upload", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();
            if (!data.success) throw new Error(data.msg || "Image upload failed");

            return data.url;
        } catch (err: any) {
            toast.error(err.message);
            return "";
        }
    };

    const handleSend = async () => {
        if (!subject || !message) {
            toast.error("Subject and message are required!");
            return;
        }

        setLoading(true);

        let uploadedUrl = "";
        if (imageFile) {
            uploadedUrl = await uploadImage();
            if (!uploadedUrl) {
                setLoading(false);
                return;
            }
        }

        const token = localStorage.getItem("token");

        const { success, data } = await apiRequest("/admin_mail/send_mail", {
            method: "POST",
            body: { subject, message, image: uploadedUrl, token },
        });

        setLoading(false);

        if (success) {
            toast.success("Newsletter sent successfully!");
            setSubject("");
            setMessage("");
            setImageFile(null);
            setImageUrl("");
        } else {
            toast.error(data?.error || "Failed to send newsletter.");
        }
    };

    return (
        <div className="w-full flex justify-center">
            <div className="w-full max-w-3xl xl:max-w-4xl min-h-screen pb-10 m-2 md:m-6 px-3 md:px-8 pt-12 bg-white rounded-xl shadow-lg border border-gray-200">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Send Newsletter</h1>

                {/* Subject */}
                <div className="mb-4">
                    <label className="block font-semibold text-gray-700 mb-1">Subject</label>
                    <input
                        type="text"
                        placeholder="Enter newsletter subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    />
                </div>

                {/* Message */}
                <div className="mb-4">
                    <label className="block font-semibold text-gray-700 mb-1">Message</label>
                    <textarea
                        placeholder="Write your message here..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-purple-500 focus:outline-none"
                        rows={6}
                    />
                </div>

                {/* Image Upload */}
                <div className="mb-6">
                    <label className="block font-semibold text-gray-700 mb-2">Image (optional)</label>

                    <div
                        onClick={() => document.getElementById("imageInput")?.click()}
                        className="w-full h-40 md:h-52 border-2 border-dashed border-gray-400 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-purple-500 transition"
                    >
                        {!imageFile ? (
                            <>
                                <span className="text-5xl text-gray-400">+</span>
                                <p className="text-gray-500 mt-2">Click to upload image</p>
                            </>
                        ) : (
                            <img
                                src={URL.createObjectURL(imageFile)}
                                alt="Preview"
                                className="h-full object-contain rounded-md"
                            />
                        )}
                    </div>

                    <input
                        id="imageInput"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)}
                        className="hidden"
                    />
                </div>

                {/* Preview Box */}
                {(subject || message || imageFile) && (
                    <div className="mb-6 p-4 border border-gray-300 rounded-lg bg-gray-50">
                        <h3 className="font-bold text-gray-700 mb-2">{subject || "Preview Subject"}</h3>
                        <p className="text-gray-700 mb-2">{message || "Preview message..."}</p>
                        {imageFile && (
                            <img
                                src={URL.createObjectURL(imageFile)}
                                alt="Preview"
                                className="max-w-full rounded-md mt-2"
                            />
                        )}
                    </div>
                )}

                {/* Send Button */}
                <button
                    onClick={handleSend}
                    disabled={loading}
                    className={`w-full py-3 rounded-lg text-white font-semibold transition-colors ${
                        loading ? "bg-gray-400 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700"
                    }`}
                >
                    {loading ? "Sending..." : "Send Newsletter"}
                </button>
            </div>
        </div>
    );
};

export default News;
