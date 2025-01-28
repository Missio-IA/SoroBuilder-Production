import React, { useState } from "react"
import { Elements } from "@stripe/react-stripe-js"
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js"
import axios from "axios"
import { auth } from "../firebaseConfig"
import { X, CreditCard, Zap, Lock } from "lucide-react"

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#32325d",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  },
}

const CheckoutForm = ({ closeModal, selectedPackage }) => {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!selectedPackage) {
      alert("No package selected")
      return
    }

    setLoading(true)

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
    })

    if (!error) {
      const { id } = paymentMethod
      try {
        const user = auth.currentUser
        const userId = user ? user.uid : null
        const amount = selectedPackage.price * 100

        const { data } = await axios.post("http://localhost:3001/api/checkout", {
          id,
          amount,
          userId,
          credits: selectedPackage.credits,
        })

        console.log("Server response:", data)
        elements.getElement(CardElement).clear()
        alert("Payment successful!")
        closeModal()
      } catch (error) {
        console.error("Error processing payment:", error)
        alert("Payment failed!")
      } finally {
        setLoading(false)
      }
    } else {
      console.error("Error in createPaymentMethod:", error)
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-gray-800">Secure Checkout</h3>
        <button
          type="button"
          onClick={closeModal}
          className="text-gray-400 hover:text-gray-500 transition-colors duration-200"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {selectedPackage && (
        <div className="bg-gradient-to-r from-blue-500 to-teal-500 text-white p-4 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-lg font-semibold">Selected Package</span>
            <Zap className="w-6 h-6" />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-3xl font-bold">{selectedPackage.credits} Credits</span>
            <span className="text-2xl font-semibold">${selectedPackage.price}</span>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">Card Details</label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <CreditCard className="h-5 w-5 text-gray-400" />
          </div>
          <CardElement
            options={CARD_ELEMENT_OPTIONS}
            className="block w-full pl-10 sm:text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 p-3"
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Lock className="h-5 w-5 text-gray-400 mr-2" />
          <span className="text-sm text-gray-500">Secure SSL Encrypted Payment</span>
        </div>
        <button
          type="submit"
          disabled={!stripe || loading}
          className={`px-6 py-3 rounded-md text-white font-semibold shadow-md transition-all duration-200 ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600"
          }`}
        >
          {loading ? "Processing..." : selectedPackage ? `Pay $${selectedPackage.price}` : "Pay"}
        </button>
      </div>
    </form>
  )
}

const CheckoutModal = ({ isOpen, closeModal, stripePromise, selectedPackage }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-xl p-8 w-11/12 max-w-md transform transition-all duration-300 ease-in-out">
        <Elements stripe={stripePromise}>
          <CheckoutForm closeModal={closeModal} selectedPackage={selectedPackage} />
        </Elements>
      </div>
    </div>
  )
}

export default CheckoutModal

