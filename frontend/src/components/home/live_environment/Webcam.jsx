import { useEffect, useRef, useState } from 'react'
import './Webcam.css'

export default function Webcam({ onDetections }) {
  const videoRef = useRef(null)
  const [error, setError] = useState(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let stream

    async function startCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          setReady(true)
        }
      } catch (err) {
        setError(err.message ?? 'Camera access denied')
      }
    }

    startCamera()

    return () => {
      stream?.getTracks().forEach(t => t.stop())
    }
  }, [])

  useEffect(() => {
    if (!ready) return

    const canvas = document.createElement('canvas')
    const interval = setInterval(() => {
      const video = videoRef.current
      if (!video) return

      // Ensure the video is playing and has frames ready (readyState >= 2)
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
                if (onDetections) {
                  onDetections(data.predictions)
                }
              } else {
                console.error('YOLO endpoint returned error:', response.statusText)
              }
            } catch (err) {
              console.error('Error sending frame to YOLO:', err)
            }
          }, 'image/jpeg', 0.7)
        }
      }
    }, 200)


    return () => {
      clearInterval(interval)
    }
  }, [ready])

  return (
    <div className="webcam">
      <div className="webcam__header">
        <span className="webcam__title">LIVE ENVIRONMENT SCAN</span>
        <span className={`webcam__status ${ready ? 'webcam__status--active' : ''}`}>
          {ready ? '● ACTIVE' : error ? '● ERROR' : '● CONNECTING'}
        </span>
      </div>

      <div className="webcam__feed">
        {error ? (
          <div className="webcam__error">
            <p>Camera unavailable</p>
            <p className="webcam__error-detail">{error}</p>
          </div>
        ) : (
          <video ref={videoRef} autoPlay muted playsInline className="webcam__video" />
        )}
      </div>
    </div>
  )
}
