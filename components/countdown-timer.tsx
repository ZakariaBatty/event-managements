"use client"

import { useEffect, useState } from "react"

export function CountdownTimer({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  const [isExpired, setIsExpired] = useState(false)

  useEffect(() => {
    const target = new Date(targetDate).getTime()

    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const difference = target - now

      if (difference <= 0) {
        setIsExpired(true)
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        }
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      }
    }

    setTimeLeft(calculateTimeLeft())

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [targetDate])

  if (isExpired) {
    return (
      <div className="text-center py-4">
        <p className="text-lg font-medium text-gray-700">L'événement a commencé!</p>
      </div>
    )
  }

  return (
    <div className="flex justify-center gap-4 py-4">
      <div className="flex flex-col items-center">
        <div className="text-3xl font-bold text-[#004258] w-16 h-16 flex items-center justify-center bg-white rounded-lg shadow-sm">
          {timeLeft.days}
        </div>
        <span className="text-sm text-gray-600 mt-1">Jours</span>
      </div>
      <div className="flex flex-col items-center">
        <div className="text-3xl font-bold text-[#004258] w-16 h-16 flex items-center justify-center bg-white rounded-lg shadow-sm">
          {timeLeft.hours}
        </div>
        <span className="text-sm text-gray-600 mt-1">Heures</span>
      </div>
      <div className="flex flex-col items-center">
        <div className="text-3xl font-bold text-[#004258] w-16 h-16 flex items-center justify-center bg-white rounded-lg shadow-sm">
          {timeLeft.minutes}
        </div>
        <span className="text-sm text-gray-600 mt-1">Minutes</span>
      </div>
      <div className="flex flex-col items-center">
        <div className="text-3xl font-bold text-[#004258] w-16 h-16 flex items-center justify-center bg-white rounded-lg shadow-sm">
          {timeLeft.seconds}
        </div>
        <span className="text-sm text-gray-600 mt-1">Secondes</span>
      </div>
    </div>
  )
}
