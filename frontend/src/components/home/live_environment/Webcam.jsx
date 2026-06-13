import { useEffect, useRef, useState, useCallback } from 'react'
import './Webcam.css'

export default function Webcam({ onDetections }) {
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const [error, setError] = useState(null)
  const [ready, setReady] = useState(false)
  const [active, setActive] = useState(false)

  const startCamera = useCallback(async () => {
    setError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setReady(true)
        setActive(true)
      }
    } catch (err) {
      setError(err.message ?? 'Camera access denied')
    }
  }, [])

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach(t => t.stop())
    streamRef.current = null
    if (videoRef.current) videoRef.current.srcObject = null
    setReady(false)
    setActive(false)
    onDetections?.([])
  }, [onDetections])

  // Start on mount, stop on unmount
  useEffect(() => {
    startCamera()
    return () => {
      streamRef.current?.getTracks().forEach(t => t.stop())
    }
  }, [])

  // Frame capture + YOLO polling
  useEffect(() => {
    if (!ready) return

    const canvas = document.createElement('canvas')
    const interval = setInterval(() => {
      const video = videoRef.current
      if (!video || !streamRef.current) return

      if (video.readyState >= 2 && video.videoWidth > 0 && video.videoHeight > 0) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
          canvas.toBlob(async (blob) => {
            if (!blob) return
            const formData = new FormData()
            formData.append('file', blob, 'webcam_frame.jpg')
            try {
              const response = await fetch('http://localhost:8000/yolo/detect', {
                method: 'POST',
                body: formData,
              })
              if (response.ok) {
                const data = await response.json()
                onDetections?.(data.predictions)
              } else {
                console.error('YOLO endpoint returned error:', response.statusText)
              }
            } catch (err) {
              console.error('Error sending frame to YOLO:', err)
            }
          }, 'image/jpeg', 0.7)
        }
      }
    }, 500)

    return () => clearInterval(interval)
  }, [ready])

  return (
    <div className="webcam">
      <div className="webcam__header">
        <span className="webcam__title">LIVE ENVIRONMENT SCAN</span>
        <div className="webcam__header-right">
          <span className={`webcam__status ${ready ? 'webcam__status--active' : ''}`}>
            {ready ? '● ACTIVE' : error ? '● ERROR' : '● INACTIVE'}
          </span>
          {active ? (
            <button className="webcam__btn webcam__btn--stop" onClick={stopCamera}>
              Stop
            </button>
          ) : (
            <button className="webcam__btn webcam__btn--start" onClick={startCamera}>
              Start
            </button>
          )}
        </div>
      </div>

      <div className="webcam__feed">
        {error && (
          <div className="webcam__error">
            <p>Camera unavailable</p>
            <p className="webcam__error-detail">{error}</p>
          </div>
        )}
        {!error && !active && (
          <p className="webcam__stopped">Camera stopped</p>
        )}
        {/* Always mounted so videoRef is never null when startCamera runs */}
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="webcam__video"
          style={{ display: active && !error ? 'block' : 'none' }}
        />
      </div>
    </div>
  )
}
