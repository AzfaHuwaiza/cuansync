import { useState, useEffect, useRef } from "react";
import Header from "../components/header";
import { FiSend, FiPlus, FiTrash } from "react-icons/fi";
import { RiRobot3Fill } from "react-icons/ri";
import { getUMKMByUser } from "../services/umkmService";
import { sendAiMessage } from "../services/aiServices";
import { getIdUser } from "../utils/authStorage";
import { Link } from "react-router-dom";
import { Typewriter } from "../components/typingWriter";
import ModalTambahUmkm from "../modalSelect/modalUmkm";

export default function KonsultasiAi() {
    const userId = getIdUser();
    const [umkmList, setUmkmList] = useState([]);
    const [selectedUmkm, setSelectedUmkm] = useState("");
    const [isFeatchingUmkm, setIsFetchingUmkm] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [message, setMessage] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const textArea = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [message, isTyping]);

    useEffect(() => {
        const fetchUmkm = async () => {
            try {
                const response = await getUMKMByUser(userId);
                setUmkmList(response.data.umkm);
            } catch (err) {
                console.error("Error fetching UMKM:", err);
            } finally {
                setIsFetchingUmkm(false);
            }
        }
        fetchUmkm();
    }, [userId]);

    useEffect(() => {
        if (selectedUmkm) {
            const saveHistory = localStorage.getItem(`chat_history_${selectedUmkm}`);
            if (saveHistory) {
                const parsedHistory = JSON.parse(saveHistory).map(msg => ({
                    ...msg,
                    isNew: false
                }))
                setMessage(parsedHistory);
            } else {
                setMessage([]);
            }
        } else {
            setMessage([]);
        }
    }, [selectedUmkm]);

    useEffect(() => {
        if (selectedUmkm && message.length > 0) {
            localStorage.setItem(`chat_history_${selectedUmkm}`, JSON.stringify(message));
        }
    }, [selectedUmkm, message]);

    const clearHistoryChat = () => {
        if (window.confirm("Yakin ingin menghapus riwayat chat ini?")) {
            localStorage.removeItem(`chat_history_${selectedUmkm}`);
            setMessage([]);
        }
    }

    const handleInputResize = (e) => {
        setInputValue(e.target.value);
        e.target.style.height = 'auto';
        e.target.style.height = `${e.target.scrollHeight}px`;
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleMessage(e);
        }
    }

    const handleMessage = async (e) => {
        e.preventDefault();
        if (!inputValue.trim() || !selectedUmkm) return;

        const userText = inputValue;
        const newMsgUser = { id: Date.now(), role: "user", text: userText };
        const chatHistoryForBe = message.map(msg => ({
            isFromUser: msg.role === "user",
            textMessage: msg.text,
        }));
        setMessage((prev) => [...prev, newMsgUser]);
        setInputValue("");
        if (textArea.current) {
            textArea.current.style.height = 'auto';
        }
        setIsTyping(true);

        try {
            const response = await sendAiMessage({
                umkmId: selectedUmkm,
                message: userText,
                chatHistory: chatHistoryForBe,
            });

            const aiReply = response.data.replay;
            const newMsgAi = { id: Date.now() + 1, role: "ai", text: aiReply, isNew: true };
            setMessage((prev) => [...prev, newMsgAi]);
        } catch (error) {
            const errorMsg = { id: Date.now() + 1, role: "ai", text: "Waduh bos, sinyal ke otak AI saya lagi putus nih. Coba lagi nanti ya!", isNew: true };
            setMessage((prev) => [...prev, errorMsg]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <>
            <Header pageTitle="Konsultasi CuanAI">
            <div className=" mx-auto p-4 sm:p-8 min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">

                {/* MODAL */}
                <ModalTambahUmkm 
                    isOpen={isModalOpen} 
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={(newUmkm) => {
                        setUmkmList(prev => [...prev, newUmkm]);
                        setSelectedUmkm(newUmkm.id);
                    }}
                />

                <div className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm flex flex-col h-[600px]">

                    {/* HEADER */}
                    <div className="bg-violet-700 dark:bg-violet-900 p-6 flex items-center gap-4 shrink-0">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-white backdrop-blur-sm">
                            <RiRobot3Fill size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">CuanAI</h2>
                            <p className="text-violet-200 text-sm">Memahami Data, Mengarahkan Laba.</p>
                        </div>

                        {message.length > 0 && (
                            <button
                                onClick={clearHistoryChat}
                                className="text-violet-200 hover:text-white transition-colors flex items-center gap-2 text-sm bg-violet-800/50 px-3 py-2 rounded-lg hover:cursor-pointer"
                            >
                                <FiTrash size={16} /> Hapus Chat
                            </button>
                        )}
                    </div>

                    {/* MESSAGE AREA */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {message.length === 0 && !isTyping && (
                            <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-70">
                                <RiRobot3Fill size={64} className="mb-4 text-violet-400" />
                                {isFeatchingUmkm ? (
                                    <p className="text-slate-500 animate-pulse">Sedang Menampilkan UMKM Anda...</p>
                                ) : umkmList.length === 0 ? (
                                    <div className="flex flex-col items-center text-center">
                                        <h3 className="font-bold text-xl text-slate-800 dark:text-slate-100 mb-2">Anda Belum Memiliki Bisnis</h3>
                                        <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-sm">Silakan tambahkan profil bisnis/UMKM Anda terlebih dahulu untuk memulai konsultasi dengan CuanAI.</p>

                                        <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-colors hover:cursor-pointer" onClick={() => setIsModalOpen(true)}>
                                            <FiPlus size={20} /> Tambahkan UMKM Baru
                                        </button>
                                    </div>
                                ) : !selectedUmkm ? (
                                    <div className="flex flex-col items-center text-center">
                                        <h3 className="font-bold text-xl text-slate-800 dark:text-slate-100 mb-2">Pilih UMKM untuk Konsultasi</h3>
                                        <p className="text-slate-500 dark:text-slate-400 mb-6">Pilih salah satu UMKM Anda agar CuanAI dapat menganalisis datanya secara akurat.</p>
                                        <select
                                            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500 font-semibold min-w-[250px] shadow-sm cursor-pointer"
                                            value={selectedUmkm}
                                            onChange={(e) => setSelectedUmkm(e.target.value)}
                                        >
                                            <option value="" disabled>Pilih UMKM Anda</option>
                                            {umkmList.map((umkm, i) => (
                                                <option key={i} value={umkm.id}>{umkm.nama_umkm}</option>
                                            ))}
                                        </select>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center">
                                        <h3 className="font-bold text-xl text-slate-800 dark:text-slate-100 mb-2">Semua Siap!</h3>
                                        <p className="text-slate-500 dark:text-slate-400">Mulai ketikkan pertanyaan Anda di bawah ini...</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {message.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                <div className={`max-w-[80%] px-5 py-3.5 text-sm sm:text-base shadow-sm ${msg.role === 'user'
                                    ? 'bg-violet-600 text-white rounded-2xl rounded-tr-sm'
                                    : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-2xl rounded-tl-sm'
                                    }`}>
                                    {msg.role === 'ai' ? <Typewriter text={msg.text} animate={msg.isNew} /> : msg.text}
                                </div>
                            </div>
                        ))}

                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 rounded-2xl rounded-tl-sm px-5 py-4 max-w-[80%] shadow-sm flex items-center gap-2">
                                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* INPUT AREA */}
                    <form onSubmit={handleMessage} className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex gap-3 shrink-0">
                        <textarea
                            ref={textArea}
                            rows="1"
                            placeholder={selectedUmkm ? "Tanyakan sesuatu ke CuanAI..." : "Pilih UMKM terlebih dahulu..."}
                            value={inputValue}
                            onChange={handleInputResize}
                            onKeyDown={handleKeyDown}
                            disabled={isTyping || !selectedUmkm}
                            className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-slate-100 rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-violet-500 transition-all resize-none max-h-[120px] overflow-y-auto disabled:bg-slate-100 dark:disabled:bg-slate-950 disabled:cursor-not-allowed"
                        />
                        <button type="submit"
                            disabled={!inputValue.trim() || isTyping}
                            className="bg-violet-400 hover:bg-violet-500 disabled:bg-slate-200 dark:disabled:bg-slate-700 disabled:cursor-not-allowed text-white w-14 rounded-2xl flex items-center justify-center transition-colors shrink-0"
                        >
                            <FiSend size={20} className={inputValue.trim() ? "translate-x-[-2px] translate-y-[2px]" : ""} />
                        </button>
                    </form>
                </div>
            </div>
            </Header>
        </>
    )
}