import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"

export function useWebSocketContracts(token) {
  const ws = useRef(null)
  const [contracts, setContracts] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!token) return

    ws.current = new WebSocket(`${process.env.NEXT_PUBLIC_WEBSOCKET_URL}/ws/contract/`)

    ws.current.onopen = () => {
      console.log("WebSocket connected")
      ws.current.send(
        JSON.stringify({
          token: token,
          action: "fetch_contracts",
        }),
      )
    }

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data)
      console.log("WebSocket data received:", data)
      if (data.data) {
        const transformedContracts = transformContracts(data.data)
        setContracts(transformedContracts)
        setIsLoading(false)
      }
    }

    ws.current.onerror = (error) => {
      console.error("WebSocket error:", error)
    }

    ws.current.onclose = () => {
      console.log("WebSocket disconnected")
    }

    return () => {
      if (ws.current) {
        ws.current.close()
      }
    }
  }, [token])

  const transformContracts = (data) => {
    if (!data || !Array.isArray(data)) return []

    try {
      return data.map((contract) => ({
        id: contract.contract_id,
        crop: contract.crop_name,
        farmer: contract.farmer_name,
        buyer: contract.buyer_name,
        quantity: contract.quantity,
        price: contract.nego_price,
        deliveryDate: contract.delivery_date,
        status: contract.status ? "active" : "pending",
        createdAt: contract.created_at,
        terms: contract.terms || [],
        delivery_address: contract.delivery_address,
        rawData: contract,
      }))
    } catch (error) {
      console.error("Error transforming contracts:", error)
      return []
    }
  }

  const sendMessage = (message) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ token, ...message }))
    }
  }

  return { contracts, isLoading, ws, sendMessage }
}
