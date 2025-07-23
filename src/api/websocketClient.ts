// IMPORTANT: Use 'ws://' for HTTP and 'wss://' for HTTPS
// The VITE_WS_BASE_URL should include the protocol prefix.
const wsBaseURL = import.meta.env.VITE_WS_API_URL;

/**
 * Establishes a WebSocket connection for real-time submission updates.
 * @param submissionId The ID of the submission to listen for.
 * @param onMessage Callback function for incoming messages.
 * @param onOpen Optional callback for connection open.
 * @param onClose Optional callback for connection close.
 * @param onError Optional callback for connection errors.
 * @returns The WebSocket instance.
 */
export const connectToSubmissionWebSocket = (
    submissionId: string,
    onMessage: (data: WebSocketSubmissionUpdate) => void,
    onOpen?: () => void,
    onClose?: (event: CloseEvent) => void,
    onError?: (event: Event) => void
): WebSocket => {
    const wsURL = `${wsBaseURL}/api/ws/submissions/${submissionId}`;
    const ws = new WebSocket(wsURL);

    ws.onopen = (event) => {
        console.log(
            `WebSocket connected for submission ${submissionId}:`,
            event
        );
        onOpen?.();
    };

    ws.onmessage = (event) => {
        try {
            // Assuming backend sends JSON string
            const data: WebSocketSubmissionUpdate = JSON.parse(
                event.data as string
            );
            onMessage(data);
        } catch (e) {
            console.error('Failed to parse WebSocket message:', e, event.data);
        }
    };

    ws.onclose = (event) => {
        console.log(
            `WebSocket disconnected for submission ${submissionId}:`,
            event
        );
        onClose?.(event);
    };

    ws.onerror = (event) => {
        console.error(`WebSocket error for submission ${submissionId}:`, event);
        onError?.(event);
    };

    return ws;
};
