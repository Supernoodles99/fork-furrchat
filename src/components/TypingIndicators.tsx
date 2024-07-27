import { useState, useEffect, useCallback } from 'react'
import { LoaderElement } from './LoaderElement.tsx'
import '../styles/TypingIndicator.css'

export const TypingIndicator = () => {
    const [typingUsers, setTypingUsers] = useState(new Set())
    const [typingTimeouts, setTypingTimeouts] = useState({})

    useEffect(() => {
        const ws = new WebSocket('wss://server.meower.org?v=1')

        ws.onmessage = (event) => {
            const { cmd, val: { username, chat_id } } = JSON.parse(event.data)
            if (cmd === 'typing') handleTypingNotification(username, chat_id)
        }

        ws.onerror = (error) => console.error('WebSocket error:', error)
        ws.onclose = (event) => console.log('WebSocket connection closed:', event)

        return () => { ws.close() }
    }, [])

    const handleTypingNotification = useCallback((username: string, chatId: string) => {
        const typingTimeouts: { [key: string]: NodeJS.Timeout } = {}
        const key = `${chatId}-${username}`

        if (typingTimeouts[key]) { clearTimeout(typingTimeouts[key]) }
        setTypingUsers(prev => new Set(prev).add(key))

        const timeout = setTimeout(() => {
            setTypingUsers(prev => {
                const updated = new Set(prev)
                updated.delete(key)
                return updated
            })
        }, 2000)

        setTypingTimeouts(prev => ({ ...prev, [key]: timeout }));
    }, [typingTimeouts])

    const updateTypingIndicator = () => {
        return Array.from(typingUsers).map((key: any) => key.split('-')[1]).join(', ')
    };

    return (
        <div id="typingIndicator">
            {updateTypingIndicator() ? 
            <> <LoaderElement/> <span className='typing-indicator'>{`${updateTypingIndicator()} is typing...`}</span> </>
            : <span className='no-typing'>{'No one is currently typing...'}</span>}
        </div>
    )
}