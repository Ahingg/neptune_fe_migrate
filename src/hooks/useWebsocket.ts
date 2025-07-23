import { useEffect, useState, useRef, useCallback } from 'react';
import { connectToSubmissionWebSocket } from '../api/websocketClient';
/**
 * Custom hook to manage a WebSocket connection for a specific submission ID.
 * Provides the latest update, connection status, and any errors.
 *
 * @param submissionId The ID of the submission to subscribe to. If null, no connection is made.
 */
export const useSubmissionWebSocket = (submissionId: string | null) => {
    // State to hold the most recent WebSocket update
    const [latestUpdate, setLatestUpdate] =
        useState<WebSocketSubmissionUpdate | null>(null);
    // State to track WebSocket connection status
    const [isConnected, setIsConnected] = useState(false);
    // State to hold any WebSocket errors
    const [error, setError] = useState<Event | null>(null);

    // Ref to hold the WebSocket instance, so it persists across renders
    const wsRef = useRef<WebSocket | null>(null);

    // Callback for handling incoming messages from the WebSocket
    const handleMessage = useCallback((data: WebSocketSubmissionUpdate) => {
        console.log('Received WS update:', data);
        setLatestUpdate(data); // Update state with the new data
    }, []);

    // Callback for when the WebSocket connection opens
    const handleOpen = useCallback(() => {
        setIsConnected(true);
        setError(null); // Clear any previous errors on successful connection
    }, []);

    // Callback for when the WebSocket connection closes
    const handleClose = useCallback((event: CloseEvent) => {
        setIsConnected(false);
        console.log('WebSocket connection closed:', event);
        // You might add reconnect logic here for production applications
    }, []);

    // Callback for WebSocket errors
    const handleError = useCallback((event: Event) => {
        setError(event);
        console.error('WebSocket error:', event);
    }, []);

    // Effect to manage the WebSocket connection lifecycle
    useEffect(() => {
        // If no submissionId is provided, or it becomes null, close any existing connection and clear state.
        if (!submissionId) {
            setLatestUpdate(null);
            if (wsRef.current) {
                wsRef.current.close(); // Close active connection
                wsRef.current = null;
            }
            return; // Do nothing if no submissionId
        }

        // If there's an existing open connection for a different or same submissionId, close it first.
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.close();
        }

        // Establish a new WebSocket connection
        const ws = connectToSubmissionWebSocket(
            submissionId,
            handleMessage,
            handleOpen,
            handleClose,
            handleError
        );
        wsRef.current = ws; // Store the WebSocket instance in the ref

        // Cleanup function: This runs when the component unmounts or before the effect re-runs.
        return () => {
            if (wsRef.current) {
                wsRef.current.close(); // Ensure WebSocket is closed cleanly
                wsRef.current = null;
            }
        };
    }, [submissionId, handleMessage, handleOpen, handleClose, handleError]); // Dependencies array

    // Return the current state of the WebSocket connection and the latest update
    return { latestUpdate, isConnected, error };
};
