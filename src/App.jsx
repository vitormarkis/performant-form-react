import { useEffect, useRef, useState } from "react"

const initialInputRef = {
  element: null,
  value: "",
  listeners: [],
  error: null,
}

function App() {
  console.log("render")
  const [error, setError] = useState(null)
  const inputRef = useRef(initialInputRef)

  useEffect(() => {
    console.log("rodou use effect")
    if (!inputRef.current.element) return

    const ref = inputRef.current

    function listener(e) {
      const newValue = e.target.value
      inputRef.current.value = newValue
      if (newValue.length < 3) {
        if (ref.error) return
        const errorMsg = "Muito curto."
        setError(errorMsg)
        inputRef.current.error = errorMsg
        return
      }
      if (!ref.error) return
      setError(null)
      inputRef.current.error = null
    }

    if (ref.listeners.length === 0 || !ref.listeners.includes(listener)) {
      ref.element.addEventListener("change", listener)
      ref.listeners.push(listener)
    }

    return () => {
      inputRef.current = initialInputRef
    }
  }, [inputRef.current])

  return (
    <div className="root">
      <input
        ref={ref => {
          inputRef.current.element = ref
        }}
      />
      {error && <span>{error}</span>}
      <button
        onClick={() => {
          console.log(inputRef.current.value)
        }}
      >
        logar resultado
      </button>
    </div>
  )
}

export default App
