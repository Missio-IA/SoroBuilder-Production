import { useSearchParams, useNavigate } from "react-router-dom"
import { doc, getDoc } from "firebase/firestore"
import { auth, db } from "../firebaseConfig"
import React, { useEffect, useState } from "react"
import { CheckCircle, Zap, Loader, ArrowRight } from "lucide-react"

function PaymentSuccess() {
  const [searchParams] = useSearchParams()
  const userIdFromURL = searchParams.get("userId")
  const [credits, setCredits] = useState(null)
  const [countdown, setCountdown] = useState(3)
  const navigate = useNavigate()

  useEffect(() => {
    async function fetchCredits() {
      if (!userIdFromURL) return
      const userDoc = await getDoc(doc(db, "users", userIdFromURL))
      if (userDoc.exists()) {
        setCredits(userDoc.data().credits || 0)
      }
    }
    fetchCredits()
  }, [userIdFromURL])

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => Math.max(0, prev - 1))
    }, 1000)

    const redirectTimer = setTimeout(() => {
      navigate("/credits")
    }, 3000)

    return () => {
      clearInterval(timer)
      clearTimeout(redirectTimer)
    }
  }, [navigate])

  return (
    <div className="min-h-screen bg-[#1a1f2b] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-[#1e2533] rounded-xl shadow-2xl p-8 text-center">
          {/* Success Icon Animation */}
          <div className="mb-6 relative">
            <div className="w-20 h-20 mx-auto bg-green-500/10 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-500 animate-bounce" />
            </div>
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-[#3898FF] via-[#40C4AA] to-[#40C4AA] text-transparent bg-clip-text">
            Payment Successful!
          </h1>

          <p className="text-gray-400 mb-6">
            Thank you for your purchase. Your credits have been added to your account.
          </p>

          {/* Credits Display */}
          {credits !== null ? (
            <div className="bg-[#262d3d] rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center space-x-2">
                <Zap className="w-6 h-6 text-yellow-400" />
                <span className="text-2xl font-bold text-white">{credits} {credits === 1 ? "Credit" : "Credits"}</span>
              </div>
            </div>
          ) : (
            <div className="flex justify-center mb-6">
              <Loader className="w-6 h-6 text-blue-500 animate-spin" />
            </div>
          )}

          {/* Redirect Message */}
          <div className="bg-[#262d3d]/50 rounded-lg p-4 flex items-center justify-between">
            <span className="text-gray-400">Redirecting to credits page...</span>
            <div className="flex items-center space-x-2">
              <span className="text-white font-medium">{countdown}</span>
              <ArrowRight className="w-4 h-4 text-gray-400 animate-pulse" />
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 h-1 w-full bg-[#262d3d] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#3898FF] to-[#40C4AA] transition-all duration-1000 ease-linear"
              style={{ width: `${((3 - countdown) / 3) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentSuccess

