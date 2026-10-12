"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type BusinessChatsProps = {
  token?: string;
  id?: string;
  profileImage?: string;
  fullName?: string;
  enableAdminMessaging?: boolean;
  businessId?: string;
  adminToken?: string;
  adminId?: string;
  businessProfileImage?: string;
  businessFullName?: string;
};

type ChatPartner = {
  id?: string;
  fullName?: string;
  profileImage?: string;
  isActive?: boolean;
};

type Conversation = {
  roomId: string;
  isBlocked?: boolean;
  blockerId?: string | null;
  partner?: ChatPartner;
  lastMessage?: {
    content?: string | null;
    createdAt?: string | null;
  } | null;
  unreadCount?: number;
};

type ChatMessage = {
  content?: string | null;
  fileUrl?: string[];
  senderId?: string;
  receiverId?: string;
  roomId?: string;
  createdAt?: string;
};

const WS_BASE_URL = "wss://api.shaara.center";
// const WS_BASE_URL = "ws://localhost:4015";

const formatTime = (iso?: string | null) => {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const previewText = (message?: ChatMessage | null) => {
  if (!message) return "No messages yet";
  if (message.content) return message.content;
  if (Array.isArray(message.fileUrl) && message.fileUrl[0]) return "sent file";
  return "No messages yet";
};

const avatarFallback = (name?: string) => (name || "U").charAt(0).toUpperCase();

const BusinessChats = ({
  token,
  id,
  profileImage,
  fullName,
  enableAdminMessaging = false,
  businessId,
  adminToken,
  adminId,
  businessProfileImage,
  businessFullName,
}: BusinessChatsProps) => {
  const viewerWsRef = useRef<WebSocket | null>(null);
  const adminWsRef = useRef<WebSocket | null>(null);
  const selectedRoomIdRef = useRef<string | null>(null);
  const adminStartInFlightRef = useRef(false);
  const [status, setStatus] = useState<
    "connecting" | "connected" | "disconnected"
  >("connecting");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [activeRoomMeta, setActiveRoomMeta] = useState<{
    isBlocked?: boolean;
    blockerId?: string | null;
  }>({});
  const [messageInput, setMessageInput] = useState("");
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    selectedRoomIdRef.current = selectedRoomId;
  }, [selectedRoomId]);

  const normalizedAdminId = enableAdminMessaging ? adminId : undefined;

  useEffect(() => {
    if (!token) {
      setStatus("disconnected");
      return;
    }

    const ws = new WebSocket(
      `${WS_BASE_URL}?x-token=${encodeURIComponent(token)}`,
    );
    viewerWsRef.current = ws;

    ws.onopen = () => {
      setStatus("connected");
      ws.send(JSON.stringify({ type: "member-conversation" }));
    };

    ws.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);

        if (payload?.type === "member-conversation") {
          const nextConversations = Array.isArray(payload.conversations)
            ? payload.conversations
            : [];

          if (
            normalizedAdminId &&
            nextConversations.some(
              (conversation: Conversation) =>
                conversation?.partner?.id === normalizedAdminId,
            )
          ) {
            adminStartInFlightRef.current = false;
          }

          setConversations(nextConversations);

          if (nextConversations.length === 0) {
            setSelectedRoomId(null);
            setMessages([]);
            setActiveRoomMeta({});
          }

          if (nextConversations.length > 0) {
            const firstRoom = nextConversations[0];
            const stillSelected = nextConversations.some(
              (conversation: Conversation) =>
                conversation.roomId === selectedRoomIdRef.current,
            );

            if (!stillSelected) {
              setSelectedRoomId(firstRoom.roomId);
            }

            const shouldSubscribe =
              !stillSelected && selectedRoomIdRef.current !== firstRoom.roomId;

            if (shouldSubscribe) {
              ws.send(
                JSON.stringify({
                  type: "member-subscribe",
                  receiverId: firstRoom?.partner?.id,
                }),
              );
            }
          }
        }

        if (payload?.type === "past-messages") {
          setSelectedRoomId(payload.roomId);
          setMessages(
            Array.isArray(payload.messages)
              ? [...payload.messages].reverse()
              : [],
          );
          setActiveRoomMeta({
            isBlocked: payload.isBlocked,
            blockerId: payload.blockerId,
          });
        }

        if (
          payload?.type === "member-new-message" &&
          payload?.roomId === selectedRoomIdRef.current
        ) {
          setMessages((prev) => [...prev, payload.message]);
        }
      } catch {
        // Ignore malformed payloads from socket stream.
      }
    };

    ws.onclose = () => {
      setStatus("disconnected");
    };

    ws.onerror = () => {
      setStatus("disconnected");
    };

    return () => {
      ws.close();
      viewerWsRef.current = null;
    };
  }, [token]);

  useEffect(() => {
    if (!enableAdminMessaging || !adminToken) {
      return;
    }

    const adminWs = new WebSocket(
      `${WS_BASE_URL}?x-token=${encodeURIComponent(adminToken)}`,
    );
    adminWsRef.current = adminWs;

    return () => {
      adminWs.close();
      adminWsRef.current = null;
    };
  }, [enableAdminMessaging, adminToken]);

  const selectedConversation = useMemo(
    () =>
      conversations.find(
        (conversation) => conversation.roomId === selectedRoomId,
      ) ?? null,
    [conversations, selectedRoomId],
  );

  const currentUser = useMemo(
    () => ({
      id,
      profileImage,
      fullName: fullName || "You",
    }),
    [id, profileImage, fullName],
  );

  const adminConversation = useMemo(
    () =>
      conversations.find(
        (conversation) =>
          !!normalizedAdminId &&
          conversation?.partner?.id === normalizedAdminId,
      ) ?? null,
    [conversations, normalizedAdminId],
  );

  const canSendInSelectedConversation =
    enableAdminMessaging &&
    !!selectedConversation &&
    !!normalizedAdminId &&
    selectedConversation.partner?.id === normalizedAdminId;

  const shouldShowAdminStartButton =
    enableAdminMessaging &&
    !!businessId &&
    !!normalizedAdminId &&
    !adminConversation;

  const getConversationTitle = (conversation?: Conversation | null) => {
    if (normalizedAdminId && conversation?.partner?.id === normalizedAdminId) {
      return "Chats with Admin";
    }
    return conversation?.partner?.fullName || "Unknown user";
  };

  const handleSelectConversation = (conversation: Conversation) => {
    if (
      !conversation?.partner?.id ||
      !viewerWsRef.current ||
      viewerWsRef.current.readyState !== WebSocket.OPEN
    ) {
      return;
    }

    setSelectedRoomId(conversation.roomId);
    setMessages([]);
    viewerWsRef.current.send(
      JSON.stringify({
        type: "member-subscribe",
        receiverId: conversation.partner.id,
      }),
    );

    if (
      enableAdminMessaging &&
      normalizedAdminId &&
      conversation.partner.id === normalizedAdminId &&
      adminWsRef.current &&
      adminWsRef.current.readyState === WebSocket.OPEN &&
      businessId
    ) {
      adminWsRef.current.send(
        JSON.stringify({
          type: "member-subscribe",
          receiverId: businessId,
        }),
      );
    }
  };

  const handleStartAdminConversation = () => {
    if (
      !enableAdminMessaging ||
      !businessId ||
      adminStartInFlightRef.current ||
      !adminWsRef.current ||
      adminWsRef.current.readyState !== WebSocket.OPEN
    ) {
      return;
    }

    adminStartInFlightRef.current = true;

    adminWsRef.current.send(
      JSON.stringify({
        type: "member-subscribe",
        receiverId: businessId,
      }),
    );

    window.setTimeout(() => {
      if (
        viewerWsRef.current &&
        viewerWsRef.current.readyState === WebSocket.OPEN
      ) {
        viewerWsRef.current.send(
          JSON.stringify({ type: "member-conversation" }),
        );
      }
    }, 250);

    window.setTimeout(() => {
      if (
        viewerWsRef.current &&
        viewerWsRef.current.readyState === WebSocket.OPEN
      ) {
        viewerWsRef.current.send(
          JSON.stringify({ type: "member-conversation" }),
        );
      }
      adminStartInFlightRef.current = false;
    }, 1000);
  };

  const handleSendMessage = () => {
    const content = messageInput.trim();
    if (
      !content ||
      !canSendInSelectedConversation ||
      !businessId ||
      !adminWsRef.current ||
      adminWsRef.current.readyState !== WebSocket.OPEN
    ) {
      return;
    }

    setIsSending(true);
    adminWsRef.current.send(
      JSON.stringify({
        type: "member-send-message",
        receiverId: businessId,
        content,
        fileUrl: [""],
      }),
    );
    setMessageInput("");
    setIsSending(false);
  };

  return (
    <div className="mt-6 overflow-hidden">
      <div className="grid gap-6 h-[600px] grid-cols-1 overflow-hidden lg:grid-cols-[340px_1fr]">
        <aside className="flex h-full rounded-2xl min-h-0 flex-col bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800">
          <div className="border-b border-[#E6EAF0] dark:border-slate-800 px-5 py-4">
            <h2 className="text-lg font-semibold text-[#101828] dark:text-slate-100">
              Chats
            </h2>
            <p className="text-xs text-[#667085] dark:text-slate-400">
              {conversations.length} conversations · {status}
            </p>
            {shouldShowAdminStartButton ? (
              <button
                type="button"
                onClick={handleStartAdminConversation}
                className="mt-3 inline-flex items-center justify-center rounded-lg bg-bprimary px-3 py-2 text-xs font-semibold text-white hover:opacity-90"
              >
                Start chat with admin
              </button>
            ) : null}
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="rounded-xl border border-dashed border-[#D0D5DD] dark:border-slate-700 bg-white dark:bg-slate-900 p-4 text-sm text-[#667085] dark:text-slate-400">
                No conversations found.
              </div>
            ) : (
              conversations.map((conversation) => {
                const isSelected = selectedRoomId === conversation.roomId;

                return (
                  <button
                    type="button"
                    key={conversation.roomId}
                    onClick={() => handleSelectConversation(conversation)}
                    className={`mb-2 cursor-pointer flex w-full items-center gap-3 px-3 py-5 text-left transition ${
                      isSelected
                        ? "bg-bprimary/10 dark:bg-bprimary/20"
                        : "bg-white dark:bg-slate-900 hover:bg-[#F2F4F7] dark:hover:bg-slate-800"
                    }`}
                  >
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-[#D9D9D9]">
                      {conversation?.partner?.profileImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={conversation.partner.profileImage}
                          alt={conversation?.partner?.fullName || "profile"}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full bg-gray-200 dark:bg-slate-700 w-full items-center justify-center text-sm font-semibold text-[#344054] dark:text-slate-200">
                          {avatarFallback(conversation?.partner?.fullName)}
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-sm font-semibold text-[#101828] dark:text-slate-100">
                        {getConversationTitle(conversation)}
                      </h3>
                      <p className="truncate text-xs text-[#667085] dark:text-slate-400">
                        {conversation?.lastMessage?.content ||
                          "No messages yet"}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <div className="flex items-center gap-1.5">
                        {conversation?.partner?.isActive ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#ECFDF3] px-2 py-0.5 text-[10px] font-semibold text-[#039855] dark:bg-emerald-500/15 dark:text-emerald-300">
                            <span className="h-2 w-2 rounded-full bg-[#12B76A] ring-2 ring-[#ECFDF3] dark:ring-slate-900 animate-pulse" />
                            Active now
                          </span>
                        ) : null}
                        <span className="text-[11px] text-[#98A2B3] dark:text-slate-500">
                          {formatTime(conversation?.lastMessage?.createdAt)}
                        </span>
                      </div>
                      {conversation?.unreadCount ? (
                        <span className="rounded-full bg-[#12B76A] px-2 py-0.5 text-[10px] font-semibold text-white">
                          {conversation.unreadCount}
                        </span>
                      ) : null}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </aside>

        <section className="relative flex h-full min-h-0 flex-col overflow-hidden bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl">
          {selectedConversation ? (
            <>
              <div className="px-5 py-4 border-b border-gray-100 dark:border-slate-800">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 overflow-hidden rounded-full bg-white dark:bg-slate-800">
                      {selectedConversation?.partner?.profileImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={selectedConversation.partner.profileImage}
                          alt={
                            selectedConversation?.partner?.fullName || "partner"
                          }
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full bg-gray-100 dark:bg-slate-700 w-full items-center justify-center text-sm font-semibold text-[#344054] dark:text-slate-200">
                          {avatarFallback(
                            selectedConversation?.partner?.fullName,
                          )}
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-[#101828] dark:text-slate-100">
                        {getConversationTitle(selectedConversation) ||
                          "Conversation"}
                      </h3>
                      <p className="text-xs text-[#667085] dark:text-slate-400">
                        {activeRoomMeta?.isBlocked
                          ? "This room is blocked"
                          : canSendInSelectedConversation
                            ? "Admin can send messages"
                            : "Read only mode"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center -space-x-2">
                    <div className="relative z-10 h-8 w-8 overflow-hidden rounded-full border-2 border-white dark:border-slate-900 bg-[#D9D9D9]">
                      {currentUser.profileImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={currentUser.profileImage}
                          alt={currentUser.fullName}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-[#344054]">
                          {avatarFallback(currentUser.fullName)}
                        </div>
                      )}
                    </div>
                    <div className="relative h-8 w-8 overflow-hidden rounded-full border-2 border-white dark:border-slate-900 bg-[#D9D9D9]">
                      {selectedConversation?.partner?.profileImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={selectedConversation.partner.profileImage}
                          alt={
                            selectedConversation?.partner?.fullName || "partner"
                          }
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-[#344054]">
                          {avatarFallback(
                            selectedConversation?.partner?.fullName,
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-white dark:bg-slate-900 p-5">
                {messages.length === 0 ? (
                  <div className="flex h-full items-center justify-center px-2 py-6">
                    <div className="text-center">
                      <h4 className="text-base font-semibold text-[#101828] dark:text-slate-100">
                        No chat history yet
                      </h4>
                      <p className="mt-2 text-sm text-[#667085] dark:text-slate-400">
                        No message between this business and client yet
                      </p>
                      <p className="mt-1 text-xs text-[#98A2B3] dark:text-slate-500">
                        {canSendInSelectedConversation
                          ? "Admin can send messages here."
                          : "Messages will appear here as soon as either side starts the conversation."}
                      </p>
                    </div>
                  </div>
                ) : (
                  messages.map((message, index) => {
                    const isAdminSender =
                      enableAdminMessaging &&
                      message?.senderId === normalizedAdminId;
                    const isSelf =
                      selectedConversation?.partner?.id === normalizedAdminId
                        ? isAdminSender
                        : message?.senderId === id;
                    const messageUser =
                      selectedConversation?.partner?.id === normalizedAdminId
                        ? isAdminSender
                          ? {
                              fullName: selectedConversation?.partner?.fullName,
                              profileImage:
                                selectedConversation?.partner?.profileImage,
                            }
                          : {
                              fullName: businessFullName,
                              profileImage: businessProfileImage,
                            }
                        : isSelf
                          ? currentUser
                          : {
                              fullName: selectedConversation?.partner?.fullName,
                              profileImage:
                                selectedConversation?.partner?.profileImage,
                            };

                    return (
                      <div
                        key={`${message?.createdAt || "msg"}-${index}`}
                        className={`flex items-end gap-2 ${
                          isSelf ? "justify-end" : "justify-start"
                        }`}
                      >
                        {!isSelf ? (
                          <div className="h-8 w-8 shrink-0 overflow-hidden rounded-full bg-[#D9D9D9]">
                            {messageUser.profileImage ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={messageUser.profileImage}
                                alt={messageUser.fullName || "user"}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-[#344054] dark:text-slate-200">
                                {avatarFallback(messageUser.fullName)}
                              </div>
                            )}
                          </div>
                        ) : null}

                        <div
                          className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                            isSelf
                              ? "bg-bprimary/10 dark:bg-bprimary/20 text-bprimary dark:text-emerald-300"
                              : "bg-gray-100 dark:bg-slate-800 text-black dark:text-slate-100"
                          }`}
                        >
                          <p className="whitespace-pre-wrap wrap-break-word">
                            {previewText(message)}
                          </p>
                          <p className="mt-1 text-right text-[10px] text-[#98A2B3] dark:text-slate-500">
                            {formatTime(message.createdAt)}
                          </p>
                        </div>

                        {isSelf ? (
                          <div className="h-8 w-8 shrink-0 overflow-hidden rounded-full bg-[#D9D9D9]">
                            {messageUser.profileImage ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={messageUser.profileImage}
                                alt={messageUser.fullName || "user"}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-[#344054] dark:text-slate-200">
                                {avatarFallback(messageUser.fullName)}
                              </div>
                            )}
                          </div>
                        ) : null}
                      </div>
                    );
                  })
                )}
              </div>

              {canSendInSelectedConversation ? (
                <div className="border-t border-gray-100 dark:border-slate-800 p-4">
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={messageInput}
                      onChange={(event) => setMessageInput(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          event.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      placeholder="Type a message to this business"
                      className="h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-bprimary dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                    />
                    <button
                      type="button"
                      disabled={isSending || !messageInput.trim()}
                      onClick={handleSendMessage}
                      className="h-11 rounded-xl bg-bprimary px-4 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Send
                    </button>
                  </div>
                </div>
              ) : null}
            </>
          ) : (
            <div className="flex h-full flex-col items-center justify-center p-6 text-center text-sm text-[#667085] dark:text-slate-400">
              {shouldShowAdminStartButton ? (
                <>
                  <p>No admin conversation found with this business yet.</p>
                  <button
                    type="button"
                    onClick={handleStartAdminConversation}
                    className="mt-3 inline-flex items-center justify-center rounded-lg bg-bprimary px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
                  >
                    Start chat with admin
                  </button>
                </>
              ) : (
                <p>Select a conversation from the left to load chat history.</p>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default BusinessChats;
