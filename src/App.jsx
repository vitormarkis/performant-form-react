import { useEffect, useRef, useState } from "react"

const initialInputRef = {
  element: null,
  value: "",
  listeners: [],
  error: {
    message: null,
    code: null,
  },
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
      validateFieldValue(newValue, ref.error, async error => {
        setError(error.message)
        inputRef.current.error.code = error.code
        inputRef.current.error.message = error.message
      })
    }

    if (ref.listeners.length === 0 || !ref.listeners.includes(listener)) {
      ref.element.addEventListener("input", listener)
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

/**
 * Validations
 */
const validations = [
  value => ({
    isValid: value.length < 12,
    message: "Muito longo.",
    code: "TOO_LONG",
  }),
  value => ({
    isValid: value.length > 4,
    message: "Muito curto.",
    code: "TOO_SHORT",
  }),
  value => ({
    isValid: value.includes("@"),
    message: "Deve incluir @",
    code: "SHOULD_INCLUDE_AT",
  }),
  value => ({
    isValid: value.startsWith("mrks"),
    message: "Deve começar com 'mrks'.",
    code: "STARTS_WITH_A",
  }),
]

function validateFieldValue(value, error, onError) {
  for (const validate of validations) {
    const { isValid, message, code } = validate(value)
    if (isValid) continue
    if (code === error.code) return
    onError({ message, code })
    return
  }

  const hasError = error.code != null
  if (!hasError) return
  onError({
    message: null,
    code: null,
  })
}
